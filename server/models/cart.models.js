import mongoose, {Schema } from "mongoose";

const cartSchema = new Schema(
  {
    sessionId: {
      type: Number
    },

    items: [],
    
    totalPrice: {
      type: Number,
      min: 0
    }
  },

  {
    timestamps: true
  }
);

const cartItemSchema = new Schema( 
  {
    name: {
      type: String 
    },

    // price: {
    //   required: true,
    //   type: Number
    // },

    amount: {
      type: Number,
      min: 1,
      required: true
    }
  }
)

const Cart = mongoose.model('Cart', cartSchema);
const CartItem = mongoose.model('Cart item', cartItemSchema)

export default Cart;