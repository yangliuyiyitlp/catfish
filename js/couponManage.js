var couponManage = new Vue({
	el: "#couponManage",
	data: {
		useRange: [{//指定类型
			id: 1,
			name: "不限"
		}, {
			id: 0,
			name: "全场"
		}, {
			id: -1,
			name: "单个"
		}],		
		statusValid: ['过期','有效'],		
		useState: ['未使用','使用'],	
		formInline: {
            pageSize: 30,
            pageNo: 1,
            storeName: ''
       },
		pagination: {
			pageSizes: [30, 40, 60, 100],
			pageSize: 30,
			count: 0,
			pageNo: 1
		},
		serachData:{
			couponId:'',
			couponNum:'',
			userName:'',
			dateTime:'',
			useStateData:'',
			useRangeData:'',
			statusValidData:'',
			couponName:'',
			useRange: [{//指定类型
				id: 1,
				name: "不限"
			}, {
				id: 0,
				name: "全场"
			}, {
				id: -1,
				name: "单个"
			}],
			
			statusValid: [{//有效状态
				id: 0,
				val: '过期'
			},
			{
				id: 1,
				val: '有效'
			}],
			
			useState: [{//使用状态
				id: 0,
				val: '未使用'
			},
			{
				id: 1,
				val: '使用'
			}],
		},
		loadingShow: false, //loading
		couponList:[],
		fBgIsShow:false,
		showItem:{}
	},
	methods: {		
		getData:function(){
			var that = this;
			var dateT = that.serachData.dateTime;
			var startTime = null,endTime = null;
			console.log(that.serachData.dateTime)
			if(dateT != ''){
				startTime = dateT[0].getFullYear() + '-' + (dateT[0].getMonth() + 1) + '-' + dateT[0].getDate() + ' ' + dateT[0].getHours() + ':' + dateT[0].getMinutes() + ':' + dateT[0].getSeconds();
				endTime = dateT[1].getFullYear() + '-' + (dateT[1].getMonth() + 1) + '-' + dateT[1].getDate() + ' ' + dateT[1].getHours() + ':' + dateT[1].getMinutes() + ':' + dateT[1].getSeconds();			
			}
			var content = {
				id:that.serachData.couponId,
				couponCode:that.serachData.couponNum,
				realName:that.serachData.userName,
				startDate:startTime,
				endDate:endTime,
				couponStatus:that.serachData.useStateData,
				isExpired:that.serachData.useRangeData,
				couponAssignType:that.serachData.statusValidData,
				couponTypeName:that.serachData.couponName,
				pageSize:that.formInline.pageSize,
				pageNo:that.formInline.pageNo				
			}
			PostAjax(that, 'post', content, '/layer/nycoupon/nyCoupon/list', function(data) {
				that.couponList = data.result;
				var newA = [];
				for (var i = 0;i<data.result.length;i++) {				
					var li = data.result[i];
					li.couponStatus = li.couponStatus == 0 ? '未使用': '使用';
					li.isExpired = li.isExpired == 0 ? '过期': '有效';
					newA[i] = li;			
				}
				that.couponList = newA;
				that.formInline.pageNo ++;
			},'','','','','','',4)
		},
		searchData:function(){
			var that = this;
			that.formInline.pageNo = 1;
			that.getData();			
		},
		handleCurrentChange: function(val) {
			this.formInline.pageNo = val
			this.pagination.pageNo = val
			this.getData()
		},
		handleSizeChange: function(val) {
			this.formInline.pageSize = val
			this.pagination.pageSize = val
			this.getData()
		},
		showRow:function(data){
			this.showItem = data;
			this.fBgIsShow = true;
		},
		closePopup:function(){
			this.fBgIsShow = false;
		},
		exportData:function(){
			var that = this;
			var dateT = that.serachData.dateTime;
			var startTime = null,endTime = null;
			console.log(that.serachData.dateTime)
			if(dateT != ''){
				startTime = dateT[0].getFullYear() + '-' + (dateT[0].getMonth() + 1) + '-' + dateT[0].getDate() + ' ' + dateT[0].getHours() + ':' + dateT[0].getMinutes() + ':' + dateT[0].getSeconds();
				endTime = dateT[1].getFullYear() + '-' + (dateT[1].getMonth() + 1) + '-' + dateT[1].getDate() + ' ' + dateT[1].getHours() + ':' + dateT[1].getMinutes() + ':' + dateT[1].getSeconds();			
			}
			var content = {
				id:that.serachData.couponId,
				couponCode:that.serachData.couponNum,
				realName:that.serachData.userName,
				startDate:startTime,
				endDate:endTime,
				couponStatus:that.serachData.useStateData,
				isExpired:that.serachData.useRangeData,
				couponAssignType:that.serachData.statusValidData,
				couponTypeName:that.serachData.couponName				
			}
	
			PostAjax(that, 'post', content, '/layer/nycoupon/nyCoupon/export', function(data) {
				console.log(data)
				window.location.href = 'http://192.168.0.123:8080'+data;
			},'','','','','','',4)
		}
	},
	created: function() {
		
	}
})