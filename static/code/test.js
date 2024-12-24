
const EC = require('./ecc').EC
const isPrime = require("./miller-rabin.js");
function getRandomPrime(){
    while(1){
      var m = 11 + Math.floor(Math.random() * 1000);
      if (m > 2 && isPrime(m) ) {
        console.log('random prime:',m);
        return m ;
      }
    }   
  }

var p = 6741313;getRandomPrime();
console.log(p);


EC._BSGS_Algoritm(p);

var r = EC._findOrderCurve(p);
console.log('order', r);
