// 请求封装
function PostAjax(who,content,Pri,callBack,type){
	var guid = NewGuid();
	var userData = JSON.parse(localStorage.getItem('user'))==null?{}:JSON.parse(localStorage.getItem('user'));
	var openId = localStorage.getItem('openId');
    var userId = localStorage.getItem('userId');
    var item = getParameter('items');
    if (item != null){
		userData = JSON.parse(window.atob(item));
		openId = userData.UIUserId;
		userId = userData.DeviceToken;
	}

	var head = {
        CertType: "MD5",
        Certification: hex_md5(guid + keyNum),
        Channel: "4.1.0",
        DeviceToken: openId==null?'sfsf':openId,
        OSInformation: "9.3",
        Plat: "pc",
        Timestamp: "1473407895755",
        UserId: (userData.UserId==null?'999999999':userData.UserId),
        Version: "1.0",
        ToKen:(userData.UserToken==null?'':userData.UserToken),
        UnitType:userData.UnitType,
        UnitId:userData.UnitId,
        ApplicationId : openId
    };
    
    var request = {
        RGuid: guid,
        UIServiceId: "",
        UIUserId: userId,
        Pri: Pri,
        IsTest: "1",
        Content: JSON.stringify(content)
    }
    var data = {
        Head: head,
        Request: request
    };
    console.log(data);
    who.$http({
	    method:'post',
	    url:netLink,
	    data:data,
	    header: {
	       'content-type': 'application/json',
	    },
	    emulateJSON: true
    }).then(function(data){//es5写法
        console.log(data);
    	if(data.data.Status == 0){
    		if (data.data != '' && data.data.Data !='') {
    			var dataL = JSON.parse(data.data.Data);
        		if(dataL.status == 20404){
        			fadeInOut(dataL.msg);
        			localStorage.removeItem('user');
        			setTimeout(function(){
//      				window.location.href = 'login.html';
        			},1500);        			
        		}else{
        			if (typeof callBack == 'function');        		
            			callBack(dataL);
        		}
        		
            }else{
				fadeInOut(infoList('00007'));	
				console.log(data);
			}  
    	}else{
			fadeInOut(infoList('00007'));
			console.log(data.data.Message);
			return false;	
		}     
		if(type != 1){
			who.loadingshow = false;
		}
  	},function(error){
  		who.loadingshow = false;
	    fadeInOut(infoList('00007'));
	    console.log(data);
  	})
}
//去除空格
function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}

//截取参数
function getParameter(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r!=null) return decodeURIComponent(r[2]); return null;
}

//提示弹框  全局
function fadeInOut(msg){
	var time = null;
	var time1 = null;
	var div = document.createElement("div");
	div.innerHTML = msg;
	div.setAttribute('id','msg');
	document.body.appendChild(div);
	var num=0;
    var step=60;
	clearInterval(time);
	clearInterval(time1);
	time = setInterval(function(){
	    num+=step;
	    if(num>=360){
	        num=360;
	        clearInterval(time);
		    setTimeout(function(){
		      	time1 = setInterval(function(){
				    num-=step;
				    if(num==0){
				        num=0;
				        clearInterval(time1);
				        document.body.removeChild(document.getElementById("msg"));
				    }else{					
				    	document.getElementById("msg").style.background='rgba(0,0,0,'+(num/400)+')';
				    }
				  },50)
	        },1000)
	    }
	    document.getElementById("msg").style.display = 'block';
	    document.getElementById("msg").style.background='rgba(0,0,0,'+(num/400)+')';
	    
	},50)	
}
//JS生成GUID函数,类似.net中的NewID();
function S4(){   
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);   
}    
function NewGuid(){   
   return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());   
}
//时间去T
function stt(str){
	str = str.replace('T','  ');
	return str;
}