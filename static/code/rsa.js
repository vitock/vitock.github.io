const isPrime = require('./miller-rabin.js')
const exGcd = require('./exGcd.js')
function genRsaKeyPair() {
    var P = 0, Q = 0, N = 0, E = 65537n, D = 0;
    while (1) {
        if (P != 0 && Q != 0) {
            break;
        }
        var tmpPrime = Math.round(Math.random() * (1e10));
        if (!isPrime(tmpPrime)) {
            continue;
        }
        if (P == 0) {
            P = BigInt(tmpPrime);
            continue;
        }
        if (Q == 0 && tmpPrime != P) {
            Q = BigInt(tmpPrime);
            continue;
        }
    }
    N = P * Q;
    // P != Q  ,if P == Q YN = P(P-1)
    var YN = (P - 1n) * (Q - 1n);
    console.log('P,Q,N,Yn:', P, Q, N, YN);
    D = exGcd(E, YN);
    /// E D not co-prime ,rechoose P Q 
    if (D == 0) {
        return genRsaKeyPair();
    }
    // public key = E,N  private key D,N
    return {
        public: [E, N],
        private: [D, N]
    }
}

function encyrptWithRsaKey(msg, key) {
    msg = BigInt(msg);
    // a * b % n
    function multify(a, b, n) {
        return BigInt(a) * BigInt(b) % BigInt(n);
    }
    //  a ^ e  % n
    function pow(a, e, n) {
        if (e == 0) {
            return 1n;
        }
        if (e == 1) {
            return a % n;
        }
        var e0 = e % 2n;
        var e1 = (e - e0) / 2n;
        var m = pow(a, e1, n) % n
        var k = pow(a, e0, n)
        return multify(k, multify(m, m, n), n)

    }
    // var z = multify(1,43046721,73783487)
    var z = pow(msg, key[0], key[1]);
    return z;
}
do {
    var kp2 = genRsaKeyPair();
    console.log('RSA Key Pair:\n', kp2);

    var N = kp2.public[1];
    var E = kp2.public[0];
    var D = kp2.private[0];

    var z = Math.floor(Math.random() * Number(N));
    var e2 = encyrptWithRsaKey(z, kp2.public);
    var d2 = encyrptWithRsaKey(e2, kp2.private);
    var Sign = encyrptWithRsaKey(z, kp2.private);
    var Verify = encyrptWithRsaKey(Sign, kp2.public);
    console.log(
        `
     E = ${E}  
     D = ${D}  
     N = ${N}
     MSG = ${z};
     Enc = ${z}  ^ ${E}  % N= ${e2};
     Dec = ${e2}  ^ ${D}  % N  = ${d2};
     Sign = ${z} ^ ${D} % N = ${Sign};
     Verify = ${Sign} ^ ${E} % N = ${Verify};
     Encrypt:${d2 == z ? 'Success ✅' : "Failed ❌"}: MSG ${d2 == z ? '=' : '≠'} Dec 
     Sign:${Verify == z ? 'Success ✅' : "Failed ❌"}: MSG ${d2 == Verify ? '=' : '≠'} Verify 
    `
    )
    if (d2 != z) {
        break;
    }
} while (0)