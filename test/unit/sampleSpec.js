var routes = require('routes/index');

describe('A suite', function() {
  it('contains spec with an expectation', function() {
    var out = routes.test();
    expect(out).toBe(true);
  });
});
