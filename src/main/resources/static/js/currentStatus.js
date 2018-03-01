$(document).ready(function() {

    //ajax중 csrf 설정
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    //우측 view template
    var _defaultView = $("#default_view"),
        _entryView = $("#entry_view");
        _alertView = $("#alert_view");
        _errorView = $("#error_view");

     //기본 데이터
     var PASSWORD=1234,
         MAXPLAYCUSTOMER=12,
         _playCustomerCount=0,
         _playCustomerList={

         }
         ;

     //고객 생성자
     function OCustomer(memberCount, playedTime) {
         var currentTime = new Date();
         return{
             memberCount:memberCount,
             startTime: currentTime,
             playedTime: playedTime,//이용시간 % 붙여줘야함
         }
     }

    $("#go_entry_view").click(function () {
        _defaultView.css("display", "none");
        _entryView.css("display", "block");
    })

    var _memberCountElement = $("#member_count"),
        _memberCountText = "";

    $("#select_member_pad").click(function(e) {
        if(e.target.tagName=='BUTTON'){
            _memberCountText = e.target.innerText;
            modifyEntryView(_memberCountText);
        }
    });

    $("#add_customer").click(function (e) {
        addCustomer();
    });

    function addCustomer() {
        if(_playCustomerCount===MAXPLAYCUSTOMER){
            alert("입장 인원 초과");
        }
        else if(_memberCountText===""){
            alert("인원 입력해라");
        }
        else{
            $.ajax({
                type: 'POST',
                url: "http://localhost:8080/addCustomer",
                data: {
                    //인원 및 시간 전달
                    "memberCount":_memberCountText,
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader(header, token);
                },
                success: function (response) {
                    //알림 화면 표시
                    _alertView.css("display", "block");
                    _entryView.css("display", "none");

                    setTimeout(function(){
                        _alertView.css("display","none");
                        _entryView.css("display", "block");
                    },2000);

                    //progress view 처리
                    _playCustomerCount+=1;
                    var oCustomer = new OCustomer(_memberCountText,90),//인원수, 이용할시간(현재는 퍼센티지)
                        customerListIndex = _playCustomerCount;
                        progressElementIndex = "#customer"+customerListIndex;
                    _playCustomerList[customerListIndex] = oCustomer;

                     console.log(oCustomer.playedTime);
                    $(progressElementIndex).text(oCustomer.playedTime+"%");
                    $(progressElementIndex).each(function(){
                        var percent = $(this).html();
                        var pTop = 100 - ( percent.slice(0, percent.length - 1) ) + "%";
                        $(this).parent().css({
                            'height' : percent,
                            'top' : pTop
                        });
                    });

                    //초기화할 데이터
                    _memberCountText = "";
                    modifyEntryView(_memberCountText);

                },
                error: function () {}
            });
        }
    }

    $("#back_to_home").click(function () {
        //데이터 초기화
        _memberCountText = "";
        modifyEntryView("");

        _entryView.css("display", "none");
        _defaultView.css("display", "block");
    })

    function modifyEntryView(text) {
        var currentCountElement = "<button class='mdl-button mdl-js-button mdl-button--raised'>"+text+"</button>"
        _memberCountElement.html(currentCountElement);
    }

    //상태변화 세팅

    var x = setInterval(function() {
        //시계
        document.getElementById("clock").innerHTML = new Date().toLocaleString();

        //progress view
        for(var index in _playCustomerList){
            var oCustomer = _playCustomerList[index];
            //소모되는 비율 계산해야함. 우선 1
            if(oCustomer.playedTime>0){ // 100이 최대 소진 시간
                oCustomer.playedTime-=1;
                var progressElementIndex = "#customer"+index;
                // var percent = oCustomer.playedTime +"%";
                var pTop = 100 - ( oCustomer.playedTime) + "%";
                $(progressElementIndex).each(function(){
                    $(this).parent().css({
                        'top' : pTop
                    });
                });
            }
        }
        console.log(index);
    }, 1000);

    //고객 progress bar 세팅
    $('.vertical .progress-fill span').each(function(){
        var percent = $(this).html();
        var pTop = 100 - ( percent.slice(0, percent.length - 1) ) + "%";
        $(this).parent().css({
            'height' : percent,
            'top' : pTop
        });
    });

});