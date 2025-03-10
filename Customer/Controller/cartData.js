import mongoose from "mongoose";
import cartdata from "../../Customer/Model/cartDataModel.js"; 
import Joi from "joi";

// const cartSchema = Joi.object({
//   customerId: Joi.string().required(),
//   pizzaId: Joi.string().required(),
//   mealId: Joi.string().required(),
//   quantity: Joi.number().integer().min(1),
//   Id: Joi.string(),
// });

const getcart = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    const cart = await cartdata
      .findOne({ customer: id })
      .populate("pizzas.pizza")
      .populate("meals.meal");
console.log("cart=",cart)
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const totalAmount =
      cart.pizzas.reduce(
        (acc, item) => acc + item.pizza.price * item.quantity,
        0
      ) +
      cart.meals.reduce(
        (acc, item) => acc + item.meal.price * item.quantity,
        0
      );

    res.json({ cart, totalAmount });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const addtocart = async (req, res) => {

  // const { error } = cartSchema.validate(req.body);
  // if (error) {
  //   return res.status(400).json({ message: error.details[0].message });
  // }

  const { pizzaId, mealId, customerId, quantity  } = req.body;
  console.log("req.body =",req.body)

  if (!customerId || (!pizzaId && !mealId)) {
    return res
      .status(400)
      .json({
        message: "Customer ID and either Pizza ID or Meal ID are required",
      });
  }

  try {
    let cart = await cartdata.findOne({ customer: customerId });

    if (!cart) {
      cart = new cartdata({
        customer: customerId,
        pizzas: pizzaId ? [{ pizza: pizzaId, quantity: quantity }] : [],
        meals: mealId ? [{ meal: mealId, quantity: quantity }] : [],
      });
    } else {
      if (pizzaId) {
        const pizzaIndex = cart.pizzas.findIndex(
          (item) => item.pizza.toString() === pizzaId
        );
        if (pizzaIndex > -1) {
          cart.pizzas[pizzaIndex].quantity += quantity;
        } else {
          cart.pizzas.push({ pizza: pizzaId, quantity: quantity });
        }
      }

      if (mealId) {
        const mealIndex = cart.meals.findIndex(
          (item) => item.meal.toString() === mealId
        );
        if (mealIndex > -1) {
          cart.meals[mealIndex].quantity += quantity;
        } else {
          cart.meals.push({ meal: mealId, quantity: quantity });
        }
      }
    }

    await cart.save();
    res.json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const removefromcart = async (req, res) => {
  const { customerId, Id } = req.body;

  if (!customerId || !Id) {
    return res
      .status(400)
      .json({ message: "Customer ID and Item ID are required" });
  }

  try {
    const cart = await cartdata.findOne({ customer: customerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.pizzas = cart.pizzas.filter((item) => item.pizza.toString() !== Id);
    cart.meals = cart.meals.filter((item) => item.meal.toString() !== Id);

    await cart.save();

    res.json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res
      .status(500)
      .json({
        message: "Error in removing item from cart",
        error: error.message,
      });
  }
};

const updateCartQuantity = async (req, res) => {
  const { customerId, id } = req.params; 
  const { quantity } = req.body;

  console.log("customerId:", customerId);
  console.log("id:", id);
  console.log("quantity:", quantity);

  if (!customerId || !id || quantity == null || quantity < 1) {
    return res.status(400).json({
      message: "Customer ID, Item ID, and a valid Quantity are required",
    });
  }

  try {
    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const itemObjectId = new mongoose.Types.ObjectId(id);

    const pizzaResult = await cartdata.updateOne(
      { customer: customerObjectId, "pizzas.pizza": itemObjectId },
      { $set: { "pizzas.$.quantity": quantity } }
    );

    if (pizzaResult.matchedCount > 0) {
      return res.status(200).json({ message: "Pizza quantity updated successfully" });
    }

    const mealResult = await cartdata.updateOne(
      { customer: customerObjectId, "meals.meal": itemObjectId },
      { $set: { "meals.$.quantity": quantity } }
    );

    if (mealResult.matchedCount > 0) {
      return res.status(200).json({ message: "Meal quantity updated successfully" });
    }

    return res.status(404).json({ message: "Cart item not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error updating quantity", error: error.message });
  }
};



export { getcart, addtocart, removefromcart, updateCartQuantity };
