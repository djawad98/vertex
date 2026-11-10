( function( $ ) {

	"use strict";

	const $window   = $( window );
	const $document = $( document );

	$document.ready( function() {
		// Back to Top
		let $elScrollTopArrow = $( '.scroll-top-arrow' );
		$window.on( 'scroll', function() {
			const scrollTop = $document.scrollTop();
			if ( scrollTop > 150 ) {
				$elScrollTopArrow.addClass( 'visible' );
			} else {
				$elScrollTopArrow.removeClass( 'visible' );
			}
		});

		$document.on( 'click', '.scroll-top-arrow, .scroll-top', function( e ) {
			$( 'html, body' ).animate({
				scrollTop: 0
			}, 800 );
		});

		function scrollIndicator() {
			const el_scroll_progress = $( '.scroll-progress' );
			const scrollTop          = document.documentElement.scrollTop;

			if ( el_scroll_progress.length > 0 ) {
				el_scroll_progress.toggleClass( 'visible', scrollTop > 200 );
				const scrollHeight     = document.documentElement.scrollHeight;
				const windowHeight     = document.documentElement.clientHeight;
				const maxScrollTop     = scrollHeight - windowHeight;
				const scrollPercentage = Math.min( ( scrollTop / ( maxScrollTop - 200 ) ) * 100, 100 );
				$( '.scroll-point' ).css( 'height', scrollPercentage + '%' );
			}
		}

		$window.on( 'scroll', function() {
			scrollIndicator();
		});
	});

})( jQuery );
