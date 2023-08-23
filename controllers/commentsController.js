const mongoose = require('mongoose');
const Comment = require('../models/commentsModel');
const Post = require('../models/postsModel');
const User = require('../models/usersModel');

exports.getComments = async (req, res) => {
	const { postId } = req.params;
	const { page } = req.query;
	const commentsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Comment.find({ postId })
			.sort({ createdAt: -1 })
			.skip(pageNum * commentsPerPage)
			.limit(commentsPerPage)
			.populate({
				path: 'userId',
				select: 'firstName lastName profilePicture',
			});

		res.status(200).json({ success: true, message: 'comments', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the comments' });
	}
};

exports.createComment = async (req, res) => {
	const { postId } = req.params;
	const { commentBody } = req.body;
	const { userId } = req.user;
	const givenPicture = req.file;

	try {
		if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
			return res
				.status(404)
				.json({ message: "It seems the post doesn't exist!" });
		}

		if (
			(!commentBody ||
				commentBody.trim() === '' ||
				commentBody === undefined ||
				commentBody === null) &&
			!givenPicture
		) {
			return res
				.status(401)
				.json({ message: 'Write something or select picture to post!' });
		}

		const pictureUrl = givenPicture ? givenPicture.path : undefined;

		const result = await Comment.create({
			commentBody,
			commentPicture: pictureUrl,
			postId,
			userId,
		});

		Post.updateOne(
			{ _id: postId },
			{ $inc: { commentsCount: 1 } },
			(err, result) => {
				if (err) {
					return res
						.status(401)
						.json({ message: 'Error while updating comments count!', err });
				}
			}
		);

		res.status(201).json({ success: true, message: 'Comment posted!', result });
	} catch (err) {
		return res
			.status(401)
			.json({ message: 'Error while posting comment!', err });
	}
};

exports.updateComment = async (req, res) => {
	const { _id } = req.params;
	const { commentBody } = req.body;
	const { userId } = req.user;

	try {
		if (!_id) {
			return res
				.status(404)
				.json({ message: 'That comment seems unavailable!' });
		}

		const existingComment = await Comment.findOne({ _id });

		if (!existingComment) {
			return res
				.status(404)
				.json({ message: 'Oops! That comment seems unavailable!' });
		}

		if (existingComment.userId.toString() !== userId) {
			return res.status(400).json({
				message: 'You do not have the authority to update this comment!',
			});
		}

		existingComment.commentBody = commentBody;
		const result = await existingComment.save();
		res
			.status(203)
			.json({ success: true, message: 'Comment updated succesfully!', result });
	} catch (err) {
		console.log(err);
	}
};

exports.deleteComment = async (req, res) => {
	const { _id } = req.params;
	const { userId } = req.user;

	try {
		if (!_id) {
			return res
				.status(404)
				.json({ message: 'That comment seems unavailable!' });
		}

		const existingComment = await Comment.findOne({ _id });

		if (!existingComment) {
			return res
				.status(404)
				.json({ message: 'Oops! That comment seems already unavailable!' });
		}

		if (existingComment.userId.toString() !== userId) {
			return res.status(400).json({
				message: 'You do not have the authority to delete this comment!',
			});
		}

		await Comment.deleteOne({ _id });
		res
			.status(203)
			.json({ success: true, message: 'Comment deleted succesfully!' });
	} catch (err) {
		console.log(err);
	}
};

exports.addUpvote = async (req, res) => {
	const { _id } = req.params;
	const { userId } = req.user;
	const { solverId } = req.params;

	try {
		if (!_id) {
			return res
				.status(404)
				.json({ message: 'That comment seems unavailable!' });
		}

		const existingComment = await Comment.findOne({ _id });

		if (!existingComment) {
			return res
				.status(404)
				.json({ message: 'Oops! That Comment seems already unavailable!' });
		}

		if (existingComment.upvoted) {
			return res
				.status(400)
				.json({ message: 'You cannot upvote a Comment twice!' });
		}

		existingComment.upvoted = true;
		existingComment.upvotedBy = userId;

		await existingComment.save();

		User.updateOne(
			{ _id: solverId },
			{ $inc: { points: 5 } },
			(err, result) => {
				if (err) {
					return res
						.status(401)
						.json({ message: 'Error while updating points!', err });
				}
			}
		);

		res.status(200).json({ success: true, message: 'Comment upvoted!' });
	} catch (err) {
		console.log(err);
	}
};

exports.removeUpvote = async (req, res) => {
	const { _id } = req.params;
	const { userId } = req.user;
	const { solverId } = req.params;

	try {
		if (!_id) {
			return res
				.status(404)
				.json({ message: 'That comment seems unavailable!' });
		}

		const existingComment = await Comment.findOne({ _id });

		if (!existingComment) {
			return res
				.status(404)
				.json({ message: 'Oops! That Comment seems already unavailable!' });
		}

		if (!existingComment.upvoted) {
			return res.status(400).json({ message: 'You have not upvoted yet!' });
		}

		console.log(existingComment.upvotedBy);
		console.log(userId);
		if (existingComment.upvotedBy.toString() !== userId) {
			return res.status(400).json({ message: 'You cannot downvote!' });
		}

		existingComment.upvoted = false;
		existingComment.upvotedBy = undefined;

		await existingComment.save();

		User.updateOne(
			{ _id: solverId },
			{ $inc: { points: -5 } },
			(err, result) => {
				if (err) {
					return res
						.status(401)
						.json({ message: 'Error while updating points!', err });
				}
			}
		);

		res.status(200).json({ success: true, message: 'Comment upvoted!' });
	} catch (err) {
		console.log(err);
	}
};
