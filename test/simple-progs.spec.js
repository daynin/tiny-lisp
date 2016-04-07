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
(define (until pred body)
  (if (pred)
      (do (body)
          (until pred body))))

(define n 0)

(until (lambda (x) (< n 10)) (lambda (x) (set! n (+ n 1))))
(n)
                          `);
    expect(result).toBe(10);
  });
});

