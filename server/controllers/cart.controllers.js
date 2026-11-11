import { Cart } from '../models/cart.models.js'
import { getProductById } from "../services/product.services.js";

const getCart = async (req, res) => { // !!! to display the cart actually
  try {
    const { id } = req.params;

  //  retrieve cart
    const cartInfo = await Cart.findById(id);

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
    const { existingCartId, productId, amount} = req.body;
    let myCart = await Cart.findById(existingCartId);

    if (!myCart) {
      myCart = new Cart({ items: [], totalPrice: 0 }); // ??? postman method post/get
    }

    if (!productId || !Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ message: `productId (${productId}) and a positive integer amount (${amount}) are required` });
    }
  
    const item = await getProductById(productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const alreadyItem = myCart.items.find((i) => i.itemId.equals(item._id));
    if (alreadyItem) {
      alreadyItem.amount += amount;
      
    } else {
      const cartItem = {
        itemId: item._id,
        name: item.name,
        unitPrice: item.price,
        amount: amount // ??? aint sure, do not confuse this with line_items
      };
      myCart.items.push(cartItem);
    }

    // updating total sum
    myCart.totalPrice += amount * item.price;

    await myCart.save();
    return res.status(200).json({ item: myCart.items, totalPrice: myCart.totalPrice });

  } catch(error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

export {addToCart, getCart};