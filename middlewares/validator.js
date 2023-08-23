const Joi = require('joi');

exports.signupScheema = Joi.object({
	firstName: Joi.string().min(3).max(30).required(),
	lastName: Joi.string().min(3).max(30).required(),
	birthday: Joi.date().required(),
	gender: Joi.any().valid('Male', 'Female', 'Custom').required(),
	email: Joi.string()
		.min(6)
		.max(50)
		.required()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		}),
	password: Joi.string()
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$'))
		.messages({
			'string.pattern.base':
				'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
		}),
});

exports.signinScheema = Joi.object({
	email: Joi.string()
		.min(6)
		.max(50)
		.required()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		}),
	password: Joi.string().required(),
});

exports.changePasswordScheema = Joi.object({
	newPassword: Joi.string()
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$'))
		.messages({
			'string.pattern.base':
				'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
		}),
});

exports.acceptCodeScheema = Joi.object({
	providedCode: Joi.number().required(),
});

exports.acceptFPCodeScheema = Joi.object({
	email: Joi.string()
		.min(6)
		.max(50)
		.required()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		}),
	providedCode: Joi.number().required(),
	newPassword: Joi.string()
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$'))
		.messages({
			'string.pattern.base':
				'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
		}),
});
