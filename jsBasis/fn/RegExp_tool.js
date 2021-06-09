/**
 * 按照规则更换时间格式
 * @params
 *  templete 是要改变的时间格式模版, 默认格式：{0}年{1}月{2}日 {3}时{4}分{5}秒
 *    {0}  ->年
 *    {1} ->月
 *    {2} ->日
 *    {3} ->时
 *    {4} ->分
 *    {5} ->秒
 */
~ function(){
    ["formatTime", "formatTime_1", "queryURLParams", "millimeter"].forEach((options) => {
        String.prototype[options] = eval(options)
    });
    function formatTime (templete){
        templete = templete || "{0}年{1}月{2}日 {3}时{4}分{5}秒";
        let arr = this.match(/\d+/g);
       return templete.replace(/\{(\d+)\}/g, (...[,$1])=>{
            let time = arr[$1] || "00";
            return time.length < 2 ? "0" + time : time;
        })
    }
    function formatTime_1 (templete){
        templete = templete || "YY年MM月DD日 hh时mm分ss秒";
        let arr = this.match(/\d+/g);
        return templete.replace(/([a-zA-Z]+)/g, (...[,$1])=>{
            let time;
           switch($1){
               case "YY":
                   time = arr[0] || "00";
                   break;
                case "MM":
                    time = arr[1] || "00";
                    break;
                case "DD":
                   time = arr[2] || "00";
                   break;
                case "hh":
                   time = arr[3] || "00";
                   break;
                case "mm":
                   time = arr[4] || "00";
                   break;
                case "ss":
                    time = arr[5] || "00";
                    break;
           }
           return time.length < 2 ? "0" + time : time;
        })
    }
    function queryURLParams(){
        let obj = {}
        this.replace(/([^?&#]+)=([^?&#]+)/g, (...[,$1,$2]) => obj[$1] = decodeURIComponent($2));
        this.replace(/#([^?&#]+)/g, (...[,$1]) => obj["HASH"] = $1);
        return obj;
    }
    function millimeter(){
        return this.replace(/\d{1,3}(?=(\d{3})+$)/g, content => content + ",")
    }
let url = "https://www.baidu.com/s?wd=%E6%B5%8B%E8%AF%95&rsv_spt=1&rsv_iqid=0xf7b6ec8c0001da64&issp=1&f=3&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_dl=ts_0&rsv_enter=1&rsv_sug3=7&rsv_sug1=5&rsv_sug7=100&rsv_sug2=1&rsv_btype=i&prefixsug=ceshi&rsp=0&inputT=3215&rsv_sug4=6683#hash"
console.log(url.queryURLParams())

let str = "2021-5-1 12:34:33"
console.log(str.formatTime("{0}-{1}-{2} {3}:{4}"))
// console.log(str.formatTime("{0}/{1}/{2} {3}:{4}:{5}"))
// console.log(str.formatTime_1("YY/MM/DD hh:mm:ss"))
let timestr = str.formatTime_1()
console.log(timestr)
let num = "12345678"
console.log(num.millimeter())
let a = str.replace(/-/g, "/")
console.log('ffff',a)

}()