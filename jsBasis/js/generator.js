/**
 * 生成器对象是由一个generator function返回的,并且它符合可迭代协议和迭代器协议
 *  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator
 * 
 * 普通函数 VS 生成器函数
 *  生成器函数 [[IsGenerator]]:true
 * 
 *  「把它当做一个实例 __proto__ 」
 *   普通函数是 Function 的实例，普通函数.__proto__===Function.prototype
 *   生成器函数是GeneratorFunction 的实例，生成器函数.__proto__===GeneratorFunction.prototype -> GeneratorFunction.prototype.__proto__===Function.prototype
 *   ({}).toString.call(生成器函数) => "[object GeneratorFunction]"
 * 
 * 「把它作为一个构造函数 prototype」
 *   生成器函数不能被new执行  Uncaught TypeError: func is not a constructor
 *   当做普通函数执行，返回的结果就是生成器函数的一个实例
 *   itor.__proto__ -> func.prototype「空对象，没有constructor」 -> Generator.prototype「constructor:GeneratorFunction」{next/return/throw/Symbol(Symbol.toStringTag): "Generator"} -> 一个具备迭代器规范的对象「Symbol(Symbol.iterator)」 -> Object.prototype
 * 
 * 
 * react里面的redux->saga->dva->阿里封装的umi  都是基于generator原理
 */


 //栗子
//  function *fun(){
//      console.log(1)
//      return 2;
//  }
//  let f = fun()
//  console.log(f.next())
//  console.log(f.next())

 /**
  * 每一次执行next，遇到yield会暂停函数的执行(把后面的全都放入微任务中，等到再次调用next时执行)
  *  + done   
  *  + value -> yield后面的值
  * 
  * 执行next还可以传递值「第一次没必要，其余每次传递的值，都是给上一次yield的处理结果」
  * 生成器函数中的this不是其实例，而是window/undefined
  */

 /*
 function *fun1(){
    let y1 = yield 10;
    console.log(y1)
    let y2 = yield 20;
    console.log(y2)
    let y3 = yield 30;
    console.log(y3)
    let y4 = yield 40;
    console.log(y4)
}
let f = fun1()
console.log(f.next())
console.log(f.next(55))
console.log(f.return())  //return把生成器内部的执行直接停止，让done变为true，如果不传值value是undefined,传值则value为传入的值。「throw直接抛异常，下面代码都不执行了」
console.log(f.next())
*/


//======测试
const query = interval => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(interval);
        }, interval);
    });
};
//串行
// query(1000).then(result1=>{
//     console.log(result1)
//     return query(2000)
// }).then(result2=>{
//     console.log(result2)
//     return query(3000)
// }).then(result3=>{
//     console.log(result3)
// })

// (async function(){
//     let res1 = await query(1000)
//     console.log(res1)
//     let res2 = await query(2000)
//     console.log(res2)
//     let res3 = await query(3000)
//     console.log(res3)
// })()

// function *gen(){
//     console.log('diyici')
//     let res1 = yield query(1000);
//     console.log(res1)
//     let res2 = yield query(2000);
//     console.log(res2)
//     let res3 = yield query(3000);
//     console.log(res3)
// }
// let fn = gen()
// fn.next().value.then(res1=>{
//     // console.log(res1)
//     fn.next(res1).value.then(res2=>{
//         // console.log(res2)
//         fn.next(res2).value.then(res3=>{
//             // console.log(res3)
//             fn.next(res3)
//         })
//     })
// })


//=======generator语法糖await  -> async await处理的事情：构建generator执行器
var isPromise = function isPromise(x){
    if (x == null) return false;
    if (/^(object|function)$/i.test(typeof x)) {
        if (typeof x.then === "function") {
            return true;
        }
    }
    return false;
}
function AsyncFunction(generator){
    return new Promise((resolve, reject)=>{
        let iterator = generator();
        const next = x => {
            let {
                value,
                done
            } = iterator.next(x);
            if(done){
                resolve(value)
                return;
            }
            if (!isPromise(value)) value = Promise.resolve(value);
            value.then(next).catch(error => {
                iterator.throw(error)
            })
        }
        next()
    })
}
AsyncFunction(function *(){
    let res1 = yield query(1000);
    console.log(res1)
    let res2 = yield query(2000);
    console.log(res2)
    let res3 = yield query(3000);
    console.log(res3)
})