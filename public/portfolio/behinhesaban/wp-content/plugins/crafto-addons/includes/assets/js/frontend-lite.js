( function ( $ ) {

	"use strict";

	var editorElements;
	var sectionData = '';
	var get_entrance_anime = '';
	var tabletBreakPoint = 991;
	var timer;

	if ( checkUndefinedVal( elementorFrontendConfig ) ) {
		if ( checkUndefinedVal( elementorFrontendConfig.breakpoints ) ) {
			if ( checkUndefinedVal( elementorFrontendConfig.breakpoints.lg ) ) {
				tabletBreakPoint = elementorFrontendConfig.breakpoints.lg - 1;
			}
		}
	}

	function checkUndefinedVal( $Optval ) {
		if ( 'undefined' != typeof $Optval ) {
			return true;
		}
		return false;
	};

	let CraftoAddonsInit = {
		init: function init() {
			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy ) {
				if ( typeof elementorFrontend === 'undefined' ) {
					return;
				}
			}

			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy && ! elementorFrontend.isEditMode() ) {
				const widgets = [
					'.e-con',
				];

				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.globalInit( $( element ) );
						CraftoAddonsInit.elementorSection( $( element ) );
						CraftoAddonsInit.verticalBar( $( element ) );
					}
				});
			} else {
				elementorFrontend.hooks.addAction( 'frontend/element_ready/container', CraftoAddonsInit.globalInit );
				elementorFrontend.hooks.addAction( 'frontend/element_ready/container', CraftoAddonsInit.elementorSection );
				elementorFrontend.hooks.addAction( 'frontend/element_ready/container', CraftoAddonsInit.verticalBar );
			}

			const el_header                = $( 'header' );
			const el_header_common_wrapper = $( '.header-common-wrapper' );

			// One page scroll while header is sticky
			if ( el_header.find( 'nav.always-fixed' ).length > 0 || el_header.find( 'nav.header-reverse' ).length > 0 || el_header.find( '.header-common-wrapper.shrink-nav' ).length > 0 ) {
				elementorFrontend.hooks.addFilter( 'frontend/handlers/menu_anchor/scroll_top_distance', function( scrollPosition ) {
					if ( el_header_common_wrapper.length > 0 ) {
						scrollPosition -= el_header_common_wrapper.outerHeight() - 50;
					}
					// To close mobile menu
					const el_navbar_collapse = $( '.navbar-collapse.collapse' );
					if ( el_navbar_collapse.length > 0 ) {
						el_navbar_collapse.collapse( 'hide' );
					}
					return scrollPosition;
				});
			}
		},
		globalInit: function() {
			setTimeout( function() {
				const el_has_parallax_bg = $( '.e-con' ).hasClass( 'has-parallax-background' );
				if ( el_has_parallax_bg ) {
					CraftoAddonsInit.setParallax();
				}
			}, 100 );
		},
		sectionSettings: function( sectionId ) {
			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;
			if ( ! editorElements.models ) {
				return false;
			}

			$.each( editorElements.models, function( index, obj ) {
				if ( sectionId == obj.id ) {
					sectionData = obj.attributes.settings.attributes;
				}
			} );

			var crafto_parallax_ratio,
				crafto_parallax;

			if ( checkUndefinedVal( sectionData['crafto_parallax'] ) ) {
				crafto_parallax = sectionData['crafto_parallax'];
			}

			if ( checkUndefinedVal( sectionData['crafto_parallax_ratio'] ) ) {
				crafto_parallax_ratio = sectionData['crafto_parallax_ratio']['size'];
			}

			return{
				'parallax_ratio': crafto_parallax_ratio,
				'parallax': crafto_parallax,				
			}
		},
		setParallax: function() {
			// Parallax background and layout
			const $elParallaxBackground = $( '.has-parallax-background' );
			const $elParallaxLayout     = $( '.has-parallax-layout' );
			if ( 'undefined' != typeof CraftoMain && $.inArray( 'custom-parallax', CraftoMain.disable_scripts ) < 0 && $.fn.parallax ) {
				if ( $elParallaxBackground.length > 0 ) {
					$elParallaxBackground.each( function() {
						const ratio = parseFloat( $( this ).attr( 'data-parallax-background-ratio' ) || 0.5 );
						$( this ).parallax( '50%', ratio );
					});
				}

				if ( $elParallaxLayout.length > 0 ) {
					$elParallaxLayout.each( function() {
						const ratio = parseFloat( $( this ).attr( 'data-parallax-layout-ratio' ) || 1 );
						$( this ).parallaxImg( '50%', ratio );
					});
				}
			}
		},
		elementorSection: function( $scope ) {
			var sectionId = $scope.data( 'id' ),
				editMode  = Boolean( elementorFrontend.isEditMode() );

			if ( editMode ) {
				var parallaxSettings = CraftoAddonsInit.sectionSettings( sectionId );
				get_parallax( parallaxSettings );
			} else {
				var parallaxSettings = $scope.data( 'parallax-section-settings' );
				get_parallax( parallaxSettings );
			}

			function get_parallax( settings ) {
				if ( 'undefined' !== typeof settings ) {
					if ( 'parallax' === settings['parallax'] ) {
						$scope.addClass( 'has-parallax-background' );
						$scope.attr( 'data-parallax-background-ratio', settings['parallax_ratio'] );
					} else {
						$scope.removeClass( 'has-parallax-background' ).removeAttr( 'data-parallax-background-ratio');
					}
				} else {
					return;
				}
			}
		},	
		verticalBar: function( $scope ) {
			var editMode = Boolean( elementorFrontend.isEditMode() );
			if ( editMode ) {
				var postType = ( 'undefined' != typeof CraftoFrontend ) ? CraftoFrontend.postType : '';
				var crafto_verticalbar,
				    verticalbar_position;
				if ( 'yes' === sectionData['crafto_verticalbar_block'] ) {
					crafto_verticalbar = sectionData['crafto_verticalbar_block'];
				}
				if ( '' !== sectionData['crafto_verticalbar_position'] ) {
					verticalbar_position = sectionData['crafto_verticalbar_position'];
				}
				if ( 'yes' === crafto_verticalbar ) {
					$scope.addClass( 'verticalbar-wrap' );
					if ( 'left' === verticalbar_position ) {
						$scope.removeClass( 'verticalbar-position-right' ).addClass( 'verticalbar-position-' + verticalbar_position );
					} else if ( 'right' === verticalbar_position ) {
						$scope.removeClass( 'verticalbar-position-left' ).addClass( 'verticalbar-position-' + verticalbar_position );
					} else {
						$scope.removeClass( 'verticalbar-position-left verticalbar-position-right' );
					}
				} else {
					if ( 'themebuilder' === postType ) {
						$scope.removeClass( 'verticalbar-wrap' );
					}
				}
			}


			const $sticky_wrap  = $( '.verticalbar-wrap' );
			if ( $sticky_wrap.hasClass( 'shadow-animation' ) ) {
				var shadow_animation = $( '.verticalbar-wrap.shadow-animation' );
				if ( 0 === shadow_animation.length ) {
					return;
				}

				$( window ).on( 'scroll', function( event ) {
					apply_shadow_effect();
				});

				shadow_animation.removeClass( 'shadow-in' );
				apply_shadow_effect();

				function apply_shadow_effect() {
					shadow_animation.each( function () {
						add_box_animation_class( $( this ) )
					});
				}

				function add_box_animation_class( boxObj ) {
					if ( boxObj.length > 0 ) {
						var box_w    = boxObj.width(),
							box_h    = boxObj.height(),
							offset   = boxObj.offset(),
							right    = offset.left + parseInt( box_w ),
							bottom   = offset.top + parseInt( box_h ),
							visibleX = Math.max( 0, Math.min( box_w, window.scrollX + window.innerWidth - offset.left, right - window.scrollX ) ),
							visibleY = Math.max( 0, Math.min( box_h, window.scrollY + window.innerHeight - offset.top, bottom - window.scrollY ) ),
							visible  = visibleX * visibleY / ( box_w * box_h );

						var delay = boxObj.attr( 'data-animation-delay' );

						if ( visible >= 0 ) {
							if ( 'undefined' !== typeof delay && delay > 10 ) {
								setTimeout( function () {
									boxObj.addClass( 'shadow-in' );
								}, delay );
							} else {
								boxObj.addClass( 'shadow-in' );
							}
						}
					}
				}
			}
			
			if ( $sticky_wrap.length > 0 ) {
				const footer_height = $( 'footer' ).outerHeight();
				function updateElements( e ) {
					let viewportHeight = document.documentElement.clientHeight;
					let elements       = document.querySelectorAll( '.section-dark' );
					let markedClass    = 'section-dark-highlight';
					let zone           = [10, 10];
					let found          = [];
			
					elements.forEach( ( elm ) => {
						let pos        = elm.getBoundingClientRect();
						let topPerc    = ( pos.top / viewportHeight ) * 100;
						let bottomPerc = ( pos.bottom / viewportHeight ) * 100;
						let middle     = ( topPerc + bottomPerc ) / 2;
						let inViewport = middle > zone[1] && middle < (100 - zone[1]);
			
						elm.classList.toggle( markedClass, inViewport );
						if ( inViewport ) {
							found.push( elm );
						}
					});
		
					if ( $( '.section-dark-highlight' ).length > 0 ) {
						$sticky_wrap.addClass( 'verticalbar-highlight' );
					} else {
						$sticky_wrap.removeClass( 'verticalbar-highlight' );
					}

					if ( $( window ).scrollTop() + $( window ).height() >= $( document ).height() - footer_height ) {
						$sticky_wrap.addClass( 'verticalbar-hidden' );
					} else {
						$sticky_wrap.removeClass( 'verticalbar-hidden' );
					}
				}
			
				$( window ).on( 'scroll load resize', updateElements );

				updateElements();
			}
		},
	}

	/* If Elementor is already initialized, manually trigger */
	if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy ) {
		if ( typeof elementorFrontend !== 'undefined' && ! elementorFrontend.isEditMode() ) {
			CraftoAddonsInit.init();
		} else {
			$( window ).on( 'elementor/frontend/init', CraftoAddonsInit.init );
		}
	} else {
		$( window ).on( 'elementor/frontend/init', CraftoAddonsInit.init );
	}

})( jQuery );
