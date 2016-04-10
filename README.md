[![npm](https://img.shields.io/npm/v/tiny-lisp.svg)]()
[![npm](https://img.shields.io/npm/dm/tiny-lisp.svg)]()
[![npm](https://img.shields.io/npm/l/tiny-lisp.svg)]()
[![build](https://travis-ci.org/daynin/tiny-lisp.svg?branch=master)]()

![](https://raw.githubusercontent.com/daynin/scheme-js/master/tiny-lisp-logo.png)

###Tiny Lisp

This is a small and simple but very powerful lisp written in JavaScript and [Jison](http://zaa.ch/jison/). Now it has many already developed features, but at the same time, it has many features I want to develop.

[![asciicast](https://asciinema.org/a/d7j80vqtt9xcq5pijc3l4u59o.png)](https://asciinema.org/a/d7j80vqtt9xcq5pijc3l4u59o)

What does it have?

##### Simple operations

```lisp
(+ 1 2) ; 3
(* 2 2 2) ; 8
(/ 4 2) ; 2
(- 5 3) ; 2

(+ (* 2 2) (/ 30 5)) ; 10

(+ "Hello, " "world" "!") ; Hello, world!
```

##### Definitions

```lisp
(def a 10)
(a) ; 10

(def (sum a b) (+ a b))
(sum 10 20) ; 30
```

##### "set!" function for mutating variables

```lisp
(def a 10)
(set! a 20)

(a) ; 20
```

##### "do" function for sequential expressions execution. It always returns a result of the last expression

```lisp
(do (+ 1 2)
    (* 2 2)
    (/ 15 5)) ; 5
```

##### Conditions

```lisp
(if (< 10 20)
    true
    false) ; true
```
##### Loops

```lisp
(def n 0)

; it'll print each state of the "n" variable
(while (< n 10)
  (do (set! n (+ n 1))
      (print (+ "N is " n " now"))))
```

##### Lists

```lisp
(def l1 (list 1 2 3 4))

; and shor version of a list definition
(def l2 `(1 2 3 4))

; of course, lists can contain any type of a value
(def (sum a b) (+ a b))

(def l3 `(1, "hello", sum))
```

##### Lambdas

```lisp
; returns a function
(fn (x) (* x x)) 

(def sqrt (fn (x) (* x x)))
(sqrt 4)
; 16
```

##### Functions for working with lists

```lisp
(def l `(1 2 3 4))

(map (fn (x) (* x x)) l) ; [1, 4, 9, 16]

(filter (fn (x) (> x 2)) l) ; [3, 4]

(reduce (fn (a b) (+ a b)) l) ; 10

(conj l 5) ; [1, 2, 3, 4, 5]

(nth l 2) ; 3
```

##### Fibonacci example

```lisp
(def (fib n)
    (if (<= n 1)
        n
        (+ (fib (- n 1))
           (fib (- n 2)))))

(def n 0)

(while (< n 15)
       (do (set! n (+ n 1))
           (print (+ n " Fibonacci number is " (fib n)))))

```
