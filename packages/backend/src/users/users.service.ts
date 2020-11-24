import { Observable, of, from, throwError, forkJoin } from 'rxjs';
import { switchMap, map, mergeMap, toArray, catchError } from 'rxjs/operators';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UserDto } from '@users/dto/user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { Users } from '@users/entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) {}

    dbRequest(username: string) {
        return {
            where: { username },
            relations: ['roles', 'permissions']
        };
    }

    /**
     * Пагинация юзеров общий список
     * @param page
     * @param limit
     */
    getUsers(page: number, limit: number): Observable<
        Omit<Pagination<Omit<UserDto, 'permissions'>>, 'links'>
    > {
        return from(
            paginate(this.usersRepository
                .createQueryBuilder('users')
                .orderBy('users.time', 'ASC')
                .leftJoinAndSelect('users.roles', 'roles'),
                { page, limit }
            )
        ).pipe(
            mergeMap(({ items, meta }) => forkJoin({
                    items: from(items.map((user) => ({
                        username: user.username,
                        role: user.roles.name,
                        time: user.time,
                        isActive: user.isActive
                    }))).pipe(toArray()),
                    meta: of(meta)
                })
            ),

            catchError((err) => throwError(
                new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
            ))
        );
    }

    /**
     * Найти пользователя в базе по имени
     * @param param имя пользователя
     */
    findByUsername(username: string): Observable<UserDto> {
        return from(this.usersRepository.findOne(this.dbRequest(username))).pipe(
            switchMap((user) => (user
                ? of(user).pipe(
                    map((user) => ({
                        username: user.username,
                        role: user.roles.name,
                        isActive: user.isActive,
                        permissions: user.permissions.map(({ name }) => name)
                    }))
                )
                : throwError(
                    new HttpException('Пользователь не существует', HttpStatus.UNAUTHORIZED)
                ))
            )
        );
    }

    /**
     * Найти пльзователя и его контакты, чтобы отредактировать
     * @param username
     */
    findUserForEdit(username: string): Observable<
        Omit<CreateUserDto, 'password'> & { isActive: boolean; }
    > {
        return from(this.usersRepository
            .createQueryBuilder('users')
            .select([
                'users.username',
                'users.isActive',
                'rol.name',
                'perm.name',
                'cont.email',
                'cont.phone',
                'cont.position'
            ])
            .innerJoin('users.roles', 'rol')
            .innerJoin('users.permissions', 'perm')
            .innerJoin('users.contacts', 'cont')
            .where('users.username = :name', { name: username })
            .getOne()).pipe(
                map((user) => ({
                    username: user.username,
                    isActive: user.isActive,
                    role: user.roles.name,
                    permissions: user.permissions.map(({ name }) => name),
                    contacts: user.contacts
                }))
            );
    }

    editUser(editableUser: string, userDto: CreateUserDto & { isActive: boolean; }) {
        this.usersRepository
            .createQueryBuilder('users')
            .select('users.id')
            .where('users.username = :n', { n: editableUser })
            .getOne();
    }

    /**
     * Удалить пользователя
     * @param userName
     */
    removeUser(username: string) {
        return from(this.usersRepository.findOne({ where: { username } })).pipe(
            switchMap((user) => from(this.usersRepository.remove(user)).pipe(
                map(() => ({ message: `Пользователь ${username} удалён` }))
            )),

            catchError(() => throwError(
                new HttpException(
                    `Пользователь ${username} не найден`,
                    HttpStatus.BAD_REQUEST
                )
            ))
        );
    }
}
