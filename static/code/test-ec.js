

!function(){
const EC = require('./ecc').EC
var a = EC.genKeyPair(Math.floor(Math.random() * EC.Order ));
var b = EC.genKeyPair();
console.log('keypair A',a );
console.log('keypair B',b );
if(1){
    var ecdhA = EC.ecdh(a.private,b.public);
    var ecdhB = EC.ecdh(b.private,a.public);
    console.log('ECDH of A', ecdhA);
    console.log('ECDH of B', ecdhB);
    console.log('ECDH A == B ?', ecdhB.x == ecdhA.x && ecdhB.y == ecdhA.y);
}


if(1){
    console.log('\n\n-----------Sign-------')
    var msgHash = Math.floor(Math.random() * EC.Order);
    console.log('msg to be sign:',msgHash);
    var signinfo = EC.SingMsg(msgHash,a.private);
    console.log('sign with key A.private result',signinfo);

    var ra = EC.VerifySign(msgHash,signinfo, a.public);
    var rb = EC.VerifySign(msgHash,signinfo, b.public);

    console.log('verify with A.public:',ra ? '✅' : '❌');
    console.log('verify with B.public:',rb ? '✅' : '❌');
}


if(1){
    console.log('\n\n--------------Encryption (Menezes-Vanstone)--------')
    var msg = Math.floor(Math.random() * EC.Prime) & 0xffffffff;

    console.log('message :',msg);

    var cipher = EC.encyptMsg(msg,a.public);

    console.log("encrypt (by A.public):",cipher);
    var msg2 = EC.decryptMsg(cipher,a.private);
    console.log('decrypt (by A.private)',msg2,msg2 == msg ? '✅' : '❌');

    msg2 = EC.decryptMsg(cipher,b.private);
    console.log('decrypt (by B.private)',msg2,msg2 == msg ? '✅' : '❌');
}
 

// // // 重新生成素数P,生成点
// EC.findNewGroup()
// var c = EC.genKeyPair()
// console.log(c); 

}();

