import mongoose from "mongoose";
import { Cart } from "../models/cart.models.js";
import { getPriceData } from "./product.services.js";

const getCart = async (idOrName) => {
  /* !!! regex when name > 12 caracters /^[0-9a-fA-F]{24}$/ */
  if (mongoose.isValidObjectId(idOrName)) {
    const cart = await Cart.findById(idOrName);
    return cart;

  } else if (typeof idOrName === "string") {
    const cart = await Cart.findOne({ name: idOrName });
    return cart;
  }

  return null;
}

const computeCartPrices = async (cart) => {
  const fetchCart = await getCart(cart);
  if (!fetchCart) return null;

  const unpriced = [];

  // checking if each item has the correct unitPrice with same currency as the cart
  // later !!! long list of items so should fetch all products in one query (Brick.find({ _id: { $in: ids } }))

  for (const item of fetchCart.items) {
    const itemPrice = await getPriceData(item.id || item.name, fetchCart.currency);
    
    if (!itemPrice) {
      unpriced.push(item.itemId ?? item.name);
      continue;
    }

    if (itemPrice !== item.unitPrice) {
      console.log("item ", item, " old price: ", item.unitPrice, ", new price: ", itemPrice);
      item.unitPrice = itemPrice;
    }
  }

  fetchCart.totalPrice = fetchCart.items.reduce((sum, i) => sum + i.unitPrice * i.amount, 0);
  await fetchCart.save();

  if (unpriced.length > 0) console.log("Error while processing: ", unpriced);

  return { cart: fetchCart, unpriced };
};

export { getCart, computeCartPrices };