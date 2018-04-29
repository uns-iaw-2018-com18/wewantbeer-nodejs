function ageVerification() {
	var verified = localStorage.getItem("verified");
	if (verified == undefined) {
		$("body").prepend("<div id='modal-bg'><div id='age-verification-modal'><span id='age-verification-top-text'>¿Sos mayor de edad?</span><button id='age-verification-no' class='confirm-btn'>NO</button><button id='age-verification-yes' class='confirm-btn'>SI</button><span id='age-verification-bottom-text'>Para visitar el sitio tenés que ser mayor de 18 años</span><span id='modal-logo'></span></div></div>");
		$("#modal-bg").show();
		$("#age-verification-modal").addClass("animated bounceInDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
		  $(this).removeClass();
		});
	}
}

$(function() {
	$("#age-verification-yes").click(function(event) {
		event.preventDefault();
		localStorage.setItem("verified", true);
		$("#age-verification-yes").attr("disabled", true);
		$("#age-verification-no").attr("disabled", true);
		$("#age-verification-modal").addClass("animated bounceOut").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
		  $("#modal-bg").fadeOut();
		});
	});
	$("#age-verification-no").click(function(event) {
		event.preventDefault();
		$("#age-verification-top-text").html("¡Lo sentimos!");
		$("#age-verification-yes").hide();
		$("#age-verification-no").hide();
	});
});
