// import mongoose from 'mongoose';
// import { Cart } from '../models/cart.models.js';
import { Order } from '../models/order.models.js'
import { getCart, validateCart } from '../services/shop.services.js';

const createSession = async (req, res) => {
  try {

    const { cartId, email, account } = req.body;

    const { cart: validCart, unpriced, unavailable } = await validateCart(cartId);
    console.log("cart after validation: ", validCart, '\nunpriced', unpriced, '\nunavailable', unavailable);

    const cart = await getCart(cartId);

    if (!cart) {
      return res.status(404).json({
        message: "cart doesn't exist", cartId: cartId
      });
    }

    const cartAlreadyInSession = await Order.findOne({ cartId: cartId });

    if (cartAlreadyInSession) {
      return res.status(409).json({
        message: `this cart (${cartId}) is already tied to a session (${cartAlreadyInSession, cartAlreadyInSession.status})`
      });
    }

    const orderItemsList = cart.items.map(({ itemId, name, unitPrice, amount }) => ({
      itemId,
      name,
      unitPrice,
      amount
    }));

    console.log('orderItemsList', orderItemsList);

    const newSession = await Order.create({
      cartId: cartId,
      items: orderItemsList,
      total: cart.totalPrice,
      currency: cart.currency,
      status: "pending", // default anyway
      customerEmail: email
    });

    cart.sessionId = newSession._id;
    await cart.save();

    // !!! need to check whether an account is tied to the user or if the user is creating one

    return res.status(201).json({
      message: "New session created",
      session: {
        cartId: newSession.cartId,
        items: newSession.items,
        total: newSession.total,
        currency: newSession.currency,
        status: newSession.status,
        customerEmail: newSession.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// maybe could be used as check instead of session||cart existing
const retrieveSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const sessionCart = await Order.findById(sessionId);
    
    return res.status(200).json({ sessionCart: sessionCart });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

// then issuing checkout session({ status, payment_status, ammount_total, currency, customer_details.email, payment_intent, metadata, client_reference_id})
// finally receiving payment intent from stripe, created by session??? -> update session status and delete cart

export { createSession, retrieveSession };