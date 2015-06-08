$(function(){
	$('.post').hover(function(){
		$(this).find('.overlay').stop().fadeIn(400);
	},
	function(){
		$(this).find('.overlay').stop().fadeOut(200);
	});
});