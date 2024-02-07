import express from 'express'
const router = express.Router()
import { createPost, getAllPosts, getPostById, updatePostById, deletePostById } from '../controllers/postController.js'


router.route('/')
    .post(createPost)
    .get(getAllPosts)

router.route('/:id')
    .get(getPostById)
    .put(updatePostById)
    .delete(deletePostById)


export default router