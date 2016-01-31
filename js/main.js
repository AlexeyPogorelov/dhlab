// easing

jQuery.extend( jQuery.easing,
	{
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInBounce: function (x, t, b, c, d) {
			return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
		},
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	});

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
	$('.left-bottom-holder').find('> span').on('click', function () {
		var topTarget = $('.features').offset().top;
		$("html, body").stop().animate({
			scrollTop: topTarget
		}, 800, 'easeOutQuint').one('mousewheel DOMMouseScroll touchstart',
			function () {
				$(this).stop(false, false)
			})
	});

	// main navigation
	$('.main-navbar').find('a').on('click', function (e) {
		e.preventDefault();
		var target = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(target).offset().top
		}, 1200, 'easeOutCirc');
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

	// initias
	$('#news-slider').simpleSlider();
	$('#persons-slider').personsSlider();
	$('#partners-slider').verticalSlider();

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

	$.fn.verticalSlider = function (opt) {

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
					if (!DOM.$sliderHolder) {
						this.cacheDom();
					}
					state.cur = state.cur || 0;
					state.slideHeight = DOM.$sliderHolder.height();
					state.activeSlides = parseInt(state.slideHeight / DOM.$viewport);
				},
				cacheDom: function () {
					DOM.$preloader = $self.find('.slider-preloader');
					DOM.$viewport = $self.find('.slider-viewport');
					DOM.$sliderHolder = DOM.$viewport.find('.slider-holder');
					DOM.$slides = DOM.$sliderHolder.find('.slide');
				},
				resize: function () {
					state.slideHeight = DOM.$sliderHolder.height();
					DOM.$sliderHolder.height(state.slideHeight * state.activeSlides);
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
						'-webkit-transform': 'translateY( -' + (state.slideHeight * id) + 'px)',
						'transform': 'translateY( -' + (state.slideHeight * id) + 'px)'
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
					$('<div>')
						.addClass('prev-slide')
						.on('click', function() {
							this.prevSlide();
						})
						.appendTo(DOM.$pagination);
					for (var i = 0; i < state.activeSlides / opt.slidesOnPage; i++) {
						var page = $('<div>').data('page', i).addClass('page');
						if (!i) {
							page.addClass('active');
						}
						DOM.$pagination.append(page);
					}
					$('<div>')
						.addClass('next-slide')
						.on('click', function() {
							this.nextSlide();
						})
						.appendTo(DOM.$pagination);
				}
			};

			plg.cacheDom();
			plg.init();

			return plg;
		});
	};

	$.fn.simpleSlider = function(options) {
		if (!options) {
			options = {};
		}
		options = $.extend({
		}, options);
		this.each(function () {
			var DOM = {},
				state = {},
				self = this;
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
					DOM.$sliderHolder.width(state.sliderWidth * state.activeSlides);
					DOM.$slides.width(state.sliderWidth);
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
					state.cur = id;
					DOM.$sliderHolder.css({
						'transform': 'translateX( -' + (state.sliderWidth * id) + 'px)'
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

					$('<div>')
						.addClass('prev-slide')
						.on('click', function() {
							plg.prevSlide();
						})
						.appendTo(DOM.$pagination);
					for (var i = 0; i < state.activeSlides; i++) {
						var page = $('<div>').data('page', i).addClass('page');
						if (!i) {
							page.addClass('active');
						}
						DOM.$pagination.append(page);
					}
					$('<div>')
						.addClass('next-slide')
						.on('click', function() {
							plg.nextSlide();
						})
						.appendTo(DOM.$pagination);
				}
			};

			plg.cacheDOM();
			plg.init();
			plg.createPagination();
			plg.resize();
			// console.log(DOM);

			// resize
			$(window).on('resize', function () {
				plg.resize();
			});

			// click events
			DOM.$slider.on('click', function (e) {
				var $target = $(e.target);
				if ($target.hasClass('page')) {
					plg.toSlide($(e.target).data('page'));
				} else if ($target.hasClass('filter')) {
					$target.addClass('active').siblings().removeClass('active');
					plg.filter($target.data('filter'));
				}
			});

			return plg;
		});
	};

	$.fn.personsSlider = function(options) {
		if (!options) {
			options = {};
		}
		options = $.extend({
			'slidesOnPage': 3
		}, options);
		this.each(function () {
			var DOM = {},
				state = {},
				self = this;
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
					state.pages = Math.ceil(DOM.$slides.length / options.slidesOnPage);
					state.slideWidth = state.sliderWidth / options.slidesOnPage;
					DOM.$preloader.fadeOut(150);
				},
				resize: function () {
					state.sliderWidth = DOM.$viewport.width();
					state.slideWidth = state.sliderWidth / options.slidesOnPage;
					DOM.$slides.width(state.slideWidth);
					DOM.$sliderHolder.width(state.slideWidth * state.activeSlides);
				},
				prevSlide: function () {
					var id = state.cur - 1;
					if (id < 0) {
						this.toSlide(state.activeSlides - options.slidesOnPage);
						return;
					}
					this.toSlide(id);
				},
				nextSlide: function () {
					var id = state.cur + 1;
					if (id >= state.activeSlides - options.slidesOnPage + 1) {
						this.toSlide(0);
						return;
					}
					this.toSlide(id);
				},
				toSlide: function (id) {
					state.cur = id;
					DOM.$sliderHolder.css({
						'transform': 'translateX( -' + (state.slideWidth * id) + 'px)'
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
					$('<div>')
						.addClass('prev-slide')
						.on('click', function() {
							plg.prevSlide();
						})
						.appendTo(DOM.$pagination);
					$('<div>')
						.addClass('next-slide')
						.on('click', function() {
							plg.nextSlide();
						})
						.appendTo(DOM.$pagination);
				}
			};

			plg.cacheDOM();
			plg.init();
			plg.createPagination();
			plg.resize();
			// console.log(DOM);

			// video
			DOM.$slides.find('video').each(function () {
					this.load();
					this.currentTime = 0.01;
				});
			DOM.$slides.on('mouseenter', function () {
					var $this = $(this);
					$this.find('video').get(0).play();
				})
				.on('mouseleave', function () {
					var $this = $(this);
					var video = $this.find('video').get(0);

					video.pause();
					video.currentTime = 0.01;
				});

			// resize
			$(window).on('resize', function () {
				plg.resize();
			});

			// click events
			DOM.$slider.on('click', function (e) {
				var $target = $(e.target);
				if ($target.hasClass('page')) {
					plg.toSlide($(e.target).data('page'));
				} else if ($target.hasClass('filter')) {
					$target.addClass('active').siblings().removeClass('active');
					plg.filter($target.data('filter'));
				}
			});

			return plg;
		});
	};

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