( function( $ ) {
 
	"use strict";

	const $window = $( window );

	let CraftoAddonsInit = {
		settings: {
			selectors: {
				paragraph: 'p:first',
			},
			classes: {
				dropCap: 'elementor-drop-cap',
				dropCapLetter: 'elementor-drop-cap-letter',
			},
		},
		init: function() {
			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy ) {
				if ( typeof elementorFrontend === 'undefined' ) {
					return;
				}
			}

			if ( typeof CraftoMain !== 'undefined' && '1' === CraftoMain.craftoDelay && 'delay' === CraftoMain.craftoLoadStrategy && ! elementorFrontend.isEditMode() ) {
				const widgets = [
					'.elementor-widget-crafto-text-editor',
				];

				widgets.forEach( element => {
					if ( $( element ).length > 0 ) {
						CraftoAddonsInit.textEditorInit( $( element ) );
					}
				});
			} else {
				const widgets = [
					'crafto-text-editor.default',
				];

				widgets.forEach( hook => {
					elementorFrontend.hooks.addAction( `frontend/element_ready/${hook}`, CraftoAddonsInit.textEditorInit );
				});
			}
		},
		textEditorInit: function( $scope ) {
			$scope.each( function() {
				var $scope = $( this );

				const selectors  = CraftoAddonsInit.settings.selectors;
				const classes    = CraftoAddonsInit.settings.classes;
				const $paragraph = $scope.find( selectors.paragraph );

				if ( ! $paragraph.length ) {
					return;
				}

				const $dropCap       = $( '<span>', { class: classes.dropCap } );
				const $dropCapLetter = $( '<span>', { class: classes.dropCapLetter } );
				$dropCap.append( $dropCapLetter );

				const paragraphContent = $paragraph.html().replace( /&nbsp;/g, ' ' );
				const firstLetterMatch = paragraphContent.match( /^ *([^ ] ?)/ );

				if ( ! firstLetterMatch ) {
					return;
				}

				const firstLetter        = firstLetterMatch[ 1 ];
				const trimmedFirstLetter = firstLetter.trim();

				if ( '<' === trimmedFirstLetter ) {
					return;
				}

				$dropCapLetter.text( trimmedFirstLetter );

				const restoredParagraphContent = paragraphContent
					.slice( firstLetter.length )
					.replace( /^ */, ( match ) => {
						return new Array( match.length + 1 ).join( '&nbsp;' );
					} );

				let drop_cap_value = $scope.find( '.elementor-drop-cap-yes' );
				if ( $( drop_cap_value ).length > 0 ) {
					$paragraph.html( restoredParagraphContent ).prepend( $dropCap );
				}
			} );
		},
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
