const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
	{
		commentBody: {
			type: String,
			trim: true,
		},
		commentPicture: {
			type: String,
			trim: true,
		},
		upvoted: {
			type: Boolean,
			default: false,
		},

		upvotedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},

		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'This field is required'],
			trim: true,
			index: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'This field is required'],
			trim: true,
			index: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
