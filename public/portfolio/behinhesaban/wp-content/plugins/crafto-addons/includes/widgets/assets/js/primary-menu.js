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
					'.elementor-widget-crafto-mega-menu',
				];
				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.megaMenuInit( $( element ) );
					}
				});
			} else {
				elementorFrontend.hooks.addAction( 'frontend/element_ready/crafto-mega-menu.default', CraftoAddonsInit.megaMenuInit );
			}
		},
		megaMenuInit: function() {
			let tabletBreakPoint     = 991;
			const $body              = $( 'body' );
			const $html              = $( 'html' );
			const $miniHeaderWrapper = $( '.mini-header-main-wrapper' );
			const $HeaderWrapper     = $( '.header-common-wrapper.standard' );
			const $navBar            = $( 'header nav.navbar' );
			const $wpadminbar        = $( '#wpadminbar' );

			if ( typeof elementorFrontendConfig != 'undefined' ) {
				if ( typeof elementorFrontendConfig.breakpoints != 'undefined' ) {
					if ( typeof elementorFrontendConfig.breakpoints.lg != 'undefined' ) {
						tabletBreakPoint = elementorFrontendConfig.breakpoints.lg - 1;
					}
				}
			}

			// Get window height
			function getWindowHeight() {
				return $window.height();
			}

			// Get window width
			function getWindowWidth() {
				return window.innerWidth;
			}

			$window.on( 'resize', function() {
				mobileClassicNavigation();
				navbarDropdown();
			});

			// Get top space header height
			function getHeaderHeight() {
				let headerHeight = 0;
				if ( $miniHeaderWrapper.length > 0 ) {
					headerHeight = headerHeight + $miniHeaderWrapper.outerHeight();
				}
				if ( $navBar.length > 0 ) {
					headerHeight = headerHeight + $navBar.outerHeight();
				}
				if ( $( '.left-modern-header .left-modern-sidebar' ).length > 0 ) {
					headerHeight = headerHeight + $( '.left-modern-header .left-modern-sidebar' ).outerHeight();
				}
				return headerHeight;
			}

			// Parent menu active in mega menu
			let $megamenu_el = $( '.header-common-wrapper .megamenu' );
			if ( $megamenu_el.length > 0 ) {
				$megamenu_el.each( function() {
					let activeMenuLength = $( this ).find( '.megamenu-content .current-menu-item' ).length;
					if ( activeMenuLength ) {
						if ( ! $( this ).hasClass( 'current-menu-ancestor' ) ) {
							$( this ).addClass( 'current-menu-ancestor' );
						}
					}
				});
			}

			// Open menu on hover
			let $nave_el = $( 'nav' );
			$( document ).on( 'mouseenter touchstart', '.dropdown', function( e ) {
				let $elThis = $( this );
				var colorAttr = $( this ).attr( 'data-bs-color' ); // Get the data-bs-color attribute
				$elThis.addClass( 'open' );

				if ( $elThis.hasClass( 'full-width-megamenu open' ) ) {
					$nave_el.addClass( 'full-megamenu-open' );
					if ( colorAttr ) {
						$nave_el.css( 'background-color', colorAttr );
					}
				}
				
				if ( $elThis.hasClass( 'open' ) && getWindowWidth() > tabletBreakPoint  ) {
					$elThis.find( '.dropdown-menu' ).removeClass( 'show' );
				}
				
				$elThis.siblings( '.dropdown' ).removeClass( 'open' );
				if ( getWindowWidth() >= tabletBreakPoint ) {
					menuPosition( $elThis );
					if ( $( e.target ).siblings( '.dropdown-menu' ).length > 0 ) {
						e.preventDefault();
					}
				}
			}).on( 'mouseleave', '.dropdown', function() {
				let $elThis = $( this );
				$elThis.removeClass( 'menu-left open' );
				$nave_el.removeClass( 'full-megamenu-open' );
				$nave_el.css( 'background-color', '' );
			});

			//Navbar collapse classic menu event
			$( '[data-mobile-nav-style="classic"] .navbar-collapse.collapse' ).on( 'show.bs.collapse', function() {
				let $elThis = $( this );
				if ( ! $body.hasClass( 'navbar-collapse-show' ) ) {
					$body.addClass( 'navbar-collapse-show' );
					$html.addClass( 'overflow-hidden' );
				}

				setTimeout( function() {
					let elementorContainerLeft = $elThis.offset().left;
					$elThis.css( 'left', -( elementorContainerLeft ) );

					if ( ! $body.hasClass( 'navbar-collapse-show-after' ) ) {
						$body.addClass( 'navbar-collapse-show-after' );
					}
				}, 100 );

				if ( getWindowWidth() <= tabletBreakPoint ) {
					var windowHeight = getWindowHeight(),
						headerHeight = getHeaderHeight();
					$( 'header .navbar-collapse' ).css( 'max-height', windowHeight - headerHeight );
				}
			}).on( 'hide.bs.collapse', function() {
				let $elThis = $( this );
				if ( $body.hasClass( 'navbar-collapse-show' ) ) {
					$body.removeClass( 'navbar-collapse-show' );
					$html.removeClass( 'overflow-hidden' );
					setTimeout( function() {
						$elThis.css( 'left', '' );
					}, 400 );
				}

				setTimeout( function() {
					if ( $body.hasClass( 'navbar-collapse-show-after' ) ) {
						$body.removeClass( 'navbar-collapse-show-after' );
					}
				}, 500 );
			});

			let navbarWidgetNavbar = $( '.header-common-wrapper.standard .elementor-widget-crafto-mega-menu .navbar-collapse' );
			let mobileNavStyle     = $( 'body' ).attr( 'data-mobile-nav-style' );

			//mobile navigation classic style
			mobileClassicNavigation();
			function mobileClassicNavigation() {
				let Window_width = $(window).width();
				if ( Window_width <= tabletBreakPoint ) {
					if ( 'classic' === mobileNavStyle ) {
						$( '.elementor-widget-crafto-mega-menu .navbar-collapse' ).css( 'width', Window_width + 'px' );
					}
					if ( 'classic' === mobileNavStyle && navbarWidgetNavbar.length > 1 && ! $( '.navbar-nav-clone' ).length > 0 ) {
						navbarWidgetNavbar.first().find( '.navbar-nav' ).clone( false ).addClass( 'navbar-nav-clone' ).insertBefore( navbarWidgetNavbar.last().find( '.navbar-nav' ) );
						navbarWidgetNavbar.last().addClass( 'navbar-collapse-clone' );
					}
				} else {
					setTimeout( function() {
						$( '.elementor-widget-crafto-mega-menu .navbar-collapse' ).css( { width: '', left: '' } );
					}, 400 );
					if ( 'classic' === mobileNavStyle && navbarWidgetNavbar.length > 1 && $( '.navbar-nav-clone' ).length > 0 ) {
						navbarWidgetNavbar.last().removeClass( 'navbar-collapse-clone' );
						navbarWidgetNavbar.last().find( '.navbar-nav-clone' ).remove();	
					}
				}
			}


			function getTopSpaceHeaderHeight() {
				let mini_header_height = 0,
					main_header_height = 0,
					wpadminbarHeight   = 0,
					ts_height          = 0;

				if ( $wpadminbar.length > 0 ) {
					wpadminbarHeight = $wpadminbar.outerHeight();
					wpadminbarHeight = Math.round( wpadminbarHeight );
					ts_height        = ts_height + wpadminbarHeight;
				}

				if ( $miniHeaderWrapper.length > 0 ) {
					let mini_header_object = $miniHeaderWrapper;
						mini_header_height = mini_header_object.outerHeight();
						ts_height          = ts_height + mini_header_height;
				}

				if ( $HeaderWrapper.length > 0 ) {
					let main_header_object = $HeaderWrapper;
					    main_header_height = main_header_object.outerHeight();
					    ts_height          = ts_height + main_header_height;
				}

				return ts_height;
			}

			// Define varibale
			let simpleDropdown = 0,
				linkDropdown   = 0;
			function menuPosition( element ) {
				var windowWidth = getWindowWidth();
				if ( element.hasClass( 'simple-dropdown' ) ) {
					    simpleDropdown = element;
					    linkDropdown   = element.find( 'a.nav-link' );

					let menuSpacing      = 30,
					    menuLeftPosition = element.offset().left,
					    menuWidth        = element.children( '.dropdown-menu' ).outerWidth(),
					    menuDropdownCSS  = ( windowWidth - menuSpacing ) - ( menuLeftPosition + menuWidth );

					if ( menuDropdownCSS < 0 ) {
						element.children( '.dropdown-menu' ).css( 'left', menuDropdownCSS );
					}
				}

				if ( element.parent().hasClass( 'dropdown-menu' ) && element.parents( '.simple-dropdown' ) ) {
					let dropdownWidth          = 0,
					    maxValueInArray        = 0,
					    lastValue              = 0,
					    multiDepth             = 0,
					    linkDropdownouterWidth = 0;

						if ( linkDropdown.length > 0 ) {
							linkDropdownouterWidth = linkDropdown.outerWidth();
						}

					dropdownWidth = element.outerWidth() - linkDropdownouterWidth;
					element.find( '.dropdown-menu' ).each( function() {
						let arr = [];
						if ( element.find( 'li' ).hasClass( 'dropdown' ) ) {
							dropdownWidth = dropdownWidth + element.outerWidth();
							element.find( 'li.dropdown' ).each( function() {
								let dropdownMenu = element.closest( '.dropdown-menu' );
								arr.push( dropdownMenu.outerWidth() );getHeaderHeight
							});
							maxValueInArray = lastValue + Math.max.apply( Math, arr );
							lastValue       = maxValueInArray;
							dropdownWidth   = dropdownWidth + maxValueInArray;
							multiDepth      = multiDepth + 1;
						} else if ( multiDepth < 1 ) {
							dropdownWidth = dropdownWidth + element.outerWidth();
						}
					});

					let menuRightPosition = windowWidth - ( simpleDropdown.offset().left + simpleDropdown.outerWidth() );
					if ( dropdownWidth > menuRightPosition ) {
						if ( element.find( '.dropdown-menu' ).length > 0 ) {
							var menuTopPosition = element.position().top,
								submenuObj      = element.find( '.dropdown-menu' ),
								submenuHeight   = submenuObj.outerHeight(),
								totalHeight     = menuTopPosition + submenuHeight + getTopSpaceHeaderHeight(),
								windowHeight    = getWindowHeight();
							
							if ( totalHeight > windowHeight ) {
								submenuObj.css( 'top', '-' + ( totalHeight - windowHeight ) + 'px' );
							}
						}
						element.addClass( 'menu-left' );
					}
				}
			}

			// Bootstrap dropdown toggle.
			navbarDropdown();
			function navbarDropdown() {
				let $dropdownToggle      = $( '.dropdown-toggle' );
				let $dropdownToggleClone = $( '.dropdown-toggle-clone' );
				if ( $( '.navbar-modern-inner' ).length > 0 ) {
					if ( $dropdownToggleClone.length > 0 && $.isFunction( window.dropdown ) ) {
						$dropdownToggleClone.dropdown();
					}
				} else {
					if ( $dropdownToggle.length > 0 && $.isFunction( window.dropdown ) ) {
						$dropdownToggle.dropdown();
					}
				}
			}

			// Close all menu
			let $navbarCollapse = $( '.navbar-collapse' );
			if ( $navbarCollapse.hasClass( 'show' ) ) {
				$navbarCollapse.collapse( 'hide' ).removeClass( 'show' );
			}

			if ( $body.hasClass( 'navbar-collapse-show' ) ) {
				$body.removeClass( 'navbar-collapse-show' );
			}

			setTimeout( function() {
				if ( $body.hasClass( 'navbar-collapse-show-after' ) ) {
					$body.removeClass( 'navbar-collapse-show-after' );
				}
				$navbarCollapse.css( 'left', '' );
			}, 500 );

			$window.on( 'orientationchange', function( e ) {
				$( 'html, body' ).removeClass( 'show-menu' );
			});
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
