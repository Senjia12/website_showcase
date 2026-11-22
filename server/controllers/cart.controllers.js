import mongoose from 'mongoose';
import { Cart } from '../models/cart.models.js'
import { getProduct } from '../services/product.services.js';
import { computeCartAmounts, computeCartPrices } from '../services/shop.services.js';

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
        total: cartInfo.totalPrice,
        currency: cartInfo.currency
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal error"
    });
  }
};

const addToCart = async (req, res) => {
  try {
    // sessions and accounts not implemented yet
    const { existingCartId, product, amount, currency } = req.body;

    if (!product || !Number.isInteger(amount) || amount > 1) {
      return res.status(400).json({
        message: `A product (${product}) and a positive integer amount (${amount} are required)`
      });
    }

    if (existingCartId && !mongoose.isValidObjectId(existingCartId)) {
      return res.status(400).json({ message: "Invalid cart id" });
    }

    if (!product || !Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ message: `product (${product}) and a positive integer amount (${amount}) are required` });
    }
    
    const item = await getProduct(product);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // later option to try to detect user's currency + if account, account's default
    const myCart = (existingCartId && (await Cart.findById(existingCartId))) || new Cart({ items: [], totalPrice: 0, currency: currency ?? "eur" });

    const alreadyItem = myCart.items.find((i) => i.itemId.equals(item._id));

    if (alreadyItem) {
      alreadyItem.amount += amount;
    } else {
      const unitPrice = item.price.find((p) => p.currency === myCart.currency)?.value;

      const cartItem = {
        itemId: item._id,
        name: item.name,
        unitPrice,
        amount // ??? aint sure, do not confuse this with line_items
      };
      myCart.items.push(cartItem);
    }

    // updating total sum
    myCart.totalPrice += amount * itemPrice;

    await myCart.save();
    return res.status(200).json({ item: myCart.items, totalPrice: myCart.totalPrice });

  } catch(error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { existingCartId, product, amount } = req.body;
    let myCart = await Cart.findById(existingCartId);

    if (!myCart) {
      return res.status(400).json({ message: `cart ${existingCartId} doesnt exist`});
    }

    if (!product || !Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ message: `product (${product}) and a positive integer amount (${amount}) are required` });
    }
  
    const item = await getProduct(product);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const indexOfItem = myCart.items.findIndex((i) => i.itemId?.equals(item._id));
    const alreadyItem = myCart.items[indexOfItem];
    
    if (alreadyItem) {
      if (alreadyItem.amount <= amount) {
        myCart.totalPrice -= alreadyItem.amount * item.price;
        myCart.items.pull({ itemId: item._id });

      } else {
        alreadyItem.amount -= amount;
        myCart.totalPrice -= amount * item.price;
      }

    } else {
      console.log("Nothing changed")
      return res.status(200).json({ item: myCart.items, totalPrice: myCart.totalPrice })
    }

    await myCart.save();
    return res.status(200).json({ item: myCart.items, totalPrice: myCart.totalPrice }); // !!! note: if pull used, above response won't be up to date, but db will contain the correct value. Using more verbose syntax (for later) allows to ask to return the "new" cart (output identical to db)

  } catch (error) {
    console.error(error); // !!! I always forget this one
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const validateCart = async (req, res) => {
  try {
    const cartWithValidPrices = await computeCartPrices(req.params.id);

    const cartWithValidStock = await computeCartAmounts(req.params.id);
    
    return res.status(200).json({ cartWithValidPrices, cartWithValidStock });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export {
  addToCart,
  getCart,
  removeFromCart,
  validateCart
};