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
});

