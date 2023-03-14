(function($, window, document) {

	"use strict";

		var $window                 = $(window),
		$body                       = $('body'),
		$offCanvasEl                = $('#slide-out-widget-area'),
		$offCanvasBG                = $('#slide-out-widget-area-bg'),
		$headerOuterEl              = $('#header-outer'),
		$headerSecondaryEl          = $('#header-secondary-outer'),
		$searchButtonEl             = $('#header-outer #search-btn a'),
		$wpAdminBar                 = $('#wpadminbar'),
		$loadingScreenEl            = $('#ajax-loading-screen'),
		$bodyBorderTop              = $('.body-border-top'),
		$pageHeaderBG               = $('#page-header-bg'),
		$footerOuterEl              = $('#footer-outer'),
		$bodyBorderWidth            = ($('.body-border-right').length > 0) ? $('.body-border-right').width() : 0,
		$logoHeight                 = ($headerOuterEl.is('[data-logo-height]')) ? parseInt($headerOuterEl.attr('data-logo-height')) : 30,
		headerPadding               = ($headerOuterEl.is('[data-padding]')) ? parseInt($headerOuterEl.attr('data-padding')) : 28,
		logoShrinkNum               = ($headerOuterEl.is('[data-shrink-num]')) ? $headerOuterEl.attr('data-shrink-num') : 6,
		condenseHeaderLayout        = ($headerOuterEl.is('[data-condense="true"]')) ? true : false,
		usingLogoImage              = ($headerOuterEl.is('[data-using-logo="1"]')) ? true : false,
		headerResize                = ($headerOuterEl.is('[data-header-resize="1"]')) ? true : false,
		headerTransparent           = ($headerOuterEl.is('[data-transparent-header="true"]')) ? true : false,
		headerMobileFixed           = ($headerOuterEl.is('[data-mobile-fixed="1"]')) ? true : false,
		headerLayoutFormat          = ($body.is('[data-header-format]')) ? $body.attr('data-header-format') : 'default',
		headerHideUntilNeeded       = ($body.is('[data-hhun]')) ? $body.attr('data-hhun') : '',
		$animationEasing            = ($body.is('[data-cae]') && $body.attr('data-cae') !== 'swing' ) ? $body.attr('data-cae') : 'easeOutCubic',
		$animationDuration          = ($body.is('[data-cad]')) ? $body.attr('data-cad') : '650',
		bypassAnimations            = (!$body.is('[data-m-animate="1"]') && navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/) ) ? true : false,
		$portfolio_containers       = [],
		$svgIcons                   = [],
		$nectarCustomSliderRotate   = [],
		$flickitySliders            = [],
		flickityDragArr             = [],
		viewIndicatorArr            = [],
		iconMouseFollowArr          = [],
		postGridImgMouseFollowArr   = [],
		parallaxItemsArr            = [],
		$fsProjectSliderArr         = [],
		$wooFlickityCarousels       = [],
		$liquidBG_EL                = [],
		$testimonialSliders         = [],
		$mouseParallaxScenes        = [],
		$nectarMasonryBlogs         = [],
		$standAnimatedColTimeout    = [],
		$animatedSVGIconTimeout     = [],
		$projectCarouselSliderArr   = [],
		$nectarPostGridArr          = [],
		$verticalScrollingTabs      = [],
		$tabbedClickCount           = 0,
		$fullscreenSelector         = '',
		$fullscreenMarkupBool       = false,
		$bodyBorderHeaderColorMatch = false,
		nectarBoxRoll               = {
			animating: 'false',
			perspect: 'not-rolled'
		},
		$nectarFullPage             = {
			$usingFullScreenRows: false
		},
		$svgResizeTimeout,
		$bodyBorderSizeToRemove;

		if( $bodyBorderTop.length > 0 ) {

			if ( $bodyBorderTop.css('background-color') == '#ffffff' && $body.attr('data-header-color') == 'light' ||
				$bodyBorderTop.css('background-color') == 'rgb(255, 255, 255)' && $body.attr('data-header-color') == 'light' ||
				$bodyBorderTop.css('background-color') == $headerOuterEl.attr('data-user-set-bg')) {
				$bodyBorderHeaderColorMatch = true;
			}

		}

		var nectarDOMInfo = {

			usingMobileBrowser: (navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) ? true : false,
			usingFrontEndEditor: (typeof window.vc_iframe === 'undefined') ? false : true,
			getWindowSize: function() {
				nectarDOMInfo.winH                  = window.innerHeight;
				nectarDOMInfo.winW                  = window.innerWidth;
				nectarDOMInfo.adminBarHeight        = ($wpAdminBar.length > 0) ? $wpAdminBar.height() : 0;
				nectarDOMInfo.secondaryHeaderHeight = ($headerSecondaryEl.length > 0 && $headerSecondaryEl.css('display') != 'none') ? $headerSecondaryEl.outerHeight() : 0;
				nectarDOMInfo.footerOuterHeight     = ($footerOuterEl.length > 0) ? $footerOuterEl.outerHeight() : 0;
			},
			scrollTop: 0,
			clientX: 0,
			clientY: 0,
			scrollPosMouse: function() {
				return window.scrollY || $window.scrollTop();
			},
			scrollPosRAF: function() {

				nectarDOMInfo.scrollTop = window.scrollY || $window.scrollTop();
				requestAnimationFrame(nectarDOMInfo.scrollPosRAF);
			},
			bindEvents: function() {

				if (!nectarDOMInfo.usingMobileBrowser) {

					$window.on('scroll', function() {
						nectarDOMInfo.scrollTop = nectarDOMInfo.scrollPosMouse();
					});
					document.addEventListener("mousemove", function(e) {
						nectarDOMInfo.clientX = e.clientX;
						nectarDOMInfo.clientY = e.clientY;
					});

				} else {
					requestAnimationFrame(nectarDOMInfo.scrollPosRAF);
				}

				$window.on('resize', nectarDOMInfo.getWindowSize);

			},
			init: function() {

				$wpAdminBar = $('#wpadminbar');

				this.getWindowSize();
				this.scrollTop = this.scrollPosMouse();
				this.bindEvents();

				this.usingFrontEndEditor = (typeof window.vc_iframe === 'undefined') ? false : true;
			}

		};
		window.nectarDOMInfo = nectarDOMInfo;


		var nectarState = {
			materialOffCanvasOpen: false,
			materialSearchOpen: false,
			permanentTransHeader: ( $headerOuterEl.is('[data-permanent-transparent="1"]') ) ? true : false,
			animatedScrolling: false,
			preventScroll: false,
			mobileHeader: ''
		}

		function linearInterpolate(a, b, n) {
			return (1 - n) * a + n * b;
		}


		
				function cascadingImageBGSizing() {

					$('.nectar_cascading_images').each(function () {

						var forcedAspect = ( $(this).hasClass('forced-aspect') ) ? true : false;

						if ($(this).parents('.vc_row-o-equal-height').length > 0 && $(this).parents('.wpb_column').length > 0) {
							$(this).css('max-width', $(this).parents('.wpb_column').width());
						}

						$(this).find('.bg-color').each(function () {

							if( forcedAspect == true && $(this).parents('.cascading-image').index() == 0 ) {
								return true;
							}

							var $bgColorHeight  = 0;
							var $bgColorWidth   = 0;

							if ($(this).parent().find('.img-wrap').length == 0) {

								var $firstSibling = $(this).parents('.cascading-image').siblings('.cascading-image[data-has-img="true"]').first();

								$bgColorHeight 	= $firstSibling.find('.img-wrap').height();
								$bgColorWidth 	= $firstSibling.find('.img-wrap').width();

							} else {
								$bgColorHeight 	= $(this).parent().find('.img-wrap').height();
								$bgColorWidth 	= $(this).parent().find('.img-wrap').width();
							}

							$(this).css({
								'height': $bgColorHeight,
								'width': $bgColorWidth
							}).addClass('calculated');

						});

					});

				}
				function cascadingImageInit() {

					if ($('.nectar_cascading_images').length > 0) {

						var cascadingParallax = [];

						$('.nectar_cascading_images').each(function(i){

							imagesLoaded($(this), function (instance) {


								cascadingImageBGSizing();

								if( $(instance.elements[0]).is('[data-parallax="yes"]') && !nectarDOMInfo.usingMobileBrowser && $('#nectar_fullscreen_rows').length == 0 ) {
									cascadingParallax[i] = new CascadingParallax($(instance.elements[0]), $(instance.elements[0]).attr('data-parallax-intensity'));
								}

							});

						});

						$window.on('resize', cascadingImageBGSizing);

					}

				}




				function CascadingParallax(el, intensity) {

					this.$element  = el;
					this.inView    = false;
					this.topLevel  = false;
					this.lastY     = 0;

					this.layer1Parallax = ( this.$element.is('[data-layer-1-parallax="yes"]') ) ? true : false;

					switch(intensity) {
						case 'subtle':
							this.intensity = 0.09;
							break;
						case 'medium':
							this.intensity = 0.15;
							break;
						case 'high':
							this.intensity = 0.25;
							break;
					}
					this.calculatePos();
					this.trackView();
					this.animate();

					if( $('.portfolio-filters').length > 0 ||
					$('.portfolio-filters-inline').length > 0 ) {
						setInterval(this.calculatePos.bind(this),700);
					}

					$window.on('resize', this.calculatePos.bind(this));
				}

				CascadingParallax.prototype.calculatePos = function() {
					this.offsetTop  = this.$element.offset().top;
					this.height     = this.$element.outerHeight();
					this.vertCenter = nectarDOMInfo.winH/2 - this.height/2;
				};

				CascadingParallax.prototype.trackView = function() {

					var that = this;

					if( this.$element.parents('.top-level').length > 0 ) {
						this.topLevel = true;
					}

					if( 'IntersectionObserver' in window ) {

						var options = {
							rootMargin: '250px',
						}
						var observer = new IntersectionObserver(function(entries) {

							entries.forEach(function(entry){
								var isIntersecting = entry.isIntersecting;

								if (isIntersecting) {
									that.inView = true;
								} else {
									that.inView = false;
								}
							});

						}, options);

						observer.observe(this.$element[0]);

					}

				};

				CascadingParallax.prototype.animate = function() {

					if( nectarState.materialOffCanvasOpen == true ) {
						window.requestAnimationFrame(this.animate.bind(this));
						return;
					}

					this.lastY = linearInterpolate(this.lastY, nectarDOMInfo.scrollTop, 0.2);

					if( this.inView ) {

						var that = this;

						this.$element.find('.bg-layer').each(function(i) {

							var $scale = $(this).data('scale');

							if( that.layer1Parallax ) {
								i = (i/1.5)+1;
							}

							if( that.topLevel === true && nectarDOMInfo.winW > 1000) {
								$(this)[0].style.transform = 'translateY(' + -(that.lastY * that.intensity * i) + 'px) translateZ(0) scale(' + $scale + ')';
							} else {
								$(this)[0].style.transform = 'translateY(' + -((that.lastY - that.offsetTop + that.vertCenter ) * that.intensity * i ) + 'px) translateZ(0) scale(' + $scale + ')';
								jQuery("img.rotated").each(function(){
									jQuery(this)[0].style.transform = 'rotateZ(' + -((that.lastY - that.offsetTop + that.vertCenter ) * 0.002 * i ) + 'deg)';
								});
							}

						});
					}

					window.requestAnimationFrame(this.animate.bind(this));
				};


		

				function salientPageBuilderElInit() {
	
					cascadingImageInit();
				
				}

			
			jQuery(document).ready(function ($) {

				
				nectarDOMInfo.init();

				salientPageBuilderElInit();

				if( document.readyState === 'complete' ) {

					setTimeout(function(){
						$window.trigger('load');
					},30);

				}

				$window.on('load', function () {

					if ( $(window).scrollTop() == 0 ) {
						//headerSpace();
					}

					$('video').css('visibility', 'visible');

				});


			});



}(window.jQuery, window, document));