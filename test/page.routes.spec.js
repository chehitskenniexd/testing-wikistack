var blue = function (val) {
	console.log(chalk.blue(val));
}

var blueJ = function (val) {
	blue(JSON.stringify(val));
}

var models = require('../models');
var Page = models.Page;
var User = models.User;

var chalk = require('chalk');
var chai = require('chai');
// var expect = chai.expect;
// var spies = require

var supertest = require('supertest');
var app = require('../index');
var agent = supertest.agent(app);






describe('http requests', function () {

  describe('GET /wiki/', function () {
    it('responds with 200', (done) => {
    	agent
		  .get('/wiki/')
		  .expect(200)
		  .end(function(err, res) {
		    if (err) throw err;
		    blueJ(res);
		  });
		  done()
    });
  });

  xdescribe('GET /wiki/add', function () {
    it('responds with 200', (done) => {
    	agent
		  .get('/wiki/add').then((val) => {
		  	val
		  	.expect(200, done)
		  	.end(function(err, res) {
		    if (err) throw err;
		  });
		  })
		  
    });
  });

  xdescribe('GET /wiki/:urlTitle', function () {
    it('responds with 404 on page that does not exist', () => {
    	agent
		  .get('/wiki/asdlfkjadslkk')
		  .expect(404, done)
    });
    it('responds with 200 on page that does exist', () => {
    	agent
		  .get('/wiki/Maritime_Law')
		  .expect(200, done)
    });
  });

  xdescribe('GET /wiki/search', function () {
    it('responds with 200', () => {
    	agent
		  .get('/wiki/search')
		  .expect(200, done)
    });
  });

  xdescribe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', () => {

    });
    it('responds with 200 for similar page', () => {

    });
  });

  xdescribe('POST /wiki', function () {
    it('responds with 201', () => {

    });
    it('creates a page in the database', () => {

    });
  });

});