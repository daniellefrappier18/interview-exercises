/**
  * Author: Mark Eldridge - Nov 2018
  *
  * Instantiate using:
  *       var $ssnInput = $("input.ssnTextBox"); // Select your input box.
  *       $ssnInput.maskSSN();   // Apply the plugin.  Masking is on by default.
  *
  * Interact with this jQuery plugin using the extended functions:
  *     $ssnInput.toggleMask() - if on, turns off, if off, turns on.
  *     $ssnInput.mask() - if masking is off, it will turn on masking.
  *     $ssnInput.unmask() - if masking is on, it will turn off masking.
  * 	$ssnInput.getSSN() - Returns the plain text SSN from the data tag on this element.
  *     $ssnInput.setSSN() - sets the data tag for the element, and formats it according to current mask setting.
  *     $ssnInput.getUnmaskedSSN() - returns the masked data tag.
  *
  * How this works:
  *      The text input element you apply the plugin to is not the actual source of the data. 
  *      It acts as a display box for the data which is held in a data tag on the text box element.
  *      All keystrokes are trapped, and applied against the data in the tag, then the tag data is formatted 
  *      and the formatted string is pushed into the input box.  The cursor is then set to the appropriate
  *      position based on the action taken.  
  * Supports backspace, delete, moving the cursor around.
  * Does NOT support:  Highlighting with a mouse.  Too complex.
  *  
  **/
  
(function ( $ ) {
	// Allow for multiple elements to be selected and having the plugin applied.
    if (this.length > 1){
        this.each(function() { $(this).maskSSN(options) });
        return this;
    }
	
	// The Plugin:
	$.fn.maskSSN = function (options) {
		var $self = $(this); // The single text input, to which this plugin is applied.
		var self = this;	 // Used to access this instance's public/private methods.
		
		// These are the defaults, which may be passed.
		var settings = $.extend({
			maskCharacter: "X",
			mask: true 
		}, options );
				
		/**********************************
		 *  Public Plugin Methods: 
		 *
		 *********************************/
		
		// Toggles between mask and unmask
		self.toggleMask = function() {
			settings.masked = !settings.masked;
			$self.val(formatSSN(self.getSSN(), settings.masked));
		};
		
		// Turns on masking (default on instantiation is that masking is enabled)
		self.mask = function() {
			settings.masked = true;
			$self.val(formatSSN(self.getSSN(), settings.masked));		
		};
		
		// Turns off masking, and allows editing of the formatted plaintext SSN
		self.unmask = function() {
			settings.masked = false;
			$self.val(formatSSN(self.getSSN(), settings.masked));		
		};
		
		// Returns the SSN to the caller.
		self.getSSN = function() {
			var value = "";
			if ($self.data("ssn")) {
				value = $self.data("ssn").plain;
			}
			return value; 
		};
		
		// Sets the SSN, and displays it as masked if masking is on, formatted plaintext if not.
		self.setSSN = function(plainSSN) {
			$self.data("ssn", {plain: plainSSN});
			$self.val(formatSSN(self.getSSN(), settings.masked));
		};
		
		// Allows the caller to acquire the masked formatted string.
		self.getMaskedSSN = function() {
			return formatSSN(self.getSSN(), true);
		};
		
		// Allows the caller to acquire the formatted string.
		self.getFormattedSSN = function() {
			return formatSSN(self.getSSN(), false);
		};
		
		/**
		 * PRIVATE METHODS:
		 **/
		// Private method for formatting the SSN, either with a mask or without:
		var formatSSN = function(unmaskedSSN) {
			var len = unmaskedSSN.length;
			// Condensed IF Statement:
			var stars = len>0?len>1?len>2?len>3?len>4?'XXX-XX-':'XXX-X':'XXX-':'XX':'X'
				:'';		
			stars = stars.replace(/X/gi, settings.maskCharacter);
			if (settings.masked === false) {
				// Condensed IF statement:
				stars = len>0?len>1?len>2?len>3?len>4?
						 unmaskedSSN.substring(0,3).concat('-').concat(unmaskedSSN.substring(3,5)).concat('-')
						:unmaskedSSN.substring(0,3).concat('-').concat(unmaskedSSN.substring(3,5))
						:unmaskedSSN.substring(0,3):unmaskedSSN.substring(0,2):unmaskedSSN.substring(0,1):'';		
			}
			if (unmaskedSSN.length >= 5) {
				return stars + unmaskedSSN.substring(5);
			} else {
				return stars;
			}
		}
		
		
		/**********************************
		 *  Plugin Functionality: 
		 *********************************/  
		 
		 
		/**
		 *	Prevent Highlighting:
		 */ 
		$self.attr('maxlength', 11).on('selectstart', false).css('user-select', 'none');	
		$self.select(function(e) {
			if (e.target.selectionStart != e.target.selectionEnd) {
				e.target.selectionStart = e.target.selectionEnd;
			}
		});	
		
		/**
		 *	Handles only the backspace & delete keys:
		 */ 
		$self.keydown(function(e) {
			var key = e.keyCode || e.charCode;
			if( key === 8) {
				// Backspace button action to take:
				var cursorPosition = e.target.selectionStart;

				// Correct position if at a dash when hitting backspace:
				if (cursorPosition === 4 || cursorPosition === 7) {
					cursorPosition--;
					e.target.selectionStart = cursorPosition;
					e.target.selectionEnd = cursorPosition;					
				}
				// Backspace calculation, based on real position in the data.
				if (cursorPosition >= 1) {
					var dataPosition = cursorPosition;
					if (cursorPosition >= 4) { 
						dataPosition = dataPosition - 1;
					}
					if (cursorPosition >= 7) { 
						dataPosition = dataPosition - 1;
					}
					var str = self.getSSN();
					self.setSSN(str.slice(0, dataPosition-1) + str.slice(dataPosition));
					
					cursorPosition--;
					if (cursorPosition === 4 || cursorPosition === 7) {
						cursorPosition--;
					}
					e.target.selectionStart = cursorPosition;
					e.target.selectionEnd = cursorPosition;
				}
				e.preventDefault();
			} else if (key === 46) {
				// Delete button action to take:
				var cursorPosition = e.target.selectionStart;
				if (cursorPosition <= $self.val().length-1) {
					var dataPosition = cursorPosition;
					if (cursorPosition >= 4) { 
						dataPosition = dataPosition - 1;
					}
					if (cursorPosition >= 7) { 
						dataPosition = dataPosition - 1;
					}
					var str = self.getSSN();
					self.setSSN(str.slice(0, dataPosition) + str.slice(dataPosition+1));
					
					e.target.selectionStart = cursorPosition;
					e.target.selectionEnd = cursorPosition;
				}
				e.preventDefault();
			}
		});

		/**
		 *	Handles all other inputs except backspace and delete:
		 */ 
		$self.keypress(function(e) {
			// Convert input to integer.
			var strKeyPressed = String.fromCharCode(e.keyCode);
			var intKeyPressed = parseInt(strKeyPressed);				
			var unmaskedValue = self.getSSN();

			// Initialize unmasked value to existing unmasked string or "";
			if (unmaskedValue == undefined) {
				unmaskedValue = "";
			}
			
			// Handle numeric only inputs
			var maskedValue = $self.val();
			
			// Check if masked value completely deleted:
			if (maskedValue.length = 0) {
				self.setSSN("");
			}
			// Check if masked value has reached formatted length maximum:
			if (maskedValue.length === 11) {
				e.preventDefault();
				return;
			}


			// If the key pressed was a number:
			if (isNaN(intKeyPressed) === false) {
				var cursorPosition = e.target.selectionStart;
				if (cursorPosition <= $self.val().length-1) {
					
					// Correct position if at a dash when inserting numbers:
					if (cursorPosition === 3 || cursorPosition === 6) {
						cursorPosition++;
						e.target.selectionStart = cursorPosition;
						e.target.selectionEnd = cursorPosition;					
					}
					// execute the character insert in the data string, at the same position as the cursor:
					var dataPosition = cursorPosition;
					if (cursorPosition >= 4) { 
						dataPosition = dataPosition - 1;
					}
					if (cursorPosition >= 7) { 
						dataPosition = dataPosition - 1;
					}
					var str = self.getSSN();
					self.setSSN(str.slice(0, dataPosition) + strKeyPressed + str.slice(dataPosition));
					
					cursorPosition++;
					if (cursorPosition === 3 || cursorPosition === 6) {
						cursorPosition++;
					}
					e.target.selectionStart = cursorPosition;
					e.target.selectionEnd = cursorPosition;
				} else {
					unmaskedValue = self.getSSN();
					if (unmaskedValue.length < 9) {
						self.setSSN(unmaskedValue.concat(strKeyPressed));
					}		
				}
			}
			e.preventDefault();
		});
		
		return this;
	}
}( jQuery ));