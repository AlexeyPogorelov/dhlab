var loading = {
	avgTime: 3000,
	trg: 1,
	state: 0,
	loaded: function () {
		if(++this.state == this.trg) {
			this.done();
		}
	},
	done: function () {
		// setInterval();

		// hide preloader
		$('body > .preloader').animate({
			'opacity': 0
		}, 200, function () {
			$(this).remove();
		});
	}
};
$(document).on('ready', function () {
	var winWidth = $(window).width(),
		winHeight = $(window).height(),
		bodyOverflow = {
			fixBody: function () {
				$('body').width($('body').width())
					.css({
						'overflow': 'hidden'
					});
			},
			unfixBody: function () {
				$('body')
					.css({
						'overflow': 'auto',
						'overflow-y': 'scroll',
						'width': 'initial'
					});
			},
			resize: function () {
				this.unfixBody();
			}.bind(this)
		};
	$('.full-height').css({
		'min-height': winHeight
	});

	// sidebars
	$('.navbar-toggle').on('click', function () {
		$('#mobile-menu').toggleClass('opened');
		bodyOverflow.fixBody();
	});
	$('.open-lightbox').on('click', function () {
		$($(this).data('target')).addClass('opened');
	});
	$('.close-lightbox').on('click', function () {
		$(this).closest($(this).data('target')).removeClass('opened');
		bodyOverflow.unfixBody();
	});

	// loaded
	loading.loaded();

	// resize
	$(window).on('resize', function () {
		winWidth = $(window).width();
		winHeight = $(window).height();
		$('.full-height').css({
			'min-height': winHeight
		});
	});
});

//plugins
(function ($) {

	$.fn.test = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {},
				$self = $(this);

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
			}, opt);

			// methods
			var plg = {
				init: function () {
				}
			};

			plg.init();

			return plg;
		});
	};
})(jQuery);