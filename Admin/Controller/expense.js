import Expense from "../../Admin/Model/expense.js";
import Joi from "joi";
const expenseSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    amount: Joi.number().min(1).positive().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    paymentMode: Joi.string().required(),
    vendor: Joi.string().required(),
    billImage: Joi.string().uri().optional() 
});
// Add a new expense
const addExpense = async (req, res) => {
    try {
        const { error } = expenseSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { title, amount, category, description, paymentMode, vendor } = req.body;
        const billImage = req.file ? req.file.path : null;

        const newExpense = new Expense({
            title,
            amount,
            category,
            description,
            paymentMode,
            vendor,
            billImage
        });

        await newExpense.save();
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error adding expense' });
    }
};


// Get all expenses and calculate total expense
const getAllExpense = async (req, res) => {
    try {
        const expenses = await Expense.find();
        const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
        res.status(200).json({ expenses, totalExpense });
    } catch (error) {
        res.status(400).json({ error: 'Error fetching expenses' });
    }
};


// Get a single expense by ID
const getSingleExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        console.log("expenseId",expenseId)
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching expense' });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    try {
        const { title, amount, category, description, paymentMode, vendor } = req.body;
        const billImage = req.file ? req.file.path : req.body.billImage;

        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, {
            title,
            amount,
            category,
            description,
            paymentMode,
            vendor,
            billImage
        }, { new: true });

        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
    } catch (error) {
        res.status(400).json({ error: 'Error updating expense' });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting expense' });
    }
};

export { addExpense, getAllExpense, getSingleExpense, updateExpense, deleteExpense };
