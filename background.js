var currentUrl = "";

init();

function init() {
  if(localStorage["isParamsActive"] == null) {
    localStorage["isParamsActive"] = false;
  }
  if(localStorage["isDomainActive"] == null) {
    localStorage["isDomainActive"] = false;
  }

  var params = localStorage.getItem("params");

  if(params == null) {
    localStorage["params"] = "";
  }

  if(localStorage["isParamsActive"] == true) {
    activeAddParams();
  }

  if(localStorage["isDomainActive"] == true) {
    activeRewriteDomain();
  }
}

function restartAddParams() {
  inactiveAddParams();
  activeAddParams();
}

function activeAddParams() {
  var params_url = localStorage.getItem("params-url");
  if(!params_url) {
    localStorage["params-url"] = "https://*/*";
    params_url = localStorage.getItem("params-url");
  }
  console.log("++++++++++++++++++++++++++++++++++++++ params-url:" + params_url);
  chrome.webRequest.onBeforeRequest.addListener(
    redirectWithParams,
    { urls: [ params_url ] },
    [ "blocking" ]
  );
  localStorage["isParamsActive"] = true;
}

function inactiveAddParams() {
  console.log("--------------------------------------");
  chrome.webRequest.onBeforeRequest.removeListener(redirectWithParams);
  localStorage["isParamsActive"] = false;
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

function redirectWithParams( detail ) {

    var params_url = localStorage.getItem("params-url");
    var params = localStorage.getItem("params");

    var params_fix_url = localStorage.getItem("params-fix-url");
    var params_fix = localStorage.getItem("params-fix");

    // オプション未指定時は処理を行わない
    if(params_url == null || params == null || params_url == "" || params == "") {
        return;
    }

    params = params + "=";

    // 遷移前のURLを取得
    chrome.tabs.query( { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
                         function( tabs ) { currentUrl = tabs[0].url; });

    // 遷移元URLが無い場合は処理を行わない
    if(!currentUrl) {
        return;
    }

    // 遷移元に対象パラメータが無い場合は処理不要
    if(!isParamExist(currentUrl, params)) {
      return;
    }

    // 遷移先に対象パラメータが「存在する」場合は処理不要、上書きはしない
    if(isParamExist(detail.url, params)) {
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

//console.log("url:" + detail.url);
//console.log("currentUrl:" + currentUrl);

//console.log("params_fix_url:" + params_fix_url);
//console.log("params_fix:" + params_fix);

    // 固定設定があれば上書き
    if(params_fix_url != null && params_fix_url != "" &&
       params_fix != null && params_fix != "" &&
       -1 != detail.url.indexOf(params_fix_url)) {
//      console.log("fix");

          org_param = params_fix;
    } else {
      // 遷移元URLから対象パラメータの値を取得
      var org_param = "";
      var splitedCurrentUrl = currentUrl.split("?");
      org_params = splitedCurrentUrl[1].split('&');
      for(var i = 0; i < params.length; i++) {
        if(org_params[i].indexOf(params) >= 0) {
          org_param = org_params[i];
          break;
        }
      }
    }
//console.log("param:" + org_param);

    if(detail.url.indexOf("?") <= -1){
      var newUrl = detail.url + "?" + org_param;
    } else {
      var newUrl = detail.url + "&" + org_param;
    }

console.log("RedirectTo: " + newUrl);

    return { redirectUrl: newUrl };
}

function restartRewriteDomain() {
  inactiveRewriteDomain();
  activeRewriteDomain();
}
function activeRewriteDomain() {
  var rewrite_domain = localStorage.getItem("rewrite-domain");
  if(!rewrite_domain || rewrite_domain == "") {
      return;
  }

  console.log("++++++++++++++++++++++++++++++++++++++ rewrite_domain:" + rewrite_domain);
  chrome.webRequest.onBeforeRequest.addListener(
    rewriteDomain,
    { urls: [ rewrite_domain + "/*" ] },
    [ "blocking" ]
  );
  localStorage["isDomainActive"] = true;
}

function inactiveRewriteDomain() {
  console.log("--------------------------------------");
  chrome.webRequest.onBeforeRequest.removeListener(rewriteDomain);
  localStorage["isDomainActive"] = false;
}

function rewriteDomain(detail) {
  var rewrite_domain = localStorage.getItem("rewrite-domain");
  var changed_domain = localStorage.getItem("changed-domain");

  // オプション未指定時は処理を行わない
  if(!rewrite_domain || !changed_domain) {
      return;
  }
  var newUrl = detail.url.replace(rewrite_domain, changed_domain);
console.log("RewritTo: " + newUrl);

  return { redirectUrl: newUrl };
}
