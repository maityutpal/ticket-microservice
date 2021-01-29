import { Publisher, Subjects, OrderCreatedEvent } from '@utpalmaity/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
