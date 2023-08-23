const express = require('express');

const router = express.Router();
const uploader = require('../middlewares/uploader');
const commentsController = require('../controllers/commentsController');
const {
	identifier,
	credentialsVerified,
} = require('../middlewares/identification');

router.get('/:postId/get-comments', commentsController.getComments);
router.post(
	'/:postId/create-comment',
	identifier,
	credentialsVerified,
	uploader.single('comment-picture'),
	commentsController.createComment
);
router.patch(
	'/update-comment/:_id',
	identifier,
	credentialsVerified,
	commentsController.updateComment
);
router.delete(
	'/delete-comment/:_id',
	identifier,
	credentialsVerified,
	commentsController.deleteComment
);
router.patch(
	'/add-upvote/:_id/:solverId',
	identifier,
	credentialsVerified,
	commentsController.addUpvote
);
router.patch(
	'/remove-upvote/:_id/:solverId',
	identifier,
	credentialsVerified,
	commentsController.removeUpvote
);

module.exports = router;
