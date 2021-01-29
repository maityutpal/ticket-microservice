import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent
} from '@utpalmaity/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
