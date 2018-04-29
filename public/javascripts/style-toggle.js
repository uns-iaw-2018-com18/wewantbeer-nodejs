function setStyle() {
  var style = localStorage.getItem("style");
  if (style != undefined) {
    if (style == 1) {
      $("link[href='/stylesheets/original-bg.css']").attr("href", "/stylesheets/alternative-bg.css");
      $("#switch-checkbox").attr("checked", false);
    }
  }
}

$(function() {
  $("#switch-checkbox").click(function() {
    if ($("#switch-checkbox").is(":checked")) {
      $("#switch-checkbox").attr("checked", false);
      localStorage.setItem("style", 0);
      $("link[href='/stylesheets/alternative-bg.css']").attr("href", "/stylesheets/original-bg.css");
    } else {
      $("#switch-checkbox").attr("checked", true);
      localStorage.setItem("style", 1);
      $("link[href='/stylesheets/original-bg.css']").attr("href", "/stylesheets/alternative-bg.css");
    }
  });
});
