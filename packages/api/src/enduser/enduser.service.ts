import { of, from } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Enduser } from "@enduser/entities/enduser.entity";
import { EnduserDto } from "@enduser/dto/enduser.dto";

@Injectable()
export class EnduserService {
  constructor(
    @InjectRepository(Enduser)
    private readonly enduserRepository: Repository<Enduser>
  ) {}

  /**
   * Создать нового заказчика
   * @param dto
   */
  create(dto: EnduserDto) {
    return from(
      this.enduserRepository.save(this.enduserRepository.create(dto))
    );
  }

  /**
   * Проверить на существование и если не существует создать
   * @param dto
   */
  checkCreate(dto: EnduserDto) {
    return from(this.enduserRepository.findOne(dto)).pipe(
      mergeMap((enduser) => (enduser ? of(enduser) : this.create(dto)))
    );
  }
}
