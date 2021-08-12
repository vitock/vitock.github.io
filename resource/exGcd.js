function gcd(a,b,r0){
    var r = b % a  ;
    if (r == 0) {
        return a;
    }
    return gcd(r,a);
}



function exGcd(a,b){

    /**
     * 2x2 矩阵,用数组表示
     * @param {*} a 
     * @param {*} b 
     */
    function matrixMultiply(A,B){


        return [A[0] * B[0] + A[1] * B[2],A[0] * B[1] + A[1] * B[3],

        A[2] * B[0] + A[3] * B[2] , A[2] * B[1] + A[3] * B[3]];
    
    }

    function _exGcd(a,b){
         /**
         *   | xn  1 |  ... | x1 1|  * | a |  =  | 1 |
         *   | 1   0 |      | 1  0|    | b |  =  | k |
         */
        var s = b % a ;
        var q = (b - s  ) /a ;

        if(s == 1){ //终止
            return  [-q,1,   1,0]
        }
        else if(s == 0){

            /// error 不互质,除非 a == 1
            return [0,0,0,0];
        }

        const matrix0 = [-q,1 ,1,0];
        const matrix1 = _exGcd(s,a);
        return matrixMultiply(matrix1,matrix0);
    }
 

    /// 1 的逆元是本身
    if (a == 1) {
        return 1;
    }
    // 0 无逆元
    if (a == 0) {
        return 0;
    }
    if(a > b) {
        a = a % b ;
    }
    var m = _exGcd(a,b);
    
    /// a * m[0] + b m[1] = 1;
    return (m[0] % b + b) % b;
}


var b = 10;
for(var a = 1 ;a < b ; ++ a ){
    var c = exGcd(a,b);
    if (c == 0 || c == 1) {
        // console.log('-----' ,a)
    }
    else if(a * c %b == 1){
        console.log(c , a   , ` ${c} * ${a} % ${b}  = ${a * c %b }`);
    }
}


