(function(){
/**
 * JQ里面的数据检测
 */
"use strict"
var getProto = Object.getPrototypeOf;
var class2type = {};
var toString = class2type.toString; //->Object.prototype.toString
var hasOwn = class2type.hasOwnProperty; //->Object.prototype.hasOwnProperty
var fnToString = hasOwn.toString; //->Function.prototype.toString
var ObjectFunctionString = fnToString.call(Object); //->Object.toString => "function Object() { [native code] }"
//建立一个数据检测的映射表
var arr_type = ["Boolean", "Number", "String", "Function", "Object", "Array", "Math", "Date", "RegExp", "Error", "Symbol"];
arr_type.forEach(function(name){
    class2type["[object " + name + "]"] = name.toLowerCase()
})
//通用检测方法
var toType = function toType(obj){
    /**
     * 如果是原始值类型用typeof，除了null和undefined
     * 是对象类型就用toString.call()
     */
    if(obj == null) return obj + "";

    return typeof obj === "object" ||  typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj
}
//检测是否为function
var isFunction = function ifFunction(obj){
    /**考虑到了一些标签元素经过typeof检测返回也是function */
    return typeof obj === 'function' && typeof obj.nodeType !== 'number'
}
//检测是否为window对象
var isWindow = function isWindow(obj){
    return obj != null && obj.window === window
}
//检测是否为数组或者类数组
var isArrayLike = function isArrayLike(obj){
    var length = !!obj && "length" in obj && obj.length;
    var type = toType(obj)
    if(isFunction(obj) || isWindow(obj)) return false;
    return type === "Array" || length === 0 || typeof length === "number" && length > 0 && (length-1) in obj 
}
//检测是否为纯粹对象，也就是原型链直接找到的是object的原型才是纯粹的对象 obj.__proto__ === Object.prototype
var isPlainObject = function isPlainObject(obj){
    var proto,Ctor;
    if(!obj || toString.call(obj) !== "[object Object]") return false;
    proto = getProto(obj)
    if(!proto) return true;  //Object.create(null)这样子的创建对象是没有原型的
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString
}
//检测是否为空对象
var isEmptyObject = function isEmptyObject(obj){
    // var _name;
    // for(_name in obj){  //for in 循环是存在很大问题的，因为自定义在原型上的属性也能遍历到，不能遍历Symnol类型
    //     return false
    // }
    // return true;

    if(obj == null) return false;
    var keys = Object.keys(obj)
    if(typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj))
    return keys.length === 0
}
//检测是否为有效数字，纯数字的字符串也算
var isNumberic = function isNumberic(obj){
    var type = toType(obj)
    return (type === 'number' || type === "string") && !isNaN(obj - parseFloat(obj))
}
//遍历数组/类数组/对象的每一项
var each = function each(obj, callback) {
    var i = 0,
        len,
        item,
        index,
        keys,
        result;
    if(isArrayLike(obj)){
        //判断是否为数组/类数组
        len = obj.length
        for(;i<len;i++){
            item = obj[i]
            index = i
            result = callback.call(item,item,index);
            //处理了FOR-EACH不支持的“循环结束的控制方式”:回调函数返回false
            if(result === false) return
        }
    }else{
        if(obj == null) throw new TypeError('obj not be a null/undefined!')
        //遍历对象
        keys = Object.keys(obj)
        typeof Symbol !== 'undefined' ? keys = keys.concat(Object.getOwnPropertySymbols(obj)) : null
        len = keys.length;
        for(;i<len;i++){
            index = keys[i]
            item = obj[index]
            result = callback.call(item,item,index);
            if(result === false) return
        }
    }
    return obj;
}

//实现数组/纯粹对象的深浅合并
var merge = function merge(){
    var options,src,copyIsArray,
        target = arguments[0] || {},
        i = 1,
        len = arguments.length,
        deep = false;
    if(typeof target === "boolean"){
        deep = target
        target = arguments[i] || {}
        i++
    }
    if(typeof target !== "object" && !isFunction(target)) target = {};
    for(; i < len ; i++){
        if((options = arguments[i]) != null){ //排除null
            each(options, function (value, name){
                if (target === value) return; //防止对象某个属性值是自己本身的死递归
                copyIsArray = Array.isArray(value);
                if (deep && value && (isPlainObject(value) || copyIsArray)) {
                    src = target[name];
                    if (copyIsArray && !Array.isArray(src)) {
                        src = [];
                    } else if (!copyIsArray && !isPlainObject(src)) {
                        src = {};
                    }
                    target[name] = merge(deep, src, value);
                    return;
                }
                target[name] = value;
            })
        }
    }
    return target;
};
//实现「数组/纯粹对象,其余类型的值,直接浅克隆即可」深浅克隆
var clone = function clone(deep, obj, cache){
    var type, Ctor, copy;
    if(typeof deep !== 'boolean'){
        obj = deep;
        deep = false;
    }
    //优化处理死递归，lodash的处理思路，存储值然后来对比，如果已经有这个对象就不做处理直接返回
    !Array.isArray(cache) ? cache = [] : null;
    if(cache.indexOf(obj) > -1) return obj;
    cache.push(obj)
    //原始值类型直接返回
    if(obj == null) return obj;
    if(!/^(function|object)$/.test(typeof obj)) return obj;
    //特殊值处理，包装类
    type = toType(obj);
    Ctor = obj.constructor;
    if(/^(number|string|boolean|date|regexp)$/.test(type)) return new Ctor(obj);
    if(type === 'error') return new Ctor(obj.message);
    if(type === 'function'){
        return function proxy(){
            var params = [].slice.call(arguments);
            return obj.apply(this, params)
        }
    }
    if (!isPlainObject(obj) && !Array.isArray(obj)) return obj;
    //纯粹对象和数组
    copy = new Ctor();
    each(obj, function(value,index){
        if(deep){
            //深拷贝
            copy[index] = clone(deep, value, cache)
            return;
        }
        //浅拷贝
        copy[index] = value
    })
    return copy
}

/**
 * 以后项目倒入可以直接写个闭包，然后把方法给暴露出来
 */
    /**暴露API */
    var utils = {
        toType: toType,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isNumberic: isNumberic,
        each: each,
        merge: merge,
        clone: clone
    }
    /** 还需要考虑到是否会起名冲突的问题 */
    var _u = window._;
    utils.noCnflict = function noCnflict(){
        if(window._ === utils) window._ = _u
        return utils
    }

    /**判断是哪个环境 webpack环境下 */
    if(typeof module === "object" && typeof module.exports === 'object'){
        module.exports = utils
    }
    if(typeof window !== "undefined"){
        window._ = window.utils = utils
    }
})();