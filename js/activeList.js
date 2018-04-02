var couponType = new Vue({
	el: "#activeList",
	data: {
		serachData:{
			activeStateVal:'',
			activityFormVal:'',
			activityTypeVal:'',
			activeState: [{//活动状态
				value: 1,
				label: "不限"
			}, {
				value: 0,
				label: "全场"
			}, {
				value: -1,
				label: "单个"
			}],
			activityForm: [{//活动表现形式
				value: 1,
				label: "不限"
			}, {
				value: 0,
				label: "全场"
			}, {
				value: -1,
				label: "单个"
			}],
			activityType: [{//活动类型
				value: 1,
				label: "不限"
			}, {
				value: 0,
				label: "全场"
			}, {
				value: -1,
				label: "单个"
			}]
		},
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
		pageNo: 1,
		loadingShow: false, //loading
		pAdd: {
			activityForm: [{//活动表现形式
				value: 1,
				label: "不限"
			}, {
				value: 0,
				label: "全场"
			}, {
				value: -1,
				label: "单个"
			}],
			activityType: [{//活动类型
				value: 1,
				label: "不限"
			}, {
				value: 0,
				label: "全场"
			}, {
				value: -1,
				label: "单个"
			}],
			activeName:'',
			startTime:'',
			endTime:'',
			showTime:'',
			failureTime:''			
		},
		couponList: [],
		fBgIsShow: false,
		addPopupShow:false
	},
	methods: {
		getData:function(){
			var that = this;
			var content = {
				eventTypeId: '',
				eventManId: '',
				newEventStatus: '',							
				pageSize: 10,
				pageSize:1
			}
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/list', function(data) {
				console.log(data)
//				that.couponList = data.result;
//				that.formInline.pageNo ++;
			},'','','','','','',4)
		},
		BlurValue: function(event, name) { //失去焦点
			if(name == 'typeName') { //类型名称
				var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/;
				if(!reg.test(this.pAdd.typeName)) {
					this.pAdd.typeNameShow = true;
				} else {
					this.pAdd.typeNameShow = false;
				}
			} else if(name == 'parValue') { //类型金额
				var reg = /^[1-9]+[0-9]*$/;
				if(!reg.test(this.pAdd.parValue)) {
					this.pAdd.parValueShow = true;
				} else {
					this.pAdd.parValueShow = false;
				}
			} else if(name == 'validPeriod') { //有效期
				if(this.pAdd.validPeriod !== '0' && this.pAdd.validPeriod !== 0) {
					var reg = /^[1-9]+[0-9]*$/;
					if(!reg.test(this.pAdd.validPeriod)) {
						this.pAdd.validPeriodShow = true;
					} else {
						this.pAdd.validPeriodShow = false;
					}
				} else {
					this.pAdd.validPeriodShow = false;
				}
			} else if(name == 'conditionValue') { //满足条件金额
				var reg = /^[1-9]+[0-9]*$/;
				if(!reg.test(this.pAdd.conditionValue)) {
					this.pAdd.conditionValueShow = true;
				} else {
					this.pAdd.conditionValueShow = false;
				}
			}
		},
		AddActive: function() { //添加
			var content = "";
			var that = this;
			var pAdd = that.pAdd;
			content = {
				eventTypeId: '',
				eventManId: '',
				newEventStatus: '',							
				pageSize: 10,
				pageSize:1
			}
			console.log(content)
			that.addPopupShow = false;
			that.fBgIsShow = false;
			PostAjax(that, 'post', content, '/layer/nycoupontype/nyCouponType/save', function(data) {
				console.log(data);
//				that.loadingShow = false;				
				if(pAdd.id === -1){					
					that.formInline.pageNo = 1;				
					that.getData();
				}else{		
					Vue.set(that.couponList, that.pAdd.index, data)
				}
				that.PopupConcel();
			},'','','','','','',4)
		},
		PopupConcel: function() {
			this.fBgIsShow = false;
			this.addPopupShow = false;
			this.pAdd = {
				activityForm: [{//活动表现形式
					value: 1,
					label: "不限"
				}, {
					value: 0,
					label: "全场"
				}, {
					value: -1,
					label: "单个"
				}],
				activityType: [{//活动类型
					value: 1,
					label: "不限"
				}, {
					value: 0,
					label: "全场"
				}, {
					value: -1,
					label: "单个"
				}],
				activeName:'',
				startTime:'',
				endTime:'',
				showTime:'',
				failureTime:''
			};
		},
		changeTypes: function(index,data) { //启动/停止
			console.log(data)
			var that = this;			
			that.pAdd.index = index;
			that.loadingShow = true;
			var isUse = data.isUse == true ? 0 : 1;
			var content = {
				id: data.id,
				isUse: isUse,
				couponTypeName: data.couponTypeName,
				parValue: data.parValue,							
				couponAssignType: data.couponAssignType,
				storeId:data.storeId,
				validPeriod: data.validPeriod,
				conditionValue: data.conditionValue,
				isRepeatable: data.isRepeatable,
				isMixable: data.isMixable,
				couponType: data.couponType
			}
			PostAjax(that, 'post', content, '/layer/nycoupontype/nyCouponType/save', function(data) {
				console.log(data);
				that.loadingShow = false;				
				Vue.set(that.couponList, that.pAdd.index, data)
			},'','','','','','',4)
		},
		handleCurrentChange: function (val) {
            this.formInline.pageNo = val
            this.pagination.pageNo = val
            this.query()
        },
        handleSizeChange: function (val) {
            this.formInline.pageSize = val
            this.pagination.pageSize = val
            this.query()
        },
        delectFun() {
        	var that = this;
	        that.$confirm('确定删除“7474747”?', '', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          confirmButtonClass:'confirm',
	          cancelButtonClass	:'is-round',
	          type: 'warning',
	          center: true
	        }).then(() => {
	          	PostAjax(that, 'post', {'id':'002891091fa949628d0e5350c84d28ed'}, '/layer/nyevent/nyEvent/delete/002891091fa949628d0e5350c84d28ed', function(data) {
					console.log(data);
				},'','','','','','',4)
	        }).catch(() => {
	          	
	        });
	    },
	    updataFun() {
	        this.$confirm('确定提交？', '', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          confirmButtonClass:'confirm',
	          cancelButtonClass	:'is-round',
	          type: 'warning',
	          center: true
	        }).then(() => {
	          
	        }).catch(() => {
	          
	        });
	    },
	    audit(){
	    	 this.$prompt('请输入邮箱', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
	          inputErrorMessage: '邮箱格式不正确',
	          center: true
	        }).then(({ value }) => {
	          
	        }).catch(() => {
	               
	        });
	    },
	    changeFun(){
	    	var that = this;
	    	var content={
	    		'id':'002891091fa949628d0e5350c84d28ed',
	    		
	    	}
	    	PostAjax(that, 'post', {}, '/layer/nyevent/nyEvent/delete/002891091fa949628d0e5350c84d28ed', function(data) {
					console.log(data);
				},'','','','','','',4)
	    },
	    ///layer/nyevent/nyEvent/status
	    getKeyWords:function(){
	      	var that = this;
	      	PostAjax(that, 'post', {"types":"CouponSpecifiedType"}, '/layer/dict/sysDict/listByTypes', function(data) {
	      		console.log(data)
				that.serachData.useRange = data.CouponSpecifiedType;

			},'','','','','',1,1)
	    }
	},
	created: function() {
		var that = this;	
		that.getKeyWords();
	}
})