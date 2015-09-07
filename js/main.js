/* 主函数 */
window.onload = function(){
	/* 获取元素对象 */
	var oHeaderTop = document.getElementById('headerTop');	//获取顶栏不再提醒div对象
	var oCloseTop = document.getElementById('closeTop');	//获取顶栏不再提醒关闭按钮对象
	var images = document.getElementById('m-image');    	//获取轮播图整个区域div对象ID
	var listImg = document.getElementById('listImg');   	//获取单张图片img对象ID
	var prev = document.getElementById('prev');		    	//获取轮播图<箭头对象ID
	var next = document.getElementById('next');         	//获取轮播图>箭头对象ID
	var playBtn = document.getElementById('playBtn');   	//获取机构介绍视频播放按钮img图像ID
	var oMask = document.getElementById('mask')		   		//获取遮罩层div标签ID
	var oIntBig = document.getElementById('introduce_big'); //获取视频弹出框div对象ID	
	var oClosePlay = document.getElementById('closePlay');	//获取视频弹出框关闭按钮对象
	var oAttBtn = document.getElementById('att_btn');		//获取关注按钮对象
	var oAtt_Icon = document.getElementById('att_Icon');	//获取关注按钮对象
	var oAtted_Icon = document.getElementById('atted_Icon');//获取关注按钮对象
	var oAttClose = document.getElementById('attClose');	//获取关注按钮对象
	var oLogin = document.getElementById('login');			//获取登录框对象
	var aInput = oLogin.getElementsByTagName('input')		//获取登录框文本输入框input标签
	var oCloseLog = document.getElementById('closeLog');	//获取登录弹出框关闭按钮对象
	var oLogBtn = document.getElementById('logBtn')			//获取登录框登陆按钮对象
	var oPageNum = document.getElementById('pageNum');		//获取页码对象
	var aPageA = oPageNum.getElementsByTagName("a");		//获取页码对象中的a标签
	var oTab = document.getElementById('tabList')			//获取tab标签对象
	var aTabList = oTab.getElementsByTagName("a");			//获取页码对象中的a标签
	var pageNum = 1;										//获取页码初始值
	var timerRoll =  null; 									//定义轮播滚动定时器

	//最热排行调用ajax.js中ajax函数获取后台数据,并通过hotAjax函数创建列表
	ajax("GET","http://study.163.com/webDev/hotcouresByCategory.htm","",hotAjax);   
	//课程列表调用ajax.js中ajax函数获取后台数据,并通过couListAjax函数创建课程列表
	//通过对屏幕的宽度判断，如果是宽屏则每页显示20门课程，否则按窄屏每页显示15门课程
	if(document.documentElement.clientWidth >= 1205){
		ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(1,20,10),couListAjax);
	}else{
		ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(1,15,10),couListAjax);
	}
	
	/* 通过JS函数创建video标签，即机构介绍中视频 */
	cteVideo();
	var oVideoBtn = document.getElementById('videoBtn')		//获取video标签对象，需要在video标签创建后定义
	//刷新页面加载顶部不再显示cookie值，是否需要隐藏该栏
	oHeaderTop.style.display = getCookie("headerTop");
	//首先判断登录的 cookie 是否已设置(loginSuc)，若已设置则显示已关注
	if(getCookie("followSuc")){
		oAttBtn.className = "";						//将关注按钮的样式去除
		oAtt_Icon.style.display = "none";			//将关注按钮标签隐藏				  
		oAtted_Icon.style.display = "inline-block";	//显示已关注标签
	}
	/* 顶栏不再提醒关闭按钮点击事件 */
	oCloseTop.onclick = function(){
		oHeaderTop.style.display = 'none';			//隐藏不再提醒栏
		setCookie('headerTop','none',14);			//将其不再显示状态存储到本地cookie
	};

	/* 图片自动切换函数 */
	play();

	/* 向左箭头点击事件 */
	prev.onclick = function(){
		animate(-1);								//调用scrolmag.js中的animate切换到上一张图
	};

	/* 向右箭头点击事件 */
	next.onclick = function(){						//调用scrolmag.js中的animate切换到下一张图
		animate(1);
	};

	/* 点击小圆点切换事件 */
	for(var i=0;i<buttons.length;i++){
		buttons[i].onclick = function(){
			if(parseInt(this.getAttribute('index')) == index){ //如果点击的圆点和当前值相同，则不执行
				return;
			}else{   //否则获取当前点击圆点的序号，并执行图片和圆点切换到点击的图片
				index = parseInt(this.getAttribute('index'));
				showPic();
				showButton();
			}
		}
	}
	
	/* 鼠标移出轮播图滚动开始滚动 */
	images.onmouseout = function(){
		play();
	};
	/* 鼠标移入轮播图滚动停止滚动 */
	images.onmouseover = function(){
		stopPlay();
	};

	/* 机构介绍视频点击播放事件 */
	playBtn.onclick = function(){
		popUpBox(oIntBig);				   //点击机构介绍播放按钮后执行弹出框函数
	};

	/* 机构介绍视频弹出框关闭按钮点击事件 */
	oClosePlay.onclick = function(){
		oVideoBtn.pause();                 //关闭视频后播放停止
		oIntBig.style.display = "none";	   //将该播放弹出框隐藏
		oMask.className = '';			   //将遮罩层隐藏
	};
	/* 机构介绍弹出视频点击video可以切换播放或暂停播放 */
	if(navigator.userAgent.indexOf("Firefox")>0){ //为了解决firefox上添加点击事件后视频无法播放bug，通过游览器类型检测解决
   	}else{   //让非Firefox游览器执行下面语句
   		oVideoBtn.onclick = function(){          //机构介绍弹出视频框点击事件
			if(this.paused){						 //若当前视频停止，则点击后视频继续播放
				this.play();
			}else{		
				this.pause();						//否则停止
			}	
		};
   	}
				
	/* 关注按钮对象点击事件 */
	oAttBtn.onclick = function(){
		if(getCookie("loginSuc") == "studyOnline"){   	//判断cookie中是否有已经保存的用户名
			oAttBtn.className = "";						//将关注按钮的样式去除
			oAtt_Icon.style.display = "none";			//将关注按钮标签隐藏				  
			oAtted_Icon.style.display = "inline-block";	//显示已关注标签
			ajax("GET","http://study.163.com/webDev/attention.htm","",cookieAjax);//导航关注API
		}else{
			aInput[1].value = "";     //每次登陆删除密码输入框中的密码
			popUpBox(oLogin);		  //调用popUpBox函数弹出遮罩层和登陆框
		}		

	};

	/* 取消关注按钮点击事件 */
	oAttClose.onclick = function(){
		oAttBtn.className = "att_btn";            //点击已关注取消按钮后，给原来去掉的关注按钮添加删除的样式
		oAtt_Icon.style.display = "inline-block"; //显示关注按钮								  
		oAtted_Icon.style.display = "none";		  //隐藏已关注按钮
		removeCookie("followSuc");                //删除保存的关注cookie
	};

	/* 登录弹出框关闭按钮点击事件 */
	oCloseLog.onclick = function(){
		oLogin.style.display = "none"; //隐藏登陆框
		oMask.className = '';		   //隐藏遮罩层
	};

	/* 登录按钮点击事件 */
	oLogBtn.onclick = function(){
		/* 将用户名账号和密码进行MD5加密 */
		var user = hex_md5(aInput[0].value);    
		var paw = hex_md5(aInput[1].value);
		/* 将输入的账号及密码通过ajax函数发送到后端，通过loginAjax函数判断用户名及密码输入是否正确 */
		ajax("GET","http://study.163.com/webDev/login.htm",getLogin(user,paw),loginAjax);

	};
	/* 左侧内容区tab切换点击事件 */
	for(var i=0;i<aTabList.length;i++){
		aTabList[i].onclick = function(){

			/* 该for循环用于去掉tab标签的active样式*/
			for(var j=0;j<aTabList.length;j++){  
				aTabList[j].className = "";
			}
			/* 下面代码用于去掉页码标签的current样式,无论原来在第几页，点击切换后都是显示页码1*/
			for(var j=1;j<aPageA.length-1;j++){
				aPageA[j].className = "";
			}
			pageNum = 1;
			aPageA[1].className = "current";
			/* 给当前点击标签添加active类名 */
			this.className = "active";
			/* 每次切换时先将当前课程列表清除 */
			oCourse.innerHTML = "";
			/* 判断点击的是编程语言Tab还是产品设计Tab,当点击是编程语言给ajax函数传入发送给服务器的筛选
			类型type=20,否则type=10 */
			if(this.innerHTML == "编程语言"){
				if(document.documentElement.clientWidth >= 1205){
					ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(1,20,20),couListAjax);
				}else{
					ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(1,15,20),couListAjax);
				}
			}else{
				if(document.documentElement.clientWidth >= 1205){
					ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(1,20,10),couListAjax);
				}else{
					ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(1,15,10),couListAjax);
				}
			}
		};
	}

	/* 切换课程列表页码点击事件 */
	for(var i=1;i<aPageA.length-1;i++){
		aPageA[i].onclick = function(){
			/* 如果点击当前页则退出不执行下面操作,避免重复刷新 */
			if(pageNum == this.innerHTML){
				return;
			}	
			/* 将当前页码赋值给pageNum */
			pageNum = this.innerHTML;	
			/* 执行pageFun函数 */
			pageFun();
		}
	}	

	/* 页码 < 箭头点击事件 */
	aPageA[0].onclick = function(){
		pageNum--;
		if(pageNum < 1){
			pageNum = 1;
			return;
		}
		pageFun();
	};

	/* 页码 > 箭头点击事件 */
	aPageA[9].onclick = function(){
		pageNum++;
		if(pageNum > 8){
			pageNum = 8;
			return;
		}
		pageFun();
	};

	/* 页码变化函数 */
	function pageFun(){
		for(var j=1;j<aPageA.length-1;j++){
			aPageA[j].className = "";
		}
		aPageA[pageNum].className = "current";
		oCourse.innerHTML = "";
		//通过对当前课程标签的className值进行判断，如果当前是产品设计激活(class = active)则调用ajax传入type = 10
		//否则type = 20，并对当前窗口视窗进行判断，如果是窄框（clientWidth<1205）则每页显示15门课程(psize=15)
		for(var i=0;i<aTabList.length;i++){  
			if(aTabList[i].className == "active"){
				if(i == 0){
					if(document.documentElement.clientWidth >= 1205){
						ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(pageNum,20,10),couListAjax);
					}else{
						ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(pageNum,15,10),couListAjax);
					}
				}else{
					if(document.documentElement.clientWidth >= 1205){
						ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(pageNum,20,20),couListAjax);
					}else{
						ajax("GET","http://study.163.com/webDev/couresByCategory.htm",getData(pageNum,15,20),couListAjax);
					}
				}	
			}	
		}

		if(pageNum == 1){
			aPageA[0].className = "";
		}else if(pageNum == 8){
			aPageA[0].className = "direction";
			aPageA[9].className = "";
		}
		else{
			aPageA[0].className = aPageA[9].className = "direction";
		}
	}

	/* ajax函数调用发送给后端的data数据 */
	function getLogin(user,paw){
		return "userName="+user+"&password="+paw+"";
	}

	/* 课程列表调用发送给后端的data数据 */
	function getData(num,size,typeNum){
		return "pageNo="+num+"&psize="+size+"&type="+typeNum+"";
	}

	/* 设置弹出框函数 */
	function popUpBox(obj){
		oMask.className = 'm-mask';  //添加遮罩层
		obj.style.display = "block"; //将隐藏的弹出框显示出来
		//获取可视区域宽度和高度
		var oWidth = document.documentElement.clientWidth;  
		var oHeight = document.documentElement.clientHeight;
		//获取页面滚动高度
		var sHeight = document.body.scrollTop || document.documentElement.scrollTop;
		//设置弹出视频窗口居中显示
		obj.style.left = (oWidth - obj.offsetWidth)/2 +  'px';
		obj.style.top = (oHeight - obj.offsetHeight)/2 + sHeight + 'px';
	}
	/* 通过JS创建video标签，这样可以先处理课程列表及排行榜等用户可以看见的图片，因为视频过大，如果在HTML中
	通过video加载视频会比较耗时，影响后面Ajax执行，在网络较慢时视频下载较久会出现课程列表和最热排行榜空白
	*/
	function cteVideo(){
		var oVideo = document.createElement('video');
		oVideo.id = "videoBtn";
		oVideo.src = "http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4";

		oVideo.width = 891;
		oVideo.height = 595;
		oVideo.poster="images/play_big.png";
		oVideo.controls = true;
		oIntBig.appendChild(oVideo);

		var oVideoBtn = document.getElementById('videoBtn')		//获取video标签对象
	}
}

