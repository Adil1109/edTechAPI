const Playlist = require('../models/playlistsModel');
const Joi = require('joi');

exports.getPlaylist = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Playlist id not found!' });
		}

		const existingPlaylist = await Playlist.findOne({ _id });

		if (!existingPlaylist) {
			return res
				.status(400)
				.json({ success: false, message: 'Playlist is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the Playlist!',
			data: existingPlaylist,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Playlist' });
	}
};

exports.getPlaylists = async (req, res) => {
	const { page } = req.query;
	const playlistsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Playlist.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * playlistsPerPage)
			.limit(playlistsPerPage);

		res.status(200).json({ success: true, message: 'Playlists', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the playlists!' });
	}
};
exports.getTeacherPlaylists = async (req, res) => {
	const { userId } = req.params;
	const { page } = req.query;
	const playlistsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Playlist.find({ userId })
			.sort({ createdAt: 1 })
			.skip(pageNum * playlistsPerPage)
			.limit(playlistsPerPage);

		res.status(200).json({ success: true, message: 'Playlists', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the playlists!' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(3).required(),
});

exports.searchPlaylist = async (req, res) => {
	const { term } = req.params;
	const { page } = req.query;
	const playlistsPerPage = 10;

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
		const result = await Playlist.find({ $or: [{ title: { $regex: term } }] })
			.sort({ createdAt: -1 })
			.skip(pageNum * playlistsPerPage)
			.limit(playlistsPerPage);

		res.status(200).json({ success: true, message: 'playlists', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiPlaylistScheema = Joi.object({
	title: Joi.string().min(5).required(),
	description: Joi.string().min(10).required(),
	thumbnailLink: Joi.string().uri().required(),
	playlistLink: Joi.string().uri().required(),
});

exports.createPlaylist = async (req, res) => {
	const { title, description, thumbnailLink, playlistLink } = req.body;
	const { userId } = req.user;
	try {
		const { error, value } = joiPlaylistScheema.validate({
			title,
			description,
			thumbnailLink,
			playlistLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		await Playlist.create({
			title,
			description,
			thumbnailLink,
			playlistLink,

			userId,
		});

		res
			.status(201)
			.json({ success: true, message: 'Playlist created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the Playlist' });
	}
};

exports.updatePlaylist = async (req, res) => {
	const { _id } = req.params;
	const { title, description, thumbnailLink, playlistLink } = req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Playlist id not found!' });
		}

		const existingPlaylist = await Playlist.findOne({ _id });

		if (!existingPlaylist) {
			return res
				.status(400)
				.json({ success: false, message: 'Playlist is unavailable!' });
		}

		const { error, value } = joiPlaylistScheema.validate({
			title,
			description,
			thumbnailLink,
			playlistLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		existingPlaylist.title = title;
		existingPlaylist.description = description;
		existingPlaylist.thumbnailLink = thumbnailLink;
		existingPlaylist.playlistLink = playlistLink;

		await existingPlaylist.save();

		res
			.status(201)
			.json({ success: true, message: 'Playlist updated successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ message: 'Error while updating the Playlist' });
	}
};

exports.deletePlaylist = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Playlist id not found!' });
		}

		const existingPlaylist = await Playlist.findOne({ _id });

		if (!existingPlaylist) {
			return res
				.status(400)
				.json({ success: false, message: 'Playlist is already unavailable!' });
		}

		await Playlist.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Playlist deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the Playlist' });
	}
};
