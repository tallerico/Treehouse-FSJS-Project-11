const mongoose = require('mongoose')
const Schema = mongoose.Schema

//courses schema
const courses = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	estimatedTime: {
		type: String,
	},
	materialsNeeded: {
		type: String,
	},
	steps: [
		{
			stepNumber: Number,
			title: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
		},
	],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
})

const Course = mongoose.model('Course', courses)

module.exports = Course
