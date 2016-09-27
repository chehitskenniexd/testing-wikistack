var models = require('../models');
var Page = models.Page;
var User = models.User;

var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('Page model', function () {
  describe('Virtuals', function () {
    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', (done) => {

      	var page = Page.build({title: "My Title!", content: "## This is Sparta...", status: "open", tags: "a, b, c, d", urlTitle: "My_Title"});

      	expect(page.route).to.be.equal("/wiki/My_Title");
      	done();

      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', done => {
      	var page = Page.build({title: "My Title!", content: "## This is Sparta...", status: "open", tags: "a, b, c, d", urlTitle: "My_Title"});
		expect(page.renderedContent).to.be.equal('<h2 id="this-is-sparta-">This is Sparta...</h2>\n');
		done();
    	});
	});


  });

  describe('Class methods', function () {
    describe('findByTag', function () {
      it('gets pages with the search tag');
      it('does not get pages without the search tag');
    });
  });

  describe('Instance methods', function () {
    describe('findSimilar', function () {
      it('never gets itself');
      it('gets other pages with any common tags');
      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function () {
    it('errors without title');
    it('errors without content');
    it('errors given an invalid status');
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating');
  });

});