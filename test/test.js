const assert = require('assert')
const expect = require('chai').expect
const should = require('chai').should()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Course = require('../src/models/course')
const User = require('../src/models/user')

const test = express()

function validAuth(req, res, next) {
	const user = {
		name: 'joe@smith.com',
		pass: 'password',
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

// enter your own credentials based on what credentials are in your DB to test.
function invalidAuth(req, res, next) {
	const user = {
		name: 'joe@smith.com',
		pass: 'passord',
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

describe('User', function() {
	it('Should not error with correct User Authentication', function() {
		test.get('/api/users', validAuth, function(err, doc) {
			should.not.exist(err)
			should.exist(doc)
			doc.should.be.an('object')
		})
	})
})

describe('Course', function() {
	it('Should return and error becuase of invalid credentials', function() {
		test.get('/api/courses/:courseId', invalidAuth, function(err, doc) {
			should.not.exist(doc)
			should.exist(err)
		})
	})
})
