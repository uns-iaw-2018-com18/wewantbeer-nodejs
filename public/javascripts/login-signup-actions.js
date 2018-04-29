$(function () {
  // Cuando el campo pierde el foco
  $(".login-signup-input").focusout(function() {
    if ($(this).val() == "") {
      $(this).next("button").show();
      $(this).css("background-color", "#E6E6E6");
    }
  });
  // Cuando se ingresa un caracter en el campo
  $(".login-signup-input").keydown(function() {
    $(this).next("button").hide();
    $(this).css("background-color", "white");
  });
  // Cuando se hace clic en el boton de ingresar/registrarse
  $("#login-signup-submit-btn").click(function(event) {
    event.preventDefault();
    $(".login-signup-input").each(function() {
      if ($(this).val() == "") {
        $(this).next("button").show();
        $(this).css("background-color", "#E6E6E6");
      }
    });
  });
  // Desactivar evento del boton de aviso
  $(".input-warning-icon").click(function(event) {
    event.preventDefault();
  });
  // Mostrar tooltip
  $("[data-toggle='tooltip']").tooltip();
});
