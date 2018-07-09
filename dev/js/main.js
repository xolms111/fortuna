$(document).ready(function() {
	$('.slider').slick({
		dots: true,
		arrows: false
	});
	$('.project__slider').slick({
		dots: true,
		arrows: false,
		infinite: false,
		asNavFor: '.project__subslider'
	});
	$('.project__subslider').slick({
		dots: false,
		arrows: false,
		asNavFor: '.project__slider',
		slidesToShow: 3,
		slidesToScroll: 1,
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



	$('.magnific-slider').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Загрузка изображения #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">Изображение #%curr%</a> не может быть загруженно.',
			titleSrc: function(item) {
				return item.el.attr('title');
			}
		}
	});
	$('.modal-open').click(function (e) {
		e.preventDefault();
		var title = $(this).attr('data-title')
		$('.modal__title').text(title)
		$('.modal__form input[name=theme]').val(title)
		$('.modal').fadeIn()
		return false
	})
	$('.modal__cross').click(function() {
		$('.modal').fadeOut()
	})

})