const i = require('../../lib/interpreter.js');

describe('calculations', () => {
  it('should sum numbers', () => {
    const result = i.exec('(+ 10 20 30)');
    expect(result).toBe(60);
  });

  it('should substract numbers', () => {
    const result = i.exec('(- 10 20 30)');
    expect(result).toBe(-40);
  });

  it('should multiply numbers', () => {
    const result = i.exec('(* 10 20 30)');
    expect(result).toBe(6000);
  });

  it('should devide numbers', () => {
    const result = i.exec('(/ 100 4 5)');
    expect(result).toBe(5);
  });

  describe('calculate inserted expressions', () => {
    it('should sum numbers and then sustract', () => {
      const result = i.exec('(- 100 0 (+ 90 9))');
      expect(result).toBe(1);
    });

    it('should product of results of expressions', () => {
      const result = i.exec('(* (* 5 5) (/ 20 5))');
      expect(result).toBe(100);
    });

    it('should sum results of expressions', () => {
      const result = i.exec('(+ (* 5 5)\n (/ 20 5)\n 1\t\n (+ 40 30))');
      expect(result).toBe(100);
    });

  });
});

