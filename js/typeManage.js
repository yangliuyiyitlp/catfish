var searchData = {
	useRangeSelect: 1,
	UseRange: 0,
	TypeName: '',
	ParValue: '',
	PageNo: 1,
	PageSize: 10
}
var couponType = new Vue({
	el: "#couponType",
	data: {
		serachData:{
			couponNum:'',
			userName:'',
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
			}]
		},
		pagination: {pageSizes: [30, 40, 60, 100], pageSize: 30, count: 0, pageNo: 1},
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
			uSelect: [{
				Id: 0,
				Name: "全场"
			}, {
				Id: -1,
				Name: "单个"
			}],
			popupName: '', //添加/编辑
			popupShow: false, //弹框
			useRangeId: 0, //优惠券指定类型（Id）
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
			pG: { //商品
				goodsNameIsShow: true, //商品
				goodsSearch: "", //单个，搜索店铺
				goodsSearchResult: [], //搜索结果
			},
			goodsName: "",
			goodsId: "",
			goodsNameShow: false,
			conditionValue: "", //订单总额满足
			conditionValueShow: false,
			isRepeatable: 0, //是否可以叠加使用
			isMixable: 0, //是否混合使用
			couponType: 1, //优惠券形式
		},
		searchResult: [],
		fBgIsShow: false,
		clearIsShow: false,
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
			PostAjax(that, 'post', content, '/nycoupon/nyCoupon/list', function(data) {
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
			},'','','','','','',2)
		},
		GetCouponTypeList: function(n) { //查询优惠券类型数据
			var parValue = this.parValue;
			var reg = /^[1-9]{1}[0-9]*$/;
			if(parValue) {
				if(!reg.test(parValue)) {
					fadeInOut("金额为正整数");
					return false;
				}
			}
			var content = {
				useRangeSelect: this.useRangeId,
				UseRange: this.useRangeResultId,
				TypeName: this.typeName,
				ParValue: this.parValue,
				PageNo: n,
				PageSize: 10
			};
			this.pageNo = n;
			//			$('#kkpager').hide();
			this.loadingShow = true;
			PostAjax2(this, content, '/Coupon/GetCouponTypeList', function(data) {
				if(data.status == "200") {
					var obj = data.obj;
					if(obj) {
						if(obj.length > 0) {
							this.searchResult = data.obj;
							pageDatamyPagin('#kkpager', n, data.TotalCount, data.pageSize, this.GetCouponTypeList);
							$('#kkpager').show();
						} else {
							if(n > 1) {
								this.GetCouponTypeList(n - 1);
							} else {
								this.searchResult = data.obj;
								fadeInOut("没有数据");
							}
						}
					} else {
						if(n > 1) {
							this.GetCouponTypeList(n - 1);
						} else {
							this.searchResult = data.obj;
							fadeInOut("没有数据");
						}
					}
					this.loadingShow = false;
				} else {
					this.loadingShow = false;
					fadeInOut(data.msg);
				}
			}.bind(this))
		},
		changeUseRange: function(event, type) {
			if(event.target.value !== -1) {
				if(type == 1) {
					this.useRangeResult = "";
					this.useRangeResultId = -1;
				} else {
					this.pAdd.useRangeResult = "";
					this.pAdd.useRangeResultId = -1;
				}
			}
		},
		SingleClick: function(type) { //选择单个可查询，选择全场不可以查询
			if(type == 1) {
				if(this.useRangeId !== -1) {
					return false;
				} else {
					if(this.shopNameIsShow != true) {
						this.useRangeSearch = '';
						this.useRangeSearchResult = null;
						this.shopNameIsShow = true;
					}
				}
			} else if(type == 2) {
				if(this.pAdd.useRangeId == 0) {
					return false;
				} else {
					if(this.pAdd.pUR.shopNameIsShow != true) {
						this.pAdd.pUR.useRangeSearch = '';
						this.pAdd.pUR.useRangeSearchResult = null;
						this.pAdd.pUR.shopNameIsShow = true;
					}
				}
			} else if(type == 3) {
				if(this.pAdd.useRangeId == -1 && !this.pAdd.useRangeResultId) { //判断是否单个，是单个是否有选中供应商
					fadeInOut("请先选择优惠券指定类型");
					return false;
				}
				if(this.pAdd.pG.goodsNameIsShow != true) {
					this.pAdd.pG.goodsSearch = '';
					this.pAdd.pG.goodsSearchResult = null;
					this.pAdd.pG.goodsNameIsShow = true;
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
			var content = "";
			if(type == 1) {
				if(this.useRangeSearch == "") {
					fadeInOut("请输入搜索条件");
					return false;
				}
				content = {
					SearchValue: this.useRangeSearch
				};
			} else if(type == 2) {
				if(this.pAdd.pUR.useRangeSearch == "") {
					fadeInOut("请输入搜索条件");
					return false;
				}
				content = {
					SearchValue: this.pAdd.pUR.useRangeSearch
				};
			}
			this.loadingShow = true;
			PostAjax2(this, content, '/Coupon/GetU_UnitSeller', function(data) {
				if(data.status == "200") {
					this.loadingShow = false;
					if(data.obj) {
						if(data.obj.length > 0) {
							if(type == 1) {
								this.useRangeSearchResult = data.obj;
							} else if(type == 2) {
								this.pAdd.pUR.useRangeSearchResult = data.obj;
							}
							return false;
						}
					}
					if(type == 1) {
						this.useRangeSearchResult = [];
					} else if(type == 2) {
						this.pAdd.pUR.useRangeSearchResult = [];
					}
					fadeInOut('未找到对应的结果');
				} else {
					this.loadingShow = false;
					fadeInOut(data.msg);
				}
			}.bind(this))
		},
		GetSearchGoods: function() { //查询商品
			if(this.pAdd.pG.goodsSearch == "") {
				fadeInOut("请输入搜索条件");
				return false;
			}
			var content = {
				UseRangeId: this.pAdd.useRangeId,
				UnitId: this.pAdd.useRangeResultId,
				ItemName: this.pAdd.pG.goodsSearch
			};
			this.loadingShow = true;
			PostAjax2(this, content, '/Coupon/GetGoodsList', function(data) {
				if(data.status == "200") {
					this.loadingShow = false;
					if(data.obj) {
						if(data.obj.length > 0) {

							return false;
						}
					}
					fadeInOut('未找到对应的结果');
				} else {
					this.loadingShow = false;
					fadeInOut(data.msg);
				}
			}.bind(this))
		},
		ShopSelect: function(event, item, type) { //选择单个指定用户
			if(type == 1) {
				this.useRangeResult = item.UnitName;
				this.useRangeResultId = item.UnitId;
				this.shopNameIsShow = false;
			} else if(type == 2) {
				this.pAdd.useRangeResult = item.UnitName;
				this.pAdd.useRangeResultId = item.UnitId;
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
		SelectGoods: function() { //选择商品

		},
		AddCouponType: function() { //添加或编辑
			var content = "";
			var pAdd = this.pAdd;
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
				var validPeriod = this.pAdd.validPeriod;
				if(validPeriod !== '0' && validPeriod !== 0) {
					var reg = /^[1-9]+[0-9]*$/;
					if(!reg.test(validPeriod)) {
						this.pAdd.validPeriodShow = true;
						index++;
					} else {
						this.pAdd.validPeriodShow = false;
					}
				} else {
					this.pAdd.validPeriodShow = false;
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
					if(pAdd.Id === -1) { //添加
						content = {
							TypeName: typeName,
							ParValue: parValue,
							UseRange: pAdd.useRangeId == 0 ? pAdd.useRangeId : pAdd.useRangeResultId,
							ValidPeriod: validPeriod,
							ConditionValue: conditionValue,
							IsRepeatable: pAdd.isRepeatable,
							IsMixable: pAdd.isMixable,
							CouponType: pAdd.couponType
						}
					} else { //编辑
						content = {
							Id: pAdd.id,
							TypeName: typeName,
							ParValue: parValue,
							UseRange: pAdd.useRangeId == 0 ? pAdd.useRangeId : pAdd.useRangeResultId,
							ValidPeriod: validPeriod,
							ConditionValue: conditionValue,
							IsRepeatable: pAdd.isRepeatable,
							IsMixable: pAdd.isMixable,
							CouponType: pAdd.couponType
						}
					}

				}
			} else { //物理券
				content = {}
			}
			this.loadingShow = true;
			PostAjax2(this, content, '/Coupon/SetCouponType', function(data) {
				if(data.status == "200") {
					fadeInOut(data.msg);
					this.GetCouponTypeList(1);
					this.pAdd = {
						uSelect: [{
							Id: 0,
							Name: "全场"
						}, {
							Id: -1,
							Name: "单个"
						}],
						popupName: '', //添加/编辑
						popupShow: false, //弹框
						useRangeId: 0, //优惠券指定类型（Id）
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
						pG: { //商品
							goodsNameIsShow: true, //商品
							goodsSearch: "", //单个，搜索店铺
							goodsSearchResult: [], //搜索结果
						},
						goodsName: "",
						goodsId: "",
						goodsNameShow: false,
						conditionValue: "", //订单总额满足
						conditionValueShow: false,
						isRepeatable: 0, //是否可以叠加使用
						isMixable: 0, //是否混合使用
						couponType: 1, //优惠券形式
					}
					this.fBgIsShow = false;
				} else {
					this.loadingShow = false;
					//					this.fBgIsShow = false;
					fadeInOut(data.msg);
				}
			}.bind(this))
		},
		PopupConcel: function() {
			this.fBgIsShow = false;
			this.pAdd = {
				uSelect: [{
					Id: 0,
					Name: "全场"
				}, {
					Id: -1,
					Name: "单个"
				}],
				popupName: '', //添加/编辑
				popupShow: false, //弹框
				useRangeId: 0, //优惠券指定类型（Id）
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
				pG: { //商品
					goodsNameIsShow: true, //商品
					goodsSearch: "", //单个，搜索店铺
					goodsSearchResult: [], //搜索结果
				},
				goodsName: "",
				goodsId: "",
				goodsNameShow: false,
				conditionValue: "", //订单总额满足
				conditionValueShow: false,
				isRepeatable: 0, //是否可以叠加使用
				isMixable: 0, //是否混合使用
				couponType: 1, //优惠券形式
			};
			this.DeleteDisplay = {
				deleteIsShow: false,
				index: -1,
				name: ''
			};
		},
		EditCouponType: function(index) { //编辑
			var editData = this.searchResult[index];
			var pAdd = this.pAdd;
			pAdd.popupName = '编辑';
			pAdd.id = editData.Id;
			pAdd.typeName = editData.TypeName;
			pAdd.couponType = editData.CouponType;
			pAdd.useRangeId = editData.UseRange == 0 ? editData.UseRange : -1;
			pAdd.useRangeResult = editData.UseRange == 0 ? '' : editData.UnitName;
			pAdd.useRangeResultId = editData.UseRange == 0 ? -1 : editData.UseRange;
			pAdd.parValue = editData.ParValue;
			pAdd.validPeriod = editData.ValidPeriod;
			pAdd.conditionValue = editData.ConditionValue;
			pAdd.isRepeatable = editData.IsRepeatable ? 1 : 0;
			pAdd.isMixable = editData.IsMixable ? 1 : 0;
			this.fBgIsShow = true;
			pAdd.popupShow = true;
		},
		SetStatusChange: function(index) { //启动/停止
			var item = this.searchResult[index];
			item.Status = (item.Status == 1 ? -1 : 1);
			this.loadingShow = true;
			var content = {
				Id: item.Id,
				status: item.Status
			}
			PostAjax2(this, content, '/Coupon/SetCouponTypeStatus', function(data) {
				if(data.status == "200") {
					fadeInOut(data.msg);
					this.searchResult[index] = item;
					this.loadingShow = false;
				} else {
					this.loadingShow = false;
					fadeInOut(data.msg);
				}
			}.bind(this))
		},
		SetIsDelete: function() { //删除
			this.loadingShow = true;
			var content = {
				Id: this.DeleteDisplay.Id,
				IsDelete: 1
			}
			PostAjax2(this, content, '/Coupon/SetCouponTypeStatus', function(data) {
				if(data.status == "200") {
					this.GetCouponTypeList(this.pageNo);
					fadeInOut(data.msg);
					this.DeleteDisplay = {
						deleteIsShow: false,
						Id: -1,
						name: ''
					};
					this.fBgIsShow = false;
				} else {
					this.loadingShow = false;
					fadeInOut(data.msg);
				}
			}.bind(this))
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
      	}
	},
	created: function() {
		var that = this;
		that.coupontype = that.useRangeSelect[0].Name;
		var data = {
			"id": "28f547feb686464997ca8c77b3549ef7",
			"updateDate": "2018-03-21 11:25:05",
			"delFlag": "0",
			"storeName": "商户名20",
			"customId": "1",
			"contact": "张2222工",
			"storeAddr": "金11汇路114",
			"storeTel": "13706533081",
			"storeProvinceid": "111"
		}
		
//		PostAjax(that, 'post', '', '/nycoupon/nyCoupon/list', function(data) {
//			that.searchResult = data.result
//		})
//		PostAjax(that,'get','','/limitoperateflag/tLimitOperateConfig/list',function(data){
//			
//		})
	}
})