const i = require('../../lib/interpreter.js');

describe('definision', () => {
  it('should def constants', () => {
    expect(() => {
      try {
        i.exec('(def x 10)')
      } catch (err) {
        console.log(err.message);
      }
    }).not.toThrow();
  });

  it('should def a list', () => {
    const result = i.exec('(list 1 2 3 4)');

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should def a list by using a backquote', () => {
    const result = i.exec('`(1 2 3 4)');

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should def a list', () => {
    const result = i.exec('(list 1 (lambda (x) (* x x)))');

    expect(result[1](2)).toEqual(4);
  });

  it('should return a value', () => {
    try {
      const result = i.exec('(def x 10)\n(x)');

      expect(result).toBe(10);
    } catch (err) {
      console.log(err.message);
    }
  });

  it('should defind a string and then return it', () => {
    const result = i.exec('(def hello "hello world")(hello)');

    expect(result).toBe('hello world');
  });

  it('should exec more than one definition', () => {
    const result = i.exec('(def foo "hello world")\n\n(def bar 10)\n\n\n(bar)');
    expect(result).toBe(10);
  });

  describe('functions', () => {
    it('should def a function', () => {
      const result = i.exec('(def (square x) (* x x))(square 2)')

      expect(result).toBe(4);
    });

    it('should def a function with two params', () => {
      const result = i.exec('(def (sum a b) (+ a b))(sum 2 3)')

      expect(result).toBe(5);
    });

    it('should def a function and be able to use it in another expressions', () => {
      const result = i.exec('(def (sum a b) (+ a b))(* (sum 10 20) (sum 5 5))')

      expect(result).toBe(300);
    });
  });

  describe('complex definitions', () => {
    it('should def vars and functions and then use they together', () => {
      const result = i.exec('(def a 10)\n(def (square x) (* x x))\n(square a)');

      expect(result).toBe(100);
    });
  });

  describe('lambda definition', () => {
    it('should be able to save lambda in a variable', () => {
      const result = i.exec('(def square (lambda (x) (* x x)))(square 10)');

      expect(result).toBe(100);
    });

    it('should ignore a space between the "lambda" keyword and a list of args', () => {
      const result = i.exec('(def square (lambda(x) (* x x)))(square 10)');

      expect(result).toBe(100);
    });

    it('should ignore a space between the "lambda" keyword and a list of args', () => {
      const result = i.exec('(def square (lambda(x)(* x x)))(square 10)');

      expect(result).toBe(100);
    });

    it('should be able to use lambda as an argument', () => {
      const result = i.exec('(def (calc value action) (action value))(calc 10 (lambda (x) (* x x)))');

      expect(result).toBe(100);
    });
  });

  describe('let definitions', () => {
    it('should use let definitions in an expressions', () => {
      const result = i.exec('(let ((x 2) (y 10))(* x y))');

      expect(result).toBe(20);
    });

    it('should return result of a last expression', () => {
      const result = i.exec('(let ((x 2) (y 10))(* x y)(+ x y))');

      expect(result).toBe(12);
    });

    it('should return result of a last expression', () => {
      const result = i.exec('(let ((foo (lambda (a) (* a a))))(foo 10))');

      expect(result).toBe(100);
    });

    it('should ignore spaces', () => {
      const result1 = i.exec('(let((foo (lambda (a) (* a a))))(foo 10))');
      const result2 = i.exec('(let ((foo (lambda (a) (* a a))))(foo 10))');
      const result3 = i.exec('(let ((foo (lambda (a) (* a a)))) (foo 10))');

      expect(result1).toBe(100);
      expect(result2).toBe(100);
      expect(result3).toBe(100);
    });

    it('should return result of a last expression', () => {
      const result = i.exec(`
                          (let ((x 2) (y 3))
                              (let ((foo (lambda (z) (+ x y z)))
                                    (x 7))
                                (foo 4)))
                            `);

      expect(result).toBe(14);
    });

    it('should return result of a last expression', () => {
      const result = i.exec(`
                            (let ((a 1) (b 1))
                              (let ((c (* a b)))
                                c))
                            `);

      expect(result).toBe(1);
    });
  });

  describe('set', () => {
    it('should update a value in a variable', () => {
      const result = i.exec('(def a 10)\n(set! a 20)\n(a)');

      expect(result).toBe(20);
    });

    it('should ignore spasec', () => {
      const result1 = i.exec('(def a 10)(set! a 20)(a)');
      const result2 = i.exec('(def a 10) (set! a 20)(a)');
      const result3 = i.exec('(def a 10) (set! a 20) (a)');
      const result4 = i.exec('(def a 10)(set! a 20) (a)');

      expect(result1).toBe(20);
      expect(result2).toBe(20);
      expect(result3).toBe(20);
      expect(result4).toBe(20);
    });
  });
});

