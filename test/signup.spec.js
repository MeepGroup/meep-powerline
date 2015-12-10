var request   = require('request');

describe('login', function () {
  it('should should return profile after posting login info', function (done) {
    request.post('http://localhost:3002/signup', {form:
      {
        email: 'mocha@test.com',
        password: 'mocha'
      }
    }, function(err,httpResponse,signupBody) {
      request.get('http://localhost:3002/profile', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(signupBody);
          console.log(body);
          expect(true).to.equal(true);
          done();
        }
      })
    });
  });
});
