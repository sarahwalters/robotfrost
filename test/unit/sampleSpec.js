var test = require('utils/test');

describe('A suite', function() {
  it('contains spec with an expectation', function() {
    var out = test.test();
    expect(out).toBe(true);
  });
});
