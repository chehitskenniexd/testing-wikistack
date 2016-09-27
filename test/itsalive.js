var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe("2+2 should", function(){
	it("equal 4", function(){
		expect(2+2).to.equal(4);
	});
});

describe("setTimeout should", function(){
	it('confirms setTimeout\'s timer accuracy', function (done) {
	  var start = new Date();
	  setTimeout(function () {
	    var duration = new Date() - start;
	    expect(duration).to.be.closeTo(1000, 50);
	    done();
	  }, 1000);
	});
});

describe("forEach should", function(){
	it("execute it's funcion on every element of its array", function () {
		
		var arr = [null,null,null];
		function fn(){}

		var spy = chai.spy(fn);
		arr.forEach(spy);

		expect(spy).to.have.been.called.exactly(3);

	});
});


// describe("", function(){
	// it("", function() {

	// });
// });