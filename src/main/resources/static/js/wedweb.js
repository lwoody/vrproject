/**
 * 
 */
$(document).ready(function() {
	
//	var HOME_PATH = window.HOME_PATH || '.';
	
	var mapOptions = {
	    center: new naver.maps.LatLng(37.5230775, 127.0560914),
	    zoom: 12
	};
		
	var map = new naver.maps.Map(document.getElementById('map'), mapOptions);
	
	var marker = new naver.maps.Marker({
	    position: new naver.maps.LatLng(37.5230775, 127.0560914),
	    map: map,
	    icon: {
	        url: '/images/hearticon.png',
	        size: new naver.maps.Size(50, 50),
	        origin: new naver.maps.Point(0, 0),
	        anchor: new naver.maps.Point(25, 26)
	    },
	    animation: naver.maps.Animation.BOUNCE
	});
	
	naver.maps.Event.addListener(marker, 'click', function(e) {
		var overlay = e.overlay, // marker
		position = overlay.getPosition(),
		url = 'http://map.naver.com/index.nhn?enc=utf8&level=2&lng='+ position.lng() +'&lat='+ position.lat() +'&pinTitle=더발렌티청담&pinType=SITE';
		window.open(url);
	});
	
//	var contentString = [
//        '<div class="w3-round">',
//        '   <p><h10>  더발렌티청담  </h10></p>',
//        '</div>'
//    ].join('');

	var infowindow = new naver.maps.InfoWindow({
//		content: contentString
		content: '<div style="width:150px;text-align:center;padding:10px; ">THE VALENTI</div>',
		
	});
	
	infowindow.open(map, marker);		
});
	
function change_attend_check() {
	document.getElementById('id01').style.display = 'none';
	document.getElementById('attend-check').value = 'true';
}