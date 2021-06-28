window.addEventListener('load', function(){
    deSVG('.desvg', true);
});

var isHoliday;
window.onload = function () {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var youbi = today.getDay();
  var date = (year).toString() + "/" + (month).toString(); + "/" + (day).toString();
  if (Holiday.getHolidayName(new Date(date)) === ""&&youbi!==0&&youbi!==6) {
    isHoliday = 0;
  }
  else isHoliday = 1;
}


function getcurrdata() {
    $.ajax({
        type: 'POST',
        url: '/people',
        people: '',
        contentType: 'application/json'
    })
      .done((people) => {
        // データ取得成功
        console.log("success");
        // JSONからデータ抽出
        var json_data = JSON.parse(people.Result);
        const j_merged_num = json_data.j_merged_num;
        const z_merged_num = json_data.z_merged_num;
        const date = json_data.date;

        // if (j_merged_num < 50 && j_merged_num >= 0) {
        //     $("#j_merged_num").attr("src", "../static/images/empty.png");
        //     $("#j-title").css("background-color","#42a5f5");
        // } else if (j_merged_num < 70 && j_merged_num >= 50) {
        //     $("#j_merged_num").attr("src", "../static/images/little_empty.png");
        //     $("#j-title").css("background-color","#79d8b8");
        // } else if (j_merged_num < 100 && j_merged_num >= 70) {
        //     $("#j_merged_num").attr("src", "../static/images/little_crowded.png");
        //     $("#j-title").css("background-color","#ffd659");
        // } else if (j_merged_num < 1000 && j_merged_num >= 100) {
        //     $("#j_merged_num").attr("src", "../static/images/crowded.png");
        //     $("#j-title").css("background-color","#ff5a4e");
        // } else {
        //     $("#j_merged_num").html("Sorry...No Content");
        // }

        // $("#h2_j_merged_num").html("推定人数：" + j_merged_num);

        // if (z_merged_num < 50 && z_merged_num >= 0) {
        //     $("#z_merged_num").attr("src", "../static/images/empty.png");
        //     $("#z-title").css("background-color","#42a5f5");
        // } else if (z_merged_num < 70 && z_merged_num >= 50) {
        //     $("#z_merged_num").attr("src", "../static/images/little_empty.png");
        //     $("#z-title").css("background-color","#79d8b8");
        // } else if (z_merged_num < 100 && z_merged_num >= 70) {
        //     $("#z_merged_num").attr("src", "../static/images/little_crowded.png");
        //     $("#z-title").css("background-color","#ffd659");
        // } else if (z_merged_num < 1000 && z_merged_num >= 100) {
        //     $("#z_merged_num").attr("src", "../static/images/crowded.png");
        //     $("#z-title").css("background-color","#ff5a4e");
        // } else {
        //     $("#z_merged_num").html("Sorry...No Content");
        // }

      $("#h2_z_merged_num").html("推定人数：" + z_merged_num);

    })
    .fail( (people) => {
        console.log("error");
    });
}


/**
 * J 号館のグラフ
 */
function jChart() {
const config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "実測値",
            backgroundColor: 'rgba(66, 165, 245, 0.3)',
            borderColor: '#42a5f5',
            data: [],
            fill: true,
        }],
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Creating Real-Time Charts with Flask'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                    display: true,
                    id: 'jChart',
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                }
            }]
        }
    }

};


const context = document.getElementById('jChart').getContext('2d');

const lineChart = new Chart(context, config);

const source = new EventSource("/chart-data");

source.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (config.data.labels.length === 20) {
        config.data.labels.shift();
        config.data.datasets[0].data.shift();
    }
    config.data.labels.push(data.time);
    config.data.datasets[0].data.push(data.j_value);
    lineChart.update();
}
};



/**
 * Z 号館のグラフ
 */
function zChart() {
const config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "実測値",
            backgroundColor: 'rgba(66, 165, 245, 0.3)',
            borderColor: '#42a5f5',
            data: [],
            fill: true,
        }],
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Creating Real-Time Charts with Flask'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
        xAxes: [{
                ticks: {
                maxRotation: 90,
                minRotation: 90
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        }
    }
};

const context = document.getElementById('zChart').getContext('2d');

const lineChart = new Chart(context, config);

const source = new EventSource("/chart-data");

source.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (config.data.labels.length === 20) {
        config.data.labels.shift();
        config.data.datasets[0].data.shift();
    }
    config.data.labels.push(data.time);
    config.data.datasets[0].data.push(data.z_value);
    lineChart.update();
}
};

$('.slider-input').jRange({
    from: -180,
    to: 180,
    step: 15,
    scale: [-180,-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180],
    format: '%s',
    width: '100%',
    theme: "theme-blue",
    showLabels: false,
});


var range = document.getElementById('range');

noUiSlider.create(range, {
    start: [ 20, 80 ], // Handle start position
    step: 10, // Slider moves in increments of '10'
    margin: 20, // Handles must be more than '20' apart
    connect: true, // Display a colored bar between the handles
    direction: 'rtl', // Put '0' at the bottom of the slider
    orientation: 'vertical', // Orient the slider vertically
    behaviour: 'tap-drag', // Move handle on tap, bar is draggable
    range: { // Slider can select '0' to '100'
        'min': 0,
        'max': 100
    },
    pips: { // Show a scale with the slider
        mode: 'steps',
        density: 2
    }
});

var valueInput = document.getElementById('value-input'),
        valueSpan = document.getElementById('value-span');

// When the slider value changes, update the input and span
range.noUiSlider.on('update', function( values, handle ) {
    if ( handle ) {
        valueInput.value = values[handle];
    } else {
        valueSpan.innerHTML = values[handle];
    }
});

// When the input changes, set the slider value
valueInput.addEventListener('change', function(){
    range.noUiSlider.set([null, this.value]);
});



//試し

function J_change_screeen(count){
    if(count==0){
        $("#J_time").html("現在");
        $(".information").html("<i class='far fa-clock'></i> 現在、空いています");
        $("#J-icon").attr("src", "../static/images/icon1.png");
        $("#J-Number-of-people").html("30");
        $("#J-5").css("border-bottom","4px solid white");
        $("#J-1").css("border-bottom","4px solid white");
        $("#J-now").css("border-bottom","4px solid black");
        return count;
    }else if(count==1){
        $("#J_time").html("１分後");
        $(".information").html("<i class='fas fa-exclamation-triangle'></i> 1分後、やや混雑します");
        $("#J-Number-of-people").html("45");
        $("#J-icon").attr("src", "../static/images/icon2.png");
        $("#J-now").css("border-bottom","4px solid white");
        $("#J-2").css("border-bottom","4px solid white");
        $("#J-1").css("border-bottom","4px solid black");
        return count;
    }else if(count==2){
        $("#J_time").html("2分後");
        $("#J-1").css("border-bottom","4px solid white");
        $("#J-3").css("border-bottom","4px solid white");
        $("#J-2").css("border-bottom","4px solid black");
        return count;
    }else if(count==3){
        $("#J_time").html("3分後");
        $("#J-2").css("border-bottom","4px solid white");
        $("#J-4").css("border-bottom","4px solid white");
        $("#J-3").css("border-bottom","4px solid black");
        return count;
    }else if(count==4){
        $("#J_time").html("4分後");
        $("#J-3").css("border-bottom","4px solid white");
        $("#J-5").css("border-bottom","4px solid white");
        $("#J-4").css("border-bottom","4px solid black");
        return count;
    }else if(count==5){
        $("#J_time").html("5分後");
        $("#J-4").css("border-bottom","4px solid white");
        $("#J-now").css("border-bottom","4px solid white");
        $("#J-5").css("border-bottom","4px solid black");
        return count;
    }else if(count==-1){
        $("#J_time").html("5分後");
        $("#J-now").css("border-bottom","4px solid white");
        $("#J-5").css("border-bottom","4px solid black");
        return 5;
    }else{
        $("#J_time").html("現在");
        $("#J-5").css("border-bottom","4px solid white");
        $("#J-now").css("border-bottom","4px solid black");
        return 0;
    }
}
function Z_change_screeen(count){
    if(count==0){
        $("#Z_time").html("現在");
        return count;
    }else if(count==1){
        $("#Z_time").html("１分後");
        return count;
    }else if(count==2){
        $("#Z_time").html("2分後");
        return count;
    }else if(count==3){
        $("#Z_time").html("3分後");
        return count;
    }else if(count==4){
        $("#Z_time").html("4分後");
        return count;
    }else if(count==5){
        $("#Z_time").html("5分後");
        return count;
    }else if(count==-1){
        $("#Z_time").html("5分後");
        return 5;
    }else{
        $("#Z_time").html("現在");
        return 0;
    }
}