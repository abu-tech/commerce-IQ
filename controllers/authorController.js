import asyncHandler from 'express-async-handler'
import Author from '../models/authorModels.js'
import redisClient from '../config/redisClient.js'

// Controller to create a new user
const createAuthor = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, posts } = req.body;

        const newAuthor = await Author.create({
            firstName,
            lastName,
        });

        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to update a user by ID
const updateAuthorById = asyncHandler(async (req, res) => {
    try {
        const authorId = req.params.id;
        const updateFields = req.body;

        const updatedAuthor = await Author.findByIdAndUpdate(
            authorId,
            updateFields,
            { new: true }
        );

        if (!updatedAuthor) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json(updatedAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to get a user by ID
const getAuthorById = asyncHandler(async (req, res) => {
    try {
        const authorId = req.params.id;

        // Check if the author data is in Redis
        const cachedData = await redisClient.get(authorId)

        if (cachedData) {
            // If author data is found in Redis, return it
            res.status(200).json(JSON.parse(cachedData));
        } else {
            // If author data is not in Redis, fetch it from the database
            const author = await Author.findById(authorId);

            if (!author) {
                res.status(404);
                throw new Error('Author not found');
            }

            await redisClient.setEx(authorId, 300, JSON.stringify(author))

            res.status(200).json(author);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to delete a user by ID
const deleteAuthorById = asyncHandler(async (req, res) => {
    try {
        const authorId = req.params.id;

        const deletedAuthor = await Author.findByIdAndDelete(authorId);

        if (!deletedAuthor) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export {
    createAuthor,
    updateAuthorById,
    getAuthorById,
    deleteAuthorById
};
