'use strict'

// load modules
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const auth = require('basic-auth')
const Course = require('./models/course')
const User = require('./models/user')
const Review = require('./models/review')
const mid = require('./middleware')

mongoose.connect('mongodb://localhost/course-api')

// Pending connection to the DB. This will give us success or error message based on connection fail/success.
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log('Connection Successful!')
})

const app = express()

app.use(bodyParser())

// set our port
app.set('port', process.env.PORT || 5000)

// morgan gives us http request logging
app.use(morgan('dev'))

// TODO add additional routes here

// send a friendly greeting for the root route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the Course Review API',
	})
})

// app.get('/api/users', (req, res, next) => {
// 	if (res.statusCode === 200) {
// 		//TODO get currently authenticated user
// 		User.find().then(user => {
// 			res.json(user)
// 		})
// 	}
// })

app.post('/api/users', function(req, res, next) {
	if (req.body.fullName && req.body.emailAddress && req.body.password && req.body.confirmPassword) {
		// confirm that user typed same password twice
		if (req.body.password !== req.body.confirmPassword) {
			var err = new Error('Passwords do not match.')
			err.status = 400
			return next(err)
		}

		// create object with data
		const user = new User({
			fullName: req.body.fullName,
			emailAddress: req.body.emailAddress,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
		})

		// use schema's `create` method to insert document into Mongo
		User.create(user, function(error, user) {
			if (error) {
				return next(error)
			} else {
				res.set('Location', '/')
				res.status(201).send({ response: 'User succesfully created' })
			}
		})
	} else {
		var err = new Error('All fields required.')
		err.status = 400
		return next(err)
	}
})

//get authenticated user
app.get('/api/users', mid.checkAuth, function(req, res, next) {
	res.send(res.locals.user)
})

//gets all courses
app.get('/api/courses', mid.checkAuth, (req, res, next) => {
	if (res.statusCode === 200) {
		Course.find({}, '_id title').then(course => {
			res.json(course)
		})
	} else {
		return next()
	}
})

//gets single course the relates to given id
app.get('/api/courses/:courseId', (req, res, next) => {
	if (res.statusCode === 200) {
		Course.find({ _id: req.params.courseId })
			.populate('user')
			.populate('reviews')
			.then(course => {
				res.json(course)
			})
	} else {
		return next()
	}
})

app.post('/api/courses', mid.checkAuth, (req, res, next) => {
	const course = new Course({
		user: res.locals.user._id,
		title: req.body.title,
		description: req.body.description,
		estimatedTime: req.body.estimatedTime,
		materialsNeeded: req.body.materialsNeeded,
		steps: [
			{
				stepNumber: req.body.steps[0].stepNumber,
				title: req.body.steps[0].title,
				description: req.body.steps[0].description,
			},
		],
	})

	Course.create(course, function(error, user) {
		if (error) {
			return next(error)
		} else {
			res.set('Location', '/')
			res.status(201).send({ response: 'Course succesfully created' })
		}
	})
})

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
	res.status(404).json({
		message: 'Route Not Found',
	})
})

// global error handler
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(err.status || 500).json({
		message: err.message,
		error: {},
	})
})

// start listening on our port
const server = app.listen(app.get('port'), () => {
	console.log(`Express server is listening on port ${server.address().port}`)
})
