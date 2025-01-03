!(function () {
  function encode(str) {
    var r = "";
    for (let i = 0; i < str.length; i++) {
      const element = str.charCodeAt(i);
      var v = element ^ (((i * 97) % 254) + 1);
      r += String.fromCharCode(v);
    }
    return r;
  }

  setTimeout(function () {
    var telegram = decodeURIComponent(
      "i%16%C2%B7V%C3%B4%C3%92d%C2%83%7B%5E%C2%BCQ%C2%BA%C2%92%3A%C2%8Ai%1B"
    );
    var t2 = encode(telegram);
    document.getElementById("telegram").innerText = t2;
    document.getElementById("telegram").href = t2;
  }, 500);

  var host = "w%07%C2%A6%08%C3%A4%C2%91(%C3%80f%13%C3%BFU%C3%A5%C2%86";
  host = encode(decodeURIComponent(host))
  
  document.getElementById("leavemsg").onclick = function () {
    var msg = document.getElementById("msg").value;
    if (!msg) {
      return;
    }

    var sc = document.createElement("script");
    sc.src = `//${host}/blgmsgadd?msg=${encodeURIComponent(
      msg
    )}&callback=postfinish`;
    document.body.append(sc);

    window.postfinish = function (res) {
      document.getElementById("msg").value = '';
      alert(JSON.stringify(res, null, "\t"));
      getMsgs();
    };
  };

  function setMsg(msg) {
    document.getElementById("msglist").innerHTML = msg;
  }
  function getMsgs() {
    var sc = document.createElement("script");

    sc.src = `//${host}/blgmsglist?_=${Math.random()}&callback=getfinish`;
    document.body.append(sc);

    window.getfinish = function (res) {
      // [{text,id,time}]
      var msg = "";
      res.forEach(function (e,idx) {
        if (e.text) {
          
          msg += `
------------- ${idx + 1} -------------
id:${e.k} 
${e.time} ${e.id}

<font  style="color:#333;font-size:15px;" >${e.text}</font>

`;
        }
      });
      setMsg(msg);
    };
  }

  getMsgs();
})();
