$(document).ready(function () {

    //ajax중 csrf 설정
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    //우측 view template
    var _defaultView = $("#default_view"),
        _entryView = $("#entry_view"),
        _alertView = $("#alert_view"),
        _errorView = $("#error_view"),
        _customerView = $("#customer_view");

    //기본 데이터
    var MAXPLAYCUSTOMER = 12,
        CONNECTIONTIME = 0,
        _ISALERTEND = true,
        _playCustomerCount = 0,
        _playCustomerList = {},
        _memberCountText = "",
        _selectedCustomerId,
        _progressId = 1;

    //localStorage.clear();
    //리로딩일 경우 캐시된 데이터 저장
    for (var index = 1; index < 12; index++) {
        var cachedObjet = localStorage.getItem("customer" + index);
        if (cachedObjet != null) {
            var jsonCustomer = JSON.parse(cachedObjet);
            _playCustomerList[index] = jsonCustomer;
            $(".progress-number-" + index).css("color", "white"); //번호 하얀색으로 활성화
            if (jsonCustomer.remainTime === 0) { //남은 시간 0이면 추가 시간 표시로!
                //상단 + 추가 이용 표시
                $(".progress-img").eq(index - 1).css("background-image", 'url("img/addPlus.png")');
                $(".progress-img").eq(index - 1).css("background-size", "70px 200px");
                //추가 시간 표시
                $(".customer" + index + "_extend_time").show();
            }
            _playCustomerCount++;
        }
    }

    //고객 생성자
    function OCustomer(memberCount, remainTime) {
        var currentDate = new Date();
        return {
            id: 0, //서버에서 생성해 받아옴
            memberCount: memberCount,
            startDate: currentDate.toISOString().substring(0, 10),
            remainTime: remainTime, //이용시간 % 단위
            extendTime: 0, //연장시간 second 단위
            //isBeverageOrdered:
            startTime: getCurrentTime(),
            endTime: 0,
            beverageTime: 0,
            customerNo: 0,
        }
    }

    //로고 클릭 스펙 아웃
    // $("#go_entry_view").click(function () {
    //     _alertView.hide();
    //     _errorView.hide();
    //     _customerView.hide();
    //     _defaultView.hide();
    //     _entryView.show();
    // })

    $(".go_to_home").click(function () {
        _entryView.hide();
        _alertView.hide();
        _errorView.hide();
        _customerView.hide();
        _defaultView.show();
    })

    //번호 입력
    $("#select_member_pad").click(function (e) {
        if (e.target.tagName == 'BUTTON') {
            $("#select_member_pad button").css("color", "black"); //나머지 버튼 컬러 아웃
            $(e.target).css("color", "red");
            _progressId = e.target.innerText;
        }
    });

    //고객관리 뷰 팝업
    $("#progress_view .progress-number").click(function (e) {
        if (_ISALERTEND === true) {
            var targetElement = e.target;
            var customerId = targetElement != null ? targetElement.innerText : ""; //빈값 전달하여 수정작업 없도록 함

            _selectedCustomerId = customerId.replace("customer", ""); //현재 선택한 숫자

            if (_playCustomerList[_selectedCustomerId] != null) { //이용중인 progress bar
                _defaultView.hide();
                _entryView.hide();
                _alertView.hide();
                _errorView.hide();
                _customerView.show();
                _customerView.find("h5").html(customerId.replace("customer", "") + "번 손님");
            } else { //이용하지 않는 progress bar 케이스 - 로고 클릭 로직을 변경하기
                _alertView.hide();
                _errorView.hide();
                _customerView.hide();
                _defaultView.hide();
                _entryView.find("h5").html(customerId.replace("customer", ""));
                _entryView.show();
            }
        }
    });

    $("#add_customer").click(function (e) { //70분 버튼
        addCustomer(e);
    });

    $("#add_ten_min").click(function (e) { //10분 버튼
        addCustomer(e);
    });

    $("#remove_customer").click(function (e) {
        removeCustomer();
    });

    function addCustomer(e) {

        var targetElement = e.target;
        var buttonTimeValue = targetElement != null ? targetElement.innerText : "";
        var TIME_PERCENTAGE = buttonTimeValue == "70" ? 100 : 14.2857142857; //70분 | 10분 버튼
        _progressId = _selectedCustomerId;

        if (_playCustomerCount === MAXPLAYCUSTOMER) { //바뀐 ui 스펙으로는 불필요해짐 - 추후 제거
            alert("입장 인원 초과");
        }
        // else if (_progressId === "") {
        //     alert("번호 입력해라");
        // }
        else {

            // if (_playCustomerList[_progressId] != null) {
            //     alert("이미 사용 중 입니다.");
            //     return;
            // }

            //고객 객체 생성 및 사전 처리
            var oCustomer = new OCustomer(_memberCountText, TIME_PERCENTAGE), //인원수(현재 안쓰임), 이용할시간(퍼센티지)
                customerListIndex = _progressId;
            progressElementIndex = "#customer" + customerListIndex;
            oCustomer.customerNo = customerListIndex;

            _playCustomerCount += 1;

            $.ajax({
                type: 'POST',
                url: "/entrySaveCustomer",
                dataType: 'json',
                data: {
                    //"memberCount": oCustomer.memberCount,
                    "startDate": oCustomer.startDate,
                    "startTime": oCustomer.startTime,
                    "customerNo": oCustomer.customerNo,
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(header, token);
                },
                success: function (response) { //response에 id값 담아오기
                    var responseObject = JSON.parse(response);
                    oCustomer.id = responseObject.id;
                    _playCustomerList[customerListIndex] = oCustomer; //현재 고객 리스트에 추가
                }
            });

            //progress view 처리
            $(progressElementIndex).text(oCustomer.remainTime + "%");
            $(progressElementIndex).each(function () {
                //var percent = $(this).html();
                var height = (0 + oCustomer.remainTime) + "%"; //하얀색 height 수치 감소 방향
                $(this).parent().css({
                    'height': height,
                });
            });

            //알림 화면 표시
            _ISALERTEND = false;
            //$("#select_member_pad button").css("color", "black");//숫자 버튼 컬러 아웃
            _alertView.show();
            _alertView.find("h5").html(_progressId + "번 손님 <br><br>" + buttonTimeValue + "분"); //여기에 70분,10분 구별하고 마크업 처리해주면 됨
            _entryView.css("display", "none");
            $(".progress-number-" + _progressId).css("color", "white"); //번호 하얀색으로 활성화

            setTimeout(function () {
                _alertView.css("display", "none");
                _defaultView.css("display", "block");
                _ISALERTEND = true;
            }, 2000);

            //초기화할 데이터
            // _memberCountText = "";
            // $("input").val("");
        }
    }

    function removeCustomer() {
        var oCustomer = _playCustomerList[_selectedCustomerId];

        //알림 화면 표시
        _ISALERTEND = false;
        _alertView.find("h5").html(_selectedCustomerId + "번 님 <br><br> 이용 마치셨습니다");
        _alertView.show();
        _customerView.hide();
        $(".progress-number-" + _selectedCustomerId).css("color", "gray"); //번호 회색으로 비활성화
        oCustomer.endTime = getCurrentTime();

        //종료시 해당 고객 데이터 저장
        $.ajax({
            type: 'POST',
            url: "/endSaveCustomer",
            dataType: 'json',
            data: {
                //"memberCount": oCustomer.memberCount,
                "id": oCustomer.id,
                "remainTime": oCustomer.remainTime.toString(),
                "extendTime": oCustomer.extendTime / 60, //minute 단위
                "beverageTime": oCustomer.beverageTime,
                "endTime": oCustomer.endTime.toString(),
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            success: function (response) {

                setTimeout(function () {
                    _alertView.hide()
                    _defaultView.show();
                    _ISALERTEND = true;
                }, 1500);

                //로컬캐시 삭제
                localStorage.removeItem("customer" + _selectedCustomerId);

                //게이지 초기화
                var progressElementIndex = "#customer" + _selectedCustomerId;
                $(progressElementIndex).html("0"); //0으로

                $(progressElementIndex).each(function () {
                    $(this).parent().css({
                        'height': "0%" //하얀색 게이지 height 0
                    });
                });

                //데이터 수정
                _playCustomerList[_selectedCustomerId] = null;
                _playCustomerCount -= 1;

                //추가시간있었을 경우
                var progressExtendIndex = ".customer" + _selectedCustomerId + "_extend_time";
                $(progressExtendIndex).hide();
                //상단 표시 -> 검은색
                $(".progress-img").eq(_selectedCustomerId - 1).css("background-image", '');

            },
            error: function () {}

        });

    }

    $("#pop_beverage_alert_view").click(function (e) {

        //알림 화면 표시
        _ISALERTEND = false;
        var tempSelectedCustomerId = _selectedCustomerId;
        _alertView.find("h5").html(_selectedCustomerId + "번 손님 <br><br> 음료 준비되었습니다");
        _alertView.show();
        _customerView.hide();

        //음료 제공 시간 캐시
        var oCustomer = _playCustomerList[_selectedCustomerId]
        oCustomer.beverageTime = getCurrentTime();

        setTimeout(function () { //5분 뒤 아직 해당 음료 뷰 떠있으면 제거 -

            _alertView.hide();
            _defaultView.show();

        }, 2000);

        //상단 음료 표시
        $(".progress-img").eq(_selectedCustomerId - 1).css("background-image", 'url("img/beverage.png")');
        $(".progress-img").eq(_selectedCustomerId - 1).css("background-size", "70px 200px");

        setTimeout(function () {
            $(".progress-img").eq(tempSelectedCustomerId - 1).css("background-image", '');
        }, 2000);

        //우선 그냥 종소리
        var snd = new Audio("img/bell.wav"); //해당 파일 프로젝내에 저장해놓음
        snd.play();

        _ISALERTEND = true;

    });

    $("#add_five_min").click(function (e) {

        var TIME_PERCENTAGE = 7.14285714
        var oCustomer = _playCustomerList[_selectedCustomerId];

        //setTimeout 게이지 소모 비동기 처리가 걸리지만 수동으로 시간 채우고 표시선 보기 때문에 이상없음
        if (oCustomer.remainTime > 0) {
            oCustomer.remainTime = parseFloat(oCustomer.remainTime) + parseFloat(TIME_PERCENTAGE);
        } else if (oCustomer.extendTime > 0) { // 추가 시간 이용 중 일때(시간 남아 있을 때)
            // oCustomer.extendTime = parseInt(oCustomer.extendTime) - 300;
            oCustomer.extendTime -= 5;
            if(oCustomer.extendTime<0){
                oCustomer.remainTime = 0 - oCustomer.extendTime; // remainTime이 float처리되어 있어 다시 0으로 갱신 및 음수값 양수 더하기
                console.log(oCustomer.remainTime);
            }
        } else if (oCustomer.extendTime <= 0) {
            oCustomer.remainTime += TIME_PERCENTAGE;
            //상단 + 추가 이용 표시 제거
            $(".progress-img").eq(_progressId - 1).css("background-image", '');
            $(".progress-img").eq(_progressId - 1).css("background-size", "");
            //추가 시간 표시 제거
            var progressElementExtendTimeIndex = ".customer" + _progressId + "_extend_time";
            $(progressElementExtendTimeIndex).remove("span");
            $(progressElementExtendTimeIndex).hide();
        }
        //알림 화면 표시
        _ISALERTEND = false;
        _alertView.show();
        _alertView.find("h5").html(_progressId + "번 손님 <br><br>5분");
        _customerView.css("display", "none");

        setTimeout(function () {
            _alertView.css("display", "none");
            _customerView.css("display", "block");
            _ISALERTEND = true;
        }, 1000);
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
        document.getElementById("clock").innerHTML = getCurrentTime();

        //progress bar
        //0시간으로 완료된 고객도 직접 이용종료 누르지 않는한 객체 삭제 안됨
        for (var index in _playCustomerList) {
            var oCustomer = _playCustomerList[index],
                progressElementIndex = "#customer" + index,
                progressElementExtendTimeIndex = ".customer" + index + "_extend_time";

            if (oCustomer == null) {
                continue;
            } else if (oCustomer.remainTime > 0) { // 100이 최대 소진 게이지
                //소모되는 비율 계산해야함. 우선 1
                //oCustomer.remainTime-=0.023809;//100:4200second = x:1second
                oCustomer.remainTime -= 5; //임의로 속도 빠르게 - 테스트 용
                var height = (0 + oCustomer.remainTime) + "%";
                $(progressElementIndex).each(function () {
                    $(this).parent().css({
                        'height': height
                    });
                });
                //로컬 브라우저에 캐시 - 약 5mb 제한
                localStorage.setItem("customer" + index, JSON.stringify(oCustomer));

            } else {
                if (oCustomer.extendTime > 0) {
                    var renderTime = oCustomer.extendTime / 60;
                    if (Number.isInteger(oCustomer.extendTime / 60)) {
                        $(progressElementExtendTimeIndex).html("<span style='font-size:40px;'><br><br>+<br><br>" + renderTime + "</span>");
                        //로컬 브라우저에 캐시
                        localStorage.setItem("customer" + index, JSON.stringify(oCustomer));
                    }
                    //oCustomer.extendTime+=1;//1초씩 더함
                    oCustomer.extendTime += 30; //임의로 속도 빠르게 - 테스트용
                } else if (oCustomer.extendTime === 0) { //고객의 progress bar 연장시간 세팅
                    $(progressElementExtendTimeIndex).html("<span style='font-size:40px;'><br><br>+<br><br>0</span>");
                    $(progressElementExtendTimeIndex).css("text-color", "white");
                    //상단 + 추가 이용 표시
                    $(".progress-img").eq(index - 1).css("background-image", 'url("img/addPlus.png")');
                    $(".progress-img").eq(index - 1).css("background-size", "70px 200px");
                    //추가 시간 표시
                    $(progressElementExtendTimeIndex).show();
                    //oCustomer.extendTime+=1;//1초씩 더함
                    oCustomer.extendTime += 30; //임의로 속도 빠르게 - 테스트용
                }
            }
        }

        CONNECTIONTIME++;
        if (Number.isInteger(CONNECTIONTIME / 600)) { //10분에 한번씩
            //connection 유지
            $.ajax({
                type: 'POST',
                url: "/makeConnection",
                data: {},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(header, token);
                },
                success: function (response) {
                    console.log("still connection exist");
                }
            });
        }
    }, 1000);

    //고객 progress bar 초기 세팅
    $('.vertical .progress-fill span').each(function () {
        var percent = $(this).html();
        $(this).parent().css({
            'height': percent,
        });
    });

    function getCurrentTime() {
        var currentDate = new Date();
        return (currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours()) + ":" + (currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes());
    }

});