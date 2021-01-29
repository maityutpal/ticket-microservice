import { Publisher, Subjects, TicketCreatedEvent } from '@utpalmaity/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
