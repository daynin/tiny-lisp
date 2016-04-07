const i = require('../../lib/interpreter.js');

describe('simple progs', () => {
  it('should be able to eval functions with recursion', () => {
    const result = i.exec(`
                          (define (test n)
                            (if (< n 10)
                              (do (set! n (+ n 1))
                              (test n))))
                          `);
  });

  it('should be should return a result from function with recursion', () => {
    const result = i.exec(`
                          (define (test n)
                            (if (< n 10)
                              (do (set! n (+ n 1))
                                (test n))
                               n))
                          (test 0)
                          `);
    expect(result).toBe(10);
  });
});

