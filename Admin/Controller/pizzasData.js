import Joi from 'joi';
import Pizza from "../../Admin/Model/pizzaData.js";

// Validation Schemas
const createPizzaSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(), // Accepts both positive and negative values
  category: Joi.string().required(),
  image: Joi.string()
});

const updatePizzaSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(), // Accepts both positive and negative values
  category: Joi.string(),
  image: Joi.string()
});

const categoryFindPizzaSchema = Joi.object({
  category: Joi.string().required()
});

// Create Pizza
const createpizza = async (req, res) => {
  try {
    const { error } = createPizzaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
    }
    
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const newPizza = new Pizza({ title, description, price, image, category });
    await newPizza.save();
    res.status(201).json({ message: "Pizza added", pizza: newPizza });
  } catch (error) {
    console.error('Error adding pizza:', error.message);
    res.status(500).json({ message: "Error adding pizza", error: error.message });
  }
};

// Update Pizza
const updatepizzas = async (req, res) => {
  try {
    const { error } = updatePizzaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
    }

    const pizzaid = req.params.id;
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, '/');
    }
    const updatedPizza = await Pizza.findByIdAndUpdate(pizzaid, updateData, { new: true });
    return res.json({ success: true, message: "Pizza updated", pizza: updatedPizza });
  } catch (error) {
    res.status(500).json({ message: "Error updating pizza", error: error.message });
  }
};

// Read All Pizzas
const readallpizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json(pizzas);
  } catch (error) {
    console.error('Error fetching pizzas:', error.message);
    res.status(500).json({ message: "Error fetching pizzas", error: error.message });
  }
};

// Read One Pizza
const readOnePizza = async (req, res) => {
  try {
    const id = req.z.id; 
    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    pizza.image = pizza.image.replace(/\\/g, '/');
    res.status(200).json(pizza);
  } catch (error) {
    console.error('Error fetching pizza:', error.message);
    res.status(500).json({ message: "Error fetching pizza", error: error.message });
  }
};

// Delete Pizza
const deletepizzas = async (req, res) => {
  try {
    const id = req.params.id;
    await Pizza.findByIdAndDelete(id);
    return res.json({ success: true, message: "Pizza deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pizza", error: error.message });
  }
};

// Delete All Pizzas
const deleteallpizzas = async (req, res) => {
  try {
    const result = await Pizza.deleteMany({});
    return res.json({ success: true, message: `${result.deletedCount} pizzas deleted` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pizzas", error: error.message });
  }
};

// Find Pizzas by Category
const categoryFindPIzza = async (req, res) => {
  const { error } = categoryFindPizzaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
  }

  const { category } = req.body;
  try {
    const pizzas = await Pizza.find({ category });
    if (!pizzas.length) {
      return res.status(404).json({ message: "No pizzas found for this category" });
    }
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pizzas by category" });
  }
};

export { createpizza, updatepizzas, readallpizzas, readOnePizza, deletepizzas, deleteallpizzas, categoryFindPIzza };
