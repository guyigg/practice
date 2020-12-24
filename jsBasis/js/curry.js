/**
 * 柯理化函数
 * currying(1,2,3,4)(5)  => 最终得到的结果是1+2+3+4+5=15
 * 在实际项目中的运用就是利用闭包，提前处理好公共或者需要处理的数据，然后再次调用获取第二次处理的值。
 * 例如：一个数字的正则校验，很多地方都用到了，就先传一个正则然后保存。然后其它哪些地方需要用到就调用刚刚保存的方法。
 */

//两次调用的时候求结果 curry(1,2,3,4)(3,4,)
function currying(...params){
    function poxy(...args){
        params.concat(args).reduce( (result, item)=> result + item )
    }
    return poxy;
}

/**
 * 面试题 let add = currying()
 *  add(1,2,3)(4)(5) =>15
 * 方法一：利用consol.log()会调用函数的tosrting方法来做
 * 方法二：可以根据手动传值需要执行多少次配合闭包来做
 */
function currying_1(){
    let arr = [];
    const poxy = (...params) => {
        arr = arr.concat( params )
        return poxy;
    }
    poxy.toString = () => arr.reduce( (result, item) => result + item )
    return poxy;
}
function currying_2(n){ //add需要被调用几次，这个值就传几，必须要统一。
    let arr = [],
        index = 0;
    const poxy = (...params) => {
        index++;
        arr = arr.concat( params )
        if( index === n){
            return arr.reduce((totle, item) => totle + item)
        }
        return poxy;
    }
    return poxy;
}