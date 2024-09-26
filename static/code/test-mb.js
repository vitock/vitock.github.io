const isPrime = require('./miller-rabin');

while (1) {
    var a = 6553600 +  Math.floor((Math.random() * 100000000))
    if(isPrime(a)){
        console.log(a);
        break;
    }
    else{
        console.log('xxxx',a)
    }
}
 



