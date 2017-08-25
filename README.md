# Shift-DMS
[![codecov](https://codecov.io/gh/andela-ifatoki/CP2-Shift-DMS/branch/chore/150541479/implement-scorecard-feedback/graph/badge.svg)](https://codecov.io/gh/andela-ifatoki/CP2-Shift-DMS)
[![Build Status](https://travis-ci.org/andela-ifatoki/CP2-Shift-DMS.svg?branch=chore/150541479/implement-scorecard-feedback)](https://travis-ci.org/andela-ifatoki/CP2-Shift-DMS)
[![Coverage Status](https://coveralls.io/repos/github/andela-ifatoki/CP2-Shift-DMS/badge.svg?branch=chore/150541479/implement-scorecard-feedback)](https://coveralls.io/github/andela-ifatoki/CP2-Shift-DMS?branch=implementFeedback)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/codeclimate/codeclimate)

## Introduction
Document Management System is a full stack application based on a RestFUL API that allows users to create and manage documents by giving different priviledges and rights to documents they create based on user roles.

## Why Shift-DMS?
With this application you can create and store a document, you have the option to select the visibility access for the document **public** - users registered on the platform can view your document, **private** - your document will only be view by you, **role** - based on the Admin's discretion, he/she can create a role and all registered users with that role can view your document because you belong to the same role. BE assured that your documents are safe and securely hosted on Heroku.

## Dependencies
### Development Dependencies
The following depencies are required by the app during developmment
- Babel-register - This framework helps to compile from es6 to es5
- enzyme - Enzyme is used together with mocha, chai and expect.js to test this application
- eslint - This is a javascript syntax highlighter used to highligh syntax error during the development of this app
- nyc - Used with mocha for test coverage report
- sinon - Used with mocha and enzyme for mocking React components during test
- webpack-dev-middleware - Serves files to server during development
- webpack-hot-middleware - It enables the browser to reload automatically when changes are made to the app
### Dependencies
- axios - Used to make GET requests to external API's
- babel-cli - It enables the app scripts to be tested with babel from the command line
- babel-core - It compiles es6 used in the app to es5
- babel-eslint - Used with ESlint to lint syntax errors
- babel-loader - Used with Webpack to transpile javascript codes
- babel-plugin-react-html-attrs - It help convert JSX class attribute into className
- bcryptjs - Used to hash user's password before saving to the database
- chai - Asscertion library used for the backend testing
- coveralls - Display test coverage
- express - Used as the web server for this application
- json-loader - Enables the app to inport json files.
- jsonwebtoken - Enables the app to implement JWT authentication.
- lodash - Used to perform filter on objects
- pg, pg-hstore, sequelize - Used to create database models and for performing database operations
- react - Used with react-dom enables the app to use the React architecture
- react-redux - Enables the app to implement the redux architecture in the react way
- react-router-dom - Used to perform app routing
- redux - The architecture library that the app is build on
- redux-thunk - Enables the app to make axios request using the redux implementation
- validator - Used to validate user input during server request
- webpack - Used to bundle the app's js and scss files for usage in the browser

## Installation and setup

Before you install the app locally, ensures you have [NodeJS](https://nodejs.org/en/#) and [PostgreSQL](https://www.postgresql.org/) installed on your computer.

- Navigate to a directory of choice on `terminal`

- Clone this repository on that directory.

- Using SSH, 

  `git clone git@github.com:andela-ifatoki/CP2-Shift-DMS.git` 

  and https, 

  `git clone https://github.com/andela-ifatoki/CP2-Shift-DMS.git`

- Run `npm install` to install project dependencies

- Create a `.env` file in your root directory as described in `.env.sample` file

- Start the app by running `npm run dev`

## Tests

- The client side test have been written using Jest and Enzyme.
- The server side test are witten with mocha and chai backed with supertest 
- They are run using the **coverage** tool in order to generate test coverage reports.
- To run the tests, navigate to the project's root folder
- Run the following commands.
- `npm test`

## Endpoints

For the API documentation, see [Shift-DMS Api Docs](https://andela-ifatoki.github.io/slate)

### User Endpoints

| ENDPOINT                                 | DESCRIPTION                              |
| ---------------------------------------- | ---------------------------------------- |
| POST /users/login                        | Logs the user in.                        |
| POST /users/logout                       | Logs the current user out.               |
| POST /users/                             | Sign up a new user.                      |
| GET /users/                              | Fetch all the users on the platform.     |
| GET /users/:id                           | Fetch the user with the passed `id`.     |
| PUT /users/:id                           | Edit the user with the passed `id`.      |
| DELETE /users/:id                        | Delete the user with the passed `id`.    |
| GET /users/:id/documents                 | Get all the documents for the user with the passed `id`. |
| GET /users/?limit={integer}&offset={integer} | Fetch all users on the platform within the range of the passed `offset` and `limit`. |
| POST /search/users/?q=${query}           | Search through users using the passed `query` |

### Document Endpoints

| ENDPOINT                         | DESCRIPTION                              |
| -------------------------------- | ---------------------------------------- |
| POST  /documents/                | Creates a new document                   |
| GET /documents/                  | Fetches all the documents                |
| GET /documents/:id               | Fetches the document with the passed `id` |
| PUT /documents/:id               | Modifies the document with he passed `id` |
| DELETE /documents/:id            | Deletes the document with the passed `id` |
| GET /search/documents?q=${query} | Search through documents using the passed `query` |

## Limitations

* Users cannot change their roles. This can only be done by the **Overlord**.
* The app can have only one **Overlord** who manages the users, roles and public documents.

## Troubleshooting & FAQ

* Can I share documents on social media?
  * Not at this time. Such feature is not yet available.
* What do I need to create an account on the platform?
  * Its simple. All you need is a valid email address, a username and a password.

## Contributing

Contributors are welcome to further enhance the features of this API by contributing to its development. The following guidelines should guide you in contributing to this project:

- Fork this repository to your own account.
- Download/Clone a forked copy of tthe repository to your local machine.
- Create a new branch: `git checkout -b new-branch-name`.
- Install the dependencies using `npm install`.
- Run `npm install` to install project dependencies
- Create a `.env` file in your root directory as described in `.env.sample` file
- To run application unit tests: `npm test`.
- Work on a new feature and push to your remote branch: `git push origin your-branch-name`
- Raise a pull request to the staging branch of this repo.
- This project uses javascript ES6 and follows the airbnb style-guide: <https://github.com/airbnb/javascript>

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.