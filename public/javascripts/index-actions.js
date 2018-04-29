var cervecerias;
var mostrar = 0;

$(function() {
  $.get("data/cervecerias.json", function(data, status) {
    cervecerias = shuffle(data);
    mostrarCervecerias(3); // Mostrar 3 filas
    loadSearch();
    $("body").append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyC6UheGSM6zHbQvf0MU5zSrdZNJCdMrZoQ&callback=initMap'></script>");
  });
});

function mostrarCervecerias(maxRows) {
  var i, j, row, cell;
  for (i = 0; i < maxRows && mostrar < cervecerias.length; i++) {
    row = document.getElementById("bar-logos-table").insertRow(-1);
    for (j = 0; j < 3 && mostrar < cervecerias.length; j++) {
      cell = row.insertCell(j);
      cell.className = "bar-data-box";
      cell.innerHTML = "<a href='bar.html?id=" + cervecerias[mostrar].id + "'><img class='bar-logo' src='" + cervecerias[mostrar].logo + "' alt='" + cervecerias[mostrar].nombre + "'></a>";
      mostrar++;
    }
  }
  if (mostrar == cervecerias.length) {
    $("#arrow-container").hide();
  }
}

// Mostrar mas cervecerias y animar el scroll hacia abajo
$(function() {
  $("#arrow-container").click(function() {
    mostrarCervecerias(2); // Mostrar 2 filas
    $("html, body").animate({scrollTop: $("#map-container").offset().top - $(window).height()}, 1000);
    return false;
  });
});

function initMap() {
  // Inicializar el mapa en Bahia Blanca
  var bahiaBlanca = new google.maps.LatLng(-38.7050295, -62.2682321);
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: bahiaBlanca,
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

  // Para cada cerveceria, agregar su marcador
  for (i = 0; i < cervecerias.length; i++) {
    agregarMarcador(cervecerias[i], map);
  }
}

function agregarMarcador(cerveceria, map) {
  var point = new google.maps.LatLng(cerveceria.latLong[0], cerveceria.latLong[1]);
  var contenidoInfoWindow = "<b>" + cerveceria.nombre + "</b><br>" + cerveceria.direccion;
  var infoWindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50),
    content: contenidoInfoWindow
  });
  var marker = new google.maps.Marker({
    position: point,
    map: map,
    url: "bar.html?id=" + cerveceria.id
  });

  marker.addListener("mouseover", function() {
    infoWindow.open(map, this);
  });
  marker.addListener("mouseout", function() {
    infoWindow.close();
  });
  marker.addListener("click", function() {
    window.location.href = this.url;
  });
}

// Fisher-Yates shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // Mientras queden elementos para mezclar
  while (currentIndex != 0) {
    // Seleccionar un elemento
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Intercambiar con el elemento actual
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
