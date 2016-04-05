const i = require('../../lib/interpreter.js');

describe('definision', () => {
  it('should define constants', () => {
    expect(() => {
      try {
        i.exec('(define x 10)')
      } catch (err) {
        console.log(err.message);
      }
    }).not.toThrow();
  });

  it('should return a value', () => {
    try {
      const result = i.exec('(define x 10)\n(x)');

      expect(result).toBe(10);
    } catch (err) {
      console.log(err.message);
    }
  });

  it('should defind a string and then return it', () => {
    const result = i.exec('(define hello "hello world")(hello)');

    expect(result).toBe('hello world');
  });

  it('should exec more than one definition', () => {
    const result = i.exec('(define foo "hello world")\n\n(define bar 10)\n\n\n(bar)');
    expect(result).toBe(10);
  });

  describe('functions', () => {
    it('should define a function', () => {
      const result = i.exec('(define (square x) (* x x))(square 2)')

      expect(result).toBe(4);
    });

    it('should define a function with two params', () => {
      const result = i.exec('(define (sum a b) (+ a b))(sum 2 3)')

      expect(result).toBe(5);
    });

    it('should define a function and be able to use it in another expressions', () => {
      const result = i.exec('(define (sum a b) (+ a b))(* (sum 10 20) (sum 5 5))')

      expect(result).toBe(300);
    });
  });

  describe('complex definitions', () => {
    it('should define vars and functions and then use they together', () => {
      const result = i.exec('(define a 10)\n(define (square x) (* x x))\n(square a)');

      expect(result).toBe(100);
    });
  });

  describe('lambda definition', () => {
    it('should be able to save lambda in a variable', () => {
      const result = i.exec('(define square (lambda (x) (* x x)))(square 10)');

      expect(result).toBe(100);
    });
  });
});

