import mongoose from "mongoose";
import Bricks from "../models/brick.models.js";

// export const productIds = cartItems.map(item => item._id);

export const getProductById = async (id) => {
  // const bricks = await Bricks.find({ _id: { $in: brickIds } });
  return await Bricks.findById(id);
};

const cartItemGetData = async (idOrName) => {

  if (mongoose.isValidObjectId(idOrName)) {
    idOrName = new mongoose.Types.ObjectId(idOrName);
  }

  if (idOrName == mongoose.Types.ObjectId) {
    const item = await Bricks.findById(idOrName);
    return item.name, item.unitPrice;
    
  } else if (idOrName == String) {
    const item = await Bricks.findOne({ name: idOrName })
  }

}