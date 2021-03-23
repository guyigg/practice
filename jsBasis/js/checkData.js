/**
 * 数据类型检测
 *  typeof
 *      typeof null -> "object"
 *      typeof 不能细分对象类型的值，返回结果都是"object",但是函数返回的是"function"
 *      typeof 10 -> "number"    typeof new Number(10) -> "object"
 *      检测原理：typeof是按照“值”在计算机存储的“二进制”值来检测的，凡是以000开头的都是对象，null -> 000000
 *      优势：检测方便，检测除null以外的原始值和函数类型很方便
 * 
 *  instanceof
 *     检测某个实例是否隶属于某个类 [临时拉来做数据检测的，不能检测原始值类型，可以细分部分对象] 缺点：原型链可是被肆意改动，结果不准确
 *     检测原理：
 *      xxx instanceof Ctor
 *      + 首先查找Symbol.hasInstance，如果存在基于这个检测  Ctor[Symbol.hasInstance](xxx)
 *      + 如果没有，则基于原型链__proto__查找：只要Ctorprototype出现在xxx的原型链上，那么就返回true
 * 
 *  constructor
 *      大多数的函数都是具有prototype属性对象的，这个属性对象上有一个constructor属性对象，并且指向当前函数本身。
 *      当函数作为构造函数的时候，实例是可以通过原型链获取到constructor，那么就会那这个来判断是不是属于某一个数据类型(只会基于直属类)
 *      缺点：constructor是可以肆意改动的，结果不准确。这个也不能检测null、undefined因为这两个
 * 
 *  Object.prototype.toString.call([value]) -> {}.toString.call([value])
 *      除了null/undefined，大部分数据类型的所属类的原型prototype上都有toString方法，但是除了Object.toString是用来检测数据类型的，其他都是转字符串的。
 *      返回值：[object ?]
 *        + 先查找[val]的Symbl.toStringTag「先找私有的，私有没有则向所属类原型上查找Symbl.toStringTag」,属性值就是“?“的值
 *        + 没有，则内部返回当前实例所属构造函数的名字
 * 
 *  Array.isArray([]) 检测是否为数组
 * Object.is(NaN, NaN) === true   检测是否为NaN  isNaN([value])
 * 
 */

/**重写instanceof 
 * 首先判断类型，example不能是原始值，Ctor必须是一个构造函数
 * 其次优先Symbol.hasInstance方法查找
 * 最后在原型链上查找,找到返回true,一只找到object的原型链上都没有就直接返回false
*/
function instance_of(example, Ctor){
    let exaType = typeof example;
    let ctorType = typeof Ctor;
    if(ctorType !== 'function' || !Ctor.prototype) throw new TypeError(Ctor + ' must be a constructor')
    if(exaType == null) return false
    if(!/^(object|function)$/.test(exaType)) return false

    if(Ctor[Symbol.hasInstance]){
        return Ctor[Symbol.hasInstance](example)
    }

    let prototype = Object.getPrototypeOf(example)
    while(prototype){ //这里为什么可以用prototype来做条件，因为当没找到最顶层时就是null,就能直接结束循环
        if( prototype === Ctor.prototype) return true
        prototype = Object.getPrototypeOf(prototype)
    }
    return false
}

// function Fn_test(){
//     this[Symbol.toStringTag] = 'Fn'
// }
// Fn_test.prototype[Symbol.toStringTag] = 'fff'
// class Fn_1 {
//     [Symbol.toStringTag] = 'Fn_1'

// }
// Fn_1.prototype[Symbol.toStringTag] = 'pro'
// let f = new Fn_test()
// f[Symbol.toStringTag] = 'sf'
// let d = new Fn_1
// d[Symbol.toStringTag] = 'ss'
// console.log(toString.call(f))
// console.log(f)

