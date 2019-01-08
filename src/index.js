'use strict'

// load modules
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Course = require('./models/course')
const User = require('./models/user')
const Review = require('./models/review')

mongoose.connect('mongodb://localhost/course-api')

// Pending connection to the DB. This will give us success or error message based on connection fail/success.
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log('Connection Successful!')
})

const app = express()

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

app.get('/api/users', (req, res, next) => {
	if (res.statusCode === 200) {
		//TODO get currently authenticated user
		models.User.find()
		res.json({
			message: 'This Works',
		})
	}
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
