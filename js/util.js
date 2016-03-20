/**
 * 获取元素对象函数
 * @param  {Object} selector DOM元素ID对象值
 */
function $(selector) {
  return document.getElementById(selector);
};

var MainUtil = {
  /**
  * 添加事件处理函数
  * @param {[Object]} element      [绑定事件元素]
  * @param {[String]} type         [事件类型]
  * @param {[Function]} handler    [事件处理函数]
  * element.addEventListener       兼容IE9+等主流游览器
  * element.attachEvent            兼容IE6-10
  */
  addEvent: function(element, type, handler) {
   if (element.addEventListener) {
     element.addEventListener(type, handler, false);
   } else if (element.attachEvent) {
     element.attachEvent("on" + type, handler);
   } else {
     element["on" + type] = handler;
   }
  },
  /**
   * 获取事件对象函数
   * 在IE中使用 DOM0 级方法添加事件处理程序时,event 对象作为 window 对象的一个属性存在
   */
  getEvent: function(event) {
   return event ? event : window.event;
  },
  /**
   * 获取事件目标函数
   * event.target         兼容IE9+及其他主流游览器
   * event.srcElement     兼容低版本IE游览器
   */
  getTarget: function(event) {
    return event.target || event.srcElement;
  },
  /**
   * 获取对象实际样式值
   * getComputedStyle     IE9+及其他主流游览器
   * currentStyle         兼容IE9以下游览器
   */
  getStyle: function(obj,name) {
    if(obj.currentStyle){
      return obj.currentStyle[name];
    }
    else{
      return getComputedStyle(obj,null)[name];
    }
  },
  /**
   * 获取元素类名函数
   * 支持:IE 9+、Firefox 3+、Safari 3.1+、Chrome 和 Opera 9.5+
   */
  getElementsByClassName: function(element,names) {
    if (element.getElementsByClassName) {
      return element.getElementsByClassName(names);
    }else {
      var elements = element.getElementsByTagName('*'),
          result = [],
          element,
          classNameStr,
          flag;
      names = names.split(' ');
      for (var i = 0; i < elements.length; i++) {
        classNameStr = ' ' + elements[i].className + ' ';
        flag = true;
        for (var j = 0; j < names.length; j++) {
          if(classNameStr.indexOf(' ' + names[j] + ' ') == -1) {
            flag = false;
            break;
          }
        }
        if (flag) {
          result.push(elements[i]);
        }
      }
      return result;
    }
  },
  /**
   * 插入文本函数
   * innerText :IE4+、Safari 3+、Opera 8+和 Chrome。Firefox45+
   * textContent:IE9+、Safari 3+、Opera 10+、Chrome、Firefox。
   */
  getInnerText: function (element) {
    return (typeof element.innerText == "string") ? element.innerText : element.textContent;
  },
  setInnerText: function(element, text) {
    if (typeof element.innerText == "string"){
      element.innerText = text;
    } else {
      element.textContent = text;
    }
  },
  /**
   * 获取元素客户区大小函数
   * document.body：IE7之前版本
   */
  getViewport: function() {
    return {
      clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
      clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
      scrollWidth: document.documentElement.scrollWidth || document.body.scrollWidth
    };
  },
  /**
   * 阻止默认行为函数
   * event.returnValue       兼容低版本IE
   */
  preventDefault: function(event) {
   if (event.preventDefault){
     event.preventDefault();
   } else {
     event.returnValue = false;
   }
  },
  /**
   * 取消冒泡函数
   * event.cancelBubble      兼容低版本IE
   */
  stopPropagation: function(event) {
   if (event.stopPropagation){
     event.stopPropagation();
   } else {
     event.cancelBubble = true;
   }
  },
  /**
   * 登陆账号密码连接函数
   */
  getLogin: function(user,paw) {
   return "userName="+user+"&password="+paw+"";
  },
  /**
   * 课程列表连接函数
   */
  getData: function(num,size,typeNum) {
  	return "pageNo="+num+"&psize="+size+"&type="+typeNum+"";
  },
  /* Ajax封装函数 */
  ajax: function(method,url,data,success) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    //兼容ie6
    }else {

        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          success && success(xhr.responseText);
        } else {
          console.error('Request was unsuccessful: ' + xhr.status);
        }
      }
    }
    if (method == 'GET' && data) {
      url += '?' + data;
    }
    xhr.open(method,url,true);
    if (method == 'GET') {
      xhr.send();
    } else {
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      xhr.send(data);
    }
  }
};

var MainCookie = {
  /**
   * 设置cookie函数
   * @param  {String} name  保存的cookie名称
   * @param  {String} value cookie值
   * @param  {Number} iDay  cookie有效期
   */
  setCookie: function(name,value,iDay){
   var oDate = new Date();
   oDate.setDate(oDate.getDate() + iDay);
   document.cookie = name + "=" + value + ";expires=" + oDate;
  },
  /**
   * 获取对象cookie名称下的cookie值函数
   * @param  {String} name 想要获取cookie的名称
   */
  getCookie: function(name){
     var arr = document.cookie.split("; ");
     for(var i = 0; i < arr.length; i++){
         var arr2 = arr[i].split('=');
         if(arr2[0] == name){
             return arr2[1];
         }
     }
  },
  /**
   * 删除cookie函数
   * @param  {String} name 想要删除cookie的名称，只需将过期时间设为-1即可
   */
  removeCookie: function(name){
     MainCookie.setCookie(name,'',-1);
  }
};

var MainPublic = {
  /**
   * 设置弹出框函数
   * @param  {Object} objMask     遮罩层容器标签对象
   * @param  {Object} objMovie    视频弹出框对象
   */
  popUpBox: function(objMask,oIntBig) {
    objMask.className = 'm-mask';  					    						// 添加遮罩层
    oIntBig.style.display = "block"; 		  						  		// 将隐藏的弹出框显示出来
    // 获取可视区域宽度和高度及页面滚动高度
    var oClientWidth = MainUtil.getViewport().clientWidth,
        oClientHeight = MainUtil.getViewport().clientHeight,
        oScrollTop = MainUtil.getViewport().scrollTop;

    // 设置弹出视频窗口居中显示
    oIntBig.style.left = (oClientWidth - oIntBig.offsetWidth) / 2 +  'px';
    oIntBig.style.top = (oClientHeight - oIntBig.offsetHeight) / 2 + oScrollTop + 'px';
  },
  /**
   * 分页函数
   * @param  {[Object} opt 需要创建分页的对象
   */
  page: function(opt) {
    if (!opt.oPage) {
      return false;
    }
    var oPage = opt.oPage,                            // 获取页码ul容器
        currentPage = opt.currentPage || 1,           // 获取当前页
        aPageList = oPage.getElementsByTagName('a'),  // 获取当前对象下具有的页码数量
        totalPage = 8,                                // 设置默认总页数
        oA;                                           // 新创建的li元素
    // 如果当前没有页码，即第一次页码加载
    if (aPageList.length === 0) {
      // 创建上一页<箭头
      var oA = document.createElement('a');
      oA.className = '';
      oA.innerHTML = '&lt';
      oPage.appendChild(oA);

      // 循环创建页码
      for (var i = 1; i <= totalPage; i++) {
        var oA = document.createElement('a');
        if (i == currentPage) {                       // 给当前页码添加current样式
          oA.className = 'current';
        }
        oA.innerHTML = i;
        oPage.appendChild(oA);
      }
      // 创建下一页>箭头
      var oA = document.createElement('a');
      oA.className = 'direction';
      oA.innerHTML = '&gt';
      oPage.appendChild(oA);
    // 该对象中已存在页码，即页码切换，执行下面部分
    }else {
      aPageList = oPage.getElementsByTagName('a');    // 获取当前页码数量
      if (currentPage > 1) {                          // 如果当前页不是第一页，则<箭头添加样式
        aPageList[0].className = 'direction';
      }else {
        aPageList[0].className = '';
      }
      // 如果当前页小于totalPage(默认为8)-2,即前6页
      if(currentPage < totalPage - 2) {
        for (var i = 1; i <= totalPage; i++) {
          if (i == currentPage) {
            aPageList[i].className = 'current';
          }
          aPageList[i].innerHTML = i;
        }
      // 当前页大于第6页时开始创建页码
      }else {
        var start = currentPage - 4,                  // 页码起始页
            j = 1;
        totalPage = 7 + start;                        // 总页数
        // 默认还是循环8次
        for (var i = start; i <= totalPage; i++) {
          // 因为当前页面共10个a标签，其中第一个和最后一个a标签对应的是上一页和下一页(<和>)
          // 所以只需修改第2至倒数第2个a标签中的页码内容即可
          if (i == currentPage) {
            aPageList[j].className = 'current';
          }else {
            aPageList[j].className = '';
          }
          aPageList[j].innerHTML = i;
          j++;
        }
      }
      // 若当前页不是最后一页则>箭头添加direction样式
      if (currentPage < totalPage) {
        aPageList[aPageList.length - 1].className = 'direction';
      }else {
        aPageList[aPageList.length - 1].className = '';
      }
    }
  }
};

var MainMovie = {
  /**
   * 运动函数
   * @param  {Object} obj   运动元素对象
   * @param  {Object} json  需要改变的元素名及值的键值对
   * @param  {Number} sp
   * @param  {[type]} fnEnd [description]
   * @return {[type]}       [description]
   */
  startMove: function(obj,json,sp,fnEnd) {
    clearInterval(obj.timer);                    // 每次运动前清掉对象中的原有的定时器，防止运动叠加
    obj.timer = setInterval(function(){
      var bStop = true;				                   // 标记位，判断运动是否完成
      for(var name in json) {                    // 遍历传输过来的json值
        var iTarget = json[name];
        if(name == 'opacity'){                   // 将透明度与其他属性值分开处理
          var cur = Math.round(parseFloat(MainUtil.getStyle(obj,name))*100);
        }else{
          var cur = parseInt(MainUtil.getStyle(obj,name));
        }
        var speed = (iTarget - cur) / sp;         // 运动速度
        // 如果速度大于0,则speed向上取整，否则向下取整，避免运动无法完成
        speed = speed > 0 ? Math.ceil(speed):Math.floor(speed);
        if(name == 'opacity'){									  // 对opacity进行另外处理，进行兼容性处理
          obj.style.filter = 'alpha(opacity:'+(cur+speed)+')';
          obj.style.opacity = (cur+speed) / 100;
        }else{
          obj.style[name] = cur + speed + 'px';   // 其他值赋值
        }
        if(cur != iTarget){                       // 标记位，判断当前值是否与目标值相等
          bStop = false;
        }
      }
      // 如果全部值都相等，bStop标记为为true，说明全部属性都运动完成，清掉定时器
      if(bStop){
        clearInterval(obj.timer);
        if(fnEnd) {                               // 如果有回调函数，处理回调函数
          fnEnd();
        }
      }
    },50);
  }
}
