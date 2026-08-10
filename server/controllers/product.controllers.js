import Bricks from "../models/product.models.js";

const brickGetInfo = async (req, res) => {
  try {
    
    // required fields
    const { id } = req.params;

    // retrieve product
    const productInfo = await Bricks.findOne({ _id: target._id});

    if (!productInfo) {
      return res.status(404).json({ message: "The product doesnt exist" });
    }

    res.status(200).json({
      product: {
        id: productInfo._id,
        name: productInfo.name,
        brickType: productInfo.brickType,
        img_link: productInfo.img,
        price: productInfo.price,
        stocks: productInfo.stock
      }
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export {
  brickGetInfo
}