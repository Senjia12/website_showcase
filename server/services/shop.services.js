import mongoose from "mongoose";
import { Cart } from "../models/cart.models.js";
import { getPriceData, getStock } from "./product.services.js";

const getCart = async (id) => {

  if (mongoose.isValidObjectId(id)) {
    const cart = await Cart.findById(id);
    return cart;
  }

  return null;
};

const checkPrices = async (cart) => {
  
  // !!! raise an error if currency not supported

  const unpriced = [];

  // checking if each item has the correct unitPrice with same currency as the cart
  // later !!! long list of items so should fetch all products in one query (Brick.find({ _id: { $in: ids } }))

  for (const item of cart.items) {
    const itemPrice = await getPriceData(item.itemId || item.name, cart.currency); // ??? an other, independant helper would be better (eur is default if no currency), so long check of currency supported is yet to be added
    
    if (!itemPrice) {
      unpriced.push(item.itemId ?? item.name);
      continue;
    }

    if (itemPrice !== item.unitPrice) {
      console.log("item ", item, " old price: ", item.unitPrice, ", new price: ", itemPrice);
      item.unitPrice = itemPrice;
    }
  }
  return unpriced;
};

const checkAmounts = async (cart) => {
  const unavailable = [];
  const toRm = [];

  for (const item of cart.items) {
    const itemStock = await getStock(item.itemId || item.name, item.amount);

    if (!itemStock) {
      unavailable.push({
        itemId: item.itemId ?? item.name,
        missingAmount: null
      });
      toRm.push(item.itemId);

    } else if (!itemStock.enough) {
      unavailable.push({
        item: item.itemId ?? item.name,
        missingAmount: item.amount - itemStock.productStock
      });

      if (itemStock.productStock === 0) {
        toRm.push(item.itemId);

      } else item.amount = itemStock.productStock;
    }
  }
  for (const id of toRm) cart.items.pull({ itemId: id });
  
  return unavailable;
};

const validateCart = async (cartId) => {
  const cart = await getCart(cartId);
  if (!cart) return null;

  const unpriced = await checkPrices(cart);
  console.log("unpriced: ", unpriced);

  const unavailable = await checkAmounts(cart);
  console.log("unavailable: ", unavailable);

  cart.totalPrice = cart.items.reduce((sum,i) => sum + i.unitPrice * i.amount, 0);
  await cart.save();
  
  return { cart, unpriced, unavailable };
}

export { getCart, checkPrices, checkAmounts, validateCart };