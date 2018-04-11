
$(function(){
  $(document).ready(function () {
    console.log("bb:" + localStorage.getItem("domain"));

    $("#input_domain").val(localStorage.getItem("domain"));
    if($("#input_domain").val() == "") {
        $("#input_domain").val("https://*/*");
    }

    $("#input_param").val(localStorage.getItem("param"));
  });

  // 保存ボタンが押されたら、ローカルストレージに保存する。
  $("#save").click(function () {
    console.log("aa:" + $("#input_domain").val());

    localStorage["domain"] = $("#input_domain").val();
    localStorage["param"] = $("#input_param").val();
    
    window.open('about:blank','_self').close();
  });
});