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
					'.elementor-widget-crafto-image-carousel',
					'.elementor-widget-crafto-image-gallery',
					'.elementor-widget-crafto-blog-list',
					'.elementor-widget-crafto-archive-blog',
					'.elementor-widget-crafto-portfolio',
					'.elementor-widget-crafto-archive-portfolio',
					'.elementor-widget-crafto-popup',
				];

				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.defaultLightboxGallery( $( element ) );
					}
				});
			} else {
				const widgets = [
					'crafto-image-carousel.default',
					'crafto-image-gallery.default',
					'crafto-blog-list.default',
					'crafto-archive-blog.default',
					'crafto-portfolio.default',
					'crafto-archive-portfolio.default',
					'crafto-popup.default',
				];

				widgets.forEach( hook => {
					elementorFrontend.hooks.addAction( `frontend/element_ready/${hook}`, CraftoAddonsInit.defaultLightboxGallery );
				});
			}
		},
		defaultLightboxGallery: function() {
			if ( 'undefined' != typeof CraftoMain && $.inArray( 'magnific-popup', CraftoMain.disable_scripts ) < 0 ) {
				const lightboxgallerygroups = {};
				const $lightboxItems        = $( '.lightbox-group-gallery-item' );

				if ( $lightboxItems.length > 0 ) {
					$lightboxItems.each( function() {
						const groupId = $( this ).attr( 'data-group' );
						if ( ! lightboxgallerygroups[groupId] ) {
							lightboxgallerygroups[groupId] = [];
						}
						lightboxgallerygroups[groupId].push( this );
					});

					$.each( lightboxgallerygroups, function() {
						$( this ).magnificPopup({
							type: 'image',
							closeOnContentClick: true,
							closeBtnInside: false,
							fixedContentPos: true,
							gallery: {
								enabled: true
							},
							image: {
								titleSrc: function( item ) {
									const title   = item.el.attr( 'title' ) || '';
									const caption = item.el.attr( 'data-lightbox-caption' ) || '';
									return `${title}${caption ? `${caption}` : ''}`;
								}
							},
						});
					});
				}
			}
		},
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
