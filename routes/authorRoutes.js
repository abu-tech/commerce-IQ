import express from 'express'
const router = express.Router()
import { createAuthor, getAuthorById, updateAuthorById, deleteAuthorById } from '../controllers/authorController.js'


router.route('/')
    .post(createAuthor)

router.route('/:id')
    .get(getAuthorById)
    .put(updateAuthorById)
    .delete(deleteAuthorById)


export default router