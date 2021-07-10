window.addEventListener('load', function(){
    deSVG('.desvg', true);
});

var isHoliday;
let people_all=[]
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
        people_all = JSON.parse(people.Result);
  
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

function change_screen_pc(count){
    //アイコン
    comment_icon1="";
    comment_icon2="<i class='fas fa-exclamation-triangle'></i>";
    //コメント
    comment1=" 空いています";
    comment2=" やや混雑しています";
    comment3=" 混雑しています";
    comment4=" 大変、混雑しています";
    //アイコンpng
   let src_style=[
       {"src":"../static/images/icon1.png"},
       {"src":"../static/images/icon2.png"},
       {"src":"../static/images/icon3.png"},
       {"src":"../static/images/icon4.png"},
   ]
   //色
   let background_color_style=[
       {"background-color":"#42a5f5"},
       {"background-color":"#79d8b8"},
       {"background-color":"#ffd659"},
       {"background-color":"#ff5a4e"},
       {"background-color":"white"},
   ]

   let border_bottom_style=[
       {"border-bottom":"6px solid #42a5f5"},
       {"border-bottom":"6px solid #79d8b8"},
       {"border-bottom":"6px solid #ffd659"},
       {"border-bottom":"6px solid #ff5a4e"},
   ]

   let name=[
       ["#J-now","#J-1","#J-5",],
       ["#Z-now","#Z-1","#Z-5",]
   ];
  
let jz=[
    ["#J-Number-of-people","#J-icon","#J-information"],
    ["#Z-Number-of-people","#Z-icon","#Z-information"]
]
//混雑度の範囲
   let range=[
       [0,15,20,45], //ｊ号館
       [0,45,60,100]//z号館
   ]
//現在、1分後、5分後の人数   

let j_people=people_all.j_merged_num
let z_people=people_all.z_merged_num

let people=[
    [j_people[0],j_people[1],j_people[5]],
    [z_people[0],z_people[1],z_people[5]]
]

//borderの色の変更
 for(j=0;j<2;j++){
for(i=0;i<3;i++){
   if(range[j][0]<=people[j][i]&&people[j][i]<range[j][1]){
       $(name[j][i]).css(border_bottom_style[0]);
   }
   else if(range[j][1]<=people[j][i]&&people[j][i]<range[j][2]){
       $(name[j][i]).css(border_bottom_style[1]);
   }
   else if(range[j][2]<=people[j][i]&&people[j][i]<range[j][3]){
       $(name[j][i]).css(border_bottom_style[2]);
   }
   else{
       $(name[j][i]).css(border_bottom_style[3]);
   }
}
}

for(j=0;j<2;j++){
for(i=0;i<3;i++){
if(count==i){
   $(jz[j][0]).html(people[j][i]);//人数変更

   if(i==0){
   $(name[j][1]).css(background_color_style[4]);
   $(name[j][2]).css(background_color_style[4]);
   }
   else if(i==1){
       $(name[j][0]).css(background_color_style[4]);
       $(name[j][2]).css(background_color_style[4]);
   }
   else if(i==2){
       $(name[j][0]).css(background_color_style[4]);
       $(name[j][1]).css(background_color_style[4]);
   }

   if(range[j][0]<=people[j][i]&&people[j][i]<range[j][1]){
       $(name[j][i]).css(background_color_style[0]);
       $(jz[j][1]).attr(src_style[0]);
       $(jz[j][2]).html(comment_icon1+comment1);
       
         }
   else if(range[j][1]<=people[j][i]&&people[j][i]<range[j][2]){
       $(name[j][i]).css(background_color_style[1]);
       $(jz[j][1]).attr(src_style[1]);
       $(jz[j][2]).html(comment_icon2+comment2);
   }
   else if(range[j][2]<=people[j][i]&&people[j][i]<range[j][3]){
       $(name[j][i]).css(background_color_style[2]);
       $(jz[j][1]).attr(src_style[2]);
       $(jz[j][2]).html(comment_icon2+comment3);
   }
   else{
       $(name[j][i]).css(background_color_style[3]);
       $(jz[j][1]).attr(src_style[3]);
       $(jz[j][2]).html(comment_icon2+comment4);
   }
}
}
}

   if(count==0){
       return 1;
   }
   else if(count==1){
       return 2;
   }
   else if(count==2){
       return 0;
   }
}