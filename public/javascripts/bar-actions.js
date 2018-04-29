var cerveceria;

$(function() {
  $.get("data/cervecerias.json", function(data, status) {
    var id = getQueryVariable("id");
    if (id === false) { // Si se quiso acceder a bar.html sin ningun id
      window.location.replace("index.html");
    } else {
      var obj = $.grep(data, function(obj){return obj.id === id;})[0]; // Buscar elemento usando jQuery
      if (obj === undefined) { // Si no se encontro el id
        $("#main-container").html("<span class='notfound-text'>No se pudo encontrar la búsqueda \"" + id + "\"</span>");
        $("#main-container").append("<span class='notfound-text'><a class='notfound-link' href='index.html'>Volver al inicio</a></span>");
      } else {
        cerveceria = obj;
        mostrarInfo();
        $("body").append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyC6UheGSM6zHbQvf0MU5zSrdZNJCdMrZoQ&callback=initMap'></script>");
      }
    }
  });
});

$(function() {
    $("#today-time").click(function() {
        $("#hidden-days-list").slideToggle();
        $("#expand-arrow").toggleClass("expanded-arrow");
        return false;
    });
});

function mostrarInfo() {
  var hoy = new Date().getDay();

  $("#info-bar-logo").attr("src", cerveceria.logo);
  $("#info-bar-logo").attr("alt", "Logo " + cerveceria.nombre);
  $("#info-bar-picture").attr("src", cerveceria.foto);
  $("#info-bar-picture").attr("alt", "Foto " + cerveceria.nombre);

  if (cerveceria.direccion.localeCompare("") != 0) {
    $("#info-directions-btn").attr("href", "https://www.google.com/maps/dir//" + cerveceria.direccion.replace(/\s+/g, '+') + ",+B8000+Bahía+Blanca,+Buenos+Aires/")
    $("#info-address-text").html("Dirección: " + cerveceria.direccion);
  } else {
    $("#info-directions-btn").hide();
    $("#info-address-text").hide();
  }
  if (cerveceria.telefono.localeCompare("") != 0) {
    $("#info-phone-text").html("Teléfono: <a class='info-link' href='tel:" + libphonenumber.formatNumber(cerveceria.telefono, "International").replace(/\s+/g, '-') + "'>" + libphonenumber.formatNumber(cerveceria.telefono, "National") + "</a>");
  } else {
    $("#info-phone-text").hide();
  }
  if (cerveceria.horario[hoy].localeCompare("") != 0) {
    var weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    $("#info-time-text").html("Horario:");
    $("#today-time").prepend(weekdays[hoy] + " " + cerveceria.horario[hoy]);
    var day = (hoy + 1) % 7;
    while(day != hoy) {
      $("#hidden-days-list").append("<div>" + weekdays[day] + " " + cerveceria.horario[day] + "</div>");
      day = (day + 1) % 7;
    }
  } else {
    $("#info-time-text").hide();
    $("#time-box").hide();
  }
  if (cerveceria.happyHour.localeCompare("") != 0) {
    $("#info-happyhour-text").html("Happy hour: " + cerveceria.happyHour);
  } else {
    $("#info-happyhour-text").hide();
  }
  if (cerveceria.web.localeCompare("") != 0) {
    $("#info-web-text").html("Web: <a class='info-link' href='http://" + cerveceria.web + "/' target='_blank' rel='noopener'>" + cerveceria.web + "</a>");
  } else {
    $("#info-web-text").hide();
  }
  if (cerveceria.email.localeCompare("") != 0) {
    $("#info-email-text").html("Email: <a class='info-link' href='mailto:" + cerveceria.email + "'>" + cerveceria.email + "</a>");
  } else {
    $("#info-email-text").hide();
  }
  if (cerveceria.facebook.localeCompare("") != 0) {
    $("#info-social-network-links").append("<a id='info-facebook-icon' href='https://www.facebook.com/" + cerveceria.facebook + "/' target='_blank' rel='noopener'></a>");
  }
  if (cerveceria.instagram.localeCompare("") != 0) {
    $("#info-social-network-links").append("<a id='info-instagram-icon' href='https://www.instagram.com/" + cerveceria.instagram + "/' target='_blank' rel='noopener'></a>");
  }
  mostrarPuntaje(cerveceria);
}

function mostrarPuntaje(cerveceria) {
  var initialLocalRating = localStorage.getItem("rating_" + cerveceria.id);
  var totalRating = calculateRating(initialLocalRating);

  $("#fontawesome-rating").barrating({
      theme: "fontawesome-stars",
      showSelectedRating: false,
      deselectable: false,
      allowEmpty: true,
      initialRating: totalRating,
      onSelect: function(value, text, event) {
        if (typeof(event) !== "undefined") {
          // El puntaje fue seleccionado por el usuario
          var toShow = calculateRating(value);
          localStorage.setItem("rating_" + cerveceria.id, value);
          $("#info-rating-number").html(toShow);
          $("#fontawesome-rating").barrating("readonly", true);
          $("#fontawesome-rating").barrating("set", toShow);
          $("#user-rating-value").html(value);
          $("#user-rating").show();
          $("#delete-user-rating").show();
      }
    }
  });

  $("#info-rating-number").html(totalRating);
  if (initialLocalRating != null) {
    $("#fontawesome-rating").barrating("readonly", true);
    $("#user-rating-value").html(initialLocalRating);
    $("#user-rating").show();
    $("#delete-user-rating").show();
  }
}

function calculateRating(localRating) {
  var rating = 0;
  var usersThatRated = cerveceria.cantidadPuntajes;
  var ratingSum = cerveceria.sumaPuntajes;
  if (localRating != null) {
    usersThatRated += 1;
    ratingSum += Number(localRating);
  }
  if (usersThatRated > 0) {
    rating = Math.round(ratingSum / usersThatRated);
  }
  return rating;
}

$(function() {
  $("#delete-user-rating").click(function() {
    var toShow = calculateRating(undefined);
    localStorage.removeItem("rating_" + cerveceria.id);
    $("#user-rating").hide();
    if (toShow == 0) {
      $("#fontawesome-rating").barrating("clear");
    } else {
      $("#fontawesome-rating").barrating("set", toShow);
    }
    $("#fontawesome-rating").barrating("readonly", false);
    $("#info-rating-number").html(toShow);
    return false;
  });
});

function initMap() {
  var cerveceriaCoordenadas = new google.maps.LatLng(cerveceria.latLong[0], cerveceria.latLong[1]);
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: cerveceriaCoordenadas,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  });
  var marker = new google.maps.Marker({
    position: cerveceriaCoordenadas,
    map: map
  });
}

// Obtener parametro de la URL
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return(false);
}
