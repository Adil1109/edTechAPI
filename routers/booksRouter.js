const express = require('express');

const router = express.Router();
const booksController = require('../controllers/booksController');

const {
	identifier,
	credentialsVerified,
} = require('../middlewares/identification');

router.get(
	'/get-books',
	identifier,
	credentialsVerified,
	booksController.getBooks
);

router.get(
	'/get-book/:_id',
	identifier,
	credentialsVerified,
	booksController.getBook
);
router.get(
	'/search-book/:term',
	identifier,
	credentialsVerified,
	booksController.searchBook
);
router.post(
	'/create-book',
	identifier,
	credentialsVerified,
	booksController.createBook
);
router.patch(
	'/update-book/:_id',
	identifier,
	credentialsVerified,
	booksController.updateBook
);
router.delete(
	'/delete-book/:_id',
	identifier,
	credentialsVerified,
	booksController.deleteBook
);

module.exports = router;
