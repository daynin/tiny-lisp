const i = require('../../lib/interpreter.js');

describe('condistions', () => {
  describe('comparision', () => {
    it('should return true if all numbers are greater each other', () => {
      const result = i.exec('(> 30 20 10)');
      expect(result).toBe(true);
    });

    it('should return false if nunbers are greater each other', () => {
      const result = i.exec('(> 50 10 30)');
      expect(result).toBe(false);
    });

    it('should return true if numbers are less each other', () => {
      const result = i.exec('(< 10 20 30)');
      expect(result).toBe(true);
    });

    it('should return false if number are not less each other', () => {
      const result = i.exec('(> 50 10 30)');
      expect(result).toBe(false);
    });

    it('should return true if numbers are equal each other', () => {
      const result = i.exec('(= 10 10 10)');
      expect(result).toBe(true);
    });

    it('should return true if any numbar is not equal to ather one', () => {
      const result = i.exec('(= 10 1 10)');
      expect(result).toBe(false);
    });

    it('should return true if numbers are greater or equal each other', () => {
      const result = i.exec('(>= 10 10 7 7)');
      expect(result).toBe(true);
    });

    it('should return true if number are less or equal each other', () => {
      const result = i.exec('(<=  1 1 2 2 3 3 3 4 5)');
      expect(result).toBe(true);
    });

    it('should compare expr should be able to use result of another expression', () => {
      const result = i.exec('(<= 1 1 2 (+ 1 1) 3)');
      expect(result).toBe(true);
    });

    it('should compare by "or" and return true if any is true', () => {
      const result = i.exec('(or true false true)');
      expect(result).toBe(true);
    });

    it('should compare by "and" and return true if all of the values are true', () => {
      const result = i.exec('(and true true true)');
      expect(result).toBe(true);
    });

    it('should compare by "or" and return false if all is false', () => {
      const result = i.exec('(or false false false)');
      expect(result).toBe(false);
    });

    it('should compare by "and" and return false if any value is false', () => {
      const result = i.exec('(and true false true)');
      expect(result).toBe(false);
    });
  });
  describe('if', () => {
    it('should parse if statement', () => {
      const result = i.exec(`
                          (if (+ 2 1)
                                "yes"
                                "no")
                          `);
      expect(result).toBe('yes');
    });

    it('should parse if statement with only true way', () => {
      const result = i.exec(`
                          (if (+ 2 1)
                                "yes")
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
      const result = i.exec('(def (if2) (if 2 "yes" "no"))(if2)')

      expect(result).toBe('yes');
    });

    it('should parse function definitions with an if statement, which contains comparison (positive)', () => {
      const result = i.exec('(def (ifLessThan10 n) (if (< n 10) "yes" "no"))(ifLessThan10 5)')

      expect(result).toBe('yes');
    });

    it('should parse function definitions with an if statement, which contains comparison (negative)', () => {
      const result = i.exec('(def (ifLessThan10 n) (if (< n 10) "yes" "no"))(ifLessThan10 10)')

      expect(result).toBe('no');
    });
  });
});

