import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
  NotAuthorizedError
} from '@utpalmaity/common';

import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('cannot pay for an cancelled order');
    }
    console.log('stripe payment start');
    try {
      const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: 'Stripe payment',
        shipping: {
          name: 'Utpal maity',
          address: {
            line1: '4296 W 7th St, Long Beach',
            country: 'us',
            state: 'CA',
            postal_code: '90802'
          }
        }
      });

      const payment = Payment.build({
        orderId: orderId,
        stripeId: charge.id
      });

      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
      });

      res.send({ id: payment.id });
    } catch (err) {
      console.log(err);
      res.send({ error: err });
    }
  }
);

export { router as createChargeRouter };
