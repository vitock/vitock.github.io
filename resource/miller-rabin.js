
function isPrime(p){
    function testPrime( a,p){
        
        /**
         * 计算 a ^2^k mod p
         */
        function pow(a,k,p){
            var z = 0
            while(z ++  < k){
                a = a * a %p
            }
            return a ;
        }

        /**
         * 计算 arr[0] * arr[x] mod p
         */
        function mods(p,arr){
            var z = arr[0] % p;
            for (let index = 1; index < arr.length; index++) {  
                const element = arr[index]; 
                z = z * element % p
            }
            return z;
        }

 
        // 分解 p-1 = 2 ^K  * s
        var p_1 = p-1;
        var s = 1;
        var K = 0;
        var rightShift = 0;
        while((p_1 >>rightShift & 1) == 0 && (p_1 >>rightShift)){
            rightShift ++ ;
        }
        s = p_1 >> rightShift;
        K = rightShift;


        /// 分解 s = 2 ^x1 + 2 ^x2 ...
        /// 直接读取二进制位
        var m = [];
        var k0 = 0 ,tmp = s;
        while(tmp > 0 ){
            const z = tmp & 1;
            if (z) {
                m.push(pow(a,k0,p));
            }
            k0 ++ ;
            tmp = tmp >> 1;
        }


        // 计算 ss = a ^s
        var ss = mods(p,m);
        // 逐步测试 ss ^2  = 1 ,-1 mod p
        while (ss !== 1 && ss !== p_1 && K -- > 0){
            ss = ss * ss % p;
        }
        return ss == 1 || ss == p_1  
    }
    this.testPrime = testPrime;


    if (!p) {
        return false;
    }
    for (let index = 0; index < 200  ; index++) {
        var  a =   Math.floor((Math.random() * p )) 
        while(a == 0 || a == p ){
            a = Math.floor((Math.random() * p )) ;
        }
        
        const testResult = testPrime(a,p);
        if(!testResult){
            // console.log('测试不通过',`${a } ${p }  ${testResult}`);
            return false;
        }
    }
    return true;
}


var c = 0,p = 1;
var arr = []
while(p++ < 1000){
    if(isPrime(p)){
        c ++ ;
        arr.push(p);
    }
}
 
console.log(c);

 

  