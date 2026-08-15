import Brick from "../models/brick.models.js";

const brickGetInfo = async (req, res) => {
  try {
    
    // required fields
    const { id } = req.params;

    // retrieve brick product info
    const brickInfo = await Brick.findOne({ _id: id }); // since _id is mongodb convention and id is in the api route (generic param name, REST convention)

    if (!brickInfo) {
      return res.status(404).json({ message: "The brick product doesnt exist" });
    }

    res.status(200).json({
      brickFoud: {
        id: brickInfo._id,
        name: brickInfo.name,
        brickType: brickInfo.brickType,
        img_link: brickInfo.img,
        price: brickInfo.price,
        stock: brickInfo.stock
      }
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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
    const alreadyBrick = await Brick.findOne({ name });

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
      
      // create new brick product
      const newBrick = await Brick.create({
        name,
        brickType,
        description,
        img,
        price,
        stock
      });

      res.status(201).json({
        message: "Product added successfully",
        newProduct: { id: newBrick._id, name: newBrick.name, brickType: newBrick.brickType, description: newBrick.description, img: newBrick.img, price: newBrick.price, stock: newBrick.stock }
      });
    };

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAllBricks = async (req, res) => {
  try {
    const bricks = await Brick.find();
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const updateBrick = async (req, res) => {
  try {
    // making sure the body isnt empty
    // /!\ {} is truthy so we can't use just use req.body.length cuz js behaves differently with arrays and strings
    if(Object.keys(req.body).length === 0) {// if 0 then none of the fields has a value   Object.keys converts object into an array of keys
      return res.status(400).json({
        message: "No data provided for update"
      });
    };
    const brick = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if (!post) return res.status(404).json({
      message: "Post not found"
    });

    res.status(200).json({
      message: "Post updated successfully", post
    })

  } catch (error) {
    res.status(500).json({
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