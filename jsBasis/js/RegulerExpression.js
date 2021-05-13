/**
 * 正则表达式
 * 
 * 常用的元字符
 * //=>1.量词元字符：设置出现的次数
    * 零到多次  
    + 一到多次
    ? 零次或者一次
    {n} 出现n次
    {n,} 出现n到多次
    {n,m} 出现n到m次

   //=>2.特殊元字符：单个或者组合在一起代表特殊的含义
    \    转义字符（普通->特殊->普通）
    .    除\n（换行符）以外的任意字符
    ^    以哪一个元字符作为开始
    $    以哪一个元字符作为结束
    \n   换行符
    \d   0~9之间的一个数字
    \D   非0~9之间的一个数字 （大写和小写的意思是相反的）
    \w   数字、字母、下划线中的任意一个字符
    \s   一个空白字符（包含空格、制表符、换页符等）
    \t   一个制表符（一个TAB键：四个空格）
    \b   匹配一个单词的边界
    x|y  x或者y中的一个字符
    [xyz] x或者y或者z中的一个字符
    [^xy] 除了x/y以外的任意字符
    [a-z] 指定a-z这个范围中的任意字符  [0-9a-zA-Z_]===\w
    [^a-z] 上一个的取反“非”
    ()   正则中的分组符号
    (?:) 只匹配不捕获
    (?=) 正向预查
    (?!) 负向预查 

   //=>3.普通元字符：代表本身含义的
    /zhufeng/ 此正则匹配的就是 "zhufeng"

  正则表达式常用的修饰符：img
    i =>ignoreCase  忽略单词大小写匹配
    m =>multiline   可以进行多行匹配
    g =>global      全局匹配
 */

/*
验证是否为有效数字
1、首位可能出现 + - 号，也可能不出现  [+-]?
2、一位数0-9都可以，多位数首位不能为零  (\d|[1-9]\d+) 
3、小数部分可有可无，如果有小数点后面必须跟上数字（仅能出现一次小数点）  (\.\d+)?
*/
let reg1 = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/

/**
 * 验证密码（一般是字母数字下划线6-16位的规则）
 */
let reg2 = /^\w(6-16)$/

/**
 * 验证真实名字
 * 1、必须是中文 [\u4E00-\u9FA5]
 * 2、还存在译名，·汉字 (·[\u4E00-\u9FA5]{2,10}){0,2}
 * 3、名字长度2-10
 */
let reg3 = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/

/**
 * 验证邮箱
 * 1. 开头是数字字母下划线（1到多位） \w+
 * 
 * 2. 还可以是 -数字字母下划线 或者 .数字字母下划线,整体零到多次 ((-\w+)|(\.\w+))*
 *    邮箱的名字由“数字、字母、下划线、-、.”几部分组成，但是-/.不能连续出现也不能作为开始
 * 
 * 3. @后面紧跟着：数字、字母 （1-多位） @[A-Za-z0-9]+
 *   + 对 @ 后面名字的补充  ((\.|-)[A-Za-z0-9]+)*
 *     多域名     .com.cn
 *     企业邮箱    zxt@zhufeng-peixun-office.com
 * 
 * 4. 这个匹配的是最后的域名（.com/.cn/.org/.edu/.net...） \.[A-Za-z0-9]+
 */
let reg4 = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/

/**
 * 身份证号码
 */