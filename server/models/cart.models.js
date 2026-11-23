import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema( 
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Brick"
    },

    name: {
      type: String 
    },

     unitPrice: {
    //   required: true,
       type: Number
     },

    amount: {
      type: Number,
      min: 1,
      required: true // ???
    }
  },

  {
    _id: false
  }
);

const cartSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Order"
    },

    items: [cartItemSchema],
    
    totalPrice: {
      type: Number,
      min: 0
    },

    currency: {
      type: String,
      default: "eur"
    }
  },

  {
    timestamps: true
  }
);

// const CartItem = mongoose.model('Cart item', cartItemSchema)
const Cart = mongoose.model('Cart', cartSchema);

export { Cart };