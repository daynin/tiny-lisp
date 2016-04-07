const i = require('../../lib/interpreter.js');

describe('simple progs', () => {
  it('should be able to eval functions with recursion', () => {
    const result = i.exec(`
                          (def (test n)
                            (if (< n 10)
                              (do (set! n (+ n 1))
                              (test n))))
                          `);
  });

  it('should be should return a result from function with recursion', () => {
    const result = i.exec(`
(def (until pred body)
  (if (pred)
      (do (body)
          (until pred body))))

(def n 0)

(until (fn () (< n 10)) (fn () (set! n (+ n 1))))
(n)
                          `);
    expect(result).toBe(10);
  });
});

