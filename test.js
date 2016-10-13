fetch('http://www.solidot.org/').then((response)=>{
    var str = response.text();
    console.log(str);
    return str;
}).done();