$(document).ready(function() {
	$('.slider').slick({
		dots: true,
	});
	$('input[name=phone]').mask('(999) 999-9999');
	$('.burger').click(function() {
		$('.navigation').slideToggle()
	})
	$(window).resize(function() {
		var width = $(document).width()
		if(width > 992) {
			$('.navigation').show()
		}
		else {
			$('.navigation').hide()
		}
	})
	$(window).scroll(function() {
		var x = $(this).scrollTop()
		if(x > 100) {
			$('.navigation').addClass('fixed')
		}
		else {
			$('.navigation').removeClass('fixed');
		}
	})
})