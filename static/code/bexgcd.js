 

function binaryExGcd(a,b){


    function div2(a,p,invers2){
        /***
         *   a/2 mod p ,
         *   如果 a 是偶数,那么直接 a/2
         *   如果 a 是奇数, 那么 a = 2n + 1
         *   a/2  =  a * I  =  2 * I * n + I = n + I 
         *   这里 I 是2 的逆元, I = (p + 1) / 2
         */
        if((a & 1n) == 0){
            return a>>1n;
        }else{
            const half = a >> 1n;
            return half + invers2
        }
    }


    if(a >= b){
        console.error("a must less than b")
        return [0,0]
    }
    if((b & 1n) == 0n){
        console.error(b, "is not odd number")
        return;
    }

    var invers2 = (b + 1n) >> 1n;
    var A = a , B = b 
    var u = 1n, v = 0n

    var gcd = 1n;
    while(true){
        console.log(A,B,u,v)
        if(A == 1n){
            break;
        }
        if(B == 0n){
            gcd *= A;
            return [gcd,u];
        }

        if (A > B){
            var c = A 
            A = B
            B = c 
            
            c = u 
            u = v 
            v = c 

            continue;
        }

        let isAOdd = (A & 1n) == 1n
        let isBOdd = (B & 1n) == 1n

        if(!isBOdd && ! isAOdd ){
            gcd <<= 1n;
        }
        
        if (isAOdd && isBOdd){
            B =  (B - A) >> 1n;
            v = (v - u) 
            v = div2(v,b,invers2);
            
            if(v < 0){
                v += b
            }
            
           
            


        }
        else if(!isAOdd){
            A >>= 1n;
            u = div2(u,b,invers2);
            if(u < 0){
                u += b
            }

        }
        else if(!isBOdd){
            B >>= 1n;
            v = div2(v,b,invers2);

            if(v < 0){
                v += b
            }
        }
    }
    u %= b 
    if(u < 0n){
        u += b
    }
    return [gcd,u];
}
 
var count  = 1;
while (count --)
{
    var a = BigInt(Math.ceil(Math.random() * 100000000))
    var b =  BigInt(Math.ceil(Math.random() * 100000000000))
    if( (b & 1n) == 0){
        b += 1n;
    }

    a = 311n 
    b = 997n

    var cc = binaryExGcd(a,b);
    var gcd = cc[0]
    var c = cc[1]
    if(gcd){
        console.log("result:",c ,gcd, (a * c )% b)
    }
    else{
    }
    
    if(gcd && (a * c )% b != gcd){
        console.log("error:",a,b,c ,gcd, (a * c )% b)
        break;
    }
}

module.exports = binaryExGcd

