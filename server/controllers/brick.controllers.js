import Brick from "../models/brick.models.js";
import { getProduct, setPriceData } from "../services/product.services.js";

const brickGetInfo = async (req, res) => {
  try {
    
    // required fields
    const brickData = req.params.idOrName;
    console.log("brickData", brickData);

    // retrieve brick product info
    const brickInfo = await getProduct(brickData);
    if (Object.keys(brickInfo).length === 0) {
      return res.status(404).json({ message: "The brick product doesnt exist" });
    }

    return res.status(200).json({
      brickFound: {
        id: brickInfo._id,
        name: brickInfo.name,
        brickType: brickInfo.brickType,
        img_link: brickInfo.img,
        price: brickInfo.price,
        stock: brickInfo.stock
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const createBrick = async (req, res) => {
  try {
    
    // required fields
    const { name, brickType, description, price, stock = 0, img } = req.body;

    if (!name || !brickType || !description || !price || !img) {
      return res.status(400).json({ message: "All fields required: name, description, price and image link"})
    }

    // brick product existing?
    const alreadyBrick = await Brick.findOne({ name }); // ???

    if (alreadyBrick) {

      return res.status(400).json({
        message: `Product already exists. If you mean to edit data, please use the appropriate update endpoint on ${alreadyBrick.name}`,
        existingBrick: {
          name: alreadyBrick.name,
          _id: alreadyBrick._id,
          brickType: alreadyBrick.brickType
        }
      });

    } else {

      if (!Array.isArray(price) || price.length === 0) {
        return res.status(400).json({ message: "prices must be a non-empty array" });
      }

      const { currency: firstCurrency, value: firstValue } = price[0];

      console.log("first price: ", firstCurrency, firstValue);

      // create new brick product
      const newBrick = await Brick.create({
        name,
        brickType,
        description,
        img,
        price: [{
          currency: firstCurrency,
          value: firstValue
        }],
        stock
      });

      console.log(await getProduct(name));
      
      if (price.length > 1) {
        const otherPrices = price.slice(1); // since the first price is already added (required field)
        const newBrickWithAllPrices = await setPriceData(name, otherPrices);

        console.log(newBrickWithAllPrices);
        return res.status(201).json({
          message: "Product added successfully",
          newProduct: newBrickWithAllPrices
        });
      }

      return res.status(201).json({
        message: "Product added successfully",
        newProduct: { id: newBrick._id, name: newBrick.name, brickType: newBrick.brickType, description: newBrick.description, img: newBrick.img, price: newBrick.price, stock: newBrick.stock }
      });
    };

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAllBricks = async (req, res) => {
  try {
    const bricks = await Brick.find();

    if (Object.keys(bricks).length === 0) {
      return res.status(404).json({
        message: "Not any brick found"
      });
    }
    
    return res.status(200).json(bricks);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const updateBrick = async (req, res) => {
  try {
    const { idOrName: brickData } = req.params;
    const { prices } = req.body;

    if (!Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({ message: "prices must be a non-empty array" });
    }
    
    const newBrick = await setPriceData(brickData, prices);
    if (!newBrick) return res.status(404).json({
      message: "Brick not found"
    });

    res.status(200).json({
      message: "Brick updated successfully", newBrick
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export {
  brickGetInfo,
  createBrick,
  getAllBricks,
  updateBrick
}