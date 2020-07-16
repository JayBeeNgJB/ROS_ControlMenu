window.addEventListener('load', (e) => {
  current_page();

  console.log("Loading control.. ");
});

// Connecting to ROS

var ros = new ROSLIB.Ros({
  url : 'ws://192.168.200.145:9090'
 });

 ros.on('connection', function() {
     status();
     console.log('Connected to websocket server.');
 });

 ros.on('error', function(error) {
     console.log('Error connecting to websocket server: ', error);
 });
 
 ros.on('close', function() {
     console.log('Connection to websocket server closed.');
 });

 // Publishing a Topic

 var cmdVel = new ROSLIB.Topic({
     ros : ros,
     name : '/cmd_vel',
     messageType : 'geometry_msgs/Twist'
 });

 var interval;
 var LINEAR = 2;
 var ANGULAR = 2;

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
     $(".btn_speed_up").click(function() {
         LINEAR = LINEAR + 0.1;
         console.log(LINEAR)
     });

     $(".btn_speed_down").click(function() {
         if (LINEAR > 0.1) {
             console.log("over 0");
             LINEAR = LINEAR - 0.1;
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

     $(".subcribe").click(function() {
         console.log("Subcribe");
         var subcribe_cmd = new ROSLIB.Topic({
             ros : ros,
             name : '/rosapi/get_loggers',
             messageType : 'turtlesim/Pose'
         });

     });

 });

 function UP() {
   publishData(LINEAR , 0, 0, 0, 0, 0);  
 }

 function DOWN() {
   publishData(0 - LINEAR, 0, 0, 0, 0, 0);  
 }

 function LEFT() {
     publishData(0, 0, 0, 0, 0, ANGULAR);  
 }

 function RIGHT() {
   publishData(0, 0, 0, 0, 0, 0 - ANGULAR); 
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

 function status() {
     $("#robot_status").text("Connected");
     $("#robot_status").css("color", "green");
 }

 function showSpeed(linear, angular) {
     $("#linear_speed").text(linear);
     $("#angular_speed").text(angular);
 }