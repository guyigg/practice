/**
 * typeof 所有数据类型存储在计算机里面都是二进制的来存储的，typeof检测是以00开头的都认为是对象，所有对象都是以三个0开头来存储的
 */
// function fun() {
//     this.a = 0;
//     this.b = function () {
//         console.log(this.a);
//     }

// }
// fun.prototype = {
//     b: function () {
//         this.a = 20;
//         console.log(this.a);
//     },
//     c: function () {
//         this.a = 30;
//         console.log(this.a)
//     }
// }
// var my_fun = new fun();
// my_fun.b();
// my_fun.c();
// alert('tom' + 'tom')

// function Fn() {
//     let a = 1;
//     this.a = a;
// }
// Fn.prototype.say = function () {
//     this.a = 2;
// }
// Fn.prototype = new Fn;
// let f1 = new Fn;

// Fn.prototype.b = function () {
//     this.a = 3;
// };
// console.log(f1.a);
// console.log(f1.prototype);
// console.log(f1.b);
// console.log(f1.hasOwnProperty('b'));
// console.log('b' in f1);
// console.log(f1.constructor == Fn);

// function Foo() {
//     getName = function () {
//         console.log(1);
//     };
//     return this;
// }
// Foo.getName = function () {
//     console.log(2);
// };
// Foo.prototype.getName = function () {
//     console.log(3);
// };
// var getName = function () {
//     console.log(4);
// };
// function getName() {
//     console.log(5);
// }
// Foo.getName();
// getName();
// Foo().getName();
// getName();
// new Foo.getName();
// new Foo().getName();
// new new Foo().getName();

// Number.prototype.plus = function (num) {
//     return this + num;
// }
// Number.prototype.minus = function (num) {
//     return this - num;
// }

// let n = 10
// let m = n.plus(10).minus(5)


function Modal(x, y) {
    this.x = x;
    this.y = y;
}
Modal.prototype.z = 10;
Modal.prototype.getX = function () {
    console.log(this.x);
}
Modal.prototype.getY = function () {
    console.log(this.y);
}
Modal.n = 200;
Modal.setNumber = function (n) {
    this.n = n;
};
let m = new Modal(10, 20);

class Modal_1 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        console.log(this.x)
    }
    getY() {
        console.log(this.y)
    }
}
Modal_1.prototype.z = 10
Modal_1.n = 200
Modal_1.setNumber = function () {
    this.n = n
}
let m_1 = new Modal_1(10, 20);
