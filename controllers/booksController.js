const Book = require('../models/booksModel');
const Joi = require('joi');

exports.getBook = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Book id not found!' });
		}

		const existingBook = await Book.findOne({ _id });

		if (!existingBook) {
			return res
				.status(400)
				.json({ success: false, message: 'Book is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the Book!',
			data: existingBook,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Book' });
	}
};

exports.getBooks = async (req, res) => {
	const { page } = req.query;
	const booksPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Book.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * booksPerPage)
			.limit(booksPerPage);

		res.status(200).json({ success: true, message: 'Books', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Books!' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(3).required(),
});

exports.searchBook = async (req, res) => {
	const { term } = req.params;
	const { page } = req.query;
	const booksPerPage = 10;

	try {
		const { error, value } = joiSearchTermScheema.validate({
			term,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid search term! ',
				error: error.details,
			});
		}
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Book.find({ $or: [{ title: { $regex: term } }] })
			.sort({ createdAt: -1 })
			.skip(pageNum * booksPerPage)
			.limit(booksPerPage);

		res.status(200).json({ success: true, message: 'Books', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiBookScheema = Joi.object({
	title: Joi.string().min(5).required(),
	description: Joi.string().min(10).required(),
	thumbnailLink: Joi.string().uri().required(),
	bookLink: Joi.string().uri().required(),
});

exports.createBook = async (req, res) => {
	const { title, description, thumbnailLink, bookLink } = req.body;
	const { userId } = req.user;
	try {
		const { error, value } = joiBookScheema.validate({
			title,
			description,
			thumbnailLink,
			bookLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		await Book.create({
			title,
			description,
			thumbnailLink,
			bookLink,
			userId,
		});

		res
			.status(201)
			.json({ success: true, message: 'Book created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the Book' });
	}
};

exports.updateBook = async (req, res) => {
	const { _id } = req.params;
	const { title, description, thumbnailLink, bookLink } = req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Book id not found!' });
		}

		const existingBook = await Book.findOne({ _id });

		if (!existingBook) {
			return res
				.status(400)
				.json({ success: false, message: 'Book is unavailable!' });
		}

		const { error, value } = joiBookScheema.validate({
			title,
			description,
			thumbnailLink,
			bookLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		existingBook.title = title;
		existingBook.description = description;
		existingBook.thumbnailLink = thumbnailLink;
		existingBook.bookLink = bookLink;

		await existingBook.save();

		res
			.status(201)
			.json({ success: true, message: 'Book updated successfully!' });
	} catch (error) {
		return res.status(400).json({ message: 'Error while updating the Book' });
	}
};

exports.deleteBook = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Book id not found!' });
		}

		const existingBook = await Book.findOne({ _id });

		if (!existingBook) {
			return res
				.status(400)
				.json({ success: false, message: 'Book is already unavailable!' });
		}

		await Book.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Book deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the Book' });
	}
};
