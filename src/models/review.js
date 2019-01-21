const mongoose = require('mongoose')
const Schema = mongoose.Schema

//schema for reviews
const reviews = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
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
			min: [1, 'Please choose a number between 1 and 5'],
			max: [5, 'Please choose a number between 1 and 5'],
		},
		review: String,
	},
})

// model for reviews

const Review = mongoose.model('Review', reviews)

module.exports = Review
