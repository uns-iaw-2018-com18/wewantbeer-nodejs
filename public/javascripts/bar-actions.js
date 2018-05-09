$(function() {
  mostrarPuntaje();
  formatNumber();

  // Mostrar tooltip
  $("[data-toggle='tooltip']").tooltip();
});

$(function() {
    $("#today-time").click(function() {
        $("#hidden-days-list").slideToggle();
        $("#expand-arrow").toggleClass("expanded-arrow");
        return false;
    });
});

function mostrarPuntaje() {
  var totalRating = calculateRating();
  $("#info-rating-number").html(totalRating);

  if (myRating) {
    $("#fontawesome-rating").barrating({
        theme: "fontawesome-stars",
        showSelectedRating: false,
        deselectable: false,
        allowEmpty: true,
        initialRating: totalRating,
        onSelect: function(value, text, event) {
          if (typeof(event) !== "undefined") {
            // Enviar el valor a agregar al servidor
            var data = {"bar": id, "count": value};
            $.post("/api/rate", data);

            // Actualizar valor en el cliente
            myRating = value;
            var toShow = recalculateRating(1);
            $("#info-rating-number").html(toShow);
            $("#fontawesome-rating").barrating("readonly", true);
            $("#fontawesome-rating").barrating("set", toShow);
            $("#user-rating-value").html(value);
            $("#user-rating").show();
            $("#delete-user-rating").show();
        }
      }
    });

    if (myRating != 0) {
      $("#fontawesome-rating").barrating("readonly", true);
      $("#user-rating-value").html(myRating);
      $("#user-rating").show();
      $("#delete-user-rating").show();
    }
  } else {
    $("#fontawesome-rating").barrating({
        theme: "fontawesome-stars",
        showSelectedRating: false,
        deselectable: false,
        allowEmpty: true,
        readonly: true,
        initialRating: totalRating
    });
  }
}

function calculateRating() {
  var rating = 0;
  if (cantidadPuntajes > 0) {
    rating = Math.round(sumaPuntajes / cantidadPuntajes);
  }
  return rating;
}

// Requiere modificar antes el valor de myRating para rate
// Y requiere modificarlo despues para unrate
function recalculateRating(rate) {
  var rating = 0;
  if (rate) {
    cantidadPuntajes = Number(cantidadPuntajes) + 1;
    sumaPuntajes = Number(sumaPuntajes) + Number(myRating);
  } else {
    cantidadPuntajes = Number(cantidadPuntajes) - 1;
    sumaPuntajes = Number(sumaPuntajes) - Number(myRating);
  }
  if (cantidadPuntajes > 0) {
    rating = Math.round(sumaPuntajes / cantidadPuntajes);
  }
  return rating;
}

$(function() {
  $("#delete-user-rating").click(function() {
    // Enviar el valor a eliminar al servidor
    var data = {"bar": id, "count": myRating};
    $.post("/api/unrate", data);

    // Actualizar valor en el cliente
    var toShow = recalculateRating(0);
    myRating = 0;
    $("#user-rating").hide();
    if (toShow == 0) {
      $("#fontawesome-rating").barrating("set", ""); // Clear no funcionaba bien
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

function formatNumber() {
  if (telefono != "") {
    $("#telefono").attr("href", "tel:" + libphonenumber.formatNumber(telefono, "International").replace(/\s+/g, '-'));
    $("#telefono").html(libphonenumber.formatNumber(telefono, "National"));
  }
}
