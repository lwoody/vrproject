
$(document).ready(function() {
	
	//check if user is logged in or not
	$.ajax({
		   type: 'GET',
		   url: "http://localhost:8080/login-check",
		   success: function(response){
			   if(response==true){
					//your logout link
					$("#login-button-a").attr("href", "/logout");
					$("#login-button-a").text("Logout");
					$("#login-button-b").attr("href", "/logout");
					$("#login-button-b").text("Logout");
				}else{
//					window.location.href = "/login";
				}
		   }
    });
	
	
});