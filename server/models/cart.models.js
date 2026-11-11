import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema( 
  { // ??? do I need to add _id field (since it is used and set in addToCart in cart controllers)
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
      type: Number
    },

    items: [cartItemSchema],
    
    totalPrice: {
      type: Number,
      min: 0
    }
  },

  {
    timestamps: true
  }
);

// const CartItem = mongoose.model('Cart item', cartItemSchema)
const Cart = mongoose.model('Cart', cartSchema);

export { Cart };