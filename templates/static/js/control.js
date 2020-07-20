// Connecting to ROS

var ros = new ROSLIB.Ros({
  url : 'ws://192.168.200.145:9090'
 });

 ros.on('connection', function() {
    status(true);
    console.log('Connected to websocket server.');
 });

 ros.on('error', function(error) {
    status(false);
    console.log('Error connecting to websocket server: ', error);
 });
 
 ros.on('close', function() {
    status(false);
    console.log('Connection to websocket server closed.');
 });

 // Publishing a Topic

 var cmdVel = new ROSLIB.Topic({
     ros : ros,
     name : '/cmd_vel',
     messageType : 'geometry_msgs/Twist'
 });

 var interval;
 var LINEAR = 0.05;
 var ANGULAR = 0.05;

 window.addEventListener('load', (e) => {
    current_page();
    showSpeed(LINEAR);
    battery_status();
    emergency_alert();
  
    console.log("Loading control.. ");
});

$(document).ready(function() {
    $(".btn_up").click(function () {
        console.log("forward...")
        clearInterval(interval);
        interval = setInterval(UP, 1000);
    });

    $(".btn_down").click(function () {
        console.log ("backing.....");
        clearInterval(interval);
        interval = setInterval(DOWN, 1000);
    });

    $(".btn_left").click(function () {
        console.log ("Left.....");
        clearInterval(interval);
        interval = setInterval(LEFT, 1000);
    });

    $(".btn_right").click(function () {
        console.log ("Right.....");
        clearInterval(interval);
        interval = setInterval(RIGHT, 1000);
    });

    $(".btn_stop").click(function () {
        console.log ("STOP.....");
        clearInterval(interval);
        STOP();
    });

    //Linear speed and angular speed control
    $("#speed_up").click(function() {
        LINEAR = LINEAR + 0.05;
        showSpeed(LINEAR);
        console.log(LINEAR)
    });

    $("#speed_down").click(function() {
    console.log(LINEAR);
    // LINEAR = LINEAR.toFixed(2);
    if (LINEAR > 0.1) {
        console.log("over 0");
        LINEAR = LINEAR - 0.05;
        showSpeed(LINEAR);
    }            
    console.log(LINEAR);
    });

    $(".test").click(function() {
        var clearRoute = new ROSLIB.Service({
            ros : ros,
            name : '/clear',
            serviceType : 'std_srvs/Empty'
        });

        clearRoute.callService();
    });

});

function UP() {
    console.log("FORWarding");
    publishData(LINEAR , 0, 0, 0, 0, 0);  
}

function DOWN() {
    publishData(0 - LINEAR, 0, 0, 0, 0, 0);  
}

function LEFT() {
    publishData(0, 0, 0, 0, 0, LINEAR);  
}

function RIGHT() {
    publishData(0, 0, 0, 0, 0, 0 - LINEAR); 
}

function STOP() {
    publishData(0, 0, 0, 0, 0, 0);
}

function publishData(lx, ly, lz, ax, ay, az) {
    var twist = new ROSLIB.Message({
        linear : {
            x : lx,
            y : ly,
            z : lz
        },
        angular : {
            x : ax,
            y : ay,
            z : az
        }
    });

    cmdVel.publish(twist);
}

function emergency_alert() {
    var emer_switch = new ROSLIB.Topic({
        ros : ros,
        name : '/Wheel_Switch',
        messageType : 'robot_msgs/Wheel_Switch'
    });

    emer_switch.subscribe(function(messages) {
        if(messages.Switch) {
            $(".emergency_alert").show();
        } else {
            $(".emergency_alert").hide();
        }
    }) 
}

function emergency() {
    console.log("Emergency");
    // var emer_switch = new ROSLIB.Topic({
    //     ros : ros,
    //     name : '/Wheel_Switch',
    //     messageType : 'robot_msgs/Wheel_Switch'
    // });

    // var emer_switch_val = new ROSLIB.Message({
    //     Switch : 1
    // });

    // emer_switch.publish(emer_switch_val)
}

function dock() {
    console.log("Docking");
    clearInterval(interval);
    STOP();
    var auto_dock = new ROSLIB.Topic({
        ros : ros,
        name : '/Auto_Charging',
        messageType : 'robot_msgs/Charging_Control'
    });

    var charge_val = new ROSLIB.Message({
        auto_charging_flag : 1
    });

    auto_dock.publish(charge_val);
}

function status(status) {
    if (status == true) {
        $("#connection_status").html("<i class='fa fa-check'></i> Connected");
        $("#connection_status").css({
            "background-color" : "#22926c",
            "color" : "#f5f7eb"
            });
    } else {
        $("#connection_status").html("<i class='fa fa-exclamation-circle'></i> Not Connected");
        $("#connection_status").css({
            "background-color" : "#e62c2c",
            "color" : "aquamarine"
        });
    }
}

function battery_status() {
    console.log("Battery status");
    var pms_status = new ROSLIB.Topic({
        ros : ros,
        name : '/PMS_get_status',
        messageType : 'robot_msgs/PMS_get_status'
    });

    pms_status.subscribe(function(messages) {
        if(messages.pms_charging_flag) {
            $("#charging_status").show();
            $("#battery_status").hide();
            $("#battery_level_charge").text(messages.pms_battary_level + "% ");
        } else {
            $("#charging_status").hide();
            $("#battery_status").show();
            $("#battery_level").text(messages.pms_battary_level + "% ");
        }  
    })


}

function showSpeed(linear) {
    linear = linear.toFixed(2);
        $("#linear_speed").text(linear + "m/s");
    //  $("#angular_speed").text(angular);
}