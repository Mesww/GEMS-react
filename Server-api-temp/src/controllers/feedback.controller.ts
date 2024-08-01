import { Request, Response } from 'express';
import Feedback from '../models/feedback.model'; // Adjust the path accordingly

// Create a new feedback
export const createFeedback = async (req: Request, res: Response) => {
    const { description, createdAt } = req.body;

    if (!description || !createdAt) {
        return res.status(400).json({ message: 'Description and createdAt are required' });
    }

    try {
        const feedback = new Feedback({ description, createdAt });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback', error });
    }
};

// Get all feedbacks
export const getAllFeedbacks = async (req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks', error });
    }
};

// Get a single feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error });
    }
};

// Update a feedback by ID
export const updateFeedback = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { description, createdAt } = req.body;

    try {
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { description, createdAt },
            { new: true, runValidators: true }
        );
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error });
    }
};

// Delete a feedback by ID
export const deleteFeedback = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error });
    }
};
