const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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

// authenticate input against database documents
users.statics.authenticate = function(email, password, callback) {
	User.findOne({ emailAddress: email }).exec(function(error, user) {
		if (error) {
			return callback(error)
		} else if (!user) {
			var err = new Error('User not found.')
			err.status = 401
			return callback(err)
		}
		bcrypt.compare(password, user.password, function(error, result) {
			if (result === true) {
				return callback(null, user)
			} else {
				return callback()
			}
		})
	})
}
// hash password before saving to database
users.pre('save', function(next) {
	var user = this
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err)
		}
		user.password = hash
		next()
	})
})

var User = mongoose.model('User', users)

module.exports = User
