( function( $ ) {
	
	"use strict";

	const $window = $( window );

	let CraftoAddonsInit = {
		init: function init() {
			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy ) {
				if ( typeof elementorFrontend === 'undefined' ) {
					return;
				}
			}

			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy && ! elementorFrontend.isEditMode() ) {
				const widgets = [
					'.elementor-widget-crafto-heading',
					'.elementor-widget-crafto-feature-box-carousel',
					'.elementor-widget-crafto-content-slider',
				];
				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.headingInit( $( element ) );
					}
				});
			} else {
				const widgets = [
					'crafto-heading.default',
					'crafto-feature-box-carousel.default',
					'crafto-content-slider.default',
				];

				widgets.forEach( hook => {
					elementorFrontend.hooks.addAction( `frontend/element_ready/${hook}`, CraftoAddonsInit.headingInit );
				});
			}
		},
		headingInit: function( $scope ) {
			// Function to get window width
			const getWindowWidth    = () => window.innerWidth;
			const animeBreakPoint   = 1199;
			const $fancyTextRotator = $( '.fancy-text-rotator' );

			$fancyTextRotator.each( function() {
				var $elThis = $( this );

				const el_preloader_overlay = $( '.preloader-overlay' );

				function headingCheckPreloader() {
					if ( el_preloader_overlay.length > 0 ) {
						let checkPreloader = setInterval( function() {
							if ( el_preloader_overlay.css( 'display' ) === 'none' ) {
								clearInterval( checkPreloader );
								$scope.fancyTextEffect();
							}
						}, 10 );
					} else {
						$scope.fancyTextEffect();
					}
				}

				if ( 'undefined' != typeof CraftoFrontend && 'undefined' != typeof CraftoMain && $elThis.length > 0  && $.inArray( 'appear', CraftoMain.disable_scripts ) < 0  && $.inArray( 'anime', CraftoMain.disable_scripts ) < 0 ) {
					if ( getWindowWidth() > animeBreakPoint ) {
						if ( '0' === CraftoFrontend.all_animations_disable ) {
							headingCheckPreloader();
						}
					} else {
						if ( '1' === CraftoFrontend.mobile_animation_disable ) {
							if ( el_preloader_overlay.length > 0 ) {
								let checkPreloader = setInterval( function() {
									if ( el_preloader_overlay.css( 'display' ) === 'none' ) {
										clearInterval( checkPreloader );
										$elThis.removeAttr( 'data-fancy-text' );
									}
								}, 10 );
							} else {
								$elThis.removeAttr( 'data-fancy-text' );
							}
						} else {
							headingCheckPreloader();
						}
					}
				}
			});
				
			const shadow_animation = $( '.shadow-animation.common-shadow-animation' );

			$window.on( 'scroll', function( event ) {
				apply_shadow_effect();
			});

			shadow_animation.removeClass( 'shadow-in' );

			let el_preloader_overlay = $( '.preloader-overlay' );
			let preloaderDelay       = 600;

			if ( el_preloader_overlay.length > 0 ) {
				let checkPreloader = setInterval( function() {
					if ( el_preloader_overlay.css( 'display' ) === 'none' ) {
						clearInterval( checkPreloader );
						preloaderDelay = 0; // Update delay when preloader disappears

						// Now apply the effect after the updated delay
						setTimeout( apply_shadow_effect, preloaderDelay );
					}
				}, 10 );
			} 

			// This ensures apply_shadow_effect() runs if no preloader is found
			setTimeout( function() {
				if ( el_preloader_overlay.length === 0 ) {
					apply_shadow_effect();
				}
			}, preloaderDelay );


			function apply_shadow_effect() {
				shadow_animation.each( function() {
					add_box_animation_class( $( this ) );
				});
			}

			function add_box_animation_class( boxObj ) {
				if ( boxObj.length > 0 ) {
					let box_w    = boxObj.width(),
						box_h    = boxObj.height(),
						offset   = boxObj.offset(),
						right    = offset.left + parseInt( box_w ),
						bottom   = offset.top + parseInt( box_h ),
						visibleX = Math.max( 0, Math.min( box_w, window.pageXOffset + window.innerWidth - offset.left, right - window.pageXOffset ) ),
						visibleY = Math.max( 0, Math.min( box_h, window.pageYOffset + window.innerHeight - offset.top, bottom - window.pageYOffset ) ),
						visible  = visibleX * visibleY / ( box_w * box_h );
					
					const delay = boxObj.attr( 'data-animation-delay' );

					if ( visible >= 1 ) {
						if ( 'undefined' !== typeof delay && delay > 10 ) {
							setTimeout( function() {
								boxObj.addClass( 'shadow-in' );
							}, delay );
						} else {
							boxObj.addClass( 'shadow-in' );
						}
					}
				}
			}
		}
	}

	// If Elementor is already initialized, manually trigger
	if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy ) {
		if ( typeof elementorFrontend !== 'undefined' && ! elementorFrontend.isEditMode() ) {
			CraftoAddonsInit.init();
		} else {
			$window.on( 'elementor/frontend/init', CraftoAddonsInit.init );
		}
	} else {
		$window.on( 'elementor/frontend/init', CraftoAddonsInit.init );
	}
	
})( jQuery );
