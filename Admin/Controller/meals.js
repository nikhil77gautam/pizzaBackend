import Joi from "joi";
import MealsItems from "../../Admin/Model/meals.js";
const mealSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('Beverages', 'Desserts').required(),
  image: Joi.string().uri().optional()
});

const createMeals = async (req, res) => {
  try {
    const { error } = mealSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const newItems = new MealsItems({
      title,
      description,
      price,
      category,
      image,
    });
    await newItems.save();
    res.status(201).json({ message: "meals added", meals: newItems });
  } catch (error) {
    console.error("Error adding meals:", error.message);
    res.status(500).json({ message: "Error adding meals", error: error.message });
  }
};

const updateMeals = async (req, res) => {
  try {
    const mealsId = req.params.id;
    const updateData = req.body;
    console.log("data",updateData)
    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/");
    }
    const updatedMeals = await MealsItems.findByIdAndUpdate(mealsId, updateData, { new: true });
    return res.json({ success: true, message: "meals updated", meals: updatedMeals });
  } catch (error) {
    res.status(500).json({ message: "Error updating meals", error: error.message });
  }
};

const readAllmeals = async (req, res) => {
  try {
    const meals = await MealsItems.find();
    res.status(200).json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error.message);
    res.status(500).json({ message: "Error fetching meals", error: error.message });
  }
};

const readOnesMeals = async (req, res) => {
  try {
    const itemsId  = req.params.id;
    const mealsData = await MealsItems.findById(itemsId);
    if (!mealsData) {
      return res.status(404).json({ message: "items not found" });
    }
    res.status(200).json(mealsData);
  } catch (error) {
    console.error('Error fetching mealsData:', error.message);
    res.status(500).json({ message: "Error fetching mealsData", error: error.message });
  }
};

const deleteOneMeals = async (req, res) => {
  try {
    const { itemsId } = req.body;
    const items = await MealsItems.findByIdAndDelete(itemsId);
    return res.json({ success: true, message: "item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mealsItems", error: error.message });
  }
};

const deleteAllMealsItems = async (req, res) => {
  try {
    const mealsItem = await MealsItems.deleteMany({});
    return res.json({ success: true, message: `${mealsItem.deletedCount} mealsItems deleted` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mealsItems", error: error.message });
  }
};

const categoryFindmeals = async (req, res) => {
  const { category } = req.body;
  try {
    const MealsData = await MealsItems.find({ category });
    if (!MealsData.length) {
      return res.status(404).json({ message: "No MealsData found for this category" });
    }
    res.status(200).json(MealsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MealsData by category" });
  }
};

export { createMeals, updateMeals, readAllmeals, readOnesMeals, deleteOneMeals, deleteAllMealsItems, categoryFindmeals };
