

const eulerJudge = require("./euler-judge")
 

// 解方程 x^2 = n mod p 
function cipolla_sqrt(n,p){
    if (n == 0) {
        return 0;
    }
    if(!eulerJudge.eulerJudge(n,p)){
        return -1;
    }

    // 随机选取 数字a 使得  a ^ 2 -n  是p二次非剩余;
    var a = 0n;
    var A2_N = 0;
    do {
        // a = BigInt(Math.floor((Math.random() * 1000 )))
        a =  127n

        A2_N = (a * a - n  ) % p ;
        if(A2_N < 0){
            A2_N += p;
        }
  

        
    } while (eulerJudge.eulerJudge(A2_N,p));
    // console.log('a,w2',a,A2_N)


    // console.log('hhhcccc')
    // console.log(a.toString(16));
    // console.log(1);
    // console.log(A2_N.toString(16));
    // console.log(((p+1n)/2n).toString(16));
    // console.log(p.toString(16));
    var result = pow2([a,1n],A2_N,(p+1n)/2n,p);
    // console.log(result, (result[0] * result[0]) %p == n);
    return result[0] % p;

    // w = sqrt(a^2 - n),w作为虚部
    // return (a + w) ^((p + 1)/2)

}

// 防止溢出
function bigNumberTimes(a,b,p){
    return BigInt(a) * BigInt(b) % BigInt(p);
    
}

// 复数相乘

function multiy(X1,X2,A2_N,p){
    
    var x = bigNumberTimes(X1[0] , X2[0] , p) + bigNumberTimes( X1[1] , bigNumberTimes(X2[1] ,A2_N , p),p);

    x = x % p


     
    var y = (bigNumberTimes(X1[0] , X2[1],p) + bigNumberTimes(X1[1] , X2[0],p)) % p;

    y = y % p

    if (x < 0) {
        x = p + x;
    }
    if(y < 0){
        y = p + y;
    }

    return [x ,y];
}

/// w = a^2-n
/// X ^ k % p
/// X = x + yw  实部x,虚部 y, w类似于虚数单位i
function pow2(xy,A2_N,k,p){
    if(k == 1n){
        return xy;
    }
    else if(k == 2n){
        return multiy(xy,xy,A2_N,p)
    }
    var left = k % 2n;
    var k_2 = (k - left ) /2n;
    var half = pow2(xy,A2_N,k_2,p);

    var r = multiy(half,half,A2_N,p);
    if(left == 0){
        
        return r
    }else{
        
        return multiy(r,xy,A2_N,p);
    }
}









 
 

module.exports = {cipolla_sqrt}




var x = 0x743bcb585f9990edc2cfc4af84f6ff300729bb5facda28154362cd47a37de52fn;
console.log(x.toString(16))
var p = (1n << 255n) - 19n;


console.log(p.toString(16))

x = BigInt(Math.floor(Math.random() * 10000))

var y2 = ((x * x % p) * x % p + (486662n * x * x ) %p + x ) % p
console.log(y2.toString(16))

var z = cipolla_sqrt(y2,p)
console.log('---')
console.log(x.toString(16))
console.log(z)

// var p = 6741313;
// var x = 288743;

// var n = (((x * x % p) * x )% p + 7) %p

// // y^2 = x^3 + ax + b mod Prime

// var y = cipolla_sqrt(n,p);

// var y2 = ((p - y) % p + p ) % p

// console.log('N',n)
// console.log(y,y2 )

// console.log(y * y % p ,y2 & y2 % p )
