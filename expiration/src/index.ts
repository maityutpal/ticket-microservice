import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
