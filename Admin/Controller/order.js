import Joi from "joi";
import Order from "../../Admin/Model/order.js";
import Cart from "../../Customer/Model/cartDataModel.js";
import Pizza from "../../Admin/Model/pizzaData.js";
import Meal from "../../Admin/Model/meals.js"; 
import Customer from "../../Customer/Model/customerAuthModel.js";

// Define Joi schema for order validation
const orderSchema = Joi.object({
  customer: Joi.string().required(),
  cartid: Joi.array().required(),
  shippingAddress: Joi.object({
    city: Joi.string().required(),
    postalCode: Joi.string().min(6).required(),
    country: Joi.string().required(),
    state: Joi.string().required()
  }).required(),
  deliveryInstructions: Joi.string().allow('', null),
});

// Place Order
const placeorder = async (req, res) => {
  try {
    // Validate request body using Joi schema
    const { error, value } = orderSchema.validate(req.body);

    // If validation fails, send an error response
    if (error) {
      return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
    }

    const { customer, cartid, shippingAddress, deliveryInstructions } = value;

    // Check if customer exists
    const customerData = await Customer.findById(customer);

    if (!customerData) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the address already exists for the customer
    const addressExists = customerData.address.some(
      (addr) =>
        addr.city === shippingAddress.city &&
        addr.state === shippingAddress.state &&
        addr.country === shippingAddress.country &&
        addr.postalCode === shippingAddress.postalCode
    );

    // If address doesn't exist, add new address
    if (!addressExists) {
      customerData.address.push(shippingAddress);
      await customerData.save();
    }

    // Fetch the cart data
    const cartData = await Cart.findById(cartid).populate('pizzas.pizza').populate('meals.meal');

    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalAmount = 0;

    // Prepare cart details
    const cartDetails = [
      ...cartData.pizzas.map(item => {
        const pizza = item.pizza;
        const itemTotal = pizza.price * item.quantity;
        totalAmount += itemTotal;

        return {
          type: 'pizza',
          item: pizza._id,
          quantity: item.quantity,
          title: pizza.title,
          price: pizza.price,
          total: itemTotal,
        };
      }),
      ...cartData.meals.map(item => {
        const meal = item.meal;
        const itemTotal = meal.price * item.quantity;
        totalAmount += itemTotal;

        return {
          type: 'meal',
          item: meal._id,
          quantity: item.quantity,
          title: meal.title,
          price: meal.price,
          total: itemTotal,
        };
      }),
    ];

    // Create a new order
    const newOrder = new Order({
      customer,
      cartid,
      cartDetails,
      shippingAddress,
      deliveryInstructions,
      totalAmount,
    });

    // Save the order and clear the cart
    const savedOrder = await newOrder.save();
    await Cart.findByIdAndDelete(cartid);

    // Send response
    res.status(201).json({
      message: "Order placed successfully and cart cleared",
      order: savedOrder,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error in placing order",
      error: error.message,
    });
  }
};



// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const Orderid = req.params.id;
    const orderStatus = req.body;

    // console.log("Orderid",Orderid)
    // console.log("orderStatus",orderStatus)
    const updateOrder = await Order.findByIdAndUpdate(
      Orderid,
      orderStatus,
      { new: true }
    );

    if (!updateOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updateOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in updating order status",
      error: error.message,
    });
  }
};

// Get Orders by Customer
const getOrder = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customerDetails = await Order.find({ customer: customerId });

    if (!customerDetails) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    return res.status(200).json({
      customerDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get order",
      error: error.message,
    });
  }
};


// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    // Populate customer details along with orders
    const orders = await Order.find()
      .populate({
        path: 'customer',
        select: 'name phoneNumber', 
      });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


// Delete Order
const deleteOrders = async (req, res) => {
  try {
    const { orderId } = req.body;
    await Order.findByIdAndDelete(orderId);
    return res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

export { placeorder, updateOrderStatus, getOrder, getAllOrders, deleteOrders };
