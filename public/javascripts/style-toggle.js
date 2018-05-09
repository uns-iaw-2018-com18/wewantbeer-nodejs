function setStyle() {
  if (myStyle) {
    if (myStyle == 1) {
      $("link[href='/stylesheets/original-bg.css']").attr("href", "/stylesheets/alternative-bg.css");
      $("#switch-checkbox").attr("checked", false);
    }
  } else {
    var style = localStorage.getItem("style");
    if (style != undefined) {
      if (style == 1) {
        $("link[href='/stylesheets/original-bg.css']").attr("href", "/stylesheets/alternative-bg.css");
        $("#switch-checkbox").attr("checked", false);
      }
    }
  }
}

$(function() {
  $("#switch-checkbox").click(function() {
    if ($("#switch-checkbox").is(":checked")) {
      $("#switch-checkbox").attr("checked", false);
      if (myStyle) {
        var data = {"style": 0};
        $.post("/api/style", data);
      } else {
        localStorage.setItem("style", 0);
      }
      $("link[href='/stylesheets/alternative-bg.css']").attr("href", "/stylesheets/original-bg.css");
    } else {
      $("#switch-checkbox").attr("checked", true);
      if (myStyle) {
        var data = {"style": 1};
        $.post("/api/style", data);
      } else {
        localStorage.setItem("style", 1);
      }
      $("link[href='/stylesheets/original-bg.css']").attr("href", "/stylesheets/alternative-bg.css");
    }
  });
});
