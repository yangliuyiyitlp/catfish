var dome = new Vue({
	el:"#dome",
	data:{
		message: 'Hello Vue!'
	},
	methods:{	
		goBack:function(){
			var that = this;
			that.route = JSON.parse(localStorage.getItem('route'));
			var goLink = that.route[that.route.length - 1];
			window.location.href = goLink;			
		},
	  	goScan:function(){//微信扫一扫
	  		var that = this;
	  		wx.scanQRCode({
			    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res) {
				    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
					window.location.href = 'user_details.html?type=1&userKey='+result;
			    }
			});
	  	},
	  	showBigCode:function(){
	  		var that = this;
	  		if(that.codeList > 1){
	  			window.location.href = 'code_list.html';
	  		}else{
	  			that.showbigcode = true;
	  		}			
	  	},
	  	closeBigCode:function(){
	  		var that = this;
	  		that.showbigcode = false;
	  	}
	},
	created:function (){  		
  		var that = this;
  		that.loadingshow = true;		
  		PostAjax(this,that.shareC,'PZ.WX.wxagent.qrscan',function(data){
  			that.loadingshow = false;
  			if(data.status == 200){  				  
  				console.log(data);				
				wx.config({
				    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: data.obj.appID, // 必填，公众号的唯一标识
				    timestamp: data.obj.timestamp, // 必填，生成签名的时间戳
				    nonceStr: data.obj.nonceStr, // 必填，生成签名的随机串
				    signature: data.obj.signature,// 必填，签名
				    jsApiList: [
				    	'scanQRCode'
				    ]
				});
				wx.error(function (res) {
				    alert(res.errMsg);  
					console.log(res.errMsg)
				    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
				});			
  			}else{
  				fadeInOut(data.msg)
  			}
		})
	},
	mounted:function(){
		var that = this;
		that.showpage = true; 
		var str = JSON.parse(localStorage.getItem('user'));
		console.log(str)		
		PostAjax(that,'','PZ.TX_App_User.api.GetInfo.GetUserMapUnitInfo',function(data){
  			that.loadingshow = false;
  			if(data.status == 200){
  				console.log(data)
  				if(data.obj != null){
  					that.codeList = data.obj.length;
  					that.myname = str.UserName == '' ? str.Phone : str.UserName;
					that.mypic = str.ImagesHead;
					that.mycode = data.obj[0].UserQRUrl;
					that.shopname = data.obj[0].UnitName;
  					console.log(data.obj)
  				}
  			}else{
  				fadeInOut(data.msg);
  			}
		})	
	}
})


