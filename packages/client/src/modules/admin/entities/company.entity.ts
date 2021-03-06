import 'reflect-metadata'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator'
import { CompanyContactEntity, RequisitesEntity } from '@admin/entities'
import { ValidationEntity } from '@shared/entities'

export class CompanyEntity extends ValidationEntity {
    @IsNotEmpty({ message: 'Поле не должно быть пустым' })
    name!: string

    @ArrayNotEmpty({
        message: 'Введите в поисковой строке имя пользователя и выберите его'
    })
    users!: string[]

    @ValidateNested()
    @Type(() => CompanyContactEntity)
    contact!: CompanyContactEntity

    @ValidateNested({ each: true })
    @Type(() => RequisitesEntity)
    requisites!: RequisitesEntity[]
}
