export class CreateOrderCommand {
  constructor(
    readonly orderId: string,
    readonly customerId: string,
    readonly amount: number,
  ) {}
}
