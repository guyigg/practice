/**
 * JS是单线程：大部分代码是同步的，但是也有少部分代码是异步编程的
 *  + 定时器 （浏览器开启一个定时器监听线程）
 *  + ajax：一般是异步的 （浏览器开启一个HTTP网络请求线程）
 *  + 事件绑定 （浏览器开启一个DOM事件监听线程）
 * -----以上都是宏任务，下面是微任务-----
 *  + promise
 *  + async await
 *  + generator
 *  + requestAnimationFrame （这个是模拟两可）
 *  + ...
 * 
 * + 页面加载时会形成一个事件队列（EventQueue)
 * + 执行环境栈（JS渲染引擎的线程 => 主线程），主线程把同步任务都执行完了，空闲下来了就会到EventQueue里面执行所有的异步任务
 * + 先找异步微任务的事件，如果有则拿到主线程当中去执行，直到微任务执行完了再去异步宏任务事件中查找
 * + 宏任务当中如果有多个事件都达到了可执行条件，那么是谁先到达执行条件就先执行谁，也是一样把异步宏任务拿到主线程当中执行。
 */

/**
 * setTimeout(function(){
        console.log(1)
        setTimeout(function(){
            console.log(10)
        },0)
    },10)
    console.log(2)
    setTimeout(function(){
        console.log(3)
        setTimeout(function(){
            console.log(11)
        },0)
    },30)
    console.log(4)
    console.time('aa')
    for(let i=0;i<900000000;i++){
    //    console.log('ss')
    }
    console.timeEnd('aa')//85ms
    console.log(5)
    setTimeout(function(){
        console.log(6)
    },20)
    console.log(8)
    setTimeout(function(){
        console.log(7)
    },10)
    console.log(9)
*/

/**
 * Promise 基础知识
 * new Promise()是必传值的，并且只能是一个函数，这个函数被成为“处理器函数「executor」”
 * let p1 = new Promise();  //=>Uncaught TypeError: Promise resolver undefined is not a function
 * let p1 = new Promise([executor])
 *  [executor]:可执行函数
 *   + new Promise的时候,在Promise内部会立即把[executor]函数执行
 *   + 函数中一般用来管理一个异步编程代码（不管控异步编程也是可以的）
 *   + 同时给[executor]函数传递两个值「函数类型」：resolve/
 *  p是Promise类的一个实例
 *   + 内置私有属性
 *     [[PromiseState]] 实例状态：pending准备状态  fulfilled/resolved成功态  rejected失败态
 *     [[PromiseResult]] 实例的值
 *   + 公共属性方法 Promise.prototype
 *     + then
 *     + catch
 *     + finally
 *     + Symbol(Symbol.toStringTag): "Promise"
 */

 /*
    let p1 = new Promise((resolve, reject) => {
        // 在[executor]执行resolve/reject都是为了改变promise实例的状态和值「结果」
        //   一但状态被改变成fulfilled/rejected则不能在改为其他的状态
        //   resolve('OK');  [[PromiseState]]:fulfilled  [[PromiseResult]]:'OK'
        //   reject('NO');   [[PromiseState]]:rejected  [[PromiseResult]]:'NO'
        // 如果[executor]函数执行执行报错，则
        //   [[PromiseState]]:rejected
        //   [[PromiseResult]]:报错原因
        //   Promise内部做了异常信息捕获「try/catch」
        reject('NO');
    });
    // 实例状态的改变，可以控制，执行then方法时，存放的两个方法中的某一个方法执行
    //   p.then(onfulfilledCallback,onrejectedCallback)
    //     + 状态成功执行的是：onfulfilledCallback
    //     + 状态失败执行的是：onrejectedCallback
    //     并且把[[PromiseResult]]的值传递给方法
    p1.then(result => {
        console.log('成功-->', result);
    }, reason => {
        console.log('失败-->', reason);
    });
    p1.then(result => {
        console.log('成功-->', result);
    }, reason => {
        console.log('失败-->', reason);
    });
*/

/*
    let p = new Promise((resolve, reject) => {
        console.log(1);
        resolve('OK'); //=>同步修改其状态和结果
        console.log(2);
    });
    console.log(p); //此时状态已经修改为成功...
    // 执行p.then(onfulfilledCallback,onrejectedCallback) （会返回一个新的Promise实例）
    //   + 首先把传递进来的onfulfilledCallback和onrejectedCallback存储起来「存储在一个容器中：因为可以基于then给其存放好多个回调函数」
    //   + 其次再去验证当前实例的状态
    //     + 如果实例状态是pending，则不做任何的处理
    //     + 如果已经变为fulfilled/rejected，则会通知对应的回调函数执行「但是不是立即执行，而是把其放置在EventQueue中的微任务队列中」 “promise本身不是异步的，是用来管理异步的，但是then方法是异步的「微任务」”
    p.then(result => {
        console.log('成功-->', result);
    });
    console.log(3);
*/

/*
    let p2 = new Promise((resolve, reject) => {
        console.log(1);
        setTimeout(() => {
            resolve('OK');
            // + 改变实例的状态和值「同步」
            // + 通知之前基于then存放的onfulfilledCallback执行「异步的微任务：也是把执行方法的事情放置在EventQueue中的微任务队列中」
            console.log(p);
            console.log(4);
        }, 1000); //=>存储了一个异步的宏任务
        console.log(2);
    });
    console.log(p2);
    // 此时接受onfulfilledCallback的时候，状态还是pending，此时只把方法存储起来
    p2.then(result => {
        console.log('成功-->', result);
    });
    console.log(3);
    // 等1000ms后，执行定时器中的函数「把异步宏任务拿出来执行」
*/

/*
    let p3 = new Promise((resolve, reject) => {
        resolve('OK');
        // reject('NO');
    });
    let p4 = p3.then(result => {
        console.log('P3成功-->', result);
        return Promise.reject(10);
    }, reason => {
        console.log('P3失败-->', reason);
    });
    // 执行then方法会返回一些全新的promise实例p4
    //   p4的状态和值是咋改变的？
    //   + 不论执行的是基于p3.then存放的onfulfilledCallback/onrejectedCallback两个方法中的哪一个
    //   + 只要方法执行不报错
    //     + 如果方法中返回一个全新的Promise实例，则“全新的Promise实例”的成功和失败决定p4的成功和失败
    //     + 如果不是返回promise呢？则 [[PromiseState]]:fulfiled  [[PromiseResult]]:返回值
    //   + 如果方法执行报错：p4的 [[PromiseState]]:rejected  [[PromiseResult]]:报错原因
    let p5 = p4.then(result => {
        console.log('P4成功-->', result);
    }, reason => {
        console.log('P4失败-->', reason);
        return Promise.resolve(10);
    });

    p5.then(result => {
        console.log('P5成功-->', result);
    }, reason => {
        console.log('P5失败-->', reason);
        return Promise.resolve(10);
    });
    console.log(1);
*/

/*
    // 如果onfulfilledCallback/onrejectedCallback不传递，
    // 则状态和结果都会“顺延/穿透”到下一个同等状态应该执行的回调函数上「内部其实是自己补充了一些实现效果的默认函数」
    new Promise((resolve, reject) => {
            // resolve('OK');
            reject('NO');
        }).then(null /!*result=>result*!/ , null /!* reason=>Promise.reject(reason) *!/ )
        .then(result => {
            console.log('成功-->', result);
        }, reason => {
            console.log('失败-->', reason);
        }).then(result => {
            console.log('成功-->', result);
        }, reason => {
            console.log('失败-->', reason);
        }); 
    new Promise((resolve, reject) => {
            resolve('OK');
            // reject('NO');
        }).then(result => {
            console.log('成功-->', result);
            // console.log(a);
        }).then(result => {
            console.log('成功-->', result);
            return Promise.reject('xx');
        }).catch(reason => {
            console.log('失败-->', reason);
        });

    // catch只处理状态为失败下做的事情
    Promise.prototype.catch = function (onrejectedCallback) {
        return this.then(null, onrejectedCallback);
    }; 
*/