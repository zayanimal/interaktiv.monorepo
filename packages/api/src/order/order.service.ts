import { Observable, of, from, forkJoin, throwError } from "rxjs";
import { map, reduce, mergeMap, catchError } from "rxjs/operators";
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, IPaginationOptions } from "nestjs-typeorm-paginate";
import { UserDto } from "@users/dto/user.dto";
import { CreateOrderDto, UpdateOrderDto } from "@order/dto";
import { OrderStatusService } from "@order/order-status/order-status.service";
import { UsersService } from "@users/services/users.service";
import { CompanyService } from "@company/company.service";
import { GoodService } from "@good/good.service";
import { PriceService } from "@good/price/price.service";
import { DiscountService } from "@good/discount/discount.service";
import { MarginService } from "@good/margin/margin.service";
import { EnduserService } from "@enduser/enduser.service";
import { QuantityService } from "@good/quantity/quantity.service";
import { OrderRepository } from "@order/order.repository";
import {
  IOrderService,
  IOrderReduce,
  IOrderReduceArr,
} from "@order/interfaces";
import { OrderAccumulator } from "@order/utils/order.util";
import { Order } from "./entities/order.entity";
import { GoodConfig } from "@/good.config";

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly statusService: OrderStatusService,
    private readonly userService: UsersService,
    private readonly companyService: CompanyService,
    private readonly goodService: GoodService,
    private readonly priceService: PriceService,
    private readonly discountService: DiscountService,
    private readonly marginService: MarginService,
    private readonly quantityService: QuantityService,
    private readonly enduserService: EnduserService
  ) {}

  checkUser(user: Observable<UserDto>) {
    return from(user).pipe(
      mergeMap((user) =>
        user?.companyId && user?.userId
          ? of({ userId: user.userId, companyId: user.companyId })
          : throwError(
              new NotFoundException("?? ???????????????????????? ?????????????????????? ????????????????")
            )
      )
    );
  }

  create(dto: CreateOrderDto, user: Observable<UserDto>) {
    return this.checkUser(user).pipe(
      mergeMap((usr) =>
        forkJoin({
          rate: of(dto.rate),
          user: this.userService.searchId(usr.userId),
          company: this.companyService.searchId(usr.companyId),
          status: this.statusService.findStatus(dto?.status || 1),
          enduser: this.enduserService.checkCreate(dto.enduser),
        })
      ),
      mergeMap((orderData) =>
        this.orderRepository.saveOrder(orderData).pipe(
          mergeMap((order) =>
            from(dto.good).pipe(
              mergeMap((good) =>
                this.goodService.searchId(good.id).pipe(
                  mergeMap((foundGood) =>
                    forkJoin([
                      of(foundGood),
                      this.priceService.searchId(good.id),
                      this.marginService.create({
                        margin: GoodConfig.MARGIN,
                        good: foundGood,
                        company: orderData.company,
                        order,
                      }),
                      this.discountService.create({
                        discount: GoodConfig.DISCOUNT,
                        good: foundGood,
                        enduser: orderData.enduser,
                        order,
                      }),
                      this.quantityService.create({
                        quantity: good?.quantity || GoodConfig.QUANTITY,
                        good: foundGood,
                        order,
                      }),
                    ])
                  )
                )
              ),
              reduce<IOrderReduceArr, IOrderReduce>(
                (acc, items) => acc.push(items),
                OrderAccumulator.create()
              ),
              mergeMap((goods) =>
                this.orderRepository.updateCreatedOrder(order.id, goods)
              ),
              map(() => ({
                message: `?????? ?????????? ????????????. ?????????? ???????????? ${order.orderId}`,
              }))
            )
          )
        )
      )
    );
  }

  find(id: string, serial = true) {
    return this.orderRepository.findOrder(id, serial);
  }

  update(dto: UpdateOrderDto, user: Observable<UserDto>) {
    return forkJoin([
      from(user),
      this.find(dto.id, false),
      this.statusService.findStatus(dto?.status || 1),
      this.enduserService.checkCreate(dto.enduser),
    ]).pipe(
      mergeMap(([usr, order, status, enduser]) =>
        from(dto.good).pipe(
          mergeMap((good) =>
            this.goodService.searchId(good.id).pipe(
              mergeMap((foundGood) =>
                forkJoin([
                  this.marginService.update({
                    margin: good.margin || GoodConfig.MARGIN,
                    good: foundGood,
                    order: order as Order,
                    user: usr,
                  }),
                  this.discountService.update({
                    discount: good.discount || GoodConfig.DISCOUNT,
                    good: foundGood,
                    order: order as Order,
                    user: usr,
                  }),
                  this.quantityService.update({
                    quantity: good.quantity || GoodConfig.QUANTITY,
                    good: foundGood,
                    order: order as Order,
                    user: usr,
                  }),
                ])
              )
            )
          ),
          mergeMap(() =>
            this.orderRepository.updateOrder({
              id: order.id,
              enduser: enduser,
              status,
            })
          ),
          map(() => ({ message: `?????????? ${order.orderId} ????????????????` }))
        )
      )
    );
  }

  remove(id: string) {
    return this.orderRepository.deleteOrder(id);
  }

  list({ page, limit }: IPaginationOptions, user: Observable<UserDto>) {
    return from(user).pipe(
      mergeMap((usr) =>
        paginate(this.orderRepository.listOrders(usr), { page, limit })
      ),
      mergeMap(({ items, meta }) =>
        forkJoin({
          items: of(this.orderRepository.transformList(items)),
          meta: of(meta),
        })
      ),
      catchError((err) =>
        throwError(new InternalServerErrorException(err.message))
      )
    );
  }
}
