window.addEventListener('load', (e) => {
    menu_switch();
});

function rotate(rotate_id) {
    console.log("rotate");
    if (!rotate_id) {
        alert("Please enter degree");
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
        window.location.href = $camera_url + '/axis-cgi/com/ptz.cgi?move=' + $move;
    })
}

function menu_switch() {
    $(".auto").on('click', function() {
        $(".timer_lbl").hide();
        $(".timer").hide();
        $(".auto").addClass('active');
        $(".manual").removeClass('active');
    });

    $(".manual").on('click', function() {
        $(".timer_lbl").show();
        $(".timer").show();
        $(".manual").addClass('active');
        $(".auto").removeClass('active');
    });
}