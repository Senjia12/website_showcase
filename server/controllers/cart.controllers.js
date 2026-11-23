import mongoose from 'mongoose';
import { Cart } from '../models/cart.models.js'
import { getProduct, getPriceData, getStock } from '../services/product.services.js';

const getCart = async (req, res) => { // !!! to display the cart actually
  try {
    const { id } = req.params;

  //  retrieve cart
    const cartInfo = await Cart.findById(id);

    if (!cartInfo) {
      return res.status(404).json({
        message: "Cart doesn't exist, add a product to create it"
      });
    }

    return res.status(200).json({
      cartFound: {
        id: cartInfo._id,
        items: cartInfo.items,
        total: cartInfo.totalPrice,
        currency: cartInfo.currency
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal error"
    });
  }
};

const addToCart = async (req, res) => {
  try {
    // sessions and accounts not implemented yet
    const { existingCartId, product, amount, currency } = req.body;

    if (!product || !Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({
        message: `A product (${product}) and a strictly positive integer amount (${amount}) are required`
      });
    }

    if (existingCartId && !mongoose.isValidObjectId(existingCartId)) {
      return res.status(400).json({ message: "Invalid cart id" });
    }
    
    const item = await getProduct(product);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // !!! option to try to detect user's currency + account's default (if account)

    const myCart = (existingCartId && (await Cart.findById(existingCartId))) || new Cart({ items: [], totalPrice: 0, currency: currency ?? "eur" });

    const alreadyItem = myCart.items.find((i) => i.itemId.equals(item._id));
    
    const myCurrency = myCart.currency;
    const unitPrice = await getPriceData(product, myCurrency);

    const itemStock = await getStock(product);
    let amountAdded = 0;

    if (alreadyItem) {
      const { enough, stockStatus } = await getStock(product, alreadyItem.amount + amount);

      if (enough) { // stockStatus 'ok' and 'almost out' pass this condition
        alreadyItem.amount += amount;
        amountAdded += amount;
      }

      // !!! temporary, later alert in notif to shop owner and customers UI
      if (stockStatus == "almost out") {
        console.log(`As of this cart, item ${item._id} (${item.brickType} ${item.name})'s stock is ${itemStock.productStock - alreadyItem.amount}, out of ${itemStock.productStock}`);
      }

      if (!enough) {
        if (itemStock.productStock === 0) {
          console.log(`As of this cart, item ${item._id} (${item.brickType} ${item.name})'s stock is out`); // !!! UI & notif admin
        }
      }
      // for now no force stock - amounts matching in carts, may be togglable later in settings

    } else {
      const { enough, stockStatus } = await getStock(product, amount);

      if (enough) {

        const cartItem = {
          itemId: item._id,
          name: item.name,
          unitPrice,
          amount
        };

        myCart.items.push(cartItem);
        amountAdded += amount;

        if (stockStatus == "almost out") console.log(`As of this cart, item ${item._id} (${item.brickType, item.name})'s stock is ${itemStock.productStock - alreadyItem.amount}, out of ${itemStock.productStock}`);
      } else { console.log("Stock is out")}
    }

    // updating total sum
    myCart.totalPrice += amountAdded * unitPrice;
    await myCart.save();

    if (amountAdded >= 1) {
      return res.status(201).json({
        item: myCart.items,
        totalPrice: myCart.totalPrice,
        itemStock: itemStock.productStock
      });
    }

    return res.status(422).json({
      item: myCart.items,
      totalPrice: myCart.totalPrice,
      itemStock: itemStock.productStock
    });

  } catch(error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const removeFromCart = async (req, res) => { // ??? should I force remove over the stock/out of stock items?
  try {
    const { existingCartId, product, amount } = req.body;
    const myCart = await Cart.findById(existingCartId);

    if (!myCart) {
      return res.status(400).json({ message: `cart ${existingCartId} doesnt exist`});
    }

    if (!product || !Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ message: `product (${product}) and a strictly positive integer amount (${amount}) are required` });
    }
  
    const item = await getProduct(product);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const myCurrency = myCart.currency;
    const unitPrice = await getPriceData(product, myCurrency);

    let amountRemoved = 0;

    const alreadyItem = myCart.items.find((i) => i.itemId.equals(item._id));
    
    if (alreadyItem) {
      if (alreadyItem.amount <= amount) {

        amountRemoved = alreadyItem.amount;
        myCart.items.pull({ itemId: item._id });
        console.log(amountRemoved, unitPrice);

      } else {
        amountRemoved = amount;
        alreadyItem.amount -= amountRemoved;
        console.log(amountRemoved, unitPrice);
      }

    } else {
      console.log("Nothing changed")
      return res.status(200).json({ item: myCart.items, totalPrice: myCart.totalPrice })
    }

    myCart.totalPrice -= amountRemoved * unitPrice;

    await myCart.save();
    return res.status(200).json({ item: myCart.items, totalPrice: myCart.totalPrice }); // !!! note: if pull used, above response won't be up to date, but db will contain the correct value. Using more verbose syntax (for later) allows to ask to return the "new" cart (output identical to db)

  } catch (error) {
    console.error(error); // !!! I always forget this one
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export {
  getCart,
  addToCart,
  removeFromCart
};