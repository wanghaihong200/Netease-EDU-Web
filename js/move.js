/**
 * 获取对象样式值
 */
function getStyle(obj,name)
{
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}
	else{
		return getComputedStyle(obj,null)[name];
	}
}
/**
 * [运动函数]
 * @param  {[type]} obj   [调用对象]
 * @param  {[type]} json  [传输过来的数据]
 * @param  {[type]} fnEnd [回调函数]
 * @return {[type]}       [description]
 */
function startMove(obj,json,fnEnd){
	clearInterval(obj.timer);               //每次运动前清掉对象中的原有的定时器，防止运动叠加
	obj.timer = setInterval(function(){ 
		var bStop = true;				    //标记位，判断运动是否完成
		for(var name in json){             //遍历传输过来的json值
			var iTarget = json[name];
			if(name == 'opacity'){         //将透明度与其他属性值分开处理
				var cur = Math.round(parseFloat(getStyle(obj,name))*100);
			}else{
				var cur = parseInt(getStyle(obj,name));
			}
			var speed = (iTarget-cur)/2;   //运动速度
			speed = speed > 0 ? Math.ceil(speed):Math.floor(speed);    //如果速度大于0,则speed向上取整，否则向下取整，避免运动无法完成
			if(name == 'opacity'){									//对opacity进行另外处理，进行兼容性处理
				obj.style.filter = 'alpha(opacity:'+(cur+speed)+')';   
				obj.style.opacity = (cur+speed)/100;
			}else{
				obj.style[name] = cur + speed + 'px';             //其他值赋值
			}
			if(cur != iTarget){                        //标记位，判断当前值是否与目标值相等
				bStop = false;
			}
		}
		if(bStop){                         //如果全部值都相等，bStop标记为为true，说明全部属性都运动完成，清掉定时器
			clearInterval(obj.timer);
			
			if(fnEnd)                      //如果有回调函数，处理回调函数
			{
				fnEnd();
			}
		}
	},50);
}