var couponType = new Vue({
	el: "#couponType",
	data: {
		serachData:{
			couponAssignType:'',
			storeName:'',
			storeId:'',
			couponTypeName:'',
			parValue:'',
			useRange: [{//指定类型
				id: 1,
				name: "不限"
			}, {
				id: 0,
				name: "全场"
			}, {
				id: -1,
				name: "单个"
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
		couponTypeList:[//优惠券形式
			{
				id: 1,
				name: "虚拟券"
			}
		],
		isRepeatableList:[
			{
				id: 0,
				name: "否"
			},
			{
				id: 1,
				name: "是"
			}
		],
		isMixableList:[
			{
				id: 0,
				name: "否"
			},
			{
				id: 1,
				name: "是"
			}
		],
		coupontype:'',
		useRangeId: 1, //优惠券指定类型（Id）
		useRangeResult: "", //单个：配送商店铺名
		useRangeResultId: -1, //单个：配送商店铺Id
		shopNameIsShow: false, //搜索框
		useRangeSearch: "", //单个，搜索店铺
		useRangeSearchResult: [], //搜索结果
		typeName: "", //类型名称
		parValue: "", //金额
		pageNo: 1,
		loadingShow: false, //loading
		pAdd: {
			index:'',
			uSelect: [{
				id: 1,
				name: "全场"
			}, {
				id: 2,
				name: "单个"
			}],
			popupName: '', //添加/编辑
			popupShow: false, //弹框
			useRangeId: 1, //优惠券指定类型（Id）
			pUR: { //使用范围
				shopNameIsShow: true,
				useRangeSearch: "", //单个，搜索店铺
				useRangeSearchResult: [], //搜索结果
			},
			useRangeResult: "", //单个：配送商店铺名
			useRangeResultId: -1, //单个：配送商店铺Id
			useRangeResultShow: false,
			id: -1, //编辑Id
			typeName: "", //优惠券类型名称
			typeNameShow: "",
			parValue: "", //优惠券金额
			parValueShow: false,
			useRange: "", //使用范围（0 全场 >0 单个配送商Id）
			validPeriod: 0, //有效期（天）
			validPeriodShow: false,
			conditionValue: "", //订单总额满足
			conditionValueShow: false,
			isRepeatable: 0, //是否可以叠加使用
			isMixable: 0, //是否混合使用
			couponType: 1, //优惠券形式
		},
		couponList: [],
		fBgIsShow: false,
		clearIsShow: false,
		isOn:false
	},
	methods: {
		getData:function(){
			var that = this;
			var content = {
				couponAssignType:that.serachData.couponAssignType,
				couponTypeName:that.serachData.couponTypeName,
				storeId:that.serachData.storeId,
				parValue:that.serachData.parValue,
				pageSize:that.formInline.pageSize,
				pageNo:that.formInline.pageNo				
			}
			PostAjax(that, 'post', content, '/layer/nycoupontype/nyCouponType/list', function(data) {
//				var newA = [];
//				for (var i = 0;i<data.result.length;i++) {				
//					var li = data.result[i];
//					console.log(li)
//					li.isRepeatable = li.isRepeatable == 0 ? '否': '是';
//					li.isMixable = li.isMixable == 0 ? '否': '是';
//					li.couponAssignType = that.serachData.useRange[li.couponAssignType].label
//					newA[i] = li;			
//				}
				that.couponList = data.result;
				that.formInline.pageNo ++;
			},'','','','','','',4)
		},
		SingleClick: function(type) { //选择单个可查询，选择全场不可以查询
			console.log(type)
			var that = this;
			if(type == 1) {
				if(that.serachData.couponAssignType != 2) {
					return false;
				} else {
					if(!that.shopNameIsShow) {
						that.useRangeSearch = '';
						that.useRangeSearchResult = null;
						that.shopNameIsShow = true;
					}
				}
			} else if(type == 2) {
				if(that.pAdd.useRangeId == 1) {
					return false;
				} else {
					if(!that.pAdd.pUR.shopNameIsShow) {
						that.pAdd.pUR.useRangeSearch = '';
						that.pAdd.pUR.useRangeSearchResult = null;
						that.pAdd.pUR.shopNameIsShow = true;
					}
				}
			}

		},
		KeyDownEnter: function(event, type) { //输入后回车搜索
			if(event.keyCode == 13) {
				if(type == 3) {
					this.GetSearchGoods();
				} else {
					this.GetSearchShop(type);
				}
			}
		},
		GetSearchShop: function(type) { //搜索店铺
			console.log(type)
			var content = "";
			var that = this;
			if(type == 1) {
				if(that.useRangeSearch == "") {
					fadeInOut("请输入搜索条件");
					return false;
				}
				content = {
					storeName: that.useRangeSearch
				};
			} else if(type == 2) {
				if(that.pAdd.pUR.useRangeSearch == "") {
					fadeInOut("请输入搜索条件");
					return false;
				}
				content = {
					storeName: that.pAdd.pUR.useRangeSearch
				};
			}
			that.loadingShow = true;
			PostAjax(that, 'post', content, '/layer/customstore/nyCustomStore/list', function(data) {
				console.log(data)
				that.loadingShow = false;
				if(data.result.length > 0) {
					if(type == 1) {
						that.useRangeSearchResult = data.result;
//						console.log(data.result)
					} else if(type == 2) {
						console.log(type)
						that.pAdd.pUR.useRangeSearchResult = data.result;
					}
					return false;
				}else{
					if(type == 1) {
						that.useRangeSearchResult = [];
					} else if(type == 2) {
						that.pAdd.pUR.useRangeSearchResult = [];
					}
					fadeInOut('未找到对应的结果');
				}
			},function(msg){
				that.loadingShow = false;
			})
		},
		ShopSelect: function(event, item, type) { //选择单个指定用户
			if(type == 1) {
				this.serachData.storeName = item.storeName;
				this.serachData.storeId = item.id;
				this.shopNameIsShow = false;
				this.clearIsShow = true;
			} else if(type == 2) {
				this.pAdd.useRangeResult = item.storeName;
				this.pAdd.useRangeResultId = item.id;
				this.pAdd.pUR.shopNameIsShow = false;
			}

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
		AddCouponType: function() { //添加或编辑
			var content = "";
			var that = this;
			var pAdd = that.pAdd;
			if(pAdd.couponType == 1) { //虚拟券
				var index = 0;
				var typeName = pAdd.typeName;
				var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/;
				if(!reg.test(pAdd.typeName)) {
					pAdd.typeNameShow = true;
					index++;
				}
				//金额
				var parValue = parseInt(pAdd.parValue);
				if(isNaN(parValue) || parValue == 0 || parValue < 0) {
					pAdd.parValueShow = true;
					index++;
				}
				//有效期
				var validPeriod = pAdd.validPeriod;
				if(validPeriod !== '0' && validPeriod !== 0) {
					var reg = /^[1-9]+[0-9]*$/;
					if(!reg.test(validPeriod)) {
						that.pAdd.validPeriodShow = true;
						index++;
					} else {
						that.pAdd.validPeriodShow = false;
					}
				} else {
					that.pAdd.validPeriodShow = false;
				}
				//订单满足条件
				var conditionValue = parseInt(pAdd.conditionValue);
				if(isNaN(conditionValue) || conditionValue == 0 || conditionValue < 0) {
					pAdd.conditionValueShow = true;
					index++;
				}
				if(pAdd.useRangeId === -1 && pAdd.useRangeResultId <= 0) { //优惠券指定类型
					pAdd.useRangeResultShow = true;
					index++;
				} else {
					pAdd.useRangeResultShow = false;
				}
				if(index > 0) {
					return false;
				} else {
					if(pAdd.id === -1) { //添加
						content = {
							couponTypeName: typeName,
							parValue: parValue,							
							couponAssignType: pAdd.useRangeId ,
							storeId:pAdd.useRangeId == 2 ? pAdd.useRangeResultId : '',
							validPeriod: validPeriod,
							conditionValue: conditionValue,
							isRepeatable: pAdd.isRepeatable,
							isMixable: pAdd.isMixable,
							couponType: pAdd.couponType
						}
					} else { //编辑
						content = {
							id: pAdd.id,
							couponTypeName: typeName,
							parValue: parValue,							
							couponAssignType: pAdd.useRangeId,
							storeId:pAdd.useRangeId == 2 ? pAdd.useRangeResultId : '',
							validPeriod: validPeriod,
							conditionValue: conditionValue,
							isRepeatable: pAdd.isRepeatable,
							isMixable: pAdd.isMixable,
							couponType: pAdd.couponType
						}
					}

				}
			}
			this.loadingShow = true;
			console.log(content)
			that.pAdd.popupShow = false;
			PostAjax(that, 'post', content, '/layer/nycoupontype/nyCouponType/save', function(data) {
				console.log(data);
				that.loadingShow = false;				
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
			this.pAdd = {
				index:'',
				uSelect: [{
					id: 1,
					name: "全场"
				}, {
					id: 2,
					name: "单个"
				}],
				popupName: '', //添加/编辑
				popupShow: false, //弹框
				useRangeId: 1, //优惠券指定类型（Id）
				pUR: { //使用范围
					shopNameIsShow: false,
					useRangeSearch: "", //单个，搜索店铺
					useRangeSearchResult: [], //搜索结果
				},
				useRangeResult: "", //单个：配送商店铺名
				useRangeResultId: -1, //单个：配送商店铺Id
				useRangeResultShow: false,
				id: -1, //编辑Id
				typeName: "", //优惠券类型名称
				typeNameShow: "",
				parValue: "", //优惠券金额
				parValueShow: false,
				useRange: "", //使用范围（0 全场 >0 单个配送商Id）
				validPeriod: 0, //有效期（天）
				validPeriodShow: false,
				conditionValue: "", //订单总额满足
				conditionValueShow: false,
				isRepeatable: 0, //是否可以叠加使用
				isMixable: 0, //是否混合使用
				couponType: 1, //优惠券形式
			};
		},
		EditCouponType: function(index,data) { //编辑
			console.log(index)
			console.log(data)
			var editData = data;
			var pAdd = this.pAdd;
			pAdd.index = index;
			pAdd.popupName = '编辑';
			pAdd.id = editData.id;
			pAdd.typeName = editData.couponTypeName;
			pAdd.couponType = 1;
			pAdd.useRangeId = parseInt(editData.couponAssignType);
			pAdd.useRangeResult = pAdd.useRangeId == 1 ? '' : editData.nyCustomStore.storeName;
			pAdd.useRangeResultId = editData.storeId == '' ? -1 : editData.storeId;
			pAdd.parValue = editData.parValue;
			pAdd.validPeriod = editData.validPeriod;
			pAdd.conditionValue = editData.conditionValue;
			pAdd.isRepeatable = parseInt(editData.isRepeatable);
			pAdd.isMixable = parseInt(editData.isMixable);
			this.fBgIsShow = true;
			pAdd.popupShow = true;
			console.log(this.pAdd.index)
		},
		changeTypes: function(index,data) { //启动/停止
			console.log(data)
			var that = this;			
			that.pAdd.index = index;
			that.loadingShow = true;
			var isUse = data.isUse == 1 ? 0 : 1
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
        querySearch(queryString, cb) {
	        var restaurants = this.restaurants;
	        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
	        // 调用 callback 返回建议列表的数据
	        cb(results);
	    },
	    createFilter(queryString) {
	        return (restaurant) => {
	          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
	        };
	    },
	    handleSelect(item) {
        	console.log(item);
	    },
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