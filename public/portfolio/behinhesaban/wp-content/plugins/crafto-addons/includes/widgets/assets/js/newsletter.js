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
					'.elementor-widget-crafto-newsletter',
				];
				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.newsletterInit( $( element ) );
					}
				});
			} else {
				elementorFrontend.hooks.addAction( 'frontend/element_ready/crafto-newsletter.default', CraftoAddonsInit.newsletterInit );
			}
		},
		newsletterInit: function newsletterInit( $scope ) {
			const subscribeForm = $( '.crafto-newsletter-form', $scope );

			subscribeForm.each( function() {
				let $elThis        = $( this ),
					messageTimeout = null,
					response       = $elThis.siblings( '.newsletter-response' );
				
				subscribeForm.on( 'submit', function() {
					let error     = false,
						emailVal  = $( '.newsletter-email', $elThis ).val(),
						gdpr_val  = subscribeForm.find( '.newsletter-gdpr' );

					subscribeForm.find( '.required' ).removeClass( 'is-invalid' );

					if ( '' === emailVal || undefined === emailVal ) {
						error = true;
						subscribeForm.find( '.newsletter-email.required' ).addClass( 'is-invalid' );
					}

					if ( gdpr_val.length > 0 && ! gdpr_val.is( ':checked' ) ) {
						error = true;
						subscribeForm.find( '.newsletter-gdpr.required' ).addClass( 'is-invalid' );
					}

					$elThis.addClass( 'form-submitting' );

					$.ajax( {
						type: 'POST',
						url: ( 'undefined' != typeof CraftoFrontend ) ? CraftoFrontend.ajaxurl : '',
						data: {
							'action': 'crafto_add_user_to_mailchimp_list',
							'list_id': $( '.newsletter-list-id', $elThis ).val(),
							'email': $( '.newsletter-email', $elThis ).val(),
							'fname': $( '.newsletter-name', $elThis ).val(),
							'tags': $( '.newsletter-tags', $elThis ).val(),
						},
						complete: function( jqXHR ) {
							$elThis.removeClass( 'form-submitting' );

							if ( ! $( 'input' ).hasClass( 'is-invalid' ) ) {
								response.html( jqXHR.responseText );
							}

							messageTimeout = setTimeout(() => {
								response.html( '' );
								messageTimeout && clearTimeout( messageTimeout );
							}, 7000 );
						},    
						error: function( jqXHR ) {
							console.log( jqXHR.status );
						}
					} );

					return false;
				});

				// Validate required fields on blur
				subscribeForm.find( '.required' ).on( 'blur', function() {
					let $elThis       = $( this );
					const fieldVal    = $elThis.val();
					const isEmail     = $elThis.attr( 'type' ) === 'email';
					const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

					if ( '' === fieldVal || undefined === fieldVal ) {
						$elThis.addClass( 'is-invalid' );
					} else if ( isEmail && ! emailFormat.test( fieldVal ) ) {
						$elThis.addClass( 'is-invalid' );
					} else {
						$elThis.removeClass( 'is-invalid' ).addClass( 'is-valid' );
					}
				});

			});
		}
	};

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
