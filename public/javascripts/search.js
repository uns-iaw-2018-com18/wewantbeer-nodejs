function loadSearch() {
  var availableTags = getNamesFromJSON(cervecerias);
  $("#search-input").autocomplete({
    source: availableTags,
    select: function(event, ui) {
      $("#search-input").val(ui.item.value);
      goToSearch(ui.item.value);
    }
  }).keyup(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      var inputValue = $("#search-input").val();
      if (inputValue.localeCompare("") != 0) {
        goToSearch(inputValue);
      }
    }
  });
  $("#search-btn").click(function(event) {
    event.preventDefault();
    var inputValue = $("#search-input").val();
    if (inputValue.localeCompare("") != 0) {
      goToSearch(inputValue);
    }
  });
}

function getNamesFromJSON(cervecerias) {
  var names = [];
  for (var i = 0; i < cervecerias.length; i++) {
    names.push(cervecerias[i].nombre);
  }
  return names;
}

function goToSearch(value) {
  var id = getIdByName(value);
  if (id !== undefined) {
    window.location.href = "bar.html?id=" + id;
  } else {
    window.location.href = "bar.html?id=" + value.toLowerCase().replace(/\s+/g, '_');
  }
}

function getIdByName(name) {
  var id;
  var obj = $.grep(cervecerias, function(obj){return obj.nombre === name;})[0]; // Buscar elemento usando jQuery
  if (obj !== undefined) {
    id = obj.id;
  }
  return id;
}

// Overrides the default autocomplete filter function to search only from the beginning of the string
$.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
    return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
    });
};
