var isSideNavOpen = true;

$(function() {
	$("#SideNav").on("click", "a", function(event) {
		event.preventDefault();
	})
	loadDashboard();

	//setting css style
	$("body").css("paddingLeft",$("#SideNav").width());
	$(window).resize();

});


function toggleMenu() {
	var h = $(window).height() - $("#upperPanel").height();
	isSideNavOpen = !isSideNavOpen;
	$("#Menu").stop().toggle("slow");
	if (isSideNavOpen) {
		$("#SideNav").stop().animate({
			height: h
		});
		$("body").stop().animate({
			paddingLeft: $("#SideNav").width()
		});
	} else {
		$("#SideNav").stop().animate({
			height: "100%"
		});
		$("body").stop().animate({
			paddingLeft: 0
		});
	}
	$(this).toggleClass("WrapBtnOpen").toggleClass("WrapBtnClose");
}

$("#WrapBtn").on("click", toggleMenu);

$(window).on("resize", function() {
	var h = $(window).height() - $("#upperPanel").height();
	if (isSideNavOpen) {
		if (h > $("#lowerPanel").height())
			$("#SideNav").css("height", h);
	}

	var w=$(window).width()-$("#SideNav").width()-1;
	$("#SearchBar").css("width",w);

	// $("table#itemList").css("width",$(".addNew").width());
});

$("#Menu li.MenuItem").on("click",function(){
	$("#Menu li.selectedlist").removeClass("selectedlist");
	$(this).addClass("selectedlist");
});

$("#ToolContainer>a").on("click",function(event){
	event.preventDefault();
	$("#ToolContainer>a.selected").removeClass("selected");
	$(this).addClass("selected");
});

function showLoading(id){
	$("#"+id).html("<div id='"+id+"-canvasloader-container"+"'></div>");
	var cl = new CanvasLoader(id+'-canvasloader-container');
	cl.setDiameter(40); // default is 40
	cl.setDensity(52); // default is 40
	cl.setRange(0.5); // default is 1.3
	cl.setSpeed(4); // default is 2
	cl.setFPS(19); // default is 24
	cl.show(); // Hidden by default
}
function loadMarketplace(){
	showLoading("MainPanel");
	showLoading("Menu");
	$("#MainPanel").load("marketplace.html #Marketplace");
	$("#Menu").load("marketplace.html #MenuItems");
}
function loadDashboard(){
	showLoading("MainPanel");
	showLoading("Menu");
	$("#MainPanel").load("dashboard.html #Dashboard");
	$("#Menu").load("dashboard.html #MenuItems");
}

$("#NavToMarketplace").on("click",loadMarketplace);

$("#NavToDashboard").on("click",loadDashboard);