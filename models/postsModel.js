const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
	{
		postBody: {
			type: String,
			trim: true,
		},
		postPicture: {
			type: String,
			trim: true,
		},
		commentsCount: {
			type: Number,
			default: 0,
		},
		pictureType: {
			type: String,
			trim: true,
			enum: {
				values: ['post-picture', 'profile-picture', 'cover-picture'],
				message: '{VALUE} is not supported',
			},
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Userid is required'],
			trim: true,
			index: true,
		},
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
