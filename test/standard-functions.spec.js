const i = require('../../lib/interpreter.js');

describe('standard functions', () => {
  describe('conj', () => {
    it('should add an element into an array', () => {
      const result = i.exec(`
                            (def l \`(1 2 3 4))
                            (conj l 5)
                            (l)
                            `);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should add an string into an array of numbers', () => {
      const result = i.exec(`
                            (def l \`(1 2 3 4))
                            (conj l "hello")
                            (l)
                            `);
      expect(result).toEqual([1, 2, 3, 4, 'hello']);
    });
  });

  describe('nth', () =>{
    it('should get nth elem of an array', () => {
      const result = i.exec(`
                            (def l \`(1 2 3 4))
                            (nth l 2)
                            `);
      expect(result).toBe(3);
    });

    it('should get nth elem of a string', () => {
      const result = i.exec(`
                            (def s "hello")
                            (nth s 1)
                            `);
      expect(result).toBe('e');
    });
  });

  describe('map', () => {
    it('should return a transformed array', () => {
      const result = i.exec(`
                            (def a \`(1 2 3 4))
                            (map (fn (x) (* x x)) a)
                            `);
      expect(result).toEqual([1, 4, 9, 16]);
    });
  });

  describe('filter', () => {
    it('should return a filtered array', () => {
      const result = i.exec(`
                            (def a \`(1 2 3 4))
                            (filter (fn (x) (> x 2)) a)
                            `);
      expect(result).toEqual([3, 4]);
    });
  });

  describe('reduce', () => {
    it('should return a reduce array', () => {
      const result = i.exec(`
                            (def a \`(1 2 3 4))
                            (reduce (fn (x y) (+ x y)) a)
                            `);
      expect(result).toEqual(10);
    });
  });
});

