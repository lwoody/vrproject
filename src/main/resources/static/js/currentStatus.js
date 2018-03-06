$(document).ready(function () {

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
    var PASSWORD = 1234,
        MAXPLAYCUSTOMER = 12,
        _ISALERTEND = true,
        _playCustomerCount = 0,
        _playCustomerList = {},
        _memberCountText = "",
        _selectedCustomerId,
        _emptyProgressId = 1;

    //고객 생성자
    function OCustomer(memberCount, remainTime) {
        var currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        return {
            memberCount: memberCount,
            startDate: currentDate,
            remainTime: remainTime,//이용시간 % 단위
            extendTime: 0,//연장시간 second 단위
            //isBeverageOrdered:
        }
    }

    $("#go_entry_view").click(function () {
        _alertView.hide();
        _errorView.hide();
        _customerView.hide();
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
    $("#select_member_pad").click(function (e) {
        if (e.target.tagName == 'BUTTON') {
            $("#select_member_pad button").css("color", "black");//나머지 버튼 컬러 아웃
            $(e.target).css("color", "red");
            _memberCountText = e.target.innerText;
        }
    });

    //고객관리 뷰 팝업
    $("#progress_view .progress-number").click(function (e) {
        if (_ISALERTEND === true) {
            var targetElement = e.target
            customerId = targetElement != null ? targetElement.innerText : "";//빈값 전달하여 수정작업 없도록 함

            _selectedCustomerId = customerId.replace("customer", "");//현재 선택한 숫자

            if (_playCustomerList[_selectedCustomerId] != null) {//이용중이지않은 progress bar disable
                _defaultView.hide();
                _entryView.hide();
                _alertView.hide();
                _errorView.hide();
                _customerView.show();
                _customerView.find("h5").html(customerId.replace("customer", "") + "번 손님");
            }
        }
    });

    $("#add_customer").click(function (e) {
        addCustomer();
    });

    function addCustomer(e) {

        var pwElementValue = $("#password").val();

        if (Number.parseInt(pwElementValue) != PASSWORD) {
            alert("비밀번호 입력해야함");
        }
        else if (_playCustomerCount === MAXPLAYCUSTOMER) {
            alert("입장 인원 초과");
        }
        else if (_memberCountText === "") {
            alert("인원 입력해라");
        }
        else {
            _playCustomerCount += 1;
            //알림 화면 표시
            _ISALERTEND = false;
            $("#select_member_pad button").css("color", "black");//숫자 버튼 컬러 아웃
            _alertView.show();
            _alertView.find("h5").html(_emptyProgressId + "번 손님 <br><br> 입장하셨습니다");
            _entryView.css("display", "none");
            $(".progress-number-" + _emptyProgressId).css("color", "white");//번호 하얀색으로 활성화
            //$(".progress-track").eq(_emptyProgressId-1).css("background-color","transparent");//시작시 게이지 배경 하얀색으로 변경 (회색 게이지의 top이 증가하는 방향)

            setTimeout(function () {
                _alertView.css("display", "none");
                _entryView.css("display", "block");
                _ISALERTEND = true;
            }, 2000);

            //progress view 처리 및 고객리스트에 푸쉬
            var oCustomer = new OCustomer(_memberCountText, 100),//인원수, 이용할시간(현재는 퍼센티지)
                customerListIndex = _emptyProgressId;
            progressElementIndex = "#customer" + customerListIndex;
            _playCustomerList[customerListIndex] = oCustomer;

            $(progressElementIndex).text(oCustomer.remainTime + "%");
            $(progressElementIndex).each(function () {
                var percent = $(this).html();
                var pTop = 100 - (percent.slice(0, percent.length - 1)) + "%";//회색이 게이지가 증가
                $(this).parent().css({
                    'height': pTop,
                    //'top': pTop
                });
            });

            for (var index = 1; index < 13; index++) { // 리스트의 인덱스로 못돌림 -> 초기에는 index자체가 존재안하기 때문, 1인덱스로시작하게끔해놨음
                if (_playCustomerList[index] == null) {
                    _emptyProgressId = index;
                    break;
                }
            }

            //초기화할 데이터
            _memberCountText = "";
            $("input").val("");
        }
    }

    $("#remove_customer").click(function (e) {
        removeCustomer();
    });

    function removeCustomer() {
        var oCustomer = _playCustomerList[_selectedCustomerId];
        console.log(_selectedCustomerId);

        //알림 화면 표시
        _ISALERTEND = false;
        _alertView.find("h5").html(_selectedCustomerId + "번 님 <br><br> 이용 마치셨습니다");
        _alertView.show();
        _customerView.hide();
        $(".progress-number-" + _selectedCustomerId).css("color", "grey");//번호 회색으로 비활성화

        //종료시 해당 고객 데이터 저장
        $.ajax({

            type: 'POST',
            url: "/saveCustomer",
            dataType: 'json',
            data: {
                "memberCount": oCustomer.memberCount,
                "startDate": oCustomer.startDate,
                "remainTime": oCustomer.remainTime.toString(),
                "extendTime": oCustomer.extendTime / 60,//minute 단위
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            success: function (response) {
                console.log(response);

                var progressElementIndex = "#customer" + _selectedCustomerId;
                $(progressElementIndex).html("0");//0으로

                $(progressElementIndex).each(function () {
                    $(this).parent().css({
                        'height': "0%"//회색 게이지 top 0%
                    });
                });

                _playCustomerList[_selectedCustomerId] = null;
                _playCustomerCount -= 1;
                _emptyProgressId = _selectedCustomerId;

                setTimeout(function () {
                    _alertView.hide()
                    _defaultView.show();
                    _ISALERTEND = true;
                }, 1500);

                //추가시간있었을 경우
                var progressElementIndex = ".customer" + _selectedCustomerId + "_extend_time";
                $(progressElementIndex).hide();
                //상단 표시 -> 검은색
                $(".progress-img").eq(_selectedCustomerId - 1).css("background-image", '');

            },
            error: function () { }

        });

    }

    $("#pop_beverage_alert_view").click(function (e) {
        //알림 화면 표시
        _ISALERTEND = false;
        _alertView.find("h5").html(_selectedCustomerId + "번 손님 <br><br> 음료 준비되었습니다");
        _alertView.show();
        _customerView.hide();
        //상단 + 추가 이용 표시
        $(".progress-img").eq(_selectedCustomerId - 1).css("background-image", 'url("img/beverage.png")');
        $(".progress-img").eq(_selectedCustomerId - 1).css("background-size", "70px 200px");

        setTimeout(function () {
            _alertView.hide()
            _defaultView.show();
            _ISALERTEND = true;
        }, 2000);
    });

    $("#add_time").click(function (e) {
        var progressElementIndex = ".customer" + _selectedCustomerId + "_extend_time";
        $(progressElementIndex).html("+<br>13");//값 받아줘야함
        $(progressElementIndex).show();
    });

    $("#back_to_home").click(function () {
        //데이터 초기화
        _memberCountText = "";

        _entryView.css("display", "none");
        _defaultView.css("display", "block");
    })

    //상태변화 세팅
    var x = setInterval(function () {
        //시계
        document.getElementById("clock").innerHTML = new Date().toLocaleString();

        //progress bar
        //0시간으로 완료된 고객도 직접 이용종료 누르지 않는한 객체 삭제 안됨
        for (var index in _playCustomerList) {
            var oCustomer = _playCustomerList[index],
                progressElementIndex = "#customer" + index,
                progressElementExtendTimeIndex = ".customer" + index + "_extend_time";

            if (oCustomer == null) {
                continue;
            }
            else if (oCustomer.remainTime > 0) { // 100이 최대 소진 게이지
                //소모되는 비율 계산해야함. 우선 1
                //oCustomer.remainTime-=0.023809;//100:4200second = x:1second
                oCustomer.remainTime -= 20;//임의로 속도 빠르게 - 테스트 용
                var pTop = (0 + oCustomer.remainTime) + "%";
                $(progressElementIndex).each(function () {
                    $(this).parent().css({
                        'height': pTop
                    });
                });
            } else {//끝난 고객의 progress bar 연장시간 세팅
                if (oCustomer.extendTime === 0) {
                    $(progressElementExtendTimeIndex).html("<span style='font-size:40px;'><br><br>+<br><br>0</span>");
                    $(progressElementExtendTimeIndex).css("text-color", "white");
                    //상단 + 추가 이용 표시
                    $(".progress-img").eq(index - 1).css("background-image", 'url("img/addPlus.png")');
                    $(".progress-img").eq(index - 1).css("background-size", "70px 200px");
                    //추가 시간 표시
                    $(progressElementExtendTimeIndex).show();
                }
                //oCustomer.extendTime+=1;//1초씩 더함
                oCustomer.extendTime += 30;//임의로 속도 빠르게 - 테스트용
                var renderTime = oCustomer.extendTime / 60;
                if (Number.isInteger(oCustomer.extendTime / 60)) {
                    $(progressElementExtendTimeIndex).html("<span style='font-size:40px;'><br><br>+<br><br>" + renderTime + "</span>");
                }
            }
        }

    }, 1000);

    //고객 progress bar 초기 세팅 - 혹시 모를 페이지 리로딩 대비해 서버에서 가져와야함_데이터를 로드해서 적용하기
    $('.vertical .progress-fill span').each(function () {
        var percent = $(this).html();
        var pTop = 100 - (percent.slice(0, percent.length - 1)) + "%";
        $(this).parent().css({
            'height': percent,
            //'top': pTop
        });
    });

});