const mongoose = require('mongoose');

const playlistScheema = mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minLength: 5,
		},
		description: {
			type: String,
			trim: true,
		},
		thumbnailLink: {
			type: String,
			trim: true,
		},
		playlistLink: {
			type: String,
			trim: true,
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Userid is required'],
			trim: true,
			index: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Playlist', playlistScheema);
