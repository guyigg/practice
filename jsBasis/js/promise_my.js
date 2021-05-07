

/**
 * 完整promise，then链式调用
 */
(function () {
    "use strict"
    /**工具方法 */
    var isArray = function isArray(value) {
        var type = Object.prototype.toString.call(value);
        return /^\[object Array\]$/i.test(type);
    };
    var isPromise = function isPromise(x){
        if (x == null) return false;
        if (/^(object|function)$/i.test(typeof x)) {
            if (typeof x.then === "function") {
                return true;
            }
        }
        return false;
    }
    var handle = function handle(promise, x, resolve, reject){
        if (x === promise) throw new TypeError('Chaining cycle detected for promise #<Promise>'); // 防止等于自身形成死循环
        if(isPromise(x)){
            try{
                x.then(resolve, reject)
            }catch(err){
                reject(err)
            }
            return;
        }
        resolve(x)
    }
    function Promise_own(executor) {
        var self = this,
            change;
        //判断是直接执行还是new执行
        if (typeof self === 'undefined' ) throw new TypeError('undefined is not a promise')
        if (typeof executor !== 'function') throw new TypeError(`${executor} must be a function`)
        //初始化私有属性
        self.state = "pending";
        self.result = undefined;
        self.onFulfilledCallbacks = [];
        self.onrejectedCallbacks = [];

        change = function change(state, result) {
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
                    typeof item === "function" ? item(self.result) : null;
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
                onrejected = function onrejected(reason) {
                    throw reason;
                }
            }
            var self = this,
                promiseNew,
                x;
            promiseNew = new Promise_own(function(resolve, reject){
                switch (self.state) {
                    case 'fullfilled':
                        //这里是放入微任务队列，可以用queueMicrotask方法，但是这个兼容性不好，IE11以上，为了兼容所以用settimeout添加到宏任务中实现异步
                        setTimeout(function () {
                            try{
                                x = onfulfilled(self.result)
                                handle(promiseNew, x, resolve, reject)
                            }catch(err){
                                reject(err)
                            }
                        })
                        break;
                    case 'rejected':
                        setTimeout(function () {
                            try{
                                x = onrejected(self.result)
                                handle(promiseNew, x, resolve, reject)
                            }catch(err){
                                reject(err)
                            }
                        })
                        break;
                    default:
                    //当执行then方法的时候，状态还是pending则需要把这两个回调函数保存起来，以便于后面改变状态了调用
                    self.onFulfilledCallbacks.push(function(result){
                        try{
                            x = onfulfilled(result)
                            handle(promiseNew, x, resolve, reject)
                        }catch(err){
                            reject(err)
                        }
                    })
                    self.onrejectedCallbacks.push(function(result){
                        try{
                            x = onrejected(result)
                            handle(promiseNew, x, resolve, reject)
                        }catch(err){
                            reject(err)
                        }
                    })
                }
            })
            return promiseNew;
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
    Promise_own.all = function all(promiseArr){
        //判断是不是可遍历的
        var legal = true;
        typeof Symbol !== 'undefined' ? (typeof promiseArr[Symbol.iterator] !== 'function' ? legal = false : null) : (!isArray(promiseArr) ? legal = false : null);
        if(!legal) throw new TypeError(promiseArr + ' is not iterable');
        var i = 0,
            len = promiseArr.length,
            index = 0,
            item,
            results = [];
        return new Promise_own(function(resolve, reject){
            for(; i<len; i++){
                (function(i){
                    item = promiseArr[i];
                    if(!isPromise(item)) item = Promise_own.resolve(item); //如果传入的不是promise对象，就手动转成promise对象
                    item.then(function onfulfilled(result) {
                        index++;
                        results[i] = (result)
                        if(index >= len) resolve(results);
                    }, reject)
                })(i)
            }
        })
        

    }
    //======测试======
    // var p1 = new Promise_own((resolve, reject) => {
    //     // setTimeout(function(){
    //     //     // resolve('OK')
    //     //     reject('NO')
    //     // })
    //     resolve('Ok')
    //     // reject('NO')
    // })
    // .then(function onfulfilled(res) {
    //     console.log('yes1', res)
    //     return new Promise_own((resolve, reject)=>{
    //         reject('nei')
    //     })
    // },function onfulfilled(res) {
    //     console.log('no1', res)
    // })
    // .then(function onfulfilled(res) {
    //     console.log('yes2', res)
    // }, function onfulfilled(res) {
    //     console.log('no2', res)
    // })
    // .then(function onfulfilled(res) {
    //     console.log('yes3', res)
    // }, function onfulfilled(res) {
    //     console.log('no3', res)
    // })
    function setPromise(time){
        return new Promise_own(function(resolve, reject){
            setTimeout(function(){
                resolve(time)
            },time)
        })
        
    }
    var p1 = setPromise(3000)
    var p2 = setPromise(2000)
    var p3 = setPromise(1000)
    var arr = Promise_own.all([p1,p2,p3,1000])
    arr.then(function(result){
        console.log(result)
    })
    
})()