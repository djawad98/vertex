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
					'.elementor-widget-crafto-menu-list-items',
					'.elementor-widget-crafto-custom-menu',
				];
				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.simpleMenuInit( $( element ) );
					}
				});
			} else {
				const widgets = [
					'crafto-menu-list-items.default',
					'crafto-custom-menu.default',
				];

				widgets.forEach( hook => {
					elementorFrontend.hooks.addAction( `frontend/element_ready/${hook}`, CraftoAddonsInit.simpleMenuInit );
				});
			}
		},
		simpleMenuInit: function() {
			let pageScroll = 0;
			$window.on( 'scroll', function() {
				const scrollTop = $( this ).scrollTop();
				const menuLinks = $( '.crafto-navigation-link .menu-item' );
				pageScroll++;

				let scrollPos = scrollTop + 60;
				if ( menuLinks.length > 0 ) {
					menuLinks.each( function() {
						const $elThis = $( this );
						if ( $elThis.find( 'a' ).attr( 'href' ) != '' && $elThis.find( 'a' ).attr( 'href' ) != undefined ) {
							let $anchorHref = $elThis.find( 'a' ).attr( 'href' );
							let hasPos      = $anchorHref.indexOf( '#' );

							if ( hasPos > -1 ) {
								let res           = $anchorHref.substring( hasPos );
								let hashID        = res.replace( '#', '' );
								let elementExists = document.getElementById( hashID );

								if ( res != '' && res != '#' && elementExists != '' && elementExists != null ) {
									let refElement = $( res );
									if ( refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos ) {
										menuLinks.removeClass( 'active' );
										$elThis.addClass( 'active' );
									}
									if ( scrollTop < 1 ) {
										$elThis.removeClass( 'active' );
									}
								}
							}
						}
					});
				}
			});

			$( document ).on( 'click', '.crafto-navigation-link .menu-item', function( e ) {
				$( 'body' ).removeClass( 'show-menu' );
				$( 'html' ).removeClass( 'overflow-hidden' );
			});
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

} )( jQuery );
