var blue = function(val) {
	console.log(chalk.blue(val));
}

var blueJ = function(val) {
	blue(JSON.stringify(val));
}

var models = require('../models');
var Page = models.Page;
var User = models.User;

var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('Page model', function () {
	var page;

	beforeEach(function (done) {
	  Page.create({
	    title: 'Foo Bar!',
	    content: '## Foo Bar Taz',
	    tags: ['foo', 'bar', 'taz']
	  })
	  .then(function () {
	    done();
	  })
	  .catch(done);
	});

	afterEach(function (done) {
	  Page.destroy( {
	  		where : { urlTitle: 'Foo_Bar' }
	  	}
	  )
	  .then(function () {
	    done();
	  })
	  .catch(done);
	});

  describe('Virtuals', function () {

  	beforeEach(function (done) {
	  Page.findOne({
	    where: { title: 'Foo Bar!' }
	  })
	  .then(function (val) {
	  	page = val;
	    done();
	  })
	  .catch(done);
	});

    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', done => {
      	expect(page.route).to.be.equal("/wiki/Foo_Bar");
      	done();
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', done => {
		expect(page.renderedContent).to.be.equal('<h2 id="foo-bar-taz">Foo Bar Taz</h2>\n');
		done();
    	});
	});
  });

  describe('Class methods', function () {

  	beforeEach(function (done) {
	  Page.findOne({
	    where: { title: 'Foo Bar!' }
	  })
	  .then(function (val) {
	  	page = val;
	    done();
	  })
	  .catch(done);
	});

    describe('findByTag', function () {
      it('gets pages with the search tag', done => {
      	Page.findByTag('foo')
      		.then(results => {
      			// blueJ(results);
      			expect(results[0].urlTitle).to.be.equal(page.urlTitle);
      		})
      		.catch(done);
      	done();
      });
      it('does not get pages without the search tag', done => {
      	Page.findByTag('oof')
      		.then(results => {
      			// blueJ(results);
      			expect(results.length).to.be.equal(0);
      		})
      		.catch(done);
      	done();
      });
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