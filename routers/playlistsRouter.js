const express = require('express');

const router = express.Router();
const playlistsController = require('../controllers/playlistsController');

const {
	identifier,
	credentialsVerified,
} = require('../middlewares/identification');

router.get(
	'/get-playlists',
	identifier,
	credentialsVerified,
	playlistsController.getPlaylists
);
router.get(
	'/get-teacher-playlists/:userId',
	identifier,
	credentialsVerified,
	playlistsController.getTeacherPlaylists
);
router.get(
	'/get-playlist/:_id',
	identifier,
	credentialsVerified,
	playlistsController.getPlaylist
);
router.get(
	'/search-playlist/:term',
	identifier,
	credentialsVerified,
	playlistsController.searchPlaylist
);
router.post(
	'/create-playlist',
	identifier,
	credentialsVerified,
	playlistsController.createPlaylist
);
router.patch(
	'/update-playlist/:_id',
	identifier,
	credentialsVerified,
	playlistsController.updatePlaylist
);
router.delete(
	'/delete-playlist/:_id',
	identifier,
	credentialsVerified,
	playlistsController.deletePlaylist
);

module.exports = router;
