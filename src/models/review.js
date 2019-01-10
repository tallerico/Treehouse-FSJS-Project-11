const mongoose = require('mongoose')
const Schema = mongoose.Schema

//schema for reviews
const reviews = new Schema({
	user: {
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		postedOn: {
			type: Date,
			default: Date.now,
		},
		rating: {
			type: Number,
			required: true,
			min: [1, 'Please choose a number between 1 and 5'],
			max: [5, 'Please choose a number between 1 and 5'],
		},
		review: String,
	},
})

// model for reviews

module.exports = mongoose.model('Review', reviews)
