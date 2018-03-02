$(document).ready(function() {

    //ajax중 csrf 설정
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    //우측 view template
    var _defaultView = $("#default_view"),
        _entryView = $("#entry_view");
        _alertView = $("#alert_view");
        _errorView = $("#error_view");
        _customerView = $("#customer_view");

     //기본 데이터
     var PASSWORD=1234,
         MAXPLAYCUSTOMER=12,
         _ISALERTEND=true,
         _playCustomerCount=0,
         _playCustomerList={},
         _memberCountElement = $("#member_count"),
         _memberCountText = "",
         _selectedCustomerId,
         _emptyProgressId=1;

     //고객 생성자
     function OCustomer(memberCount, playedTime) {
         var currentDate = new Date().toISOString().slice(0,10).replace(/-/g,"");
         return{
             memberCount: memberCount,
             startDate: currentDate,
             playedTime: playedTime,//이용시간 % 단위
             extendTime: 0,//연장시간 second 단위
             //isBeverageOrdered:
         }
     }

    $("#go_entry_view").click(function () {
        _defaultView.hide();
        _entryView.show();
    })

    $(".go_to_home").click(function () {
        _entryView.hide();
        _alertView.hide();
        _errorView.hide();
        _customerView.hide();
        _defaultView.show();
    })

    //인원 입력
    $("#select_member_pad").click(function(e) {
        if(e.target.tagName=='BUTTON'){
            _memberCountText = e.target.innerText;
            modifyEntryView(_memberCountText);
        }
    });

    //고객관리 뷰 팝업
    $("#progress_view .demo-graphs").click(function(e) {
        if(_ISALERTEND===true){
            var targetElement = e.target.getElementsByTagName("span")[0];
            customerId = targetElement!=null ? targetElement.id : "";//빈값 전달하여 수정작업 없도록 함

            _selectedCustomerId=customerId.replace("customer","");

            if(_playCustomerList[_selectedCustomerId]!=null){//이용중이지않은 progress bar disable
                _defaultView.hide();
                _entryView.hide();
                _alertView.hide();
                _errorView.hide();
                _customerView.show();
                _customerView.find("span").html(customerId.replace("customer","")+"번 손님");
            }
        }
    });

    $("#add_customer").click(function (e) {
        addCustomer();
    });

    $("#remove_customer").click(function (e) {
        var oCustomer = _playCustomerList[_selectedCustomerId];

        oCustomer.playedTime=0;
        var progressElementIndex="#customer"+_selectedCustomerId;
        $(progressElementIndex).html("0");//0으로
        $(progressElementIndex).each(function(){
            $(this).parent().css({
                'top' : "100%"
            });
        });

        _playCustomerList[_selectedCustomerId]=null;
        _playCustomerCount-=1;
        _emptyProgressId = _selectedCustomerId;

        //알림 화면 표시
        _ISALERTEND = false;
        _alertView.find("span").html(_selectedCustomerId+"번 손님 <br> 이용 마치셨습니다");
        _alertView.show();
        _customerView.hide();

        setTimeout(function(){
            _alertView.hide()
            _defaultView.show();
            _ISALERTEND = true;
        },2000);

        //추가시간있었을 경우
        var progressElementIndex=".customer"+_selectedCustomerId+"_extend_time";
        $(progressElementIndex).hide();

    });

    $("#pop_beverage_alert_view").click(function (e) {
        //알림 화면 표시
        _ISALERTEND = false;
        _alertView.find("span").html(_selectedCustomerId+"번 손님 <br> 음료 준비되었습니다");
        _alertView.show();
        _customerView.hide();

        setTimeout(function(){
            _alertView.hide()
            _defaultView.show();
            _ISALERTEND = true;
        },2000);
    });

    $("#add_time").click(function (e) {
        var progressElementIndex=".customer"+_selectedCustomerId+"_extend_time";
        $(progressElementIndex).html("+13");//값 받아줘야함
        $(progressElementIndex).show();
    });

    function addCustomer() {
        if(_playCustomerCount===MAXPLAYCUSTOMER){
            alert("입장 인원 초과");
        }
        else if(_memberCountText===""){
            alert("인원 입력해라");
        }
        else{
            _playCustomerCount+=1;
            //알림 화면 표시
            _ISALERTEND = false;
            _alertView.show();
            _alertView.find("span").html(_emptyProgressId+"번 손님 <br> 입장하셨습니다.");
            _entryView.css("display", "none");

            setTimeout(function(){
                _alertView.css("display","none");
                _entryView.css("display", "block");
                _ISALERTEND = true;
            },2000);

            //progress view 처리 및 고객리스트에 푸쉬
            var oCustomer = new OCustomer(_memberCountText,100),//인원수, 이용할시간(현재는 퍼센티지)
                customerListIndex = _emptyProgressId;
                progressElementIndex = "#customer"+customerListIndex;
            _playCustomerList[customerListIndex] = oCustomer;

            $(progressElementIndex).text(oCustomer.playedTime+"%");
            $(progressElementIndex).each(function(){
                var percent = $(this).html();
                var pTop = 100 - ( percent.slice(0, percent.length - 1) ) + "%";
                $(this).parent().css({
                    'height' : percent,
                    'top' : pTop
                });
            });

            for(var index=1; index<13; index++){ // 리스트의 인덱스로 못돌림 -> 초기에는 index자체가 존재안하기 때문
                if(_playCustomerList[index]==null){
                    _emptyProgressId=index;
                    break;
                }
            }

            //초기화할 데이터
            _memberCountText = "";
            modifyEntryView(_memberCountText);

            $.ajax({

                type: 'POST',
                url: "/addCustomer",
                dataType : 'json',
                data: {
                    "memberCount": oCustomer.memberCount,
                    "startDate" : oCustomer.startDate,
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader(header, token);
                },
                success: function (response) {
                       console.log(response);
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

        //progress bar
        //0시간으로 완료된 고객도 직접 이용종료 누르지 않는한 객체 삭제 안됨
        for(var index in _playCustomerList){
            var oCustomer = _playCustomerList[index],
                progressElementIndex = "#customer"+index,
                progressElementExtendTimeIndex = ".customer"+index+"_extend_time";

            if(oCustomer==null){
                continue;
            }
            else if(oCustomer.playedTime>0){ // 100이 최대 소진 게이지
                //소모되는 비율 계산해야함. 우선 1
                //oCustomer.playedTime-=0.023809;//100:4200second = x:1second
                oCustomer.playedTime-=20;//임의로 속도 빠르게 - 테스트 용
                var pTop = (100 - oCustomer.playedTime) + "%";
                $(progressElementIndex).each(function(){
                    $(this).parent().css({
                        'top' : pTop
                    });
                });
            }else{//끝난 고객의 progress bar 연장시간 세팅
                if(oCustomer.extendTime===0){
                    $(progressElementExtendTimeIndex).html("+0");
                    $(progressElementExtendTimeIndex).css("text-color","white");
                    $(progressElementExtendTimeIndex).show();
                }
                //oCustomer.extendTime+=1;//1초씩 더함
                oCustomer.extendTime+=30;//임의로 속도 빠르게 - 테스트용
                var renderTime = oCustomer.extendTime/60;
                if(Number.isInteger(oCustomer.extendTime/60)){
                    $(progressElementExtendTimeIndex).html("+"+renderTime);
                }
            }
        }

    }, 1000);

    //고객 progress bar 초기 세팅 - 혹시 모를 페이지 리로딩 대비해 서버에서 가져와야함
    $('.vertical .progress-fill span').each(function(){
        var percent = $(this).html();
        var pTop = 100 - ( percent.slice(0, percent.length - 1) ) + "%";
        $(this).parent().css({
            'height' : percent,
            'top' : pTop
        });
    });

});