function addItemToProjectsMenu(url, title){
	var li = $('<li/>').append($('<a/>',{href:url,target:"_blank", text:title}));
	$('#apps_menu').before(li);
}
function addItemToWaterfall(url,thumbnail_url,thumbnail_alt, title, date, content){
	/*
		<div class="thumbnail post">
          	<a href="https://lionhylra.wordpress.com/2015/05/15/k2-training-summary/" target="_blank">
	          	<img src="./img/K2 logo.png" alt="K2">
	            <h4>K2 training summary</h4>  
	            <h6>May 15, 2015</h6>
	            <p class="description">It is so lucky that I could have the chance to get enrolled in K2 training just after stepping into the workplace. Before attending the course, I knew little about K2. ...</p>
	            <div class="overlay"><span>Read more...</span></div>
            </a>  
        </div>
		*/

		var $div = $('<div/>',{class:"thumbnail post"});
		$div.append($('<a/>',{href:url,target:"_blank"}));
		var $a = $($div.find('a')[0]);
		if (thumbnail_url) {
			$a.append($('<img/>',{src:thumbnail_url,alt:thumbnail_alt}));
		};

		$a.append($('<h4/>',{text:title}))
		.append($('<h6/>',{text:date}))
		.append($('<p/>',{text:content}))
		.append($('<div class="overlay"><span>Read more...</span></div>'));

		$('.waterfall_container').append($div).masonry('appended',$div);
}

function wordpress_success(data, textStatus, jqXHR){
	$('#canvasloader-container').hide();
	var postNum = data.found;
	$(data.posts).each(function(index, element){
		var date = new Date(element.date).toLocaleDateString();
		var title = "[Post] "+element.title;
		var URL = element.URL;
		var content = $('<div/>').append($(element.excerpt)).text();
		var thumbnail_URL;
		if (element.post_thumbnail) {
			thumbnail_URL = element.post_thumbnail.URL;
		};
		var slug = element.slug;
		addItemToWaterfall(URL, thumbnail_URL, slug, title, date, content);
	});

	$('.waterfall_container').imagesLoaded()
	.always(function(instance){
      $('.waterfall_container').masonry('layout');
    });
}

function github_success(data, textStatus, jqXHR){
	$(data).each(function(index,element){
		if(element.fork){
			return;
		}
		if (element.name == "lionhylra.github.io") {
			return;
		}
		var date = new Date(element.updated_at).toLocaleDateString();
		addItemToWaterfall(element.html_url, null, null, "[Project] "+element.name, date, element.description);
		addItemToProjectsMenu(element.html_url, element.name);
	});
	var wordpress_url = "https://public-api.wordpress.com/rest/v1.1/sites/lionhylra.wordpress.com/posts/?number=10";
	$.getJSON(wordpress_url,wordpress_success);
}
$(function(){
	var cl = new CanvasLoader('canvasloader-container');
		cl.setShape('spiral'); // default is 'oval'
		cl.setDiameter(45); // default is 40
		cl.setDensity(36); // default is 40
		cl.setRange(0.8); // default is 1.3
		cl.setSpeed(2); // default is 2
		cl.setFPS(60); // default is 24
		cl.show(); // Hidden by default

	var github_url = "https://api.github.com/users/lionhylra/repos";
	$.getJSON(github_url,github_success);
});