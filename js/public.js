document.write("<script language='javascript' src='../js/md5.js'></script>");
var adminId = getParameter('adminId');
if(adminId != null){
	localStorage.setItem('adminId',adminId)
}
//http://192.168.0.167:10001/a/electric/ossutil/interface/sign
//PostAjax(who,type,content,Pri,callBack,failCallBack,isShowMsg,hideloa,showLod,linkU,ContentType)

//http://192.168.0.167:10010/layer/limitoperateflag/tLimitOperateConfig/list
// 请求封装
//who   this
//type post/get
//content 请求参数
//Pri 接口名
//callBack 成功回调方法
//failCallBack 失败回调方法
//isShowMsg  是否显示错误信息，传1为不显示
//hideloa 是否隐藏加载效果 传1  不隐藏
//showLod 是否显示加载效果    传1  不显示
//ContentType 内容类型   默认 application/json  还有 form-data , application/x-www-form-urlencoded
//fadeIn 弹框是否显示    传1  不显示
// urlDr
function PostAjax(who,type,content,Pri,callBack,failCallBack,isShowMsg,hideloa,showLod,ContentType,fadeIn,urlDr){
	console.log(type)
    var netLink = 'http://192.168.0.164:8080';
	if(urlDr == 1){
        netLink = 'http://192.168.0.167:10013';
	}else if(urlDr == 2){
        netLink = 'http://192.168.0.167:10012';
	}else if(urlDr == 3){
        netLink = 'http://192.168.0.164:10005';
    }else if(urlDr == 4){
        netLink = 'http://192.168.0.123:8080';
	}
	var guid = NewGuid();
	var adminId = localStorage.getItem('adminId') == null ? '999999999': localStorage.getItem('adminId');
	var ConType = ContentType ? ContentType : 'application/json'
    console.log(content);
    if(showLod != 1){
    	who.loadingshow = true;
    }
    axios({
		method: type,
		url: netLink + Pri,
		data: JSON.stringify(content),
		headers: {
            'Content-Type': ConType,
            CertType: "MD5",
	        Certification: "D33B351946691F22D08CEE85B793B6CE",
	        Channel: "4.1.0",
	        OSInformation: "9.3",
	        Plat: "pc",
	        Timestamp: "1521781731757",
	        UserId: adminId,
	        Version: "1.0",
	        ToKen:'',
	        RGuid: guid
      	},
		withCredentials:false
	}).then(function(data) { //es5写法
		// console.log(data);
		if(data.status == 200) {
			if(data.data != '' && data.data.data != '') {
				var dataL = data.data.data;
				console.log(dataL);
				if(dataL != '' && data.data.code == 202){
                    failCallBack(data.data.msg)
				}else if(dataL != '' && data.data.code == 0){
					if(typeof callBack == 'function')
						if(fadeIn !=1)
							fadeInOut(data.data.msg);
						callBack(dataL)
				}else {
					if(isShowMsg != 1){
						fadeInOut(data.data.msg);
					}					
					if(typeof failCallBack == 'function')
						// failCallBack(dataL)
						failCallBack(data.data.msg)
				}

			} else {
				fadeInOut('请检查网络连接');
				console.log(data);
			}
		} else {
			fadeInOut('请检查网络连接');
			console.log(data.data.Message);
			return false;
		}
		if(hideloa != 1) {
			who.loadingshow = false;
		}
	}).catch( function(error) {
		who.loadingshow = false;
		fadeInOut('请检查网络连接');
		console.log(error);
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
//校验m-n位的数字
function getNumber(str){
   var pattern = /^\d{3,4}$/;
    return pattern.test(str)
}
//校验m-n位的数字
function getpho(str){
    var pattern = /^\d{6,11}$/;
    return pattern.test(str)
}
//提示弹框  全局
function fadeInOut(msg){
	var time = null;
	var time1 = null;
	var div = document.createElement("div");
	div.innerHTML = '<p id="msgP">'+ msg +'</p>';
	div.setAttribute('id','integral_fixed');
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
				        document.body.removeChild(document.getElementById("integral_fixed"));
				    }else{					
				    	document.getElementById("msgP").style.background='rgba(0,0,0,'+(num/400)+')';
				    }
				  },50)
	        },1000)
	    }
	    document.getElementById("integral_fixed").style.display = 'block';
	    document.getElementById("msgP").style.background='rgba(0,0,0,'+(num/400)+')';
	    
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