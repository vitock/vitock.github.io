

const exGcd = require("./exGcd.js");
const isPrime = require("./miller-rabin.js");
const eulerJudge = require("./euler-judge").eulerJudge
const cipolla_sqrt = require("./cipolla").cipolla_sqrt;
const ZeroPoint = { x: 0, y: -1 };
const a = 0n;
const  b = 7n 
const MaxCofactor = 8;
function exGcd_Num(a, b) {
  return Number(exGcd(BigInt(a), BigInt(b)));
}
function isSamePoint(A,B){
  return A.x == B.x && A.y == B.y;
}
function getRandomPrime(){
  while(1){
    var m = 65536000 + Math.floor(Math.random() * 100000000);
    if (m > 2 && isPrime(m) ) {
      console.log('random prime:',m);
      return m ;
    }
  }   
}
class ECC{
  
  constructor(){
    /*
    this.Prime = 9319;
    // this.h = 1;
    // this.CurveOrder = 9127;
    /// order = curveorder / h
    this.Order = 9127;
    this.G = { x: 5762, y: 1167 };
    */
    this.Prime = 6741313;
    // this.h = 1;
    // this.CurveOrder = 6742804;
    /// order = curveorder / h
    this.Order = 1685701;
    this.G = { x: 2331692, y: 6255336 };

    this.Prime = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn

    this.Order =  0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n
    var x = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n;
    var y = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
    this.G = {x,y};

  }


  logN(a,msg){
    console.log('' + msg,a.toString(16))
  }
  PointAdd(P, Q) {
    const Prime = this.Prime;
    if (P.y < 0) {
      return Q;
    }
    if (Q.y < 0) {
      return P;
    }

    var k = 0;
    if (P.x == Q.x && P.y == Q.y) {
      /// 特殊点,斜率无穷大
      if (P.y == 0) {
        return ZeroPoint;
      }

      this.logN(0,'----------------------------')
  
      var tmp = exGcd(2n * P.y, Prime);
      k = ((3n * ((P.x * P.x) % Prime) + a) * tmp) % Prime;

      if (k < 0) {
        k += Prime;
      }
     
    } else {
      if (P.x == Q.x) {
        return ZeroPoint;
      }

      var tmpz = (P.x - Q.x) % Prime;
      if (tmpz < 0) {
        tmpz += Prime;
      }
      var tmp = exGcd(BigInt(tmpz), BigInt(Prime));

      var tmpDy = ((P.y - Q.y) % Prime) + Prime;
      k = (tmpDy * tmp) % Prime;
      if (k < 0) {
        k += Prime;
      }

      // console.log("px",P.x.toString(16));
      // console.log("py",P.y.toString(16));
      // console.log("qx",Q.x.toString(16));
      // console.log("qy",Q.y.toString(16));

      // console.log("k",k.toString(16));
    }

    const x = (((k * k - P.x - Q.x) % Prime) + Prime) % Prime;
    const y = ((((-P.y + k * (P.x - x)) % Prime) + Prime) % Prime);

    // this.logN(k * k - P.x - Q.x,"MMM")
    // this.logN('-------------')
    // this.logN(P.x,"P.x")
    // this.logN(Q.x,"Q.x")
    // this.logN(k * k ,"kk")
    // console.log("k",k.toString(16));
    // console.log("xx",x.toString(16));
    // console.log("yy",y.toString(16));
    return { x, y };
  }

  PointTimes(P, s){
    var s1 = s % (this.Order );
    return this._PointTimes(P,s1);
  }
  _PointTimes(P, s) {
    if (s == 0) {
      return ZeroPoint;
    }
    if (s == 1) {
      return P;
    }
    if (s == 2) {
      return this.PointAdd(P, P);
    }

    var s_0 = s % 2n;
    var s_2 = (s - s_0) / 2n;
    var P2 = this._PointTimes(P, s_2);
    var result = this.PointAdd(P2, P2);
    if (s_0) {
      result = this.PointAdd(result, P);
    }
    // console.log('times',P,result,s)
    return result;
  }

  genKeyPair(key){
    if(key == 0 || key >= this.Order){
      throw `key must  be  between [0,  ${this.Order}]`
      return
    }
    var keyout = key ? key : Math.floor(Math.random() * this.Order)
    while(keyout == 0){
      keyout =  Math.floor(Math.random() * this.Order)
    }
    return {
      private:keyout,
      public:this.PointTimes(this.G,keyout),
      curve:{
        P:this.Prime,
        Order:this.Order,
        G:this.G
      }
    }
  }

  ecdh(privatekeyA,publicKeyOfB){
    return this.PointTimes(publicKeyOfB,privatekeyA);
  }


  // return <R.x, S>
  SingMsg(msgHash,PriKey){
    const Order = this.Order;
    const G = this.G;
    if (PriKey == 0) {
      throw "privateKey cant  be 0"
    }

    var S = 0;
    do{
      var randK = Math.floor(Math.random() * Order);
      if (randK == 0) {
        randK = 1;
      }


      var R = this.PointTimes(G, randK);
      var k1 = exGcd_Num(randK, Order );
      S = k1 * ((msgHash + (PriKey * R.x % Order)) % Order) % Order ;
    }while(  S == 0);

    
    return [R.x,S];
  }

  VerifySign(msgHash,SignInfo,PubKey){
    const Order = this.Order;
    const G = this.G;
    var Rx = SignInfo[0];
    var S = SignInfo[1];
      
    var S1 = exGcd_Num(S, Order );
    var CheckR = this.PointAdd(
      this.PointTimes(G, (msgHash * S1) ),
      this.PointTimes(PubKey, (Rx * S1) )
    );
    return CheckR.x == Rx;
  }
  
  _findGeneratorG(Prime){
   // 找到素数阶生成元
   if(1){
    /**
     * 计算曲线的阶应该使用 schoof 算法,以后再更新..
     */
    var OrderOfCurve =  1;
    for (let x = 0; x < Prime; x++) {

      var a = ((x * x % Prime)* x + b) % Prime ;
      var exist =  eulerJudge(a,Prime);
      if (exist ) {
        /// a== 0 ,那么 y = 0,只有一个点
        OrderOfCurve += (a == 0 ? 1 : 2);
      }
    }
  
      
      
    /// 分解 曲线的阶 n = r * p ^k, p 是素数,那么肯定存在 阶为p ^k的子群, 西罗定理 , 这里k 一般是 1 ,(r,p)互质

    var h =  1;
    var tmpOrder = -1;
    var isSucc = 0;;
    /// h 很小,保证 order 很大
    for (let r = 1; r < MaxCofactor ; r++) {
      if (OrderOfCurve % r == 0) {
        var order0 = OrderOfCurve/r;
        if (isPrime(order0)) {
          tmpOrder = order0;
          h  = r;
          isSucc = 1;
          break;
        }
      }
    }


    if(h == tmpOrder){
      tmpOrder *= h;
      h = 1;
    }

    
      
    console.log('\n\n\n-----------');
    console.log("Prime ",Prime);
    console.log("curve Order ",OrderOfCurve)
    console.log("group Order ",tmpOrder)
    console.log("h ",h)
      

    if(isSucc == 0 ){
      return 0
    }

    this.Order = tmpOrder;
    this.Prime = Prime;
    var G ;
    do{

      var tmpG = {x:0,y:-1}
      do {
        tmpG.x = Math.floor(Math.random() * Prime);
        // -1 表示无解

        var tmp = Number(BigInt(tmpG.x) * BigInt(tmpG.x)  % BigInt(Prime) * BigInt(tmpG.x) % BigInt(Prime)) + b
        tmpG.y  = cipolla_sqrt(tmp, Prime );
        console.log(tmpG);
      } while (tmpG.y < 0);

      G = this.PointTimes(tmpG,h);
    }while(G.y < 0 )
  
    console.log("generator of G ",tmpG);
    console.log("G ",G);
    var checkG = this._PointTimes(G,tmpOrder)
    console.log('check G',checkG.y < 0 ? '✅' : '❌' )
    console.log('-----------\n\n\n');
    if(checkG.y >=0){
      throw "order of curve is wrong"
    }
    
    this.G = G ;
    return 1;

  }
  }

  findNewGroup(){
    var result = 0;
    do {
      var Prime =  getRandomPrime();
      result = this._findGeneratorG(Prime);
    } while (result == 0);
  }

  /**
   * Menezes-Vanstone 密码体制
   * msg 这里限制 4字节.数字,仅原理展示
   */
  encyptMsg(msg,PubKey){
    var randK =  Math.floor(Math.random() * this.Order);
    while(randK == 0){
      randK =  Math.floor(Math.random() * this.Order);
    }


    var PubRnd = this.PointTimes(this.G,randK);
    var dh = this.PointTimes(PubKey,randK);
    // 可以把msg 按字节平分,
    // msg -> (msg0 msg1);
    
    let bf =   Buffer.alloc(4,0);

    bf.writeUInt32BE(msg);
    var msg0 = bf.readUInt16BE(0);
    var msg1 = bf.readUInt16BE(2);
    if (msg0 > this.Prime || msg1 > this.Prime) {
      throw 'msg too large'
    }
 
    var out0 = Number(BigInt(msg0) * BigInt(dh.x) % BigInt(this.Prime));
    var out1 = Number(BigInt(msg1) * BigInt(dh.y) % BigInt(this.Prime));
 
    return [PubRnd,out0,out1];
  }

  decryptMsg(cipher,privatekey){
    var tmpPub = cipher[0];
    var dh  = this.PointTimes(tmpPub,privatekey);
 
    var x1 = exGcd(BigInt(dh.x),BigInt(this.Prime));
    var y1 = exGcd(BigInt(dh.y),BigInt(this.Prime));
    
    var msg0 = Number(BigInt(cipher[1]) * x1 % BigInt(this.Prime));
    var msg1 = Number(BigInt(cipher[2]) * y1 % BigInt(this.Prime));


    /// 避免溢出,实际上,溢出了肯定就是解密失败了
    msg0 = msg0 & 0xffff;
    msg1 = msg1 & 0xffff;

    let bf = Buffer.alloc(4,0);
    bf.writeUInt16BE(msg0);
    bf.writeUInt16BE(msg1,2);
    var outMsg = bf.readUInt32BE(0);
    return outMsg;
  }

}

exports.EC = new ECC;
let ec =  new ECC;

// for (var i = 100 ; i < 120 ; ++ i ){
//   var s = ec.PointTimes(ec.G,i);
//   console.log(i,"---",s);
// }

var s = ec.PointTimes(ec.G,3n);
console.log("---Finalx",s.x.toString(16));
console.log("---Finaly",s.y.toString(16));




if(0){
  var p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn
  var x = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n
  var n = ((x * x % p) * x )% p + 7n

  // y^2 = x^3 + ax + b mod Prime

  var y = cipolla_sqrt(n,p);
 
  console.log("Y",y.toString(16))
  console.log("Y2",((p - y ) % p).toString(16) )


  // 32670510020758816978083085130507043184471273380659243275938904335757337482424n
}
