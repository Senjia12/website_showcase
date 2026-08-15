import Cart from '../models/cart.models.js'
import { getProductById } from "../services/product.services.js";

const getCart = async (req, res) => {
  try {
    const { id } = req.params;

  //  retrieve cart
    const cartInfo = await Cart.findOne({ _id: id });

    if (!cartInfo) {
      return res.status(404).json({
        message: "Cart doesn't exist, add a product to create it"
      });
    }

    return res.status(200).json({
      cartFound: {
        id: cartInfo._id,
        items: cartInfo.items,
        total: cartInfo.totalPrice
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal error"
    });
  }
}

const addToCart = async (req, res) => {
  try {
    // sessions and accounts not implemented yet

    const sessionId = 123456789; // placeholder for sessionId fetching
    let myCart = await Cart.findOne({ sessionId: sessionId });
    if (!myCart) {
      myCart = new Cart({ sessionId: sessionId, items: [], totalPrice: 0 });
      // ^ sessionId tied to cart will be passed
    }
    

    const { id, amount} = req.body;
    const item = await getProductById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const cartItem = {
      itemId: item._id,
      name: item.name,
      price: item.price,
      amount,
    };

    myCart.items.push(cartItem);

    // updating total sum
    myCart.totalPrice += amount * item.price;
    await myCart.save();

    res.status(200).json({ item: cartItem, totalPrice: myCart.totalPrice });

  } catch(error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

export {addToCart, getCart};