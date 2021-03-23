/**
 * 不兼容ie6/7/8，兼容9/10的就是ES5
 * 不兼容ie9/10 就是ES6 
 * @param {*} callback 
 * @param {*} initialValue 
 */

Array.prototype.my_reduce = function (callback, initialValue) {
    if (typeof callback !== 'function') throw new TypeError('value is not a function!');
    let self = this,
        i = 0,
        len = self.length;
    if (typeof initialValue === 'undefined') {
        initialValue = self[0];
        i = 1;
    }
    for (; i < len; i++) {
        initialValue = callback(initialValue, self[i], i, self)
    }
    return initialValue;
}

/**
 * 再次练习重写reduce(2020-12-24)
 * 根据reduce的用法理出重写思路：首先接收两个参数，第一个是回调函数callback，第二个是初始值initValue
 *      callback函数里面有4个入参：第一个是每次迭代处理后的结果
 *                              第二个是被处理的数组当前值
 *                              第三个是被处理的数组当前index
 *                              第四个是被处理的整个数组
 *      如果initValue没有值，那么callback的第一个参数就是数组的第一项开始处理，第二个参数是数组的第二项开始，第三个参数就是数组的下标的1
 *      如果initValue有值，那么callback的第一个参数就是initValue，第二个参数是数组的第一项开始，第三个参数就是数组的下标的0
 */
Array.prototype.my_reduce_1 = function(callback, initValue){
    if(typeof callback !== 'function') throw new TypeError(`${callback} is not a function`);
    let self = this,
        index = 0,
        len = self.length;
    if(typeof initValue === 'undefined') {
        initValue = self[0]
        index = 1
    }
    for( let i = index; i < len; i++){
        initValue = callback(initValue, self[i], i, self)
    }
    return initValue
}

Array.prototype.my_reduce_2 = function(callback, initialValue){
    if(typeof callback !== 'function') throw new TypeError( callback + 'is not a function')
    var self = this,
        len = self.length,
        index = 0;
    if(typeof initialValue === 'undefined'){
        initialValue = self[0];
        index = 1;
    }
    for(let i=index; i<len; i++){
        initialValue = callback(initialValue, self[i], i, self)
    }
    return initialValue;
}