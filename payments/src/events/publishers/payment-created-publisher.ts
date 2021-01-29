import { Publisher, Subjects, PaymentCreatedEvent } from '@utpalmaity/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
