// Promise.reject('ddd').then(res=>{
//     console.log(res)
// },re=>{
//     console.log('失败',re)
// })

/*new Promise(resolve => {
    console.log('promise1'); //1
    resolve();
}).then(() => { //第一次主线程时then储存器里面储存第一个then，并且马上知道promise状态改变结果了把当前的then移入到微任务队列中，微任务1
    console.log('then11'); //2
    new Promise(resolve => {
        console.log('promise2'); //3
        resolve();
    }).then(() => { //微任务1执行时then储存器里面储存第三个then，并且马上知道promise状态改变结果了把当前的then放入到微任务队列中，微任务2
        console.log('then21'); //4
    }).then(() => { //微任务2执行时then储存器里面储存第四个then，等待状态改变，当微任务2执行完就知道了状态，放入微任务队列中，微任务4
        console.log('then22'); //6
    });
}).then(() => { //第一次主线程时then储存器里面储存第二个then，等待状态改变通知，当微任务1执行完它就知道了状态改变结果了，放入微任务队列中，微任务3
    console.log('then12'); //5
});*/
//上面代码执行机制：第一次主线程执行 -> 执行微任务1 ->  执行微任务2 ->  执行微任务3 ->  执行微任务4

/*new Promise(resolve => {
    console.log('promise1'); //1
    resolve();
}).then(() => { //第一次主线程时then储存器里面储存第一个then，并且马上知道promise状态改变结果了把当前的then移入到微任务队列中，微任务1
    console.log('then11'); //2
    return new Promise(resolve => { //return的最后一个then执行完的promise
        console.log('promise2'); //3
        resolve();
    }).then(() => { //微任务1执行时then储存器里面储存第三个then，并且马上知道promise状态改变结果了把当前的then放入到微任务队列中，微任务2
        console.log('then21'); //4
    }).then(() => { //微任务2执行时then储存器里面储存第四个then，并且马上知道状态改变了，放入微任务队列中，微任务3
        console.log('then22'); //5
    });
}).then(() => { //第一次主线程时then储存器里面储存第二个then，等待状态改变通知，当微任务3执行完它就知道了状态改变结果了，放入微任务队列中，微任务3
    console.log('then12'); //6
});
*/

//Promise.all([promise数组:{要求数组中的每一项都是promise实例，如果不是则会自动转}]) 
//返回一个新的promise实例AA，AA是成功还是失败取决于数组中的每一个promise实例是成功还是失败，数组中又一个是失败的则AA失败，只有都成功AA才是成功
//不论谁先知道状态，最后结果的顺序和传递数组的顺序要保持一致
//处理过程中，遇到一个失败，则All立即为失败，结果就是当前实例失败的原因

//Promise.race([promise数组:{要求数组中的每一项都是promise实例，如果不是则会自动转}])
//返回一个新的promise实例AA，数组里面最先知道状态的promise实例，是成功还是失败，决定了AA是成功还是失败

/**
 * js模拟promise基础核心部分
 */
(function () {
    "use strict"
    function Promise_own(executor) {
        var self = this;
        //判断是直接执行还是new执行
        if (typeof self === 'undefined' || !self instanceof Promise_own) throw new TypeError('undefined is not a promise')
        if (typeof executor !== 'function') throw new TypeError(`${executor} must be a function`)
        //初始化私有属性
        self.state = "pending";
        self.result = undefined;
        self.onFulfilledCallbacks = [];
        self.onrejectedCallbacks = [];

        var change = function change(state, result) {
            if (self.state !== 'pending') return; //如果状态不是pending则不做任何处理
            self.state = state;
            self.result = result;
            //当状态改变了，则从then存储的方法数组中拿出来执行
            if(self.onFulfilledCallbacks.length === 0 && self.onrejectedCallbacks.length === 0) return;
            setTimeout(function(){
                var i = 0,
                    callbacks = self.state === 'fullfilled' ? self.onFulfilledCallbacks : self.onrejectedCallbacks,
                    len = callbacks.length,
                    item;
                for(;i<len;i++){
                    item = callbacks[i];
                    if(typeof item === 'function'){
                        item(self.result)
                    }
                }

            })
        }
        // 立即执行executor,即使promise的回调函数报错了也不阻断，让状态改为失败，所以需要捕获
        try {
            executor(function resolve(result) {
                change('fullfilled', result)
            }, function reject(resason) {
                change('rejected', resason)
            })
        } catch (error) {
            change('rejected', error)
        }

    }
    Promise_own.prototype = {
        constructor: Promise_own,
        customer: true,
        then: function (onfulfilled, onrejected) {
            //优化处理下这两个参数要是不传的话，自动给补上
            if (typeof onfulfilled !== 'function') {
                onfulfilled = function onfulfilled(result) {
                    return result;
                }
            }
            if (typeof onrejected !== 'function') {
                onrejected = function onrejected(result) {
                    throw reason;
                }
            }
            var self = this;
            switch (self.state) {
                case 'fullfilled':
                    //这里是放入微任务队列，可以用queueMicrotask方法，但是这个兼容性不好，IE11以上，为了兼容所以用settimeout添加到宏任务中实现异步
                    setTimeout(function () {
                        onfulfilled(self.result)
                    })
                    break;
                case 'rejected':
                    setTimeout(function () {
                        onrejected(self.result)
                    })
                    break;
                default:
                //当执行then方法的时候，状态还是pending则需要把这两个回调函数保存起来，以便于后面改变状态了调用
                self.onFulfilledCallbacks.push(onfulfilled)
                self.onrejectedCallbacks.push(onrejected)
            }
        },
        catch: function (onrejected) {
            var self = this;
            return self.then(null, onrejected)
        },
    }
    if (typeof Symbol !== "undefined") {
        Promise_own.prototype[Symbol.toStringTag] = 'Promise_own';
    }
    Promise_own.resolve = function resolve(value) {
        return new Promise_own(function (resolve) {
            resolve(value)
        })
    }
    Promise_own.reject = function resolve(value) {
        return new Promise_own(function (_, reject) {
            reject(value)
        })
    }
    var p1 = new Promise_own((resolve, reject) => {
        setTimeout(function(){
            // resolve('OK')
            reject('NO')
        })
        // resolve('Ok')
        // reject('NO')
    })
    p1.then(function onfulfilled(res) {
        console.log('yes', res)
    }, function onfulfilled(res) {
        console.log('no', res)
    })
    //Promise_own.resolve('OK2').then(function (res) { console.log('////', res) }, function () { })
    console.log(1)
})()