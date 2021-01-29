import { Publisher, Subjects, OrderCancelledEvent } from '@utpalmaity/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
