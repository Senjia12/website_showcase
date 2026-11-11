import mongoose, {Schema } from "mongoose";

const brickSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    brickType: {
      type: String,
      required: true,
      enum: ["MixKit", "ReclaimedBricks"]
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    img: [{
      type: String,
      required: true
    }],

    stock: {
      type: Number,
      required: true
    }
  },

  {
    timestamps: true
  }
);

const Brick = mongoose.model('Brick', brickSchema)

export default Brick