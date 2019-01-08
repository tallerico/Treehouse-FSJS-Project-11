const mongoose = require('mongoose')
const Schema = mongoose.Schema

// users Schema
const users = new Schema({
	fullName: { type: String, required: true },
	emailAddress: {
		type: String,
		required: true,
		unique: [true, 'Unique Email Required'],
		validate: {
			validator: function(v) {
				const emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				return emailRegx.test(v)
			},
		},
		password: { type: String, required: true },
	},
})

//users Model
const User = mongoose.model('User', users)

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

//model for courses
const Course = mongoose.model('Course', courses)

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
const Review = mongoose.model('Review', users)

export { User, Course, Review }
