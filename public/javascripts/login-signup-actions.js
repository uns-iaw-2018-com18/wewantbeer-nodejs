$(function () {
  // Cuando el campo pierde el foco
  $(".login-signup-input").focusout(function() {
    if ($(this).val() == "") {
      $(this).next("a").show();
      $(this).css("background-color", "#E6E6E6");
    }
  });
  // Cuando se ingresa un caracter en el campo
  $(".login-signup-input").keydown(function() {
    $(this).next("a").hide();
    $(this).css("background-color", "white");
  });
  // Cuando se quiere enviar el formulario de login
  $("#login-form").submit(function() {
    var emptyFields = 0;
    $(".login-signup-input").each(function() {
      if ($(this).val() == "") {
        $(this).next("a").show();
        $(this).css("background-color", "#E6E6E6");
        emptyFields++;
      }
    });
    if (emptyFields > 0) {
      if ($(".login-signup-error-message")[0]) {
        $(".login-signup-error-message").remove();
      }
      return false;
    }
  });
  // Cuando se quiere enviar el formulario de signup
  $("#signup-form").submit(function() {
    var emptyFields = 0;
    $(".login-signup-input").each(function() {
      if ($(this).val() == "") {
        $(this).next("a").show();
        $(this).css("background-color", "#E6E6E6");
        emptyFields++;
      }
    });
    if (emptyFields > 0) {
      if ($(".login-signup-error-message")[0]) {
        $(".login-signup-error-message").remove();
      }
      return false;
    } else {
      // Formato de correo electronico invalido
      if (!validateEmail($("#signup-form").find("input[name='email']").val())) {
        if ($(".login-signup-error-message")[0]) {
          $(".login-signup-error-message").html("El correo electrónico no tiene un formato válido");
        } else {
          $("#main-container").prepend("<span class='login-signup-error-message'>El correo electrónico no tiene un formato válido</span>");
        }
        return false;
      }
      // Contraseña y confirmacion de contraseña no coinciden
      if ($("#signup-form").find("input[name='password']").val() != $("#signup-form").find("input[name='confirmPassword']").val()) {
        if ($(".login-signup-error-message")[0]) {
          $(".login-signup-error-message").html("Las contraseñas no coinciden");
        } else {
          $("#main-container").prepend("<span class='login-signup-error-message'>Las contraseñas no coinciden</span>");
        }
        return false;
      }
    }
  });
  // Desactivar evento del boton de aviso
  $(".input-warning-icon").click(function() {
    return false;
  });
  // Boton de Facebook
  $("#facebook-login-signup").click(function() {
    window.location.href = "/auth/facebook";
  });
  // Boton de Google
  $("#google-login-signup").click(function() {
    window.location.href = "/auth/google";
  });
  // Mostrar tooltip
  $("[data-toggle='tooltip']").tooltip();
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
