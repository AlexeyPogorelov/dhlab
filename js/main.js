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

		// vendor init
		$('section').addClass('wow fadeInUp');
		new WOW().init();

		// perspective hover
		$('.portfolio-item').perspectiveHover();

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

	// capatabilities
	$('#capabilities-slider').capabilitiesSlider();

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
	$.fn.capabilitiesSlider = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {},
				self = this;

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
				'loop': true,
				'interval': false,
				'easing': 'swing',
				'prevClass': 'arrow-left-1',
				'nextClass': 'arrow-right-1',
				'holderClass': '.slides-holder',
				'slideClass': '.slide',
				'nameClass': '.slide-name',
				'imageClass': '.slide-image',
				'slidesOnPage': 1
			}, opt);

			// methods
			var plg = {
				cacheDOM: function () {
					DOM.$slider = $(self);
					DOM.$preloader = DOM.$slider.find('.slider-preloader');
					DOM.$viewport = DOM.$slider.find('.slider-viewport');
					DOM.$sliderHolder = DOM.$viewport.find('.slider-holder');
					DOM.$slides = DOM.$sliderHolder.find('.slide');
				},
				init: function () {
					state.cur = state.cur || 0;
					state.activeSlides = DOM.$slides.length;
					DOM.$preloader.fadeOut(150);
				},
				resize: function () {
					state.sliderWidth = DOM.$viewport.width();
					state.slideWidth = DOM.$slides.eq(0).outerWidth();
					DOM.$sliderHolder.width(state.slideWidth * state.activeSlides);
				},
				prevSlide: function () {
					var id = state.cur - 1;
					if (id < 0) {
						this.toSlide(state.activeSlides - 1);
						return;
					}
					this.toSlide(id);
				},
				nextSlide: function () {
					var id = state.cur + 1;
					if (id >= state.activeSlides) {
						this.toSlide(0);
						return;
					}
					this.toSlide(id);
				},
				toSlide: function (id) {
					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( -' + (state.slideWidth * opt.slidesOnPage * id) + 'px)',
						'transform': 'translateX( -' + (state.slideWidth * opt.slidesOnPage * id) + 'px)'
					});
					DOM.$pagination.find('.page').eq(id).addClass('active').siblings().removeClass('active');
				},
				createPagination: function () {
					if (DOM.$pagination) {
						DOM.$pagination.empty();
					} else {
						DOM.$pagination = $('<div>').addClass('paginator-holder');
						DOM.$pagination.appendTo(DOM.$slider);
					}
					for (var i = 0; i < state.activeSlides / opt.slidesOnPage; i++) {
						var page = $('<div>').data('page', i).addClass('page');
						if (!i) {
							page.addClass('active');
						}
						DOM.$pagination.append(page);
					}
				}
			};

			plg.cacheDOM();
			plg.init();
			plg.createPagination();
			plg.resize();

			// resize
			$(window).on('resize', function () {
				plg.resize();
			});

			// click events
			DOM.$slider.on('click', function (e) {
				var $target = $(e.target);
				if ($target.hasClass('page')) {
					plg.toSlide($(e.target).data('page'));
				}
			});

			$(window).on('resize', plg.resize.bind(plg));
			plg.init();

			return plg;
		});
	};

	$.fn.perspectiveHover = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {},
				$self = $(this);

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
				'power': 4
			}, opt);

			// methods
			var plg = {
				init: function () {
					state.elementWidth = $self.innerWidth();
					state.elementHeight = $self.innerHeight();
					$self.on('mousemove', this.mousemove);
					$self.on('mouseleave', this.mouseleave);
				},
				mousemove: function (e) {
					var offsetX = e.pageX - $self.offset().left;
					state.xmult = offsetX / state.elementWidth;
					var offsetY = e.pageY - $self.offset().top;
					state.ymult = offsetY / state.elementHeight;
					// console.log(state.xmult + " - " + state.ymult);
					$self.css({
						"transform": "rotateY(" + ((state.xmult - 0.5) * -opt.power) + "deg) rotateX(" + ((state.ymult - 0.5) * opt.power) + "deg) translateZ(10px)"
					});
				},
				mouseleave: function () {
					$self.css({
						"transform": "rotateY(" + 0 + "deg) rotateX(" + 0 + "deg)"
					});
				}
			};

			plg.init();

			return plg;
		});
	};
})(jQuery);