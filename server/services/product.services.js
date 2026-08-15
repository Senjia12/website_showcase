import Bricks from "../models/brick.models.js";

// export const productIds = cartItems.map(item => item.itemId);

export const getProductById = async (id) => {
  // const bricks = await Bricks.find({ _id: { $in: brickIds } });
  return await Bricks.findOne({ _id: id });
};