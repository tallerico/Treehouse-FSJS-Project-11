const mongoose = require('mongoose')
const Schema = mongoose.Schema

// users Schema
const users = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
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
	},
	password: { type: String, required: true },
})

module.exports = mongoose.model('User', users)
