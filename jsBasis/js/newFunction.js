/**
 * ES5和ES6构造函数(类)的写法以及注意事项
 */

 /** ES5 */
 function Fn(x){
    this.x = x; //传值私有属性
    this.y = 100; //固定私有属性
}
Fn.prototype.getX = function (){} //公用属性方法
Fn.prototype.z = 400 //公用属性
Fn.name = 'ss' //静态属性
Fn.getName = function (){} //静态属性方法

Fn.getName()
Fn(10) //可以作为普通函数单独执行
new Fn(10) //new执行生成一个实例

/** ES6 */
class Fn1 {
    constructor(x){
        //相当于ES5的构造体
        this.x = x //传值改变的私有属性只能写在这里
        this.y = 100 //固定私有属性可以在这里写也可以在外面写
    }
    y = 100 //ES7: this.y = 100 设置的是私有属性

    getX(){} //原型上的方法  Fn1.prototype上的方法，此方法没有prototype
    //getX = ()=>{}   //这种写法在react里面是支持的，因为react语法包支持的，但是在普通写法里面这样子是不可以的
    //设置静态属性方法
    static name = 'ss'
    static getName = function(){}  //这种写法有prototype
    static getName(){}  //这种写法没有prototype
}
Fn1.prototype.z = 400 //共有属性只能外侧单独加

//Fn1() //不能作为普通函数执行会报错，只能new执行
new Fn1()

/** new执行的原理 */
/*
阿里的一道面试题

function Dog(name){
    this.name = name
}
Dog.prototype.bark = function () {
    console.log('wangwang')
}
Dog.prototype.sayName = function () {
    console.log( 'my name is ' + this.name)
}
let sanmao = new Dog('三毛')
sanmao.sayName()
sanmao.bark()

function _new () {
    //完成你的代码
}

let sanmao = _new(Dog, '三毛')
sanmao.sayName() // => 'wangwang'
sanmao.bark() // => 'my name is 三毛'
console.log(sanmao instanceof Dog) // => true
*/

/**
 * 
 * @param {*} Ctor 是构造函数
 * @param     params 传入构造函数里面的参数
 */
function Dog(name){
    this.name = name
}
Dog.prototype.bark = function () {
    console.log('wangwang')
}
Dog.prototype.sayName = function () {
    console.log( 'my name is ' + this.name)
}

function _new(Ctor, ...params){
    /**
     * new执行内部发生的事情
     * 1、首先会创建一个实例对象，让其__proto__指向实例对象所属类的原型 Ctor.prtotype
     * 2、把构造函数当成普通函数执行，并且让函数中的THIS指向创建的实例对象
     * 3、构造函数的返回值为原始值或者没有设置返回值则返回这个实例对象，如果手动设置了返回一个引用对象那么就是返回这个引用对象。
     */
    let obj = {},
        result = null;
    obj.__proto__ = Ctor.prototype;
    result = Ctor.call(obj, ...params);
    if(/^(object|function)$/.test(typeof result)) return result;
    return obj;
}
/**
 * 上面的方法兼容性不好，不兼容IE（因为IE把对象的__proto__保护起来了，是取不到的）
 * 所以我们可以用Object.create来做到兼容IE9以上的
 * Object.create([prototype], obj)创建一个空对象，让对象的__proto__指向传进来这个值
 */
function _new_1(Ctor, ...params){
    let obj = null,
        result = null;
    obj = Object.create(Ctor.prototype)
    result = Ctor.call(obj, ...params);
    if(/^(object|function)$/.test(typeof result)) return result;
    return obj;
}
/**
 * 进一步优化兼容性,能兼容IE9（含）以上
 */
function _new_2(Ctor){
    var obj = Object.create(Ctor.prototype),
        params = [].slice.call(arguments, 1),
        result;
    result = Ctor.apply(obj, params);
    if(/^(object|function)$/.test(typeof result)) return result;
    return obj;
}
/**
 * 最后的校验传入的第一个参数必须是构造函数才行
 */
function _new_3(Ctor){
    var reg = /^(object|function)$/i,
        params,
        obj,
        result;
    if(typeof Ctor !== 'function' || !reg.test(typeof Ctor.prototype)) throw TypeError( Ctor + ' is not a contructor')
    params = [].slice.call(arguments, 1)
    obj = Object.create(Ctor.prototype)
    result = Ctor.apply(obj, params);
    if(reg.test(typeof result)) return result;
    return obj;
}

let sanmao = _new(Dog, '三毛')
let sanmao1 = _new_1(Dog, '四毛')
let sanmao2 = _new_2(Dog, '五毛')
let sanmao3 = _new_3(Dog, '六毛')
sanmao.sayName()
sanmao.bark()
console.log(sanmao instanceof Dog)

/**
 * Object.create的栗子,不兼容IE6-8
 */
function Shape(){
    this.x = 1
}
Shape.prototype.move = function (x, y){
    this.x += x
    this.y += y;
    console.info('Shape moved.');
}
/**单链继承 */
function Rectangle(){
    Shape.call(this)
}
Rectangle.prototype = Object.create(Shape.prototype)
Rectangle.prototype.constructor = Rectangle

var rect = new Rectangle()
// console.log('sss', rect)
// console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle)
// console.log('Is rect an instance of Shape?', rect instanceof Shape)
// rect.move(1, 1)

// let cc = Object.create(null)
// console.log('没有object', cc instanceof Object)
// console.dir(cc)
// let bb = {}
// console.dir(bb)
let propertyObj = {
    value: 123,
  writable: false,
  enumerable: true,
  configurable: false
}
let obj_1 = Object.create({},{p: propertyObj})
// obj_1.c = 3
// obj_1.p = 2
console.log('p', obj_1)
let obj_2 = {
    a:'1',
    b:'2'
}

/** 
 * 如何写一个create方法，让其在IE6-8能使用。也就是重写Object.create构建一个对象，不考虑第二个入参
 */
Object.create_1 = function(prototype){
    if(!/^(function|object)$/i.test(typeof prototype)) throw TypeError('Object prototype may only be an Object or null')
    function poxy(){}
    poxy.prototype = prototype;
    return new poxy();
}
let cc = Object.create_1(null)
// console.log(cc)
/** 重写Object.create，不考虑兼容IE6-8，考虑第二个入参 */
Object.create_2 = function(prototype, prototypeObject){
    if(!/^(function|object)$/i.test(typeof prototype)) throw TypeError('Object prototype may only be an Object or null')
    if(!/^(object|undefined)$/i.test(typeof prototypeObject)) throw TypeError(prototypeObject + ' must be a object')
    var obj,
        off;
    function poxy(){}
    poxy.prototype = prototype
    obj = new poxy()
    off = false
    if(prototypeObject){
        for(var i in prototypeObject){
            if(typeof prototypeObject[i] !== 'object') off = true;
        }
        if(off) throw TypeError('Property description must be an object');
        Object.defineProperties(obj, prototypeObject)
    }
    return obj;    
}
let obj_c = Object.create_2({}, {p: propertyObj})
console.log('obj_c', obj_c)
