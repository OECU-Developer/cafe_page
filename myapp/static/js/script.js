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
function J_data_change(J_people,J_1,J_2,J_3,J_4){
    let name=[
        "#J-now",
        "#J-1",
        "#J-2",
        "#J-3",
        "#J-4",
        "#J-5",
    ]
    let border_bottom_style=[
        {"border-bottom":"3px solid #42a5f5"},
        {"border-bottom":"3px solid #79d8b8"},
        {"border-bottom":"3px solid #ffd659"},
        {"border-bottom":"3px solid #ff5a4e"},
    ]
    let background_color_style=[
        {"background-color":"white"},
    ]

    for(let i=0;i<6;i++){
        $(name[i]).css(background_color_style[0]);
        if(J_1<=J_people[i]&&J_people[i]<J_2){
            $(name[i]).css(border_bottom_style[0]);
        }
        else if(J_2<=J_people[i]&&J_people[i]<J_3){
            $(name[i]).css(border_bottom_style[1]);
        }
        else if(J_3<=J_people[i]&&J_people[i]<J_4){
            $(name[i]).css(border_bottom_style[2]);
        }
        else{
            $(name[i]).css(border_bottom_style[3]);
        }
    }
}

function change_J_people(count){
    J_people_data()
    J_change_screeen(count)
}

function J_people_data(){
    
    var min = 0 ;
    var max = 100 ;
    
    
    people_now=Math.floor( Math.random() * (max + 1 - min) ) + min ;
    people_1=Math.floor( Math.random() * (max + 1 - min) ) + min ;
    people_2=Math.floor( Math.random() * (max + 1 - min) ) + min ;
    people_3=Math.floor( Math.random() * (max + 1 - min) ) + min ;
    people_4=Math.floor( Math.random() * (max + 1 - min) ) + min ;
    people_5=Math.floor( Math.random() * (max + 1 - min) ) + min ;

}

function J_change_screeen(count){
    J_1=0;
    J_2=50;
    J_3=70;
    J_4=100;
    
    //アイコン
    comment_icon1="<i class='far fa-clock'></i>";
    comment_icon2="<i class='fas fa-exclamation-triangle'></i>";
    //コメント
    comment1=" 空いています";
    comment2=" やや混雑しています";
    comment3=" 混雑しています";
    comment4=" 大変、混雑しています";

    let J_people=[
        people_now,
        people_1,
        people_2,
        people_3,
        people_4,
        people_5,
    ]
    let name=[
        "#J-now",
        "#J-1",
        "#J-2",
        "#J-3",
        "#J-4",
        "#J-5",
    ]
    let name2=[
        "現在",
        "1分後",
        "2分後",
        "3分後",
        "4分後",
        "5分後",
    ]

    let border_bottom_style=[
        {"border-bottom":"3px solid #42a5f5"},
        {"border-bottom":"3px solid #79d8b8"},
        {"border-bottom":"3px solid #ffd659"},
        {"border-bottom":"3px solid #ff5a4e"},
    ]
    let background_color_style=[
        {"background-color":"#42a5f5"},
        {"background-color":"#79d8b8"},
        {"background-color":"#ffd659"},
        {"background-color":"#ff5a4e"},
    ]
    let src_style=[
        {"src":"../static/images/icon1.png"},
        {"src":"../static/images/icon2.png"},
        {"src":"../static/images/icon3.png"},
        {"src":"../static/images/icon4.png"},
    ]

    if(count==0)J_count=0;
    else if(count==1)J_count=1;
    else if(count==2)J_count=2;
    else if(count==3)J_count=3;
    else if(count==4)J_count=4;
    else if(count==5)J_count=5;
    else if(count==-1)J_count=5;
    else J_count=0;

    J_data_change(J_people,J_1,J_2,J_3,J_4)
    if(J_1<=J_people[J_count]&&J_people[J_count]<J_2){
        $("#J_time").html(name2[J_count]);
        $("#J-information").html(comment_icon1+comment1);
        $("#J-Number-of-people").html(J_people[J_count]);
        $(name[J_count]).css(border_bottom_style[0]);
        $(name[J_count]).css(background_color_style[0]);
        $("#J-icon").attr(src_style[0]);
    }
    else if(J_2<=J_people[J_count]&&J_people[J_count]<J_3){
        $("#J_time").html(name2[J_count]);
        $("#J-information").html(comment_icon2+comment2);
        $("#J-Number-of-people").html(J_people[J_count]);
        $(name[J_count]).css(border_bottom_style[1]);
        $(name[J_count]).css(background_color_style[1]);
        $("#J-icon").attr(src_style[1]);
    }
    else if(J_3<=J_people[J_count]&&J_people[J_count]<J_4){
        $("#J_time").html(name2[J_count]);
        $("#J-information").html(comment_icon2+comment3);
        $("#J-Number-of-people").html(J_people[J_count]);
        $(name[J_count]).css(border_bottom_style[2]);
        $(name[J_count]).css(background_color_style[2]);
        $("#J-icon").attr(src_style[2]);
    }
    else{
        $("#J_time").html(name2[J_count]);
        $("#J-information").html(comment_icon2+comment4);
        $("#J-Number-of-people").html(J_people[J_count]);
        $(name[J_count]).css(border_bottom_style[3]);
        $(name[J_count]).css(background_color_style[3]);
        $("#J-icon").attr(src_style[3]);
    }
    
    if(0<=count&&count<=5)return count;
    else if(count==-1)return 5;
    else return 0;

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