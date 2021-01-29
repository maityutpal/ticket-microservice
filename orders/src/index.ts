import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT token not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo db string for ticketing not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Nats clieny id not defined');
  }
  try {
    await natsWrapper.connect(
      'ticketing',
      process.env.NATS_CLIENT_ID,
      'http://nats-srv:4222'
    );

    natsWrapper.client.on('close', () => {
      console.log('Nats server is closing');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close);
    process.on('SIGTERM', () => natsWrapper.client.close);
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log(' ticket app connected to mongo db');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('ticket app  listening on port 3000 !');
  });
};

start();
