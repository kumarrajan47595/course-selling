import { Test } from "../models/test.js";

export const testCreate = async (req, res) => {
    const { title, description, amount } = req.body;
    const adminId = req.adminId;
    try {
        const test = {
            title: title,
            description: description,
            amount: amount,
            creatorId: adminId
        }
        const tests = await Test.create(test);
        res.status(200).json({ Message: "Test created" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in test create" });
    }
}

export const getTest = async (req, res) => {
    try {
        const test = await Test.find({});
        res.status(200).json({ Message: "All Tests", test });
    } catch (error) {
        console.log(error);
        res.status(400).json({ Messge: "Error in get test" })
    }
}

export const updateTest = async (req, res) => {
    const { testId } = req.params;
    const { title, description, amount } = req.body;
    try {
        if (!testId) {
            return res.status(400).json({ Message: "Course not found" });
        }
        const updatedTest = await Test.findByIdAndUpdate(testId, {
            title: title,
            description: description,
            amount: amount
        })
        res.status(200).json({ Message: "Test Updated", updatedTest });
    } catch (error) {
        console.log(error);
        res.status(400).json({ Message: "Error in update test" })
    }
}

export const deleteTest = async (req, res) => {
    const adminId = req.adminId;
    const { testId } = req.params;
    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(400).json({ message: "course not found" })
        }
        const tests = await Test.findOneAndDelete({
            _id: testId,
            creatorId: adminId
        })
        if (!tests) {
            return res.status(400).json({ message: "you are not creater to delete" })
        }
        res.status(200).json({message:"Assessment is deleted"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in delete test" })
    }
}