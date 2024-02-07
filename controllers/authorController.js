import asyncHandler from 'express-async-handler'
import Author from '../models/authorModels.js'

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

        const author = await Author.findById(authorId);

        if (!author) {
            res.status(404);
            throw new Error('author not found');
        }

        res.status(200).json(author);
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
