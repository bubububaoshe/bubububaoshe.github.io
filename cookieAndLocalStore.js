function setCookie(cname, carray, exdays = 9999) {
  if (is_using_localstore == true) {
    console.log('[setCookie LocalStore] ' + cname + ', ' + carray)
    window.localStorage.setItem(cname, carray);
  } else {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + carray.toString() + "; " + expires;
  }
}
function removeCookie(cname){
    if (is_using_localstore == true) {
        window.localStorage.removeItem(cname);
    }
}

function getCookie(cname) {
  if (is_using_localstore == true) {
    var ret = window.localStorage.getItem(cname);
    if ((ret == null) || (ret.length < 1)) ret = [];
    else ret = ret.split(",");
    return ret;
  } else {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    return do_getCookie(name, ca);
  }
}
function do_getCookie(name, cookie_content) {
  for (var i = 0; i < cookie_content.length; i++) {
      var c = cookie_content[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        var val = c.substring(name.length, c.length);
          if(val.length > 0)
            return val.split(",");
          else
            return [];
      }
  }
  return [];
}

// x is a JSON object: version => info
var g_update_info = null;

function FetchUpdateInfo(curr_version_id) {
  // var x = document.createElement('iframe');
  // x.src = "./upd_form.html?beiluo=wangpixie&yingyingying=" + curr_version_id + "&action=" + g_update_url;
  // x.style.borderWidth = 0;
  // x.style.width = "100%";
  // x.style.height = "25vw";
  // var uc = document.getElementById('updateinfo_content');
  //
  // while (uc.children.length > 0) {
  //   uc.removeChild(uc.children[0]);
  // }
  //
  // uc.appendChild(x);

  //var x = new XMLHttpRequest();
  //x.open("POST", g_update_url, true);
  //x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //x.send("beiluo=wangpixie&yingyingying=" + curr_version_id);

  //x.onreadystatechange = function() {
  //  if (this.readyState == 4 && this.status == 200) {
  //    var response = x.response;
  //    var j = JSON.parse(response);
  //    var k = Object.keys(j);
  //    var v = Object.values(j);

  //    var ret = "";
  //    if (j.length == 0) {
  //      ret = "（已经是最新版了。）"
  //    } else {
  //      for (var i=0; i<v.length; i++) {
  //        ret = ret + "<div>" + v[i] + "</div>";
  //      }
  //    }
  //    document.getElementById('updateinfo_content').innerHTML = ret;
  //  }
  //}
}

function ShowUpdateInfo() {
  var uw = document.getElementById('updateinfowindow');
  var b  = document.getElementById('avatarselection_blocker');
  uw.style.height = "40vw";
  b.style.display = "block";
}

function HideUpdateInfo() {
  var uw = document.getElementById('updateinfowindow');
  var b  = document.getElementById('avatarselection_blocker');
  uw.style.height = "0";
  b.style.display = "none";
}
