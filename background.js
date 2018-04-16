var currentUrl = "";

var domain = "";
var tkParam = "";
localStorage["isActive"] = false;

init();
activeAddParam();

function init() {
  domain = localStorage.getItem("domain");
  tkParam = localStorage.getItem("param");
  if(tkParam == null) {
    localStorage["param"] = "";
  }
}

function restart() {
  inactiveAddParam();
  activeAddParam();
}

function activeAddParam() {
  domain = localStorage.getItem("domain");
  if(!domain) {
    localStorage["domain"] = "https://*/*";
    domain = localStorage.getItem("domain");
  }
  console.log("++++++++++++++++++++++++++++++++++++++ domain:" + domain);
  chrome.webRequest.onBeforeRequest.addListener(
    redirectWithParam,
    { urls: [ domain ] },
    [ "blocking" ]
  );
  localStorage["isActive"] = true;
}

function inactiveAddParam() {
  console.log("--------------------------------------");
  chrome.webRequest.onBeforeRequest.removeListener(redirectWithParam);
  localStorage["isActive"] = false;
}

function isParamExist(url, param) {

  var paramStart = url.lastIndexOf('?');
  if(paramStart <= -1) {
    return false;
  }

  var paramIndex = url.lastIndexOf(param);
  if(paramIndex <= -1 || paramIndex < paramStart) {
    return false;
  }

  return true;
}

function redirectWithParam( detail ) {

    tkParam = localStorage.getItem("param");

    // オプション未指定時は処理を行わない
    if(!domain || !tkParam) {
        return;
    }

    tkParam = tkParam + "=";

    // 遷移前のURLを取得
    chrome.tabs.query( { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
                         function( tabs ) { currentUrl = tabs[0].url; });

    // 遷移元URLが無い場合は処理を行わない
    if(!currentUrl) {
        return;
    }

    // 遷移元に対象パラメータが無い場合は処理不要
    if(!isParamExist(currentUrl, tkParam)) {
      return;
    }

    // 遷移先に対象パラメータが「存在する」場合は処理不要、上書きはしない
    if(isParamExist(detail.url, tkParam)) {
      return;
    }

    // パラメータ前がファイル名(.があるか)の場合は処理しない
    var splitedUrl = detail.url.split("?");
    if(splitedUrl[0].slice(-1) != "/") {
      var tmp = splitedUrl[0].split("/");
      if(tmp[tmp.length-1].indexOf(".") >= 0) {
        return;
      }
    }

//console.log("domain:" + domain + "  param:" + tkParam);
//console.log("url:" + detail.url);
//console.log("currentUrl:" + currentUrl);

    // 遷移元URLから対象パラメータの値を取得
    var param = "";
    var splitedCurrentUrl = currentUrl.split("?");
    params = splitedCurrentUrl[1].split('&');
    for(var i = 0; i < params.length; i++) {
      if(params[i].indexOf(tkParam) >= 0) {
        param = params[i];
        break;
      }
    }
//console.log("param:" + param);

    if(detail.url.indexOf("?") <= -1){
      var newUrl = detail.url + "?" + param;
    } else {
      var newUrl = detail.url + "&" + param;
    }

console.log("RedirectTo: " + newUrl);

    return { redirectUrl: newUrl };
}
