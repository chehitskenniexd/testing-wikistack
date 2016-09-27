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

	afterEach(function (done) {
		Page.destroy({
			where: { urlTitle: 'Foo_Bar' }
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
			var page2, page3;
			beforeEach(function (done) {
				Page.create({
					title: 'Foo Bar Chai!',
					content: '## Foo Bar Chai',
					tags: ['foo', 'bar', 'chai']
				})
					.then(function () {
						done();
					})
					.catch(done);
			});
			beforeEach(done => {
				Page.create({
					title: 'Mocha Chai!',
					content: '## Mocha Chai',
					tags: ['mocha', 'chai']
				})
					.then(function () {
						done();
					})
					.catch(done);
			});

			beforeEach(function (done) {
				Page.findOne({
					where: { title: 'Foo Bar Chai!' }
				})
					.then(function (val) {
						page2 = val;
						done();
					})
					.catch(done);
			});

			beforeEach(function (done) {
				Page.findOne({
					where: { title: 'Mocha Chai!' }
				})
					.then(function (val) {
						page3 = val;
						done();
					})
					.catch(done);
			});

			afterEach(function (done) {
				Page.destroy({
					where: { urlTitle: 'Foo_Bar_Chai' }
				})
					.then(function () {
						done();
					})
					.catch(done);
			});

			afterEach(function (done) {
				Page.destroy({
					where: { urlTitle: 'Mocha_Chai' }
				})
					.then(function () {
						done();
					})
					.catch(done);
			});

			it('never gets itself', (done) => {
				page.findSimilar()
					.then(results => {
						expect(results.length).to.be.equal(1);
						var check = results.filter(nextpage => nextpage.urlTitle == page.urlTitle);
						expect(check.length).to.be.equal(0);
						done();
					})
					.catch(done);
			});
			it('gets other pages with any common tags', done => {
				page.findSimilar()
					.then(results => {
						expect(results.length).to.be.equal(1);
						var check = results.filter(nextpage => nextpage.urlTitle == page2.urlTitle);
						expect(check.length).to.be.equal(1);
						done();
					})
					.catch(done);
			});
			it('does not get other pages without any common tags', done => {
				page.findSimilar()
					.then(results => {
						expect(results.length).to.be.equal(1);
						var check = results.filter(nextpage => nextpage.urlTitle == page3.urlTitle);
						expect(check.length).to.be.equal(0);
						done();
					})
					.catch(done);
			});
		});
	});

	describe('Validations', function () {
		it('errors without title', done => {
			var page = Page.build({
				title: null,
				content: '## Foo Bar Chai',
				tags: ['foo', 'bar', 'chai'],
				status: 'open',
				urlTitle: 'Foo_Bar_Chai'				
			})
			page.validate()
				.then(result => {
					expect(result.message).to.be.equal('notNull Violation: title cannot be null');
					done();
				})
				.catch(done);
		});
		it('errors without content', done => {
			var page = Page.build({
				title: 'Foo Bar Chai',
				content: null,
				tags: ['foo', 'bar', 'chai'],
				status: 'open',
				urlTitle: 'Foo_Bar_Chai'
			})
			page.validate()
				.then(result => {
					expect(result.message).to.be.equal('notNull Violation: content cannot be null');
					done();
				})
				.catch(done);
		});
		it('errors given an invalid status', done => {
			var page = Page.build({
				title: 'Foo Bar Chai',
				content: '## Foo Bar Chai',
				tags: ['foo', 'bar', 'chai'],
				status: 'what the heck?',
				urlTitle: 'Foo_Bar_Chai'				
			})
			page.validate()
				.then(result => {
					//expect(result.name).to.be.equal('SequelizeValidationError'); ???
					done();
				})
				.catch(done);
		});
	});

	describe('Hooks', function () {
		it('it sets urlTitle based on title before validating', () => {
			expect(page.urlTitle).to.be.equal("Foo_Bar");
		});
	});

});