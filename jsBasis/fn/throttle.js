/**
 * 节流 throttle：在频繁点击的情况下，规定某段时间内只执行一次，也就是有个执行频率而不是无止境的执行
 * 节流的目的就是降低频率
 * 主要运用场景是在滚动滚动条时触发事件，瀑布流
 */

 function throttle(func, wait){
     if(typeof func !== 'function') throw new TypeError(`${func} must be a function`)
     wait = +wait; //这一步是把wait转换成数字，不管是什么值都进行数字转换一下
     if(isNaN(wait)) wait = 300;  //如果wait不是数字那么就给一个默认值300
     let timer = null,
         previous = 0
     return function Proxy(){
         let params = [].slice.call(arguments),
             _now = +new Date, //获取当前时间戳
             remaining = wait - (_now - previous) //计算这一次的时间和上一次的时间是否大于规定等待的时间
         if(remaining <= 0){ //如果大于那么remaining就是个负数，说明已经超过了等到时间就立即执行这个方法
            previous = _now; //同时把这一次的时间赋值给上一次的变量
            func.apply(this, params)
         }
         if(!timer){ //如果timer存在说明已经设置过定时器了，不需要重复在设置
            timer = setTimeout(() => {
                previous = +new Date; //定时器执行完过后把当前时间赋值给上一次的变量
                clearInterval(timer); //清除定时器
                timer = null;
                func.apply(this, params)
             }, remaining)
         }
     }
 }


 /**
  * 100   0  300-100=200
  * 105   100  300-5=295
  * 110   105  300-5=295
  */