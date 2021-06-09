
/**
 * 算法复杂度
 *  + 大O标识法和时间复杂度
 *      + 度量一个程序的执行时间通常有两种方法：事后统计的方法    事前分析估算的方法 O
 *      + Ο(1)＜Ο(log2(n))＜Ο(n)＜Ο(n^2)＜Ο(n^3)＜…＜Ο(2^n)
 * 
 *    + Ο(1)：如果算法的执行时间不随着问题规模n的增加而增长，即使算法中有上千条语句，其执行时间也不过是一个较大的常数
 *    + Ο(log2(n))：当数据增大 n 倍时，耗时增大 logn 倍（这里的 log 是以 2 为底的，比如，当数据增大 256 倍时，耗时只增大 8 倍）
 *    + Ο(n)：数据量的增大几倍，耗时也增大几倍
 *    + Ο(n^2)：数据量增大 n 倍时，耗时增大 n 的平方倍
 */


var arr = [31, 12, 3, 4, 6, 25, 19];
var arr1 = [31, 12,];



/*冒泡排序 复杂度O2^n
    + 利用两层循环来进行俩俩对比大小
*/
//最外层第1轮 [12, 3, 4, 6, 25, 19, 31] 里层循环6次
//最外层第2轮 [3, 4, 6, 12, 19, 25, 31] 里层循环5次
//最外层第3轮 [3, 4, 6, 12, 19, 25, 31] 里层循环4次
//最外层第4轮 [3, 4, 6, 12, 19, 25, 31] 里层循环3次
//最外层第5轮 [3, 4, 6, 12, 19, 25, 31] 里层循环2次
//最外层第6轮 [3, 4, 6, 12, 19, 25, 31] 里层循环1次

function swap(arr, i, j){ //交换位置
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
    return arr;
}
Array.prototype.bubble = function bubble(){
    for(let i = 0; i<this.length-1; i++){
        for(let j = 0; j<this.length-1-i; j++){
            if(this[j] > this[j+1]){
                swap(this, j, j+1)
            }
        }
    }
    return this
}
// console.log(arr.bubble())

/**
 * 插入排序 O(n^2)
 *  先建一个数组来存放取出来的数据，再用两个循环来分别循环两个数组进行对比
 */
Array.prototype.insert = function insert(){
    let temp = '';
    let handle = []; //创建一个数组来存放取出来的数据
    handle.push(this[0]) //初始化给这个数组放一个原始数据的第一个值
    //从下标为1的开始循环，因为上面把第0项取出来了的
    for(let i = 1; i < this.length; i++){
        let A = this[i]; //每次循环新取出来一个值
        for(let j = 0; j<handle.length; j++){
            let B = handle[j]; //依次在hanle数组里面取出来和A进行比较
            if(A < B){
                temp = handle[j];
                handle[j] = A;
                handle.splice(j+1, 0, B)
                break; //插入数据过后就直接跳出这一轮循环
            }
            if(j === handle.length-1){
                handle.push(A)
            }
        }
    }
    return handle;
}
 Array.prototype._insert = function _insert() {
    // 1.准备一个新数组，用来存储抓到手里的牌，开始先抓一张牌进来
    let handle = [];
    handle.push(this[0]);
    // 2.从第二项开始依次抓牌，一直到把台面上的牌抓光
    for (let i = 1; i < this.length; i++) {
        // A是新抓的牌
        let A = this[i];
        // 和HANDDLE手里的牌依次比较（从后向前比）
        for (let j = handle.length - 1; j >= 0; j--) {
            // 每一次要比较的手里的牌
            let B = handle[j];
            // 如果当前新牌A比要比较的牌B大了，把A放到B的后面
            if (A > B) {
                handle.splice(j + 1, 0, A);
                break;
            }
            // 已经比到第一项，我们把新牌放到手中最前面即可
            if (j === 0) {
                handle.unshift(A);
            }
        }
    }
    return handle;
}

console.log(arr.insert())

/**
 * 快速排序 O(n*log2(n))   相类似的，还有堆排序和归并排序
 * 相当于二分法，在数组中取到中间数，小于中间数放左边，大于放右边。然后递归下去（当数组中小于等于1项就结束递归）
 */
Array.prototype.quick = function quick(){
    if(this.length <= 1){
        return this;
    }
    let cloneAry = this;
    //let cloneAry = utils.clone(true, this); //这里做了深度克隆处理，后面会删除一项原数组，导致如果调用多次数组就会丢掉数据项
    let midIndex = Math.floor(cloneAry.length/2)
    let midValue = cloneAry.splice(midIndex, 1)[0]
    let leftAry = []
    let rightAry = []
    for(let i=0;i<cloneAry.length;i++){
        let item = cloneAry[i]
        item < midValue ? leftAry.push(item) : rightAry.push(item)
    }
    //递归拼接，按照左+中+右拼接，返回出去的是一个新数组
    return quick.call(leftAry).concat(midValue, quick.call(rightAry))
}
let ary = [12, 8, 15, 16, 1, 24];
// console.log(ary.quick());
// console.log(ary.quick());

/**
 * 选择排序  O(n^2)
 */
Array.prototype.select = function select(){
    for (let j = 0; j < this.length - 1; j++) {
        let min = j;
        // 找到比当前项还小的这一项索引
        for (let i = min + 1; i < this.length; i++) {
            if (this[i] < this[min]) {
                min = i;
            }
        }
        // 让最小的项和当前首位交换位置
        swap(this,min,j);
    }
    return this;
}
console.log(ary.select());