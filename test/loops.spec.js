const i = require('../../lib/interpreter.js');

describe('while', () => {
  it('should work with simple condistion',() =>{
    const result = i.exec(`
                          (define n 0)
                          (while (< n 10) (set! n (+ n 1)))
                          (n)
                          `);
    expect(result).toBe(10);
  });
});
