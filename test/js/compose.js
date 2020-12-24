/*
    在函数式编程当中有一个很重要的概念就是函数组合， 实际上就是把处理数据的函数像管道一样连接起来， 然后让数据穿过管道得到最终的结果。 例如：
    const add1 = (x) => x + 1;
    const mul3 = (x) => x * 3;
    const div2 = (x) => x / 2;
    div2(mul3(add1(add1(0)))); //=>3

    而这样的写法可读性明显太差了，我们可以构建一个compose函数，它接受任意多个函数作为参数（这些函数都只接受一个参数），然后compose返回的也是一个函数，达到以下的效果：
    const operate = compose(div2, mul3, add1, add1)
    operate(0) //=>相当于div2(mul3(add1(add1(0))))
    operate(2) //=>相当于div2(mul3(add1(add1(2))))

    简而言之：compose可以把类似于f(g(h(x)))这种写法简化成compose(f, g, h)(x)，请你完成 compose函数的编写
*/

const add1 = (x) => x + 1;
const mul3 = (x) => x * 3;
const div2 = (x) => x / 2;

function compose(...args) {
    return function fn(x) { //返回一个函数
        let len = args.length; //获取实参长度
        if (len === 0) return x; //如果实参为零，代表没有传入方法，那就直接返回x
        if (len === 1) return args[0](x); //如果实参只传入了一个，也直接返回这个方法并且把x传入方法里
        return args.reduceRight((result, item) => {
            return item(result)
        }, x) //把x作为初始值传入，每次迭代都执行依次方法并且把方法的返回值给result。
    }
}

/**
 * 1、conmpose函数接收多个入参args
 * 2、函数里面返回一个函数来保存需要计算的值x
 * 3、需要判断args  length为0直接返回x   length为1直接返回args[0](x)
 * 4、利用reduceRight来处理args，初始值为x，依次执行item(x)
 */
function compose_1(...funcs) {
    return x => {
        let len = funcs.length;
        if (len === 0) return x
        if (len === 1) return funcs[0](x)
        return funcs.reduceRight((result, item) => {
            return item(result)
        }, x)
    }
}
let test_1 = compose(div2, mul3, add1, add1)(0)
let test_2 = compose_1(div2, mul3, add1, add1)(0)

function compose_2(...funcs) {
    let len = funcs.length
    if (len === 0) { //如果length为0，需要返回一个函数所以要新建一个函数
        return x => {
            return x
        }
    }
    if (len === 1) { //如果length为1，直接返回这个方法传参x
        return funcs[0](x)
    }
    return funcs.reduce((result, item) => {
        return x => { // 这里的返回值是一个函数，每次迭代过后是result来接收这个函数的
            /**
             * 第一次迭代：result -> div2(mul3(x))
             * 第二次迭代：result -> div2(mul3(add1(x)))
             * 第三次迭代：result -> div2(mul3(add1(add1(x))))
             *  1  result->div2  item->mul3
             *  2  result->x1(return div2(mul3(x)))  item->add1
             *  3  result->x2(return x1(add1(x))) item->add1
             *  4  result->x3(return x2(add1(x))) item->undefined 
             */
            return result(item(x));//这里需要反推
        }
    })
}

function compose_3(...funcs) {
    let len = funcs.length;
    if (len === 0) return (x) => x;
    if (len === 1) return (x) => funcs[0](x);
    // return x => {
    //     return funcs.reduceRight((result, item) => {
    //         return item(result)
    //     }, x)
    // }
    return funcs.reduce((result, item) => x => result(item(x)))
    /**
     * 1、x1 -> result=fun[0] item=fun[1]      return fun[0](fun[1](x))
     * 2、x2 -> result=fun[0](fun[1](x)) item=fun[2]    return fun[0](fun[1](fun[2](x)))
     * 3、x3 -> rresulte=fun[0](fun[1](fun[2](x))) item=fun[3]    return fun[0](fun[1](fun[2](fun[3](x))))
    */
}