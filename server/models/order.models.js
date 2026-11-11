import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
  itemId: { // the product id
    type: Schema.Types.ObjectId,
    ref: "Brick",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  unitPrice: { // in cents, same currency as the order!!!
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    min:1,
    required:true
  }
}, { _id: false });

const orderSchema = new Schema({
  cartId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  items: [orderItemSchema],
  // maybe a virtual later. Number of items, not of different items
  /* totalItems: {
     type: Number,
     required: true
   }, */
  total: { // in cents
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "eur" // default depending on country from where the customer is shopping upon cart's creation, else default from account settings
  },
  status: {
    type: String,
    enum: ["pending", "paid", "expired", "failed"],
    default: "pending"
  },
  stripeSessionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripePaymentIntentId: String,
  customerEmail: String, // email to send the bill, default is account's if logged in
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: false
  }
}, { timestamps: true});

const Order = mongoose.model('Order', orderSchema);

export { Order };