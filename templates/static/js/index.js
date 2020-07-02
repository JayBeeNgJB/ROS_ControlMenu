// very first load
setup();

var total_seconds = 0;
var STOP_TIMER = false;

function setup() {
    console.log("Init");
    // $.getJSON($SCRIPT_ROOT + '/get/time', {
        
    // }, function(data) {
    //     total_seconds = data.result;
    //     setTotalTime();
    // });
    auto_manual(true, false);
}

window.addEventListener('load', (e) => {
    menu_switch();
    powerOn();
    powerOff();
    pause();
    resume();
});

function powerOn() {
    $(".start").on('click', function() {
        console.log("Power ON");

        //get timer period
        $duration = $("#timer_min").val() * 60;

        startTimer($duration);

        //disable power on
        $(this).css('pointer-events', 'none');
        $(this).css('color', '#767676');
        //enable power off
        $(".stop").css('pointer-events', 'auto');
        $(".stop").css('color', 'black');
    });
}

function powerOff() {
    $(".stop").on('click', function() {
        console.log("Power Off");

        STOP_TIMER = true;
        //enable power on
        $(".start").css('pointer-events', 'auto');
        $(".start").css('color', 'black');
        //disable power off
        $(this).css('pointer-events', 'none');
        $(this).css('color', 'rgb(53, 60, 71)');
    });
}

function pause() {
    $(".pause_btn").on('click', function() {
        $(".resume_btn").show();
        $(this).hide();
    });
    
}

function resume() {
    $(".resume_btn").on('click', function() {
        $(this).hide();
        $(".pause_btn").show();
    });
}

function startTimer(duration) {
    var timer = duration, minutes, seconds;

    var countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $(".timer").empty().text(minutes + ":" + seconds);

        //show total usage hour, minute, second
        var temp_total_seconds = ++total_seconds;

        save_time(temp_total_seconds);

        setTotalTime();

        if (--timer < 0 || STOP_TIMER == true) {
            clearInterval(countdown);
            $(".timer").empty().text("00:00");
            console.log("Power Off with timer");
            //enable power on
            $(".on_btn").css('pointer-events', 'auto');
            $(".on_btn i").css('color', 'blue');
            STOP_TIMER = false;
        }
    }, 1000);
}

function setTotalTime() {
    var usage_hours = Math.floor(total_seconds / 3600 );
    var usage_minutes = Math.floor(total_seconds % 3600 / 60);
    var usage_seconds = total_seconds % 60;

    usage_hours = usage_hours < 10 ? "0" + usage_hours : usage_hours;
    usage_minutes = usage_minutes < 10 ? "0" + usage_minutes : usage_minutes;
    usage_seconds = usage_seconds < 10 ? "0" + usage_seconds : usage_seconds;

    $(".run_time").empty().text(usage_hours + ":" + usage_minutes + ":" + usage_seconds);
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
        auto_manual(false, true);
        manual_show();
    });

    $(".auto").on('click', function() {
        auto_manual(true, false);
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
    $(".auto").addClass('active');
    $(".manual").removeClass('active');
}
