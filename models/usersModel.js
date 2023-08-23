const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required'],
			trim: true,
			minLength: [3, 'The minimum length should be 3 characters'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
			trim: true,
			minLength: [3, 'The minimum length should be 3 characters'],
		},
		birthday: {
			type: Date,
			required: [true, 'Birth date is required'],
			min: '1923-01-01',
			max: '2023-01-01',
		},
		gender: {
			type: String,
			required: [true, 'Gender is required'],
			trim: true,
			enum: {
				values: ['Male', 'Female', 'Custom'],
				message: '{VALUE} is not supported',
			},
			default: 'Male',
		},
		email: {
			type: String,
			required: [true, 'Email is required!'],
			trim: true,
			unique: [true, 'Email must be unique!'],
			minLength: [5, 'The minimum length should be 5 characters'],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			trim: true,
			minLength: [8, 'The minimum length should be 8 characters'],
			select: false,
		},
		profilePicture: {
			type: String,
			default: 'no-profile-photo',
			trim: true,
		},
		coverPicture: {
			type: String,
			default: 'no-cover-photo',
			trim: true,
		},
		points: {
			type: Number,
			default: 0,
		},
		about: {
			type: String,
			trim: true,
		},
		role: {
			type: String,
			trim: true,
			enum: {
				values: ['general-user', 'moderator', 'admin', 'teacher','super-admin'],
				message: '{VALUE} is not supported',
			},
			default: 'general-user',
		},
		verified: {
			type: Boolean,
			default: false,
		},
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		verificationCode: {
			type: String,
			select: false,
		},
		verificationCodeValidation: {
			type: Number,
			select: false,
		},
		forgotPasswordCode: {
			type: String,
			select: false,
		},
		forgotPasswordCodeValidation: {
			type: Number,
			select: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
