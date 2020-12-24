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