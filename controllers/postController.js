import asyncHandler from 'express-async-handler'
import Post from '../models/postModel.js'
import Author from '../models/authorModels.js'
import redisClient from '../config/redisClient.js'

// Controller to create a new Post
const createPost = asyncHandler(async (req, res) => {
    try {
        const { title, author } = req.body;

        const newPost = await Post.create({
            title,
            author
        })

        // Increment the posts field in the corresponding Author document
        await Author.findByIdAndUpdate(
            author,
            { $inc: { posts: 1 } }
        );

        await newPost.populate('author', 'firstName lastName posts');

        res.status(201).json({
            post: newPost
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to get all posts
const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author', 'firstName lastName');

        if (posts) {
            res.status(200).json({
                posts: posts
            });
        } else {
            throw new Error('No posts found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to get post by ID
const getPostById = asyncHandler(async (req, res) => {
    try {
        const postId = req.params.id
        //check if the chached data is in redis
        const cachedData = await redisClient.get(postId)

        if (cachedData) {
            res.status(200).json({
                post: JSON.parse(cachedData)
            })
        } else {
            // If author data is not in Redis, fetch it from the database
            const post = await Post.findById(postId).populate('author', 'firstName lastName')

            if (!post) {
                res.status(404);
                throw new Error('Post not found');
            }

            await redisClient.setEx(postId, 300, JSON.stringify(post))

            res.status(200).json({
                post: post
            })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to update post by ID
const updatePostById = asyncHandler(async (req, res) => {
    try {
        const postId = req.params.id;
        const updateFields = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updateFields,
            { new: true }
        );

        if (!updatedPost) {
            res.status(404);
            throw new Error('Post not found');
        }

        res.status(200).json({
            post: updatedPost
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Controller to delete post by ID
const deletePostById = asyncHandler(async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post and retrieve the author ID
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            res.status(404);
            throw new Error('Post not found');
        }

        const authorId = deletedPost.author;
        // Decrease the 'posts' field in the corresponding Author document by 1
        await Author.findByIdAndUpdate(authorId, { $inc: { posts: -1 } });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
}


