import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';
import { UserDto } from '@users/dto/user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { LoginUserDto } from '@users/dto/login-user.dto';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    register(userDto: CreateUserDto): Observable<UserDto> {
        return this.usersService.checkExistsAndCreate(userDto);
    }

    validateUser(payload: JwtPayload): Observable<UserDto> {
        return this.usersService.findByUsername(payload);
    }

    login(loginUserDto: LoginUserDto): Observable<LoginStatus> {
        this.usersService.findUserCheckPass(loginUserDto).pipe(
            map(({ id, username, roles }) => ({
                username,
                accessToken: this.jwtService.sign({ id, username }),
                role: roles.name
            }))
        ).subscribe({
            next: (res) => console.log(res);
        });

        return this.usersService.findUserCheckPass(loginUserDto).pipe(
            map(({ id, username, roles }) => ({
                username,
                accessToken: this.jwtService.sign({ id, username }),
                role: roles.name
            }))
        );
    }
}
