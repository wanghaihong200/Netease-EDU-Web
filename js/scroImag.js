var buttons = document.getElementById('buttons').getElementsByTagName('li');//获取导航圆点对象数组	
var index = 1;		 			//标记

/* 定义图片播放动画函数 */
function animate(i){
	if(i > 0){
		index++;
		if(index > 3){
			index = 1;
		}
	}else{
		index--;
		if(index < 1){
			index = 3;
		}
	}
	showPic();
	showButton();
}

/* 显示图片函数 */
function showPic(){
	listImg.src = "images/banner" + index +".jpg";	
	switch(index){
		case 1:	
		listImg.alt = "网易公开课";
		listImg.parentNode.href = "http://open.163.com/";break;
		case 2:
		//console.log(2);
		listImg.alt = "云课堂";
		listImg.parentNode.href = "http://study.163.com/";break;	
		case 3:
		listImg.alt = "中国大学MOOC";
		listImg.parentNode.href = "http://www.icourse163.org/";break;
		default:break;
	};
	
	listImg.style.opacity = 0;
	var speed = 0.1;
	var cur = 0;
	clearInterval(listImg.timer);
	listImg.timer = setInterval(function(){
		if(cur > 1){
			clearInterval(listImg.timer);
		}else{
			listImg.style.opacity = cur;
			cur += speed;
		}
	},50);
	
}

/* 定义图片导航圆点函数 */
function showButton(){
	for(var i=0;i<buttons.length;i++){
		if( buttons[i].className == "on" ){
		   	buttons[i].className = "";
			break;
		}
	}
	buttons[index - 1].className = "on";
}

/* 定义自动播放函数 */
function play(){
	timerRoll = setInterval(function(){
		next.onclick();		
	},5000);
}

/* 定义停止播放函数 */
function stopPlay(){
	clearInterval(timerRoll);
}

/* 最热排行课程滚动更新函数 */
function hotRoll(){
	var index = 0;   
	var bChange = true;                     //值为true时课程向上滚动，否则向下滚动
	for(var i=0;i<aLi.length;i++){			
		aLi[i].style.position = "absolute"; //给每个课程添加绝对定位来进行滚动
		aLi[i].style.top = 70 * i + "px";   //为前10门课程定好位置，每门课程高度为70
		if(i > 9){       					//后10门课程位置和第10们课程相同
			aLi[i].style.top = 630 + "px";
			startMove(aLi[i],{opacity:0});  //通过move.js中startMove函数设置透明度为0，脚本中做了透明度
											//兼容，兼容IE
		}
	}
	timerHot = setInterval(function(){         				//开启定时器，每5s执行一次
		if(bChange){                        				//bChange为true时课程向上滚动
			startMove(aLi[index],{opacity:0});				//每次运动先让最顶上的课程透明度为0
			for(var i=index+1;i<10+index;i++){				//剩余的9门课程分别移动到上一门课程高度
				startMove(aLi[i],{top:(i-(index+1))*70});
			}
			startMove(aLi[index+10],{opacity:100});			//每次隐藏的第一门课透明度变为100显示在第10个位置
			index++;										//指向第二门课程
			if(index == 10){								//判断如果10门课程移动完了开始做相反方向移动
				bChange = false;							//标志位取反向下移动
				index = 19;									//指向最后一门课程
			}
		}else{
			startMove(aLi[index],{opacity:0});
			for(var i=index-1;i>index-10;i--){
				startMove(aLi[i],{top:((i-index)+10)*70});
			}
			startMove(aLi[index-10],{opacity:100});
			index--;
			if(index == 9){
				bChange = true;
				index = 0;
			}
		}	
	},5000);
}

