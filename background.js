var currentUrl = "";

var domain = localStorage.getItem("domain");
var tkParam = localStorage.getItem("param");

if(!domain) {
    localStorage["domain"] = "https://*/*";
    domain = localStorage.getItem("domain");
}
if(tkParam == null) {
    localStorage["param"] = "";
}

//
// リクエスト開始直前でURL変更
//
chrome.webRequest.onBeforeRequest.addListener( function( detail ) {

domain = localStorage.getItem("domain");
tkParam = localStorage.getItem("param");

console.log("domain:" + domain + "  param:" + tkParam + " length:" + tkParam.length);

    // オプション未指定時は処理を行わない
    if(domain == "" || tkParam == "") {
        return;
    }

    tkParam = tkParam + "=";

    // 遷移前のURLを取得
    chrome.tabs.query( { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, 
                         function( tabs ) { currentUrl = tabs[0].url; });

console.log("currentUrl:" + currentUrl);

    // 遷移元URLが無い場合は処理を行わない
    if(currentUrl == "") {
        return;
    }

    var isCurrentParamExist = currentUrl.indexOf('?');
    var isCurrentParam = currentUrl.indexOf(tkParam);
    // ?の前に指定パラメータがあったら無視
    if(isCurrentParam <= isCurrentParamExist) {
        isCurrentParam = -1;
    }

    // 遷移前のURLに指定パラメータパラメータが無ければ処理を行わない
    if(isCurrentParam == -1) {
      return;
    }

    // 遷移先のURLを取得
    var url = detail.url;
    var isParamExist = url.indexOf('?');
    var isParam = url.indexOf(tkParam);

    // ?の前に指定パラメータがあったら無視
    if(isParam <= isParamExist) {
        isParam = -1;
    }
    // 遷移先URLに指定のパラメータが存在する、
    // もしくはパラメータ開始前のURLがディレクトリじゃない場合は処理を行わない
    if(isParam >= 0 || (isParamExist == -1 && url.slice(-1) != "/")){
      return;
    }

    var tmp = currentUrl.split('?');
    var param = "";
    if(tmp.length >= 2){
      params = tmp[1].split('&');
console.log("param: " + params);

      for(var i = 0; i < params.length; i++) {
        if(params[i].indexOf(tkParam) >= 0) {
          param = params[i].slice(tkParam.length);
          break;
        }
      }
    }
console.log("param:" + param);

    if(isParamExist == -1){
      var newUrl = detail.url + "?" + tkParam + param;
    } else {
      var newUrl = detail.url + "&" + tkParam + param;
    }

console.log("Loading: " + newUrl);

    return { redirectUrl: newUrl };
  }, 

  { urls: [ domain ] },

  [
    "blocking"
  ]
);