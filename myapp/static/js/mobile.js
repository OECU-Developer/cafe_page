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



//J号館
function J_data_change(J_people,J_1,J_2,J_3,J_4){
  let J_name=[
      ".J-now",
      ".J-1",
      ".J-2",
      ".J-3",
      ".J-4",
      ".J-5",
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
      $(J_name[i]).css(background_color_style[0]);
      if(J_1<=J_people[i]&&J_people[i]<J_2){
          $(J_name[i]).css(border_bottom_style[0]);
      }
      else if(J_2<=J_people[i]&&J_people[i]<J_3){
          $(J_name[i]).css(border_bottom_style[1]);
      }
      else if(J_3<=J_people[i]&&J_people[i]<J_4){
          $(J_name[i]).css(border_bottom_style[2]);
      }
      else{
          $(J_name[i]).css(border_bottom_style[3]);
      }
  }
}



function J_change_screeen(Jcount){
  J_1=0;
  J_2=15;
  J_3=20;
  J_4=45;
  
  //アイコン
  comment_icon1="";
  comment_icon2="<i class='fas fa-exclamation-triangle'></i>";
  //コメント
  comment1=" 空いています";
  comment2=" やや混雑しています";
  comment3=" 混雑しています";
  comment4=" 大変、混雑しています";

  let J_people=people_all.j_merged_num
  let J_name=[
      ".J-now",
      ".J-1",
      ".J-2",
      ".J-3",
      ".J-4",
      ".J-5",
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

  if(Jcount==0)J_count=0;
  else if(Jcount==1)J_count=1;
  else if(Jcount==2)J_count=2;
  else if(Jcount==3)J_count=3;
  else if(Jcount==4)J_count=4;
  else if(Jcount==5)J_count=5;
  else if(Jcount==-1)J_count=5;
  else J_count=0;

  J_data_change(J_people,J_1,J_2,J_3,J_4)
  if(J_1<=J_people[J_count]&&J_people[J_count]<J_2){
      $(".J_time").html(name2[J_count]);
      $(".J-information").html(comment_icon1+comment1);
      $(".J-Number-of-people").html(J_people[J_count]);
      $(J_name[J_count]).css(border_bottom_style[0]);
      $(J_name[J_count]).css(background_color_style[0]);
      $(".J-icon").attr(src_style[0]);
  }
  else if(J_2<=J_people[J_count]&&J_people[J_count]<J_3){
      $(".J_time").html(name2[J_count]);
      $(".J-information").html(comment_icon2+comment2);
      $(".J-Number-of-people").html(J_people[J_count]);
      $(J_name[J_count]).css(border_bottom_style[1]);
      $(J_name[J_count]).css(background_color_style[1]);
      $(".J-icon").attr(src_style[1]);
  }
  else if(J_3<=J_people[J_count]&&J_people[J_count]<J_4){
      $(".J_time").html(name2[J_count]);
      $(".J-information").html(comment_icon2+comment3);
      $(".J-Number-of-people").html(J_people[J_count]);
      $(J_name[J_count]).css(border_bottom_style[2]);
      $(J_name[J_count]).css(background_color_style[2]);
      $(".J-icon").attr(src_style[2]);
  }
  else{
      $(".J_time").html(name2[J_count]);
      $(".J-information").html(comment_icon2+comment4);
      $(".J-Number-of-people").html(J_people[J_count]);
      $(J_name[J_count]).css(border_bottom_style[3]);
      $(J_name[J_count]).css(background_color_style[3]);
      $(".J-icon").attr(src_style[3]);
    }
    
    if(0<=Jcount&&Jcount<=5)return Jcount;
    else if(Jcount==-1)return 5;
    else return 0;

}


//Z号館
function Z_data_change(Z_people,Z_1,Z_2,Z_3,Z_4){
  let Z_name=[
      ".Z-now",
      ".Z-1",
      ".Z-2",
      ".Z-3",
      ".Z-4",
      ".Z-5",
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
      $(Z_name[i]).css(background_color_style[0]);
      if(Z_1<=Z_people[i]&&Z_people[i]<Z_2){
          $(Z_name[i]).css(border_bottom_style[0]);
      }
      else if(Z_2<=Z_people[i]&&Z_people[i]<Z_3){
          $(Z_name[i]).css(border_bottom_style[1]);
      }
      else if(Z_3<=Z_people[i]&&Z_people[i]<Z_4){
          $(Z_name[i]).css(border_bottom_style[2]);
      }
      else{
          $(Z_name[i]).css(border_bottom_style[3]);
      }
  }
}


function Z_change_screeen(Zcount){
  Z_1=0;
  Z_2=45;
  Z_3=60;
  Z_4=100;
  
  //アイコン
  comment_icon1="";
  comment_icon2="<i class='fas fa-exclamation-triangle'></i>";
  //コメント
  comment1=" 空いています";
  comment2=" やや混雑しています";
  comment3=" 混雑しています";
  comment4=" 大変、混雑しています";

  let Z_people=people_all.z_merged_num
  let Z_name=[
      ".Z-now",
      ".Z-1",
      ".Z-2",
      ".Z-3",
      ".Z-4",
      ".Z-5",
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

  if(Zcount==0)Z_count=0;
  else if(Zcount==1)Z_count=1;
  else if(Zcount==2)Z_count=2;
  else if(Zcount==3)Z_count=3;
  else if(Zcount==4)Z_count=4;
  else if(Zcount==5)Z_count=5;
  else if(Zcount==-1)Z_count=5;
  else Z_count=0;

  Z_data_change(Z_people,Z_1,Z_2,Z_3,Z_4)
  if(Z_1<=Z_people[Z_count]&&Z_people[Z_count]<Z_2){
      $(".Z_time").html(name2[Z_count]);
      $(".Z-information").html(comment_icon1+comment1);
      $(".Z-Number-of-people").html(Z_people[Z_count]);
      $(Z_name[Z_count]).css(border_bottom_style[0]);
      $(Z_name[Z_count]).css(background_color_style[0]);
      $(".Z-icon").attr(src_style[0]);
  }
  else if(Z_2<=Z_people[Z_count]&&Z_people[Z_count]<Z_3){
      $(".Z_time").html(name2[Z_count]);
      $(".Z-information").html(comment_icon2+comment2);
      $(".Z-Number-of-people").html(Z_people[Z_count]);
      $(Z_name[Z_count]).css(border_bottom_style[1]);
      $(Z_name[Z_count]).css(background_color_style[1]);
      $(".Z-icon").attr(src_style[1]);
  }
  else if(Z_3<=Z_people[Z_count]&&Z_people[Z_count]<Z_4){
      $(".Z_time").html(name2[Z_count]);
      $(".Z-information").html(comment_icon2+comment3);
      $(".Z-Number-of-people").html(Z_people[Z_count]);
      $(Z_name[Z_count]).css(border_bottom_style[2]);
      $(Z_name[Z_count]).css(background_color_style[2]);
      $(".Z-icon").attr(src_style[2]);
  }
  else{
      $(".Z_time").html(name2[Z_count]);
      $(".Z-information").html(comment_icon2+comment4);
      $(".Z-Number-of-people").html(Z_people[Z_count]);
      $(Z_name[Z_count]).css(border_bottom_style[3]);
      $(Z_name[Z_count]).css(background_color_style[3]);
      $(".Z-icon").attr(src_style[3]);
  }
  
  if(0<=Zcount&&Zcount<=5)return Zcount;
  else if(Zcount==-1)return 5;
  else return 0;

}

//J号館詳細
function J_details(){

    J_1=0;
    J_2=15;
    J_3=20;
    J_4=45;
    
    //アイコン
    J_details_comment_icon1="<i class='fas fa-exclamation-triangle'></i>";//注意マーク
    J_details_comment_icon2="<i class='fas fa-arrow-circle-up'></i>"//上
    J_details_comment_icon3="<i class='fas fa-arrow-circle-down'></i>"//下
    J_details_comment_icon4="<i class='fas fa-arrow-circle-right'></i>"//横

    //コメント
    comment1=" 空いています";
    comment2=" やや混雑しています";
    comment3=" 混雑しています";
    comment4=" 大変、混雑しています";

    J_details_comment1="空きあり";
    J_details_comment2="やや混雑";
    J_details_comment3=" 混雑中 ";
    J_details_comment4="大変混雑";
  
    let J_people=people_all.j_merged_num
    let J_details_icon_name=[
        "#J-details-1-icon",
        "#J-details-2-icon",
        "#J-details-3-icon",
        "#J-details-4-icon",
        "#J-details-5-icon",
    ]
    let J_details_fas_name=[
        "#J-details-1-fas",
        "#J-details-2-fas",
        "#J-details-3-fas",
        "#J-details-4-fas",
        "#J-details-5-fas",
    ]
    let J_details_comment_name=[
        "#J-details-1-comment",
        "#J-details-2-comment",
        "#J-details-3-comment",
        "#J-details-4-comment",
        "#J-details-5-comment",
    ]
    let src_style=[
        {"src":"../static/images/icon1.png"},
        {"src":"../static/images/icon2.png"},
        {"src":"../static/images/icon3.png"},
        {"src":"../static/images/icon4.png"},
    ]
    for(i=0;i<5;i++){
        if(J_1<=J_people[i+1]&&J_people[i+1]<J_2){
            $(J_details_icon_name[i]).attr(src_style[0]);
            //アイコン
            if((J_people[i+1]-J_people[0])>0){
                if((J_people[i+1]-J_people[0])>=100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else if((J_people[i+1]-J_people[0])<0){
                if((J_people[i+1]-J_people[0])<=-100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else{
                $(J_details_fas_name[i]).html(J_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(J_details_comment_name[i]).html(J_details_comment1);
            //コメント
        }
        else if(J_2<=J_people[i+1]&&J_people[i+1]<J_3){
            $(J_details_icon_name[i]).attr(src_style[1]);
            //アイコン
            if((J_people[i+1]-J_people[0])>0){
                if((J_people[i+1]-J_people[0])>=100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else if((J_people[i+1]-J_people[0])<0){
                if((J_people[i+1]-J_people[0])<=-100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else{
                $(J_details_fas_name[i]).html(J_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(J_details_comment_name[i]).html(J_details_comment2);
            //コメント
        }
        else if(J_3<=J_people[i+1]&&J_people[i+1]<J_4){
            $(J_details_icon_name[i]).attr(src_style[2]);
            //アイコン
            if((J_people[i+1]-J_people[0])>0){
                if((J_people[i+1]-J_people[0])>=100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else if((J_people[i+1]-J_people[0])<0){
                if((J_people[i+1]-J_people[0])<=-100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else{
                $(J_details_fas_name[i]).html(J_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(J_details_comment_name[i]).html(J_details_comment3);
            //コメント
        }
        else{
            $(J_details_icon_name[i]).attr(src_style[3]);
            //アイコン
            if((J_people[i+1]-J_people[0])>0){
                if((J_people[i+1]-J_people[0])>=100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon2+"<br>"+"+"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else if((J_people[i+1]-J_people[0])<0){
                if((J_people[i+1]-J_people[0])<=-100){
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(J_details_fas_name[i]).html(J_details_comment_icon3+"<br>"+(J_people[i+1]-J_people[0])+"人");
                }
            }
            else{
                $(J_details_fas_name[i]).html(J_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(J_details_comment_name[i]).html(J_details_comment4);
            //コメント
        }
    }

  }


//Z号館詳細
function Z_details(){

    Z_1=0;
    Z_2=45;
    Z_3=60;
    Z_4=00;
    
    //アイコン
    Z_details_comment_icon1="<i class='fas fa-exclamation-triangle'></i>";//注意マーク
    Z_details_comment_icon2="<i class='fas fa-arrow-circle-up'></i>"//上
    Z_details_comment_icon3="<i class='fas fa-arrow-circle-down'></i>"//下
    Z_details_comment_icon4="<i class='fas fa-arrow-circle-right'></i>"//横

    //コメント
    comment1=" 空いています";
    comment2=" やや混雑しています";
    comment3=" 混雑しています";
    comment4=" 大変、混雑しています";

    Z_details_comment1="空きあり";
    Z_details_comment2="やや混雑";
    Z_details_comment3=" 混雑中 ";
    Z_details_comment4="大変混雑";
  
    let Z_people=people_all.z_merged_num
    let Z_details_icon_name=[
        "#Z-details-1-icon",
        "#Z-details-2-icon",
        "#Z-details-3-icon",
        "#Z-details-4-icon",
        "#Z-details-5-icon",
    ]
    let Z_details_fas_name=[
        "#Z-details-1-fas",
        "#Z-details-2-fas",
        "#Z-details-3-fas",
        "#Z-details-4-fas",
        "#Z-details-5-fas",
    ]
    let Z_details_comment_name=[
        "#Z-details-1-comment",
        "#Z-details-2-comment",
        "#Z-details-3-comment",
        "#Z-details-4-comment",
        "#Z-details-5-comment",
    ]
    let src_style=[
        {"src":"../static/images/icon1.png"},
        {"src":"../static/images/icon2.png"},
        {"src":"../static/images/icon3.png"},
        {"src":"../static/images/icon4.png"},
    ]
    for(i=0;i<5;i++){
        if(Z_1<=Z_people[i+1]&&Z_people[i+1]<Z_2){
            $(Z_details_icon_name[i]).attr(src_style[0]);
            //アイコン
            if((Z_people[i+1]-Z_people[0])>0){
                if((Z_people[i+1]-Z_people[0])>=100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else if((Z_people[i+1]-Z_people[0])<0){
                if((Z_people[i+1]-Z_people[0])<=-100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else{
                $(Z_details_fas_name[i]).html(Z_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(Z_details_comment_name[i]).html(Z_details_comment1);
            //コメント
        }
        else if(Z_2<=Z_people[i+1]&&Z_people[i+1]<Z_3){
            $(Z_details_icon_name[i]).attr(src_style[1]);
            //アイコン
            if((Z_people[i+1]-Z_people[0])>0){
                if((Z_people[i+1]-Z_people[0])>=100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else if((Z_people[i+1]-Z_people[0])<0){
                if((Z_people[i+1]-Z_people[0])<=-100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else{
                $(Z_details_fas_name[i]).html(Z_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(Z_details_comment_name[i]).html(Z_details_comment2);
            //コメント
        }
        else if(Z_3<=Z_people[i+1]&&Z_people[i+1]<Z_4){
            $(Z_details_icon_name[i]).attr(src_style[2]);
            //アイコン
            if((Z_people[i+1]-Z_people[0])>0){
                if((Z_people[i+1]-Z_people[0])>=100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else if((Z_people[i+1]-Z_people[0])<0){
                if((Z_people[i+1]-Z_people[0])<=-100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else{
                $(Z_details_fas_name[i]).html(Z_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(Z_details_comment_name[i]).html(Z_details_comment3);
            //コメント
        }
        else{
            $(Z_details_icon_name[i]).attr(src_style[3]);
            //アイコン
            if((Z_people[i+1]-Z_people[0])>0){
                if((Z_people[i+1]-Z_people[0])>=100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon2+"<br>"+"+"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else if((Z_people[i+1]-Z_people[0])<0){
                if((Z_people[i+1]-Z_people[0])<=-100){
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+"-99人");
                }
                else{
                    $(Z_details_fas_name[i]).html(Z_details_comment_icon3+"<br>"+(Z_people[i+1]-Z_people[0])+"人");
                }
            }
            else{
                $(Z_details_fas_name[i]).html(Z_details_comment_icon4+"<br>"+"±0人");
            }
            //人数
            $(Z_details_comment_name[i]).html(Z_details_comment4);
            //コメント
        }
    }

  }
