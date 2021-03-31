Promise.reject('ddd').then(res=>{
    console.log(res)
},re=>{
    console.log('失败',re)
})