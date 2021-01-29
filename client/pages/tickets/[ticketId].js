import React from 'react';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });

  const onsubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price : {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
}

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  console.log(data);
  return { ticket: data };
};

export default TicketShow;
