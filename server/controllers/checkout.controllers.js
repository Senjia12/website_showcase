import mongoose from 'mongoose';
import { Cart } from '../models/cart.models.js';
import { Order } from '../models/order.models.js'

const createSession = async (req, res) => {
  try {
    /* using json in crud operations (postman),
    so I need to convert the string back to object id (json doesnt have a native objectId type) */
    // const cartId = new mongoose.Types.ObjectId(req.body.cartIdString);
    // const sessionId = new mongoose.Types.ObjectId(req.body.sessionIdStrings);

    const { cartId, email, account } = req.body;

    const cart = await Cart.findById(cartId);    

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
      itemId: new mongoose.Types.ObjectId(itemId),
      name,
      unitPrice,
      amount
    }));

    console.log('orderItemsList', orderItemsList);

    const newSession = await Order.create({
      cartId: cartId,
      items: orderItemsList,
      total: cart.totalPrice, // !!! nope, recomputing everything
      currency: cart.currency, // !!! same as above
      status: "pending" // default anyway
    });

    // !!! need to check whether an account is tied to the user or if the user is creating one


    return res.status(201).json({
      message: "New session created",
      session: {
        cartId: newSession._id,
        items: newSession.items,
        total: newSession.total,
        currency: newSession.currency,
        status: newSession.status
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
    const sessionId = req.body;
    const sessionCart = await Order.findById(sessionId);
    

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

// then issuing checkout session({ status, payment_status, ammount_total, currency, customer_details.email, payment_intent, metadata, client_reference_id})
// finally receiving payment intent from stripe, created by session??? -> update session status and delete cart

export { createSession, retrieveSession };