( function( $ ) {

	"use strict";

	$( document ).ready( function() {
		const $window   = $( window );
		const $document = $( document );
		let scrollTop;

		const el_body = $( 'body' );
		const el_html = $( 'html' );

		let tabletBreakPoint = 991;
		if ( 'undefined' != typeof elementorFrontendConfig ) {
			if ( 'undefined' != typeof elementorFrontendConfig.breakpoints ) {
				if ( 'undefined' != typeof elementorFrontendConfig.breakpoints.lg ) {
					tabletBreakPoint = elementorFrontendConfig.breakpoints.lg - 1;
				}
			}
		}

		const $themeDemosMain = $( '.theme-demos-main' );
		$document.on( 'click', '.all-demo', function( e ) {
			let $themeDemosObj = $( this ).closest( '.theme-demos' );

			if ( ! $themeDemosObj.hasClass( 'active' ) ) {
				$themeDemosObj.addClass( 'active' );
				el_html.addClass( 'theme-demos-active' );
				el_body.css( 'overflow', 'hidden' );
			} else {
				$themeDemosObj.removeClass( 'active' );
				el_html.removeClass( 'theme-demos-active' );
				el_body.css( 'overflow', '' );
			}
		});

		let timer;
		$document.on( 'click', '.close-popup', function( e ) {
			let $themeDemosObj = $( this ).closest( '.theme-demos' );

			$themeDemosObj.removeClass( 'active' );
			el_html.removeClass( 'theme-demos-active' );
			el_body.css( 'overflow', '' );

			clearTimeout( timer );
			// Smooth scroll to top after a delay
			timer = setTimeout(() => {
				$themeDemosMain.animate( { scrollTop: 0 }, 'slow' );
			}, 800 );
		});

		$document.on( 'keydown', function( event ) {
			if ( event.key == "Escape" ) {

				let themeDemosObj = $( '.theme-demos' );

				themeDemosObj.removeClass( 'active' );
				el_html.removeClass( 'theme-demos-active' );
				el_body.css( 'overflow', '' );

				clearTimeout( timer );
				timer = setTimeout( function() {
					$themeDemosMain.animate( { scrollTop: 0 }, 'slow' );
				}, 800 );
			}
		});

		// START window scroll event		
		$window.on( 'scroll', function() {
			scrollTop = $( this ).scrollTop();
			if ( scrollTop > 150 ) {
				$( '.theme-demos' ).fadeIn( 600 );
			}
		});
		// END window scroll event

		// START window resize event

		$window.on( 'resize', function() {
			stickyFooter();
		});
		// END window resize event

		// Add data attribute if no retina image.
		$( 'img:not([data-at2x])' ).attr( 'data-no-retina', '' );

		if ( 'undefined' != typeof CraftoMain && $.inArray( 'magnific-popup', CraftoMain.disable_scripts ) < 0 ) {
			const $elPopup = $( '.popup-video, .popup-youtube' );
			if ( $elPopup.length > 0 ) {
				$elPopup.magnificPopup( {
					preloader: false,
					type: 'iframe',
					mainClass: 'mfp-fade crafto-video-popup',
					removalDelay: 160,
					fixedContentPos: true,
					closeBtnInside: false,
					disableOn: 'undefined' !== typeof CraftoMain ? CraftoMain.magnific_popup_video_disableOn : 0,
				});
			}
		}

		// Sticky footer.
		stickyFooter();
		function stickyFooter() {
			const $footerSticky = $( '.footer-sticky' );
			const $boxLayout    = $( '.box-layout' );

			if ( $footerSticky.length > 0 ) {
				if ( 'undefined' != typeof CraftoMain &&
					$.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 ) {
					$footerSticky.imagesLoaded( function () {
						stickyFootercallback();
					});
				} else {
					stickyFootercallback();
				}
			}

			if ( $boxLayout.length > 0 && $footerSticky.length > 0 ) {
				const boxLayoutWidth = $boxLayout.width();
				$boxLayout.find( '.footer-sticky' ).css({
					'margin': '0 auto',
					'width': boxLayoutWidth,
					'max-width': boxLayoutWidth
				});
			}
		}

		let timerStickyFooter;
		function stickyFootercallback() {
			let $footerSticky = $( '.footer-sticky' );
			let $footerHeight = Math.floor( $footerSticky.outerHeight() );

			clearTimeout( timerStickyFooter );
			timerStickyFooter = setTimeout( () => {
				$( '.crafto-main-content-wrap' ).css({
					'margin-bottom': $footerHeight
				});
			}, 500 );
		}

		$document.on( 'click', '.alert-dismissable .close', function( event ) {
			event.preventDefault();
			$( this ).closest( '.alert' ).fadeOut();
		});
	});

})( jQuery );
