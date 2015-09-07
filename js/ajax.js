var oHot = document.getElementById('hot');				//获取最热排行div对象
var aLi = oHot.getElementsByTagName('li')				//获取最热排行ul列表下全部li标签
var oCourse = document.getElementById('course');	    //获取课程列表div对象
var aCouList = oCourse.getElementsByTagName('div');
var oPage = document.getElementById('page');			//获取课程列表页码div对象
var oLogin = document.getElementById('login');			//获取登录框对象
var oMask = document.getElementById('mask')		   		//获取遮罩层div标签ID
var oLogin = document.getElementById('login');			//获取登录框对象
var aInput = oLogin.getElementsByTagName('input')		//获取登录框文本输入框input标签
var oAttBtn = document.getElementById('att_btn');		//获取关注按钮对象
var oAtt_Icon = document.getElementById('att_Icon');	//获取关注按钮对象
var oAtted_Icon = document.getElementById('atted_Icon');//获取关注按钮对象

/* Ajax封装函数 */
function ajax(method,url,data,success) {
	var xhr = null;
	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}	

	if (method == 'GET' && data) {
		url += '?' + data;
	}	

	xhr.open(method,url);
	if (method == 'GET') {
		xhr.send();	
	} else {
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send(data);
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				success && success(xhr.responseText);
			}
		}
	}
}

/* 最热排行课程Ajax函数 */
function hotAjax(repData){	
	var data = JSON.parse(repData);
	var html = "";
	for(var i=0;i<data.length;i++){
		//创建最热排行榜课程HTML结构，将ajax返回的数据添加到结构中
		html += "<li class='f-clear'>" +   //添加清除浮动的类
					"<a href="+data[i].providerLink+" target='_blank'>"+  //获取课程连接
						"<img src="+data[i].smallPhotoUrl+">"+  		  //获取课程小图片
						"<p>"+data[i].name+"</p>"+						  //获取课程名称
					"</a>"+
					"<div class='pepIcon'>"+
						"<img src=images/icon/peopleIcon.png>"+			  //添加课程学习人数头像图标
						"<span>"+data[i].learnerCount+"</span>"+	      //获取课程学习人数
					"</div>"+
				"</li>" ;
		 
	}
	oHot.innerHTML = html;                          //将建好的HTML结构添加到最热排行版的对象中
	hotRoll();    									//调用scroImag.js中的hotRoll()函数实现最热排行课程滚动更新
}

/* 课程列表Ajax函数 */
function couListAjax(repData){
	var data = JSON.parse(repData).list;          //获取课程的列表对象
	var html = "";
	for(var i=0;i<data.length;i++){
	//创建课程列表HTML结构，将ajax返回的数据添加到结构中
	html += "<div class='cou-list'>" + 
				"<a href="+data[i].providerLink+" target='_blank'>"+ //获取课程连接
					"<img src="+data[i].middlePhotoUrl+">"+          //获取课程中等图片
					"<h1>"+data[i].name+"</h1>"+                     //获取课程名称
				"</a>"+
				"<h1>"+data[i].provider+"</h1>"+					 //获取课程提供者
				"<span>"+
					"<img src=images/icon/peopleIcon.png>"+			 //添加课程学习人数头像图标
					"<span>"+data[i].learnerCount+"</span>"+		 //获取课程学习人数
				"</span>"+
				"<p class='money'>"+"￥" + data[i].price+"</p>"+     //获取课程价格￥样式和课程价格
			"</div>" ;

	}
	oCourse.innerHTML += html;
	/* 为每个课程元素添加鼠标移入移出事件，当鼠标移入某个课程元素就触发创建课程详细浮层图层，添加在该课程列表后，鼠标
	移出时删除该图层 */
	for(var i=0;i<aCouList.length;i++){
		var html = "";
		aCouList[i].index = i;								//将每个图层的序号保存到每个图层定义的新index属性中
		aCouList[i].onmouseenter =function(){				//鼠标移入事件，在该课程列表后新建一个div浮动图层
			/* 创建课程浮层显示详细信息 */
			var oDivF = document.createElement('div');
			oDivF.className = "cou-f";								//给新建浮动层添加cou-f样式     
			oDivF.innerHTML = "<a href="+data[this.index].providerLink+" target='_blank'>"+//获取课程连接
									"<div>"+
										"<img src="+data[this.index].middlePhotoUrl+">"+   //获取课程中等图片
										"<h1>"+data[this.index].name+"</h1>"+     		   //获取该课程名称
										"<i></i>"+										   //获取课程学习人数头像
										"<span>"+data[this.index].learnerCount+"人在学"+"</span>"+//获取课程学习人数
										"<p>"+"发布者:"+data[this.index].provider+"</p>"+   //获取课程提供者
									"</div>"+				
								"</a>"+
								"<p>"+data[this.index].description+"</p>";                 //获取课程描述
			this.appendChild(oDivF);   //将新创建的浮动框添加到该鼠标移入课程中 			
		};
		/* 鼠标移出该课程框时将该悬浮框删除 */
		aCouList[i].onmouseleave = function(){
			this.removeChild(this.lastChild);
		};
	}

}

/* 判断登陆是否成功函数 */
function loginAjax(repData){
	if(repData == 1){
		alert("登陆成功!");
		oLogin.style.display = "none";	  			//登陆成功后隐藏登陆框
		oMask.className = '';			  			//隐藏遮罩层
		setCookie("loginSuc","studyOnline",14); 	/*登陆成功后将用户名loginSuc=studyOnline存入cookie中，
													  有效期为14天*/
		oAttBtn.className = "";						//将关注按钮的样式去除
		oAtt_Icon.style.display = "none";			//将关注按钮标签隐藏				  
		oAtted_Icon.style.display = "inline-block";	//显示已关注标签
		ajax("GET","http://study.163.com/webDev/attention.htm","",cookieAjax);//导航关注API
	}else{
		alert("账号或密码错误!");
		aInput[1].value = "";    		  			//每次输错密码都需重新输入密码
	}
}

/* 获取关注cookie函数 */
function cookieAjax(repData){
	if(repData == 1){								//登陆成功并且返回1，设置关注cookie，有效期为14天
		setCookie("followSuc",1,14);
	}
}