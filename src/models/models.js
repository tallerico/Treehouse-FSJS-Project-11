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
				const emailRegx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
				return emailRegx.test(v)
			},
		},
		password: { type: String, required: true },
	},
})

//users Model
const User = mongoose.model('User', users)
