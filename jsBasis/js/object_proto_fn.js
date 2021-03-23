Object.prototype.hasPubProperty = function hasPbuProperty (attr) {
    var self = this,
        proto = null;
    /** 获取当前对象的原型对象 */
    proto = Object.getPrototypeOf(self)
    /** 一直向上查找原型对象，如果中途有这个属性返回true，如果没有一直查找到最顶层null就结束循环 */
    while(proto){
        /** 判断当前对象是否有这个属性（之所以用hasOwnProperty，是因为它能访问到内置属性，用循环遍历对象属性是遍历不了内置属性的） */
        if(proto.hasOwnProperty(attr)) return true;
        /**这一步就是一直循环查找 */
        proto = Object.getPrototypeOf(proto)
    }
    return false;
}