const mongoose = require('mongoose')
const Schema = mongoose.Schema

//courses schema
const courses = new Schema({
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
		required: true,
	},
	materialsNeeded: {
		type: String,
		required: true,
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

module.exports = mongoose.model('Course', courses)
