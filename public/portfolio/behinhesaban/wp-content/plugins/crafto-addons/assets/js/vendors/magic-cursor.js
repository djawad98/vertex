( function( $ ) {

	"use strict";

	$( document ).ready( function() {
		var el_magic_cursor = $( '.magic-cursor' );
		if ( el_magic_cursor.length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'anime', CraftoMain.disable_scripts ) < 0 ) {
			setTimeout( function() {
				var magic_cursor_html = '<div class="magic-cursor-wrapper">';
					magic_cursor_html += '<div id="ball-cursor">';
					magic_cursor_html += '<div id="ball-cursor-loader">';
					magic_cursor_html += '</div>';
					magic_cursor_html += '</div>';
					magic_cursor_html += '</div>';
				
				$( magic_cursor_html ).clone( false ).appendTo( 'body' );

				var el_magic_cursor_wrap = $( '.magic-cursor-wrapper' );
				if ( el_magic_cursor.hasClass( 'cursor-icon' ) ) {
					el_magic_cursor_wrap.addClass( 'magic-cursor-icon' );
				}
	
				if ( el_magic_cursor.hasClass( 'cursor-label' ) ) {
					el_magic_cursor_wrap.addClass( 'magic-cursor-label alt-font' );
				}
				
				if ( el_magic_cursor.hasClass( 'round-cursor' )) {
					el_magic_cursor_wrap.addClass( 'magic-round-cursor' );
				}
				
				var ball = document.getElementById( 'ball-cursor' );
	
				function mouseMove( e ) {
					anime({
						targets: ball,
						translateX: e.clientX - ball.offsetWidth / 2,
						translateY: e.clientY - ball.offsetHeight / 2,
						duration: 20,
						easing: 'easeInOutQuad'
					  });
				}
			
				document.addEventListener( 'mousemove', mouseMove );

				$( '.magic-cursor' ).on( 'mouseenter', function() {
					anime({
						target: '#ball-cursor',
						borderWidth: '2px',
						opacity: 1,
					});
					anime({
						target: '#ball-cursor-loader',
						borderWidth: '2px',
					});
	
					el_magic_cursor_wrap.addClass( 'sliderhover' );
	
					if ( $( this ).hasClass( 'magic-cursor-vertical' ) ) {
						el_magic_cursor_wrap.addClass( 'vertical' );
					}
				});
	
				$( '.magic-cursor' ).on( 'mouseleave', function() {
					anime({
						target: '#ball-cursor',
						borderWidth: '2px',
						opacity: 0
					});
					anime({
						target: '#ball-cursor-loader',
						borderWidth: '2px',
					
					});
					el_magic_cursor_wrap.removeClass( 'sliderhover' );
				});
	
				$( document ).on( 'mouseenter', '.elementor-swiper-button-next, .elementor-swiper-button-prev, .swiper-pagination, a:not(.force-magic-cursor), .slider-custom-image-pagination', function() {
					el_magic_cursor_wrap.css( { 'opacity': 0 } );
				}).on( 'mouseleave', '.elementor-swiper-button-next, .elementor-swiper-button-prev, .swiper-pagination, a:not(.force-magic-cursor), .slider-custom-image-pagination', function() {
					el_magic_cursor_wrap.css( { 'opacity': 1 } );
				});
			}, 1000 );
		}
	});

} )( jQuery );
