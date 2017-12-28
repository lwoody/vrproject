/**
 * 
 */

$(document).ready(function() {
	$("#loading-spinner").hide();
	var pageStart=1;
	//  send csrf token and ajax for register
	var token = $("meta[name='_csrf']").attr("content");
	var header = $("meta[name='_csrf_header']").attr("content");
	
	var isProcessing = false;
	
	$('#scroll-layer').scroll(function() {
		
		if(isProcessing){
	        /*
	         *This won't go past this condition while
	         *isProcessing is true.
	         *You could even display a message.
	         **/
			return;
	        
	    }
		
	    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
	    	
	   
	    		//show spinner
	    		$("#loading-spinner").show();
	    		// ajax call get data from server and append to the div
	    		isProcessing = true;
	    		$.ajax({
	    				type: 'POST',
	    				url: "http://localhost:8080/load-album",
	    				data: {
	    					"start": pageStart
	    				},
	    				beforeSend: function(xhr) {
	    					xhr.setRequestHeader(header, token);
	    				},
	    				success: function(responseList){
	    					
	    					pageStart+=1;
	    					
	    					for(var i=0; i<responseList.length;i++){
	    						var title = responseList[i].title;
	    						var content = responseList[i].content;
	    						var image = responseList[i].image;
	    						var date = responseList[i].date;
	    				
	    						$("#cardContainer").append("<div class='mdl-cell mdl-card mdl-shadow--4dp portfolio-card'>"
	    						        +"<div class='mdl-card__media'>"
	    						            +"<img class='article-image' src='data:image/jpg;base64,"+image+"' border='0' alt=''>"
	    						        +"</div>"
	    						        +"<div class='mdl-card__title'>"
	    						            +"<h2 class='mdl-card__title-text'>"+title+"</h2>"
	    						        +"</div>"
	    						        +"<div class='mdl-card__supporting-text'>"+content+"</div>"
	    						        +"<br>"        
	    						        +"<div class='mdl-card__actions mdl-card--border'>"
	    						          +"<a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent' href='/show-photo-detail'>"
	    						            +"더보기" 
	    						         + "</a>"
	    						        +  "<div class='mdl-card__supporting-text'>"+date+"</div>"
	    						        +"</div>"
	    						    +"</div>");
	    					}
	    					
	    					if(responseList.length>=1){
	    						isProcessing=false;
	    					}else{
	    						//stop more ajax call - there are no items left to show 
	    						isProcessing=true;
	    					
	    					}
	    		
	    					$("#loading-spinner").hide();
	    					
	    				}
	    		});
	    }
	});
});


