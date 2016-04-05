const i = require('../../lib/interpreter.js');

describe('calculations', () => {
  it('should parse if statement', () => {
    const result = i.exec(`
                          (if (+ 2 1)
                                "yes"
                                "no")
                          `);
    expect(result).toBe('yes');
  });

  it('should ignore spaces', () => {
    const result1 = i.exec('(if (+ 2 2) (- 10 20) (+ 10 20))');
    const result2 = i.exec('(if (+ 2 2)(- 10 20) (+ 10 20))');
    const result3 = i.exec('(if (+ 2 2) (- 10 20)(+ 10 20))');
    const result4 = i.exec('(if (+ 2 2)(- 10 20)(+ 10 20))');

    expect(result1).toBe(-10);
    expect(result2).toBe(-10);
    expect(result3).toBe(-10);
    expect(result4).toBe(-10);
  });

  it('should work with values', () => {
    const result = i.exec('(if 1 2 3)');

    expect(result).toBe(2);
  });

  it('should be able to be used as expr', () => {
    const result = i.exec('(+ 10 20 (if 1 2 3))');

    expect(result).toBe(32);
  });

  it('should parse function definitions with an if statement', () => {
    const result = i.exec('(define (if2) (if 2 "yes" "no"))(if2)')

    expect(result).toBe('yes');
  });
});

