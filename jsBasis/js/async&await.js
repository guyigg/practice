/*
 * ES7：generator + promise 的语法糖 async + await
 *   https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
 */

 // async:函数修饰符  控制函数返回promise实例
//  + 函数内部执行报错，则返回失败的promise实例，值是失败的原因
//  + 自己返回一个promise，以自己返回的为主
//  + 如果函数内部做了异常捕获，则还是成功态
//  + ...
// 使用async的主要目的：是为了在函数内部使用await
//await：后面应该放置一个promise实例[我们书写的不是一个promise，浏览器也会制动转成promise实例]，await会中断函数体中，其下面的代码执行[await表达式会暂停整个async函数的执行进程并出让其控制权]只有等待await后面的promise实例是成功态之后，才会把下面暂停的代码继续执行。如果后面的promise实例是失败的，则不会再执行下面的代码了。
// await是异步微任务
// 函数体中遇到await后面的代码该怎么就怎么，但是下面的代码会暂停执行，将其当成是一任务，放入微任务队列当中