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
  var initialLocalRating = localStorage.getItem("rating_" + id);
  var totalRating = calculateRating(initialLocalRating);

  if (username) {
    $("#fontawesome-rating").barrating({
        theme: "fontawesome-stars",
        showSelectedRating: false,
        deselectable: false,
        allowEmpty: true,
        initialRating: totalRating,
        onSelect: function(value, text, event) {
          if (typeof(event) !== "undefined") {
            var data = {"id": id, "rating": value};
            $.post("/api/rate", data);

            var toShow = calculateRating(value);
            localStorage.setItem("rating_" + id, value);
            $("#info-rating-number").html(toShow);
            $("#fontawesome-rating").barrating("readonly", true);
            $("#fontawesome-rating").barrating("set", toShow);
            $("#user-rating-value").html(value);
            $("#user-rating").show();
            $("#delete-user-rating").show();
        }
      }
    });
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
  var usersThatRated = cantidadPuntajes;
  var ratingSum = sumaPuntajes;
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
    var data = {"id": id, "rating": localStorage.getItem("rating_" + id)};
    $.post("/api/unrate", data);

    var toShow = calculateRating(undefined);
    localStorage.removeItem("rating_" + id);
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

function formatNumber() {
  if (telefono != "") {
    $("#telefono").attr("href", "tel:" + libphonenumber.formatNumber(telefono, "International").replace(/\s+/g, '-'));
    $("#telefono").html(libphonenumber.formatNumber(telefono, "National"));
  }
}
