
$(function(){
  $(document).ready(function () {

    $("#input-params-url").val(localStorage.getItem("params-url"));
    if($("#input-params-url").val() == "") {
        $("#input-params-url").val("https://*/*");
    }

    $("#input-params").val(localStorage.getItem("params"));
    $("#input-params-fix-url").val(localStorage.getItem("params-fix-url"));
    $("#input-params-fix").val(localStorage.getItem("params-fix"));
    $("#input-rewrite-domain").val(localStorage.getItem("rewrite-domain"));
    $("#input-changed-domain").val(localStorage.getItem("changed-domain"));

    $("#params_cb").prop("checked", localStorage.getItem("isParamsActive") == "true");
    if($("#params_cb").prop('checked')) {
      $("#params_status").text("有効");
    } else {
      $("#params_status").text("無効");
    }

    $("#domain_cb").prop("checked", localStorage.getItem("isDomainActive") == "true");
    if($("#domain_cb").prop('checked')) {
      $("#domain_status").text("有効");
    } else {
      $("#domain_status").text("無効");
    }
  });

  $("#params_cb").change(function () {
    var bg = chrome.extension.getBackgroundPage();
    if($("#params_cb").prop('checked')) {
      $("#params_status").text("有効");
      bg.activeAddParams();
    } else {
      $("#params_status").text("無効");
      bg.inactiveAddParams();
    }
  });

  $("#domain_cb").change(function () {
    var bg = chrome.extension.getBackgroundPage();
    if($("#domain_cb").prop('checked')) {
      $("#domain_status").text("有効");
      bg.activeRewriteDomain();
    } else {
      $("#domain_status").text("無効");
      bg.inactiveRewriteDomain();
    }
  });


  // 保存ボタンが押されたら、ローカルストレージに保存する。
  $("#save").click(function () {
    localStorage["params-url"] = $("#input-params-url").val();
    localStorage["params"] = $("#input-params").val();
    localStorage["params-fix-url"] = $("#input-params-fix-url").val();
    localStorage["params-fix"] = $("#input-params-fix").val();
    localStorage["rewrite-domain"] = $("#input-rewrite-domain").val();
    localStorage["changed-domain"] = $("#input-changed-domain").val();
    var bg = chrome.extension.getBackgroundPage();
    if(localStorage.getItem("isParamsActive") == "true") {
      bg.restartAddParams();
    }
    if(localStorage.getItem("isDomainActive") == "true") {
      bg.restartRewriteDomain();
    }

    window.open('about:blank','_self').close();
  });
});
