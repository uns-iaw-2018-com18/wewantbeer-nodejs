var cerveceria = '{{ cerveza }}'

$(function() {
        mostrarPuntaje(cerveceria);
});

$(function() {
    $("#today-time").click(function() {
        $("#hidden-days-list").slideToggle();
        $("#expand-arrow").toggleClass("expanded-arrow");
        return false;
    });
});

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

  var cerveceriaCoordenadas = new google.maps.LatLng(parseFloat(document.getElementById('mapcoords').getAttribute("data-lat")), parseFloat(document.getElementById('mapcoords').getAttribute("data-lng")));
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
