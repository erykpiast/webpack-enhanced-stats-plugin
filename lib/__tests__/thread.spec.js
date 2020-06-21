const thread = require('../thread');

describe('thread', () => {
  it('should call all functions in order', async () => {
    const result = thread(
      1,
      (a) => a + 3,
      (a) => a * 2,
      (a) => a - 2,
    );

    expect(result).toEqual(6);
  });
});
