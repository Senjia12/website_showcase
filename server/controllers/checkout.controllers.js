import mongoose from 'mongoose';
import { Cart } from '../models/cart.models.js';
import { Order } from '../models/order.models.js'

const createSession = async (req, res) => {
  try {
    /* using json in crud operations (postman),
    so I need to convert the string back to object id (json doesnt have a native objectId type) */
    const cartId = new mongoose.Types.ObjectId(req.body.cartIdString);
    const cart = await Cart.findById(cartId);
    // const cartInSession = await Order.findOne({ cartId: cartId}); // unless I later need to allow a cart to be used in several checkouts

    if (!cart) {
      return res.status(404).json({
        message: "cart doesn't exist", cartId: cartId
      })
    }

    /* if(session||cartInSession) {
      console.log("check conflict line 21")
      const message = session && cart
      ? `Session ${sessionId} and cart ${cartId} already use. Current session: ${session.status}, cart's session: ${cartInSession._id} (${cartInSession.status}))`
      : session
        ? `Session ${sessionId} (${session.status}) already exists`
        : `cart ${cartId} already used in session ${cartInSession._id} (${cartInSession.status})`;
      
      res.status(409).json({ // 409 status is for conflict (already exists/in use)
        message: message
      });
    } */
    
    console.log('cartItem[0]', cart.items[0]);
    console.log('Object.keys(cart.toObject().items[0])', Object.keys(cart.toObject().items[0]));
    
    const orderItemsList = cart.items.map(({ itemId, name, unitPrice, amount }) => ({
      itemId: new mongoose.Types.ObjectId(itemId),
      name,
      unitPrice,
      amount
    }));

    console.log('orderItemsList', orderItemsList);

    const newSession = await Order.create({
      cartId: cart._id,
      items: orderItemsList,
      total: cart.totalPrice, // absolutely need to know what cart asyn func returns and check if I can return a res.status for this use case
      currency: cart.currency, // same as above
      status: "pending" // default anyway
    });

    // need to check whether an account is tied to the user or if the user is creating one



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

    /*
    const sessionFields = {}; // to return all non empty key-value pairs. Maybe overkill?
    for (const key in sessionCart) {
      let value = sessionCart[key];
      if (sessionCart[key] && sessionCart[key] != '') {
        sessionFields[key][value];
      }
    }

    return res.status(204).json({
      session: {
        ...sessionFields, // do I need the spread operator?
      }
    });
    */

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

// then issuing checkout session({ status, payment_status, ammount_total, currency, customer_details.email, payment_intent, metadata, client_reference_id})
// finally receiving payment intent from stripe, created by session??? -> update session status and delete cart

export { createSession, retrieveSession };