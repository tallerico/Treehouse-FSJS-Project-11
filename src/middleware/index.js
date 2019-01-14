const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const auth = require('basic-auth')
const User = require('../models/user')

function checkAuth(req, res, next) {
	const user = auth(req)
	console.log(user)
	if (user.name && user.pass) {
		User.authenticate(user.name, user.pass, function(error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.')
				err.status = 401
				return next(err)
			} else {
				return next()
			}
		})
	} else {
		var err = new Error('Email and password are required.')
		err.status = 401
		return next(err)
	}
}
module.exports.checkAuth = checkAuth
