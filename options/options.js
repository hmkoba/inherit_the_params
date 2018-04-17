
$(function(){
  $(document).ready(function () {

    $("#input-domain").val(localStorage.getItem("domain"));
    if($("#input-domain").val() == "") {
        $("#input-domain").val("https://*/*");
    }

    $("#input-param").val(localStorage.getItem("param"));
    $("#cb1").prop("checked", localStorage.getItem("isActive") == "true");
  });

  $("#cb1").change(function () {
    var bg = chrome.extension.getBackgroundPage();
    if($("#cb1").prop('checked')) {
      $("#status").text("有効");
      bg.activeAddParam();
    } else {
      $("#status").text("無効");
      bg.inactiveAddParam();
    }
  });

  // 保存ボタンが押されたら、ローカルストレージに保存する。
  $("#save").click(function () {
    localStorage["domain"] = $("#input-domain").val();
    localStorage["param"] = $("#input-param").val();
    var bg = chrome.extension.getBackgroundPage();
    if(localStorage.getItem("isActive") == "true") {
      bg.restart();
    }
    window.open('about:blank','_self').close();
  });
});
