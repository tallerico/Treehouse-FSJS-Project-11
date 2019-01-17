const assert = require('assert')
const expect = require('chai').expect
const should = require('chai').should()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Course = require('./models/course')
const User = require('./models/user')

const test = express()

// enter your own credentials based on what you have in your DB to test.
function checkAuth(req, res, next) {
	const user = {
    name: ''
    pass: ''
  }

	if (user.name && user.pass) {
		User.authenticate(user.name, user.pass, function(error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.')
				err.status = 401
				return next(err)
			} else {
				res.locals.user = user
				return next()
			}
		})
	} else {
		var err = new Error('Email and password are required.')
		err.status = 401
		return next(err)
	}
}

test.get('/api/users', checkAuth, function(err, doc) {
	should.not.exist(err)
	should.exist(doc)
	doc.should.be.an('object')
})

test.get('/api/courses/:courseId', checkAuth, function(err, doc) {
	should.exist(err)
})
