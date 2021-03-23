/**
 * debounce 防抖：防止老年帕金森，在设定的间隔时间内频繁点击只执行一次
 *  闭包的原理
 */

 function debounce(func, wait, immediate){
     //首先func必须要是个函数，wait和immediate可以不用传设定默认值
     if(typeof func !== 'function') throw new TypeError(`${func} must be a function`)
     if (typeof wait === "undefined") {
        wait = 500;
        immediate = false;
     }
     if(typeof wait == 'boolean'){
        immediate = wait
        wait = 500
     }
     if(typeof wait === 'number' && typeof immediate === 'undefined'){
        immediate = false
     }
     if(typeof wait !== 'number') throw new TypeError(`${wait} must be a number`)
     if(typeof immediate !== 'boolean') throw new TypeError(`${immediate} must be a boolean`)

     let timer = null;
     return function poxy(){ //如果有入参需要接收参数
        let self = this,  //为了保留调用的this指向
            params = [].slice.call(arguments); //处理入参让成为一个真正的数组
        if( timer ) clearTimeout(timer); //清除前一个定时器
        if(!timer && immediate) { //立即执行
            func.apply(self, params)
        };  
        timer = setTimeout( () => {
            clearTimeout( timer );
            timer = null; //清除最后一次定时器
            if( !immediate ){ //如果是立即执行了就不再执行最后一次啦，因为前面已经立即执行一次啦
                func.apply(self, params)
            };
        }, wait)
     }
 }

 function debounce_1(func, wait, immediate) {
    if (typeof func !== "function") throw new TypeError('func must be a function!');
    if (typeof wait === "undefined") {
        wait = 500;
        immediate = false;
    }
    if (typeof wait === "boolean") {
        immediate = wait;
        wait = 500;
    }
    if (typeof wait !== "number") throw new TypeError('wait must be a number!');
    if (typeof immediate !== "boolean") throw new TypeError('immediate must be a boolean!');

    var timer = null,
        result;
    return function proxy() {
        var self = this,
            params = [].slice.call(arguments),
            callNow = !timer && immediate;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
            // 清除最后一次定时器
            clearTimeout(timer);
            timer = null;
            // 符合执行的是最后一次「触发在结束边界」
            if (!immediate) result = func.apply(self, params);
        }, wait);
        // 符合第一次立即执行「触发在开始的边界」
        if (callNow) result = func.apply(self, params);
        return result;
    };
}