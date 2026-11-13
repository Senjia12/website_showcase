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

  console.log("failed all if", typeof idOrName);
};

const getPriceData = async (product, currency) => {
  const myCurrency = currency ?? 'eur';
  const productData = await getProduct(product);
  const myPrice = productData.price.find((p) => p.currency === myCurrency)?.value; // ??? not sure of myself

  return myPrice
}

export { getProductById, getProduct }