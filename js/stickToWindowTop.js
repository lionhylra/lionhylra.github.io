/**
 * this jQuery plugin is created by Yilei He, 2015-02-01
 * 
 * 1.Usage: make a element's position fixed and located at top of window when scrolling down.
 *  
 * 2.Precondition: The element's css attribute "position" can't be "fixed".
 *
 * 3.Issue: If the element's margin-top is a percentage, error may occur
 * 
 * 4.How to use: function has to be used in $(window).load(function(){...});
 * $(window).load(function(){
 * 		$('#myid').stickToWindowTop();
 * 		//or
 * 		$('.myclss').stickToWindowTop();
 * });
 *
 *
 * 5.Parameter:
 * 
 * 1)default:
 * $.fn.stickToWindowTop.defaults = {
 * 	isOverlap: false, //by default, elements will not overlap when move to the top of window
 *  fixedTop: 0, //the sposition where the element will be fixed
 *  onstick: jQuery.noop, //the callback function will be called after the element is stick to the top
 *  offstick: jQuery.noop,//callback function, called when element get off window's top border
 *  data: {} //the data that will be passed to both callback function
 * };
 * The above structure could be used in document.ready() to reset the default parameters.
 * And the parameters passed to the function will override the default parameters
 * 
 * 2)examples:
 *  	$('.myclss').stickToWindowTop({
 *  		isOverlap: true,
 *  		fixedTop:50px,
 *  		onstick:function(){alert('success')}
 *  	});
 *
 * 3)passing data to callback function:
 * 		$('.myclss').stickToWindowTop({
 *  		isOverlap: true,
 *  		fixedTop:50px,
 *  		onstick:callback,
 *  		data:{name:'Jim',age:33, obj:new Object()}
 *  	});
 *   	function callback(data){
 *   		var n=data.name;
 *   		var a=data.age;
 *   		$this=$(this);//'this' refers to the element to which the handler function is set
 *   		$this.css('color','red');
 *   	}
 * 4)callback function example:
 * 		
 *		 function callback(data){
 *		    $(this).on('click',function(){
 *		      $('html,body').animate({
 *		        scrollTop:$('#'+$(this).data('placeholderId')).offset().top-parseInt($(this).css('top'))+'px'
 *		      },
 *		      {
 *		      duration: 500,
 *		      easing: "swing"
 *		      });
 *		    });
 *		  }
 *		  function callback2(){
 *		    $(this).off('click');
 *		  }
 *   //These two functions make window scroll to the fixed element's original place.
 * 
 * 6.Other function
 * 	1)$('element').data('isFixed') could be used to determine if the element is fixed. 
 * 	  The value could be true or false.	
 * 	2)$('element').data('placeholderId') could get the element at it's original place.
 * 	  $('#'+$(this).data('placeholderId')).offset().top could get it's original position.
 * 	3)$.fn.unstickToWindowTop() could be called to unbind this effect.
 * 	4)$.fn.restickToWindowTop() could be called to rebind. In case that a element's original
 * 	  offset is changed(other element added or expanded).
*/
(function($) {
	$.fn.stickToWindowTop = function(options) {
		options = $.extend({}, $.fn.stickToWindowTop.defaults, options);
		var fixedTop = parseInt(options.fixedTop);
		var random = Math.floor(Math.random() * 1000 + 1000);
		return this.each(function(index) {
			var $this = $(this);
			if ($this.css('position') == 'fixed') return;
			if ($this.hasClass($this.attr('class') + 'copy')) return;
			var originalProperties = $this.css(['position', 'top', 'left', 'width', 'float', ]);
			var topOnWindow = getTop($this); //this must be done after the window is loaded
			var $clone = $this.clone()
				.addClass($this.attr('class') + 'copy')
				.empty()
				.css(originalProperties)
				.css('visibility', 'hidden');
			if ($this.attr('id')) {
				$clone.attr({
					id: $this.attr('id') + 'copy'
				});
			} else {
				$clone.attr({
					id: (index + random) + 'copy'
				});
			}
			$this.data('placeholderId', $clone.attr('id'));
			$this.data('isFixed', false); //this line ensures the callback function is binded after window is refreshed

			$(window).scroll({
				obj: $this,
				clone: $clone,
				prop: originalProperties,
				top: topOnWindow,
				fixedTop: fixedTop,
				onstick: options.onstick,
				offstick: options.offstick,
				data: options.data
			}, _stickOnScroll);
			if (!options.isOverlap) {
				fixedTop += $this.outerHeight(true);
			}
		});
	};

	$.fn.unstickToWindowTop = function() {
		$(window).off('scroll', _stickOnScroll);
		return this;
	};

	$.fn.restickToWindowTop = function(options) {
		this.unstickToWindowTop().stickToWindowTop(options);
	}

	function _stickOnScroll(event) {
		var $elem = event.data.obj;
		var $clone = event.data.clone;
		var properties = event.data.prop;
		var topOnWindow = event.data.top;
		var fixedTop = event.data.fixedTop;
		var _onstick = event.data.onstick;
		var _offstick = event.data.offstick;
		var data = event.data.data;
		var docScrollTop = $('html').scrollTop() + $('body').scrollTop();
		if (docScrollTop + fixedTop + parseInt($elem.css('margin-top')) > topOnWindow) {
			if ($elem.data('isFixed') === false) {
				$clone.insertAfter($elem);
				$elem.css(properties)
					.css({
						position: 'fixed',
						top: fixedTop
					});
				if ($.isFunction(_onstick)) {
					// _onstick(data);
					_onstick.call($elem[0], data); //this allow callback function could fetch object by "this"
				}
			}
			$elem.data('isFixed', true);
		} else {
			if ($elem.data('isFixed') === true) {
				$elem.css(properties);
				$clone.remove();
				if ($.isFunction(_offstick)) {
					// _offstick(data);
					_offstick.call($elem[0], data);
				}
			}
			$elem.data('isFixed', false);
		}

	}

	//get the the elements's offset relative to window
	function getTop($elem) {
		var offset = $elem.offset().top;
		if ($elem.offsetParent().prop('tagName').toUpperCase() != 'HTML') {
			offset += getTop($elem.offsetParent())
		};
		return offset;
	}


})(jQuery);

$.fn.stickToWindowTop.defaults = {
	isOverlap: false, //by default, elements will not overlap when move to the top of window
	fixedTop: 0, //the sposition where the element will be fixed
	onstick: jQuery.noop, //the callback function will be called after the element is stick to the top
	offstick: jQuery.noop,
	data: {} //the data that will be passed to callback function
};