function Fn(obj, extend){
    if(extend){
        for(let i in obj){
            this[i] = obj[i]
        }
        // console.log('this',this)
    }
    this.a = 10
    this.b = function(){}
}
Fn.prototype.c = function(){}
Fn.prototype = new Fn({
    x: 12,
    z: function(){}
},true)

