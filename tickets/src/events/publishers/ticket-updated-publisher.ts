import { Publisher, Subjects, TicketUpdatedEvent } from '@utpalmaity/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
