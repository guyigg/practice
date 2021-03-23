/**
 * function fn(x,y){console.log(this)}
 * const obj = {name:12}
 * fn()  this->window
 * fn.call(obj) this->obj
 * 
 * 运行原理：首先fn基于__proto__找到在Function.prototype的call方法，把call方法执行
 *          传递实参 obj
 *          call方法中的this->fn
 *       call方法执行的作用就是，把fn[this]执行，并且让方法fn[this]中的this指向第一个传递的实参[obj]
 * 
 * fn.call(obj) this->obj
 * fn.call(obj, 10, 20)   this->obj,x->10,y->20
 * fn.call(10,20) this->10,x->20,y->undefined
 * fn.call() 非严格模式下this是window[第一个参数传的是null/undefined也是window],严格模式下this->undefined[第一个参数传的是谁，this就指向谁]
 * 
 * 
 * apply和call只有传递参数不一样，其他都是一样的。call是一个一个的传递参数，apply只有两个参数，第二个参数是一个数组或者类数组
 * call/apply都是把函数立即执行
 * 但是bind是把函数要改变的this和传递的参数预先存储起来[柯理化->闭包]，不立即执行
 */

 /**
  * 实际应用
  * 求数组的最大/最小值
  * let arr = [2,5,44,32,67,3]
  * 方法一： 排序
  * arr.sort((a,b) => {b-a})
  * 最大值：arr[0]
  * 
  * 方法二： Math.max/min
  * const max = Math.max(...arr) ES6的写法
  * const max = Math.max.apply(Math,arr)
  * 
  * 方法三：字符串拼接
  * const str = 'Math.max(' + arr + ')'
  * const str = `Math.max(${arr})`
  * const max = eval(str)
  * 
  * 方法四：假设最大值/最小值
  * let max = arr[0]
  * arr.slice(1).forEach(item => {
  *     if(item > max){
  *         max = item
  *     }
  * })
  * 
  * [鸭子类型] 让类数组集合也可以调用数组原型上的方法，鸭子类型就是有数组的属性有length、可以遍历，但是他们的原型指向的是Object.prototype所以不能直接调用Array.prototype的方法
  * 函数的argunments类数组的集合
  * function fn(){
  *     比如把arguments转成数组
  *     let arr = [...arguments]
  *     let arr = Array.from(arguments)
  *     let arr = Array.prototype.slice.call(arguments,0)
  *     let arr = [].slice.call(arguments,0)
  * 大部分都可以直接借用的
  *     [].forEach.call(arguments, item => {
  *        console.log('比如循环遍历', item) 
  *     })
  *     [].reduce.call(arguments, (totle, item)=>{
  *         console.log('比如求和')
  *         return totle + item;
  *     })
  *   还有一个暴力的方式那就是直接改变鸭子类型的原型指向
  *     arguments.__proto__ = Array.prototype   这种方式不兼容IE
  * }
  */

  /**
   * 面试题
   * let obj = {
   *    2: 5,
   *    3: 8,
   *    length: 2,
   *    push: Array.prototype.push
   * }
   * obj.push(1)
   * obj.push(2)
   * console.log(obj)
   */

Function.prototype.mybind = function mybind(context){
    var self = this
    if(context == null) context = window;
    var params = [].slice.call(arguments, 1)
    return function poxy(){
        var args = [].slice.call(arguments)
        params = params.concat(args)
        return self.apply(context, params)
    }
}

Function.prototype.mycall = function mycall(context){
    context == null ? context = window : null;
    if(!/^(object|function)$/i.test(typeof context)) context = Object(context)
    let self = this,
        params = [].slice.call(arguments,1),
        key = Symbol('KEY'),
        result;
    context[key] = self
    result = context[key](...params)
    delete context[key]
    return result
}
Function.prototype.myapply = function myapply(context, arr){
    context == null ? context = window : null;
    if(!Array.isArray(arr)) throw TypeError( arr + ' must be a Array!')
    if(!/^(object|function)$/i.test(typeof context)) context = Object(context)
    let self = this,
        key = Symbol('KEY'),
        result;
    context[key] = self
    result = context[key](...arr)
    delete context[key]
    return result
}

let obj = {name:13}
function fn(x,y){
    // console.log('fn',this)
    // console.log(x,y)
}

fn.mycall(null,10,20)
fn.myapply(null,[10,20])

/**
 * 面试题
 */
var name = '123'
function A(x,y){
    var res = x + y
    console.log(res, this.name)
}
function B(x,y){
    var res = x - y
    console.log(res, this.name)
}
B.call(A, 40, 30) //res=10, A
B.call.call.call(A, 20, 10) // res NaN, undefined
Function.prototype.call(A, 60, 50) //
Function.prototype.call.call.call(A, 80, 70) //res NaN udefined