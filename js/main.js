/* 主函数 */
(function() {
	/*
	 	顶部通知栏区域模块
	 */
	var indexHeader_module = (function() {
		var	oHeaderTop = $('headerTop'),										// 获取顶部通知栏的容器对象
				oCloseTop = $('closeTop');											// 获取顶部通知栏不再提醒关闭按钮对象

		// 刷新页面后顶部通知栏通过cookie值来判断是否需要隐藏该通知栏
		oHeaderTop.style.display = MainCookie.getCookie("headerTop");
		// 顶栏不再提醒关闭按钮点击事件
		MainUtil.addEvent(oCloseTop,'click',function() {
			oHeaderTop.style.display = 'none';								// 隐藏不再提醒栏
			MainCookie.setCookie('headerTop','none',14);			// 将其不再显示状态存储到本地cookie
		});
	})();

	/*
		顶部网易教育产品部关注区及登陆框模块
	 */
	var indexFollowLogin_module = (function() {
		var oAttBtn = $('att_btn'),														 		// 关注按钮对象
				oAtt_Icon = $('att_Icon'),														// 关注按钮对象中的'+'图案
				oAtted_Icon = $('atted_Icon'),												// 已关注按钮对象
				oAttClose = $('attClose'),												 		// 已关注取消对象
				oLogin = $('login'),															 		// 获取登录框对象
				aInput = oLogin.getElementsByTagName('input'), 			 	// 登录框文本输入框input标签对象
				attURL = "http://study.163.com/webDev/attention.htm"; // 导航关注URL地址

		// 登录时判断游览器 cookie 中是否设置已关注网易教育产品部(followSuc)，若已设置则显示已关注
		if(MainCookie.getCookie("followSuc")){
			oAttBtn.className = "";																	// 将关注按钮的样式去除
			oAtt_Icon.style.display = "none";												// 将关注按钮标签隐藏
			oAtted_Icon.style.display = "inline-block";							// 显示已关注标签
		}

		// 点击关注按钮
		MainUtil.addEvent(oAttBtn,'click',function(){
			// 如果网页中已保存用户登录信息
			if(MainCookie.getCookie("loginSuc") == "studyOnline"){
				oAttBtn.className = "";																// 去除关注按钮的样式
				oAtt_Icon.style.display = "none";											// 将关注按钮标签隐藏
				oAtted_Icon.style.display = "inline-block";						// 显示已关注标签
				// 登陆成功后发送Ajax请求判断是否设置关注cookie
				MainUtil.ajax("GET",attURL,"",followSuc);
			}else{
				aInput[1].value = "";     														// 每次登陆清空输入框中的密码
				MainPublic.popUpBox(oMask,oLogin);		  							// 弹出遮罩层和登陆框
			}
		});
		// 点击取消关注按钮
		MainUtil.addEvent(oAttClose,'click',function(){
			oAttBtn.className = "att_btn";            							// 点击取消按钮，恢复关注按钮样式
			oAtt_Icon.style.display = "inline-block"; 							// 显示关注按钮
			oAtted_Icon.style.display = "none";		  								// 隐藏已关注按钮
			MainCookie.removeCookie("followSuc");                		// 删除保存的关注cookie
		});

		var oCloseLog = $('closeLog'),														// 获取登录框关闭按钮对象
				oLogBtn = $('logBtn'),																// 获取登录框登陆按钮对象
				loginURL = "http://study.163.com/webDev/login.htm"; 	// 用户登录请求地址

		// 登录框关闭按钮点击事件
		MainUtil.addEvent(oCloseLog,'click',function(){
			oLogin.style.display = "none"; 													// 隐藏登陆框
			oMask.className = '';		   															// 隐藏遮罩层
		});
		// 登录按钮点击事件
		MainUtil.addEvent(oLogBtn,'click',function(){
			var user = hex_md5(aInput[0].value),										// 将用户名账号和密码进行MD5加密
					paw = hex_md5(aInput[1].value);
			// 将输入的账号及密码通过MainUtil.ajax函数发送到后端，通过loginSuc函数判断用户名及密码输入是否正确
			MainUtil.ajax("GET",loginURL,MainUtil.getLogin(user,paw),loginSuc);
		});
		/**
		 * 判断登陆是否成功函数
		 * @param  {Number} repData 返回1表示匹配用户名密码成功，0表示失败,成功设置cookie(loginSuc)
		 * 固定用户帐号:studyOnline ;
		 * 固定用户密码:study.163.com ;
		 */
		function loginSuc(repData) {
			if(repData == 1){
				alert("登陆成功!");
				oLogin.style.display = "none";	  									// 登陆成功后隐藏登陆框
				oMask.className = '';			  												// 隐藏遮罩层
				// 登陆成功后将用户名存入cookie中，有效期为14天
				MainCookie.setCookie("loginSuc","studyOnline",14);
				oAttBtn.className = "";															// 将关注按钮的样式去除
				oAtt_Icon.style.display = "none";										// 将关注按钮标签隐藏
				oAtted_Icon.style.display = "inline-block";					// 显示已关注标签
				MainUtil.ajax("GET",attURL,"",followSuc);						// 导航关注API
			}else{
				alert("账号或密码错误!");
				aInput[1].value = "";    		  											// 每次输错密码都需重新输入密码
			}
		}

		/**
		 * 获取顶部网易教育产品部关注按钮cookie函数
		 * @param  {Number} repData 如果返回1则设置关注成功的cookie(followSuc)
		 */
		function followSuc(repData) {
			console.log(repData);
			if(repData == 1){
				MainCookie.setCookie("followSuc",1,14); 						//设置关注cookie，有效期为14天
			}
		}
	})();

	/*
	  顶部轮播图区域
	 */
	var indexSlide_module = (function() {
		var oImages = $('m-image'),    						  				// 获取轮播图整个区域容器对象
				oImgList= $('imgList'),  									  		// 获取图片img对象
				aImgLen = oImgList.getElementsByTagName('a');		// 获取图片数量
				oPrev = $('prev'),		    											// 获取轮播图<箭头对象
				oNext = $('next'),         											// 获取轮播图>箭头对象
				oButton = $('buttons'),													// 获取轮播图小圆点对象
				index = 1,		 																	// 当前显示图片
				timerRoll = null;																// 定义轮播滚动定时器

		// 图片自动播放函数
		play();
		// 向左切换
		MainUtil.addEvent(oPrev,'click',function() {
			animate(-1);																			// 调用animate函数切换到上一张图
			showPic();																				// 显示图片函数
		});
		// 向右切换
		MainUtil.addEvent(oNext,'click',function() {
			animate(1);																				// 调用animate函数切换到下一张图
			showPic();																				// 显示图片函数
		});
		// 轮播图小圆点切换事件
		MainUtil.addEvent(oButton,'click',function(event) {
			var event = MainUtil.getEvent(event),							// 获取事件对象
					target = MainUtil.getTarget(event);						// 获取事件目标对象
			// 当点击当前页的小圆点或者点击的不是li元素则退出
			if (target.getAttribute('index') == index || target.nodeName !== 'LI') {
				return;
			}else {
				index = parseInt(target.getAttribute('index'));	// 获取当前点击的是哪个小圆点
				showPic();																			// 显示图片函数
			}
		});
		// 鼠标移入轮播图动画停止
		MainUtil.addEvent(oImages,'mouseover',function(){
			clearInterval(timerRoll);													// 清除定时器
		});

		// 鼠标移出轮播图滚动动画开始
		MainUtil.addEvent(oImages,'mouseleave',function(){
			play();																						// 自动滚动函数
		});

		/**
		 * 定义图片播放动画函数
		 * @param  {Number} i 当前显示图片
		 */
		function animate(i) {
			if(i > 0){
				index++;
				if(index > aImgLen.length) {
					index = 1;
				}
			}else{
				index--;
				if(index < 1) {
					index = aImgLen.length;
				}
			}
		}

		/* 显示图片函数 */
		function showPic() {
			var aButtons = oButton.getElementsByTagName('li'); //获取导航圆点对象数组
			// 每次切换图片时将图片隐藏及透明度为0 并去除圆点样式
			for(var i = 0; i < aButtons.length; i++) {
				aImgLen[i].style.display = 'none';
				aImgLen[i].style.opacity = 0;
				if(aButtons[i].className === "on"){
					aButtons[i].className = "";
				}
			}

			aImgLen[index - 1].style.display = 'block';
			MainMovie.startMove(aImgLen[index - 1],{opacity:100},10);
			aButtons[index - 1].className = "on";
		}

		/* 定义自动播放函数 */
		function play(){
			timerRoll = setInterval(function(){
				animate(1);																	// 调用animate函数切换到下一张图
				showPic();																	// 显示图片函数
			},5000);
		}
	})();

	/*
	 	机构介绍区域模块
	 */
	var indexVideo_module = (function() {
		var oPlayBtn = $('playBtn');   									// 获取机构介绍视频播放按钮对象
				oClosePlay = $('closePlay'),								// 获取视频弹出框关闭按钮对象
				oVideoBtn = $('videoBtn'),									// 获取video标签对象
				oMask = $('mask'), 		   										// 获取遮罩层容器标签对象
				oIntBig = $('introduce_big'); 							// 获取视频弹出框对象

		// 机构介绍点击视频播放
		MainUtil.addEvent(oPlayBtn,'click',function(){
			MainPublic.popUpBox(oMask,oIntBig);						// 点击机构介绍播放按钮后弹出视频播放框
		});
		// 关闭视频弹出框
		MainUtil.addEvent(oClosePlay,'click',function(){
			oVideoBtn.pause();                 						// 关闭视频后视频暂停播放
			oIntBig.style.display = "none";	   						// 隐藏视频播放弹出框
			oMask.className = '';			  	 		 						// 隐藏遮罩层
		});
		// 机构介绍弹出视频点击video可以切换播放或暂停播放
		// 为了解决firefox上点击视频无法播放bug，通过游览器类型检测解决
		if(navigator.userAgent.indexOf("Firefox")>0){
		// 让非Firefox游览器执行下面语句
		}else{
			// 若当前视频暂停，则点击后继续播放，否则停止播放
			MainUtil.addEvent(oVideoBtn,'click',function(){
				if(this.paused){
					this.play();
				}else{
					this.pause();
				}
			});
		}
	})();

	/*
		课程区域模块
	*/
	var indexCourse_module = (function() {
		var oPageNum = $('pageNum'),											// 获取页码对象
				oTab = $('tabList'),													// 获取tab标签对象
				aPageA = oPageNum.getElementsByTagName("a"),	// 获取页码对象中的a标签
				pageNum = 1;																	// 获取页码初始值
				couListURL = "http://study.163.com/webDev/couresByCategory.htm",   // 课程列表地址
				// 获取课程列表数据的初始值
				obj = {
					oTab: oTab,
					url: couListURL,
					pageNum: 1
				};
		// 执行pageDate函数获取课程数据并创建列表
		pageData(obj);
		// 产品设计/编程语言tab切换事件
		MainUtil.addEvent(oTab,'click',function(event) {
			var event = MainUtil.getEvent(event),						// 获取事件对象
					target = MainUtil.getTarget(event);					// 获取当前点击的元素对象

			// 如果重复点击相同Tab则不执行后面操作
			if(target.className === 'active') {
				return;
			}
			if(target.tagName === 'A') {
				// 去掉tab标签的active样式
				MainUtil.getElementsByClassName(this,'active')[0].className = '';
				target.className = 'active';									// 给当前点击标签添加active类名
				// 下面代码用于去掉页码标签的current样式,无论原来在第几页，点击切换后都是显示页码1
				pageNum = 1;
				// 去掉页码<箭头样式及页码的样式
				MainUtil.getElementsByClassName(oPageNum,'direction')[0].className = '';
				MainUtil.getElementsByClassName(oPageNum,'current')[0].className = '';
				aPageA[1].className = 'current';

				var obj = {
					oTab: oTab,
					url: couListURL,
					pageNum: 1
				};
				// 执行pageDate函数获取课程数据并创建列表
				pageData(obj);
			}
		});

		// 切换课程列表页码点击事件
		MainUtil.addEvent(oPageNum,'click',function(event) {
			var event = MainUtil.getEvent(event),						// 获取事件对象
					target = MainUtil.getTarget(event);					// 获取当前点击的元素对象

			// 如果点击当前页则退出不执行下面操作,避免重复刷新
			if(target.innerHTML == pageNum){
				return;
			}
			// 点击页码才执行下面赋值及页码变化函数 避免将左右箭头赋值给pageNum
			if(!isNaN(target.innerHTML)) {
				pageNum = target.innerHTML;										// 将当前页码赋值给pageNum
				pageFun();																		// 执行页码变化函数
			}
		});

		// 上一页
		MainUtil.addEvent(aPageA[0],'click',function() {
			pageNum--;
			if(pageNum < 1){
				pageNum = 1;
				return;
			}
			pageFun();																			// 执行页码变化函数
		});

		// 下一页
		MainUtil.addEvent(aPageA[9],'click',function() {
			pageNum++;
			pageFun();																			// 执行页码变化函数
		});

		/**
		 * 课程列表Ajax函数
		 * @param  {String} repData [服务器返回的课程列表字符串]
		 */
		function couListAjax(repData) {
			var data = JSON.parse(repData).list,          	// 将JSON对象转换为对象
					oCourse = $('course'),	    								//获取课程列表容器对象
					couLen = MainUtil.getElementsByClassName(oCourse,'cou-list').length,// 获取课程列表数量
					dataLen = data.length;  										// 切换课程后返回课程数量

			// 如果当前课程列表数量小于返回后课程列表数量，则创建新的课程节点
			if (couLen < dataLen) {
				for(var i = couLen; i < dataLen; i++) {
					// 创建课程列表HTML结构
					var div = document.createElement('div');
					div.className = 'cou-list';
					var a = document.createElement('a');				// 课程链接
					a.target = '_blank';
					div.appendChild(a);
					var img1 = document.createElement('img');		// 展示图片
					var h1 = document.createElement('h1');			// 课程名称
					a.appendChild(img1);
					a.appendChild(h1);
					var h2 = document.createElement('h1');			// 课程提供者
					div.appendChild(h2);
					var span1 = document.createElement('span');
					var img2 = document.createElement('img');
					img2.src = 'images/icon/peopleIcon.png';    // 添加课程学习人数头像图标
					var span2 = document.createElement('span');	// 学习人数
					span1.appendChild(img2);
					span1.appendChild(span2);
					div.appendChild(span1);
					var p = document.createElement('p');				// 课程价格
					p.className = 'money';
					div.appendChild(p);
					oCourse.appendChild(div);
				}
			// 如果当前课程列表数量大于返回后课程列表数量，则将多余课程节点删除
			}else if (couLen > dataLen) {
				var len = couLen - dataLen;
				for (var i = 0; i < len; i++) {
					oCourse.removeChild(oCourse.children[0]);
				}
			}
			// 经过上面添加或删除节点操作后切换前后节点数量相同，所以只需替换课程节点中的内容即可
			// 重新获取最新课程列表节点数量
			couLen = MainUtil.getElementsByClassName(oCourse,'cou-list').length;
			var aCourseList = MainUtil.getElementsByClassName(oCourse,'cou-list');
			for (var i = 0; i < couLen; i++) {
				// 设置课程序号，课程链接、展示图片、课程名称、课程提供者、学习人数和课程价格
				aCourseList[i].index = i;
				aCourseList[i].getElementsByTagName('a')[0].href = data[i].providerLink;
				aCourseList[i].getElementsByTagName('img')[0].src = data[i].middlePhotoUrl;
				MainUtil.setInnerText(aCourseList[i].getElementsByTagName('h1')[0],data[i].name);
				MainUtil.setInnerText(aCourseList[i].getElementsByTagName('h1')[1],data[i].provider);
				MainUtil.setInnerText(aCourseList[i].getElementsByTagName('span')[1],data[i].learnerCount);
				MainUtil.setInnerText(aCourseList[i].getElementsByTagName('p')[0],"￥" + data[i].price);
			}
			// 为每个课程元素添加鼠标移入移出事件，当鼠标移入某个课程元素就触发创建课程详细浮层图层，添加在该课程列表后，鼠标移出时删除该图层
			for(var i = 0; i < couLen; i++) {
				aCourseList[i].index = i;							//将每个图层的序号保存到每个图层定义的新index属性中
				//鼠标移入事件，在该课程列表后新建一个div浮动图层
				aCourseList[i].onmouseenter=function(event){
					// 创建课程浮层显示详细信息
					var oDivF = document.createElement('div');
					oDivF.className = "cou-f";										//给新建浮动层添加cou-f样式
					oDivF.innerHTML = "<a href="+data[this.index].providerLink+" target='_blank'>"+
											"<div>"+
												"<img src="+data[this.index].middlePhotoUrl+">"+
												"<h1>"+data[this.index].name+"</h1>"+
												"<i></i>"+
												"<span>"+data[this.index].learnerCount+"人在学"+"</span>"+
												"<p>"+"发布者:"+data[this.index].provider+"</p>"+
											"</div>"+
										"</a>"+
										"<p>"+data[this.index].description+"</p>";
					this.appendChild(oDivF);   //将新创建的浮动框添加到该鼠标移入课程中
				};
				/* 鼠标移出该课程框时将该悬浮框删除 */
				aCourseList[i].onmouseleave= function(){
					this.removeChild(this.lastChild);
				};
			}
		}

		// 页码变化函数
		function pageFun() {
			MainUtil.getElementsByClassName(oPageNum,'current')[0].className = '';// 去掉页码current样式
			var obj = {
				oTab: oTab,
				url: couListURL,
				pageNum: pageNum
			};
			pageData(obj);
		}

		/**
		 * 课程列表数据获取函数
		 * @param  {Object} obj 发送给服务器的对象
		 * 如果当前是产品设计激活(class = active)则调用MainUtil.ajax传入type = 10，否则type = 20
		 * 并对当前窗口视窗进行判断，如果是窄框（clientWidth<1205）则每页显示15门课程(psize=15)
		 */
		function pageData(obj) {
			var oTab = obj.oTab,											// 课程列表Tab对象
					url = obj.url,												// 课程列表URL地址
					pageNum = obj.pageNum;								// 当前页数

			if(MainUtil.getElementsByClassName(oTab,'active')[0].innerHTML === '产品设计') {
				if(MainUtil.getViewport().clientWidth >= 1205) {
					MainUtil.ajax("GET",url,MainUtil.getData(pageNum,20,10),couListAjax);
				}else {
					MainUtil.ajax("GET",url,MainUtil.getData(pageNum,15,10),couListAjax);
				}
			}else {
				if(MainUtil.getViewport().clientWidth >= 1205) {
					MainUtil.ajax("GET",url,MainUtil.getData(pageNum,20,20),couListAjax);
				}else {
					MainUtil.ajax("GET",url,MainUtil.getData(pageNum,15,20),couListAjax);
				}
			}
			var oPageNum = $('pageNum');								// 获取页码对象
			var objPage = {
				oPage: oPageNum,
				currentPage: pageNum
			};
			// 执行页码生成函数
			MainPublic.page(objPage);
		}
	})();


  /* 最热排行课程Ajax函数 */
	var indexHotTop_module = (function() {
		var oHot = $('hot'),																		//获取最热排行div对象
				hotListURL = "http://study.163.com/webDev/hotcouresByCategory.htm",
				timerHot = null;

		MainUtil.ajax("GET",hotListURL,"",hotListAjax);

		/**
		 * 获取最热排行榜课程列表
		 * @param  {String} repData [服务器返回的最热排行榜课程列表字符串]
		 */
		function hotListAjax(repData) {
			var data = JSON.parse(repData),
					html = "";
			for(var i = 0; i < data.length; i++) {
				// 创建最热排行榜课程HTML结构，将ajax返回的数据添加到结构中
				html += "<li class='f-clear'>" +   										// 添加清除浮动的类
				"<a href="+data[i].providerLink+" target='_blank'>"+  // 获取课程连接
				"<img src="+data[i].smallPhotoUrl+">"+  		  				// 获取课程小图片
				"<p>"+data[i].name+"</p>"+						  							// 获取课程名称
				"</a>"+
				"<div class='pepIcon'>"+
				"<img src=images/icon/peopleIcon.png>"+			  				// 添加课程学习人数头像图标
				"<span>"+data[i].learnerCount+"</span>"+	      			// 获取课程学习人数
				"</div>"+
				"</li>" ;
			}
			oHot.innerHTML = html;                    						// 添加到最热排行版的对象中
			hotRoll();    																		// 调用hotRoll函数实现课程滚动更新
		}

		/**
		 * 最热排行课程滚动更新函数
		 */
		function hotRoll(){
			var index = 0,
					bChange = true,                     				// 值为true时课程向上滚动，否则向下滚动
					aLi = oHot.getElementsByTagName('li')				// 获取最热排行ul列表下全部li标签
			for(var i = 0; i < aLi.length; i++) {
				aLi[i].style.position = "absolute"; 					// 给每个课程添加绝对定位来进行滚动
				aLi[i].style.top = 70 * i + "px";   					// 为前10门课程定好位置，每门课程高度为70
				if(i > 9){       															// 后10门课程位置和第10们课程相同
					aLi[i].style.top = 630 + "px";
					MainMovie.startMove(aLi[i],{opacity:0},2);  // 通过MainMovie.startMove函数设置透明度为0
				}
			}
			timerHot = setInterval(function(){         				// 开启定时器，每5s执行一次
				if(bChange){                        						// bChange为true时课程向上滚动
					MainMovie.startMove(aLi[index],{opacity:0},2);// 每次运动先让最顶上的课程透明度为0
					for(var i = index+1; i < 10+index; i++) {			// 剩余的9门课程分别移动到上一门课程高度
						MainMovie.startMove(aLi[i],{top:(i-(index+1))*70},2);
					}
					// 每次隐藏的第一门课透明度变为100显示在第10个位置
					MainMovie.startMove(aLi[index+10],{opacity:100},2);
					index++;																			// 指向第二门课程
					if(index == 10){													// 判断如果10门课程移动完了开始做相反方向移动
						bChange = false;														// 标志位取反向下移动
						index = 19;																	// 指向最后一门课程
					}
				}else{
					MainMovie.startMove(aLi[index],{opacity:0},2);
					for(var i = index-1; i > index - 10; i--) {
						MainMovie.startMove(aLi[i],{top:((i-index)+10)*70},2);
					}
					MainMovie.startMove(aLi[index-10],{opacity:100},2);
					index--;
					if(index == 9){
						bChange = true;
						index = 0;
					}
				}
			},3000);
		}
	})();
})();
