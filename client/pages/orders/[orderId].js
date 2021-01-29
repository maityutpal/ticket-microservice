import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

function OrderShow({ order, currentuser }) {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>This order expired</div>;
  }

  return (
    <div>
      {timeLeft} seconds left to complete the order
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        amount={order.ticket.price * 100}
        email={currentuser.email}
        stripeKey="pk_test_51I2h9NHAbpDjOVoNsb4ylI3zUfnsAjOqclzhGBH9wPt5Z4z8HvmSP9KUuKqz3EjeiSk04GQwMDj41qxtdB6TCYHc00LnEeAF57"
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
