import mongoose from "mongoose";
import Bricks from "../models/brick.models.js";

// export const productIds = cartItems.map(item => item._id);

const getProductById = async (id) => {
  // const bricks = await Bricks.find({ _id: { $in: brickIds } });
  return await Bricks.findById(id);
};

// const cartItemGetData | { item.name, item.unitPrice }

const getProduct = async (idOrName) => {

  /* !!! regex when name > 12 caracters /^[0-9a-fA-F]{24}$/ */
  if (mongoose.isValidObjectId(idOrName)) {
    const item = await Bricks.findById(idOrName);
    return item;

  } else if (typeof idOrName === "string") {
    const item = await Bricks.findOne({ name: idOrName });
    return item;
  }

  if (!item) return null;
};

const getPriceData = async (productData, currency) => {
  const myCurrency = currency ?? 'eur';
  const product = await getProduct(productData);
  if (!product) return null;

  const myPrice = product.price.find((p) => p.currency === myCurrency)?.value;

  return myPrice
}

// only admin access, for now I put this with other services for the client requests

const setPriceData = async (productData, prices) => {
  const product = await getProduct(productData);

  // prices is a string of objects [{currency: value}]
  for (const { currency, value } of prices) {
    const alreadyCurrency = product.price.find((p) => p.currency === currency);

    if (alreadyCurrency) {
      console.log("Already a price with this currency: ", alreadyCurrency.currency, alreadyCurrency.value);
      alreadyCurrency.value = value;
      console.log("Value set to: ", alreadyCurrency.value);

    } else {
      product.price.push({ currency, value });
    }
  }
  await product.save();

  return product;
};

const getStock = async (productData, amountReq = undefined) => {
  const product = await getProduct(productData);

  if (!product) {
    return null;
  }

  const productStock = product.stock ?? 0;
  console.log("productStock: ", productStock);

  if (amountReq) {
    amountReq = Number.parseInt(amountReq);
    const enough = productStock >= amountReq;

    // this is for UI and perhaps to notif shop admin
    const stockStatus = (stock = productStock, amount = amountReq, isEnough = enough) => {
      if (!isEnough) return "out"
      if (stock - amount > stock * 0.1) return "ok"; // !!! 4later minimum stock alert setting
      return "almost out";
    }
    return { enough: enough, productStock: productStock, stockStatus: stockStatus() };
  }

  return productStock;
};

export {
  getProductById,
  getProduct,
  getPriceData,
  setPriceData,
  getStock
}