// very first load
setup();

var total_seconds = 0;
var STOP_TIMER = false;
var PAUSE_TIMER = false;
var TOTAL;
var MOTION_STOP = false;

function setup() {
    console.log("Init");

    localStorage.setItem("REMAINING_SECONDS", 0);
    localStorage.setItem("CURRENT_SECONDS", 0);
    localStorage.setItem("AUTO_START", 0);
    localStorage.setItem("MANUAL_START", 0);
    auto_manual(1, 0);

    TOTAL = localStorage.getItem("total");
}

window.addEventListener('load', (e) => {
    menu_switch();
    powerOn();
    powerOff();
    pause();
    resume();

    $(".pause").css('pointer-events', 'none');
    $(".pause").css('color', '#7d7474');
    //enable power off
    $(".stop").css('pointer-events', 'none');

    $("#total_hours").text(8743);
});

function powerOn() {
    $(".start").on('click', function() {
        console.log("Power ON");

        console.log("start motion every 30 seconds");

        //get timer period
        $duration = $("#timer_min").val() * 60;

        STOP_TIMER = false;

        var auto_mode = localStorage.getItem('AUTO');
        console.log("AUTO MODE" +auto_mode);
        if (auto_mode == true) {
            console.log("Start auto");

            //different auto and manual
            localStorage.setItem("AUTO_START", 1);
            localStorage.setItem("MANUAL_START", 0);
            startTimer($duration);
        } else {
            console.log("Why");
            startCount(0);

            //different auto and manual
            localStorage.setItem("AUTO_START", 0);
            localStorage.setItem("MANUAL_START", 1);
        }        

        //disable power on
        $(this).css('pointer-events', 'none');
        $(this).css('background-color', '#484c48');

        //enable pause
        $(".pause").css('pointer-events', 'auto');
        $(".pause").css('color', 'black');
        $(".pause").css('background-color', '#FEDA6A');
        //enable power off
        $(".stop").css('pointer-events', 'auto');
        // $(".stop").css('color', 'black');
        $(".stop").css('background-color', '#dc3545');
    });
}

function powerOff() {
    $(".stop").on('click', function() {
        console.log("Power Off");

        $(".uvc_power").show();
        $(".time_area").show();
        $(".motion_alert").hide();


        STOP_TIMER = true;
        MOTION_STOP = true;
        // PAUSE_TIMER = false;

        $(".timer").empty().text("00:00");
        $(".run_time").empty().text("00:00:00");

        localStorage.setItem("REMAINING_SECONDS", 0);
        localStorage.setItem("CURRENT_SECONDS", 0);
        //change to default pause
        $(".resume_btn").hide();
        $(".pause_btn").show()

        //enable power on
        $(".start").css('pointer-events', 'auto');
        $(".start").css('color', 'black');
        $(".start").css('background-color', '#0DFF0E');
        //disable pause
        $(".pause").css('pointer-events', 'none');
        $(".pause").css('color', '#7b6d6d');
        $(".pause").css('background-color', '#2f2f2d');
        //disable power off
        $(this).css('pointer-events', 'none');
        $(this).css('color', 'black');
        $(this).css('background-color', '#2f2f2d');
    });
}

function pause() {
    $(".pause_btn").on('click', function() {

        if ((localStorage.getItem('AUTO_START') == 1 && localStorage.getItem('AUTO') == 1) || 
            (localStorage.getItem('MANUAL_START') == 1 && localStorage.getItem('MANUAL') == 1)) {
                console.log("Enterer");
                $(".resume_btn").show();
                $(this).hide();
        
                PAUSE_TIMER = true;
        } else {
            alert("Pause Mode is not correct");
        }

        
    });
}

function resume() {
    $(".resume_btn").on('click', function() {
        if ((localStorage.getItem('AUTO_START') == 1 && localStorage.getItem('AUTO') == 1) || 
            (localStorage.getItem('MANUAL_START') == 1 && localStorage.getItem('MANUAL') == 1)) {
                if (localStorage.getItem("AUTO") == true) {
                    var remain_seconds = localStorage.getItem("REMAINING_SECONDS");
                    startTimer(remain_seconds); 
                } else {
                    var current_seconds = localStorage.getItem("CURRENT_SECONDS");
                    startCount(current_seconds);
                }
        
                $(this).hide();
                $(".pause_btn").show();  
        } else {
            alert("RESUME Mode is not correct");
            return;
        }
          
    });
}

function startTimer(duration) {
    console.log("Auto start timer");
    var timer = duration, minutes, seconds;
    var stop = 0;

    var mode = localStorage.getItem('AUTO');
    if($("#timer_min").val() == 60 && mode == 1) {
        MOTION_STOP = false;
        var temp_value = 0;

        var motion_timer = setInterval(function () {
            
            if(MOTION_STOP == true) {
                clearInterval(motion_timer);
            }

            $(".uvc_power").hide();
            $(".time_area").hide();
            $(".motion_alert").show();
            
        }, 60000);

        var motion_timer1 = setInterval(function () {
            if(MOTION_STOP == true) {
                clearInterval(motion_timer1);
            }

            $(".uvc_power").show();
            $(".time_area").show();
            $(".motion_alert").hide();
            
        }, 120000);
    }

    var countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $(".timer").empty().text(minutes + ":" + seconds);

        //show total usage hour, minute, second
        var temp_total_seconds = ++total_seconds;

        localStorage.setItem("total", TOTAL + temp_total_seconds);

        // total_time(TOTAL + temp_total_seconds);

        

        save_time(temp_total_seconds);
        //pause action
        if (PAUSE_TIMER == true) {
            console.log("PAUSE");
            clearInterval(countdown);
            $timer_total = $("#timer_min").val() * 60;
            localStorage.setItem("REMAINING_SECONDS", $timer_total - temp_total_seconds);
            PAUSE_TIMER = false;
        }

        if (--timer < 0 || STOP_TIMER == true) {
            clearInterval(countdown);
            $(".timer").empty().text("00:00");
            localStorage.setItem("REMAINING_SECONDS", 0);
            console.log("Power Off with timer");
            
            $(".start").css('pointer-events', 'auto');
            $(".start").css('color', 'black');
            $(".start").css('background-color', '#0DFF0E');
            //disable pause
            $(".pause").css('pointer-events', 'none');
            $(".pause").css('color', '#7b6d6d');
            $(".pause").css('background-color', '#2f2f2d');
            //disable power off
            $(".stop").css('pointer-events', 'none');
            $(".stop").css('color', 'black');
            $(".stop").css('background-color', '#2f2f2d');

            STOP_TIMER = false;
            MOTION_STOP = true;
        }
    }, 1000);
}

function startCount($current) {
    console.log("Manual start");
    var start_second = $current;

    var countup = setInterval(function () {
        var h = Math.floor(start_second / 3600 );
        var m = Math.floor(start_second % 3600 / 60);
        var s = start_second % 60;

        var temp_start_seconds = start_second++;
    
        TOTAL = localStorage.getItem("total");
        localStorage.setItem("total", TOTAL + temp_start_seconds);

        // total_time(TOTAL);


        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;

        $(".run_time").empty().text(h + ":" + m + ":" + s);

        if (PAUSE_TIMER == true) {
            console.log("PAUSE");
            clearInterval(countup);
            localStorage.setItem("CURRENT_SECONDS", start_second);
            PAUSE_TIMER = false;
        }

        if (STOP_TIMER == true) {
            STOP_TIMER = false;
            console.log("Stop manually");
            clearInterval(countup);
            console.log($(".run_time").text());
            $(".run_time").empty().text("00:00:00");

            MOTION_STOP = true;
        }
    }, 1000);  
}

function total_time(t_seconds) {
    var t_h = Math.floor(t_seconds / 3600 );
    var t_m = Math.floor(t_seconds % 3600 / 60);
    var t_s = t_seconds % 60;
    var net_hour = TOTAL = 9000 - t_m;

    $("#total_hours").text(8743);
}

function rotate(rotate_id) {
    console.log("rotate");
    if (!rotate_id) {
        alert("Please enter direction");
        return;
    }

    $move = 'left';

    switch(rotate_id) {
        case '1':
            $move = 'left';
            break;
        case '2':
            $move = 'right';
            break;
        case '3':
            $move = 'up';
            break;
        case '4':
            $move = 'down';
    }

    $.getJSON("/static/config.json", function(data) {
        $camera_url = data.camera_url;
        var destination_url = $camera_url + '/axis-cgi/com/ptz.cgi?move=' + $move;
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                window.location.href = destination_url;
            }
        }
        xhr.open('head', destination_url);
        xhr.send(null);
        
    })

}

//store total seconds to data.json
function save_time(temp_total_seconds) {
    // $.getJSON($SCRIPT_ROOT + '/save/time', {
    //     total_seconds : temp_total_seconds
    // }, function(data) {
    //     //console.log("Success");
    // });
    // localStorage.setItem("SECONDS", temp_total_seconds);
}

function menu_switch() {
    $(".manual").on('click', function() {
        auto_manual(0, 1);
        manual_show();
    });

    $(".auto").on('click', function() {
        auto_manual(1, 0);
        auto_show();
    });
}

function auto_manual(auto, manual) {
    localStorage.setItem('AUTO', auto);
    localStorage.setItem('MANUAL', manual);
}

function manual_show() {
    //run time show
    $(".run_time_lbl").show();
    $(".run_time").show();

    //timer show
    $(".timer_select").hide();
    $(".timer_lbl").hide();
    $(".timer").hide();
    $("#hour_group").hide();
    $(".manual").addClass('active');
    $(".auto").removeClass('active');
}

function auto_show() {
    //run time hide
    $(".run_time_lbl").hide();
    $(".run_time").hide();
    //timer show
    $(".timer_select").show();
    $(".timer_lbl").show();
    $(".timer").show();
    $("#hour_group").show();
    $(".auto").addClass('active');
    $(".manual").removeClass('active');
}
