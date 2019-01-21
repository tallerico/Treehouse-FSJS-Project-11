# Treehouse-FSJS-Project-11

Thank you for checking out my API project. You will find in this project sample code written to show my understanding of node, express, mongoose and mongoDV.

Instructions:

- Run npm install

- Open a Command Prompt (on Windows) or Terminal (on Mac OS X) instance and run the command mongod (or sudo mongod) to start the MongoDB daemon.

- Open a second Command Prompt (on Windows) or Terminal (on Mac OS X) instance.

-Browse to the seed-data folder located in the root of the project.

Run the following commands:

- mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json
  mongoimport --db course-api --collection users --type=json --jsonArray --file users.json
  mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json

* To run type npm start

-------TEST---------

Test have been built to test auth with user and course routes.

- To run type npm test
