( function( $ ) {

	"use strict";

	const $window   = $( window );
	const $document = $( document );

	let CraftoAddonsInit = {
		init: function init() {
			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy ) {
				if ( typeof elementorFrontend === 'undefined' ) {
					return;
				}
			}

			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy && ! elementorFrontend.isEditMode() ) {
				const widgets = [
					'.elementor-widget-crafto-blog-list',
					'.elementor-widget-crafto-archive-blog',
					'.elementor-widget-crafto-loop-builder',
				];

				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.blogListInit( $( element ) );
					}
				});
			} else {
				const widgets = [
					'crafto-blog-list.default',
					'crafto-archive-blog.default',
					'crafto-loop-builder.default',
				];

				widgets.forEach( hook => {
					elementorFrontend.hooks.addAction( `frontend/element_ready/${hook}`, CraftoAddonsInit.blogListInit );
				});
			}
		},
		blogListInit: function( $scope ) {
			$scope.each( function() {
				var $scope                 = $( this );
				let	blog_list_grid         = $scope.find( '.crafto-blog-list' );
				let	element_data_id        = $scope.attr( 'data-id' );
				let	blog_settings          = blog_list_grid.data( 'blog-settings' ) || {};
				let	blog_pagination_type   = blog_settings.pagination_type;
				let	blog_masonry_id        = $( '.elementor-element-' + element_data_id + ' .crafto-blog-list' );
				let donationProgressbar    = $scope.find( '.donation-progress-bar' );

				if ( donationProgressbar.length > 0 ) {
					const observer = new IntersectionObserver( entries => {
						entries.forEach( entry => {
							if ( entry.isIntersecting ) {
								const $donationProgressbar = $( entry.target );
								$donationProgressbar.css( 'width', $donationProgressbar.data( 'max' ) + '%' );
								observer.unobserve( entry.target );
							}
						});
					}, { threshold: 0 } );
				
					donationProgressbar.each( function() {
						observer.observe( this );
					});
				}
				
				if ( blog_masonry_id.length > 0 && blog_masonry_id.hasClass( 'grid-masonry' ) && 'undefined' != typeof CraftoMain && $.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 && $.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 ) {
					blog_masonry_id.imagesLoaded( function() {
						blog_masonry_id.removeClass( 'grid-loading' );
						blog_masonry_id.isotope( {
							layoutMode: 'masonry',
							itemSelector: '.grid-item',
							percentPosition: true,
							stagger: 0,
							masonry: {
								columnWidth: '.grid-sizer'
							}
						});

						blog_masonry_id.isotope();

						setTimeout( function() {
							blog_masonry_id.isotope();
						}, 500 );

						blog_list_animation( blog_masonry_id );
					});
				} else {
					blog_masonry_id.removeClass( 'grid-loading' );
					blog_masonry_id.find( '.grid-item' ).removeClass( 'crafto-animated elementor-invisible' );
				}

				let hidedefault       = true;
				const $elActiveFilter = $( '.blog-grid-filter > li.active > span' );
				if ( $elActiveFilter.length > 0 ) {
					$elActiveFilter.each( function() {
						const selector = $( this ).data( 'filter' );
						if ( '*' != selector ) {
							hidedefault = false;
						}
					});

					default_selector( hidedefault );
				}

				const grid_selectors = $scope.find( '.blog-grid-filter > li > span' );
				grid_selectors.on( 'click', function() {
					var selector = $( this ).data( 'filter' ),
						_parent  = $( this ).parent();

					let $elCraftoAnimated = $( selector ).parent().find( '.crafto-animated' );

					if ( blog_list_grid.hasClass( 'grid-masonry' ) ) {

						$elCraftoAnimated.removeAttr( 'data-animation data-animation-delay' ).removeClass( 'crafto-animated animated fadeIn elementor-invisible' );
						
						grid_selectors.parent().removeClass( 'active' );
						
						_parent.addClass( 'active' );
					
						if ( ( 'undefined' != typeof CraftoMain ) && $.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 ) {
							blog_list_grid.isotope( {
								filter: selector
							} );
						}

						CraftoAddonsInit.AnimationonFilterOnClick();

						return false;
					} else {
						if ( '*' != selector ) {
							blog_list_grid.find( '.grid-item' ).css( 'display', 'none' );
							blog_list_grid.find( selector ).css( 'display', 'block' );
							$( this ).parents( '.nav-tabs' ).find( '.active' ).removeClass( 'active' );
							_parent.addClass( 'active' );
						} else {
							blog_list_grid.find( '.grid-item' ).css( 'display', 'block' );
							$( this ).parents( '.nav-tabs' ).find( '.active' ).removeClass( 'active' );
							_parent.addClass( 'active' );
						}
					}
				} );

				let	blog_side_image = $scope.find( '.blog-side-image' );
				if ( blog_side_image.length > 0 ) {
					blog_list_animation( blog_side_image );
				}

				function default_selector() {
					if ( ( 'undefined' != typeof CraftoMain ) && $.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 ) {
						let $elGridFilter = $( '.blog-grid-filter' );
						$elGridFilter.each( function() {
							let blog_filter    = $scope.find( $( $( this ).find( 'li.active span' ).attr( 'data-filter' ) ) );
							let blog_unique_id = $scope.find( $( '.crafto-blog-list' ) );

							if ( blog_unique_id.length > 0 && blog_unique_id.hasClass( 'grid-masonry' ) ) {
								blog_unique_id.isotope( {
									layoutMode: 'masonry',
									itemSelector: '.grid-item',
									percentPosition: true,
									masonry: {
										columnWidth: '.grid-sizer'
									},
									filter: blog_filter
								} );

								blog_list_animation( blog_filter );
							} else {
								blog_unique_id.find( '.grid-item' ).removeClass( 'crafto-animated elementor-invisible' );
							}
						});
					}
				}

				function blog_list_animation( target ) {
					const _element = target.find( '.crafto-animated' );
					if ( _element.length > 0 ) {
						let observer = new IntersectionObserver( function( entries ) {
							entries.forEach( function( entry ) {
								if ( entry.isIntersecting ) {
									let _this              = $( entry.target );
									let dataAnimation      = _this.attr( 'data-animation' ) || '';
									let dataAnimationDelay = _this.attr( 'data-animation-delay' ) || 0;

									if ( dataAnimation === '' || dataAnimation === 'none' ) {
										_this.removeClass( 'elementor-invisible' );
									} else {
										setTimeout( function() {
											_this.removeClass( 'elementor-invisible' ).addClass( 'animated ' + dataAnimation );
										}, dataAnimationDelay );
									}

									observer.unobserve( entry.target );
								}
							});
						}, { threshold: 0.1 } );

						_element.each( function() {
							observer.observe( this );
						});
					}
				}

				// For post format
				let	blog_post_gallery_grid = blog_list_grid.find( '.blog-post-gallery-grid' );
				if ( blog_post_gallery_grid.length > 0 && ( 'undefined' != typeof CraftoMain ) && $.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 && $.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 ) {
					blog_post_gallery_grid.each( function() {
						blog_post_gallery_grid.imagesLoaded( function() {
							blog_post_gallery_grid.isotope( {
								layoutMode: 'masonry',
								itemSelector: '.grid-gallery-item',
								percentPosition: true,
								masonry: {
									columnWidth: '.grid-gallery-sizer'
								}
							});
							blog_post_gallery_grid.isotope();
						});

						setTimeout( function() {
							blog_post_gallery_grid.isotope();
						}, 500 );
					});
				}

				// For post slider
				let	post_format_slider = blog_list_grid.find( '.post-format-slider' );
				if ( post_format_slider.length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'swiper', CraftoMain.disable_scripts ) < 0 ) {
					post_format_slider.each( function() {
						var post_format_slider = new Swiper( $( this ), {
							slidesPerView: 1,
							spaceBetween: 30,
							keyboard: {
								enabled: true,
								onlyInViewport: true
							},
							loop: true,
							pagination: {
								el: '.swiper-pagination',
								clickable: true,
							},
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},
						});
					});
				}

				// For fit videos
				const $elFitVideos = $( '.fit-videos' );
				if ( $elFitVideos.length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'fitvids', CraftoMain.disable_scripts ) < 0  && $.fn.fitVids ) {
					$elFitVideos.fitVids();
				}

				// For infiniteScroll
				var $bloginfinite;
				let blog_grid_id 	     = blog_masonry_id.parents( '.elementor-widget' ).data( 'id' ),
					elementorElement     = '.elementor-element-' + blog_grid_id,
					el_grid_item         = elementorElement + ' .grid-item',
					el_navigation        = elementorElement + ' .post-infinite-scroll-pagination',
					el_navigation_anchor = elementorElement + ' .post-infinite-scroll-pagination a';

				if ( $( el_navigation_anchor ).length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 && $.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 && $.inArray( 'infinite-scroll', CraftoMain.disable_scripts ) < 0 ) {
					if ( 'load-more-pagination' === blog_pagination_type ) {
						$bloginfinite = blog_masonry_id.infiniteScroll( {
							path: el_navigation_anchor,
							history: false,
							navSelector: el_navigation,
							contentSelector: el_navigation,
							append: el_grid_item,
							status: '.page-load-status',
							scrollThreshold: false,
							loadOnScroll: false,
							button: '.view-more-button',
						});
					} else {
						$bloginfinite = blog_masonry_id.infiniteScroll( {
							path: el_navigation_anchor,
							history: false,
							navSelector: el_navigation,
							contentSelector: el_navigation,
							append: el_grid_item,
							status: '.page-load-status',
							scrollThreshold: 100,
							loadOnScroll: true,
						});
					}
					
					$bloginfinite.on( 'append.infiniteScroll', function( event, response, path, items ) {
						var $newblogpost = $( items );
						$newblogpost.imagesLoaded( function() {
							if ( blog_masonry_id.hasClass( 'grid-masonry' ) ) {
								blog_masonry_id.isotope( 'appended', $newblogpost );
								blog_masonry_id.isotope( 'layout' );

							} else {
								blog_masonry_id.append( $newblogpost );
							}

							blog_list_animation( blog_masonry_id );

							if ( $elFitVideos.length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'fitvids', CraftoMain.disable_scripts ) < 0 && $.fn.fitVids ) {
								$elFitVideos.fitVids();
							}
						});
					});

					const $elPageLoadStatus = $( '.page-load-status' );
					$bloginfinite.on( 'last.infiniteScroll', function( event, response, path ) {
						$elPageLoadStatus.hide();
						setTimeout( function() {
							$elPageLoadStatus.show();
						}, 500 );
						setTimeout( function() { 
							$elPageLoadStatus.hide();
						}, 2500 );
					});
				}
			});

			// Post like/dislike button.
			$document.off( 'click', '.sl-button' ).on( 'click', '.sl-button', function( e ) {
				e.preventDefault();
				var button    = $( this ),
					post_id   = button.attr( 'data-post-id' ),
					security  = button.attr( 'data-nonce' ),
					iscomment = button.attr( 'data-iscomment' );

				var allbuttons;
				if ( '1' === iscomment ) {
					allbuttons = $( '.sl-comment-button-' + post_id );
				} else {
					allbuttons = $( '.sl-button-' + post_id );
				}

				var loader = allbuttons.next( '#sl-loader' );
				if ( '' !== post_id ) {
					$.ajax( {
						type: 'POST',
						url: ( 'undefined' != typeof CraftoFrontend ) ? CraftoFrontend.ajaxurl : '',
						data : {
							action : 'process_simple_like',
							post_id : post_id,
							nonce : security,
							is_comment : iscomment
						},
						success: function( response ) {
							var icon  = response.icon,
								count = response.count;
								allbuttons.html( icon + count );

							if ( 'undefined' != typeof CraftoFrontend ) {
								if ( 'unliked' === response.status ) {
									var like_text = CraftoFrontend.i18n.likeText;
										allbuttons.prop( 'title', like_text ).removeClass( 'liked' );
								} else {
									var unlike_text = CraftoFrontend.i18n.unlikeText;
										allbuttons.prop( 'title', unlike_text ).addClass( 'liked' );
								}
							}

							loader.empty();
						}
					});
				}
				return false;
			});

			// Hover Effect
			$document.on( 'mouseenter', '.blog-simple .blog-post, .blog-modern .blog-post', function() {
				$( this ).find( '.hover-text' ).slideDown( 400 );
			}).on( 'mouseleave', '.blog-simple .blog-post, .blog-modern .blog-post', function() {
				$( this ).find( '.hover-text' ).slideUp( 400 );
			});

			if ( $( '.swiper.post-format-slider' ).length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'swiper', CraftoMain.disable_scripts ) < 0 ) {
				var swiper = new Swiper( '.swiper.post-format-slider', {
					loop : true,
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
				});
			}
		},
		AnimationonFilterOnClick: function() {
			let $elementorInvisible = $( '.elementor-invisible' );
			if ( $elementorInvisible.length > 0 ) {
				$elementorInvisible.each( function() {
					let _self = $( this );
					if ( ! _self.hasClass( 'animated' ) ) {
						_self.removeClass( 'elementor-invisible' ).addClass( 'crafto-elementor-visible' );
					}
				});
			}

			if ( 'undefined' != typeof CraftoMain && $.inArray( 'appear', CraftoMain.disable_scripts ) < 0 ) {
				$( '.crafto-elementor-visible' ).appear();
			}

			$( '.crafto-elementor-visible' ).on( 'appear', function( event, $all_appeared_elements ) {
				var _this        = $( this ),
					datasettings = {};

				if ( _this.attr( 'data-settings' ) ) {
					var datasettings = $.parseJSON( _this.attr( 'data-settings' ) );
				}

				if ( _this.hasClass( 'elementor-column' ) || _this.hasClass( 'elementor-section' ) ) {
					var dataAnimation      = datasettings['animation'];
					var dataAnimationDelay = datasettings['animation_delay'];
				}

				if ( _this.hasClass( 'elementor-widget' ) ) {
					var dataAnimation      = datasettings['_animation'];
					var dataAnimationDelay = datasettings['_animation_delay'];
				}

				if ( 'undefined' === typeof( dataAnimation ) ) {
					dataAnimation = 'none';
				}

				if ( 'undefined' === typeof( dataAnimationDelay ) || '' === dataAnimationDelay ) {
					dataAnimationDelay = 100;
				}

				if ( '' === dataAnimation || 'none' === dataAnimation ) {
					_this.removeClass( 'elementor-invisible' );
					return;
				}

				if ( _this.hasClass( 'crafto-elementor-visible' ) ) {
					setTimeout( function() {
						_this.removeClass( 'crafto-elementor-visible' ).addClass( 'animated ' + dataAnimation );
					}, dataAnimationDelay );
				}
			});
		},
	}

	// // If Elementor is already initialized, manually trigger
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
