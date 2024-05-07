
/**
 *  欧拉判别法, x^2 = a mop p  有解 ,p > 2 素数 ,a >=1;
 *  
 *  a ^((p-1)/2) = 1 mod p
 *   无解
 *  a ^((p-1)/2) = -1 mod p
 *  
 */
function eulerJudge(a,prime){
  var p = prime;
  if(a % p == 0){
    return true;
  }
  
  var b = (p - 1n) / 2n;
  

  // / 类似于miller-rabin中的 二次判定. (这里假定p 是素数)
  // / 分解 b = 2^k *s
  // / 只需要, 判断 (a ^ s) ^ i  是否等于 1 -1

  var k = 0n;
  var rightShift = 0n;
  while((b >>rightShift & 1n) == 0n && (b >>rightShift)){
      rightShift ++ ;
  }
  s = b >> rightShift;
  k = rightShift;


  var t = pow(a,s,p);
  if (t == 1) {
    return true;
  }

  var k0 = 0;
  while (k0 ++ <  k) {
    t = (t * t ) % p;
    if(t == 1){
      return true;
    }
  }


  ///  只可能等于 1 或者  p-1
  return t == 1;

}

// 计算 a ^ b % p
function pow(a,b,p){
  if(b == 1){
    return a % p;
  }
  if (b == 0) {
    return 1;
  }
  // b = 2 * b1 + r ;

  var r  = b % 2n;
  var b1 = (b -r) / 2n;

  
  var r0 = pow(a,b1,p);
  if (r == 0 ) {
    return (r0 * r0 % p )
  }else{
    return (r0 * r0 % p ) * ( a  %p ) % p
  }
}
 
module.exports = {eulerJudge,pow}

