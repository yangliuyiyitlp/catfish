var couponType = new Vue({
	el: "#activeEdit",
	data: {
		rules: {
          activityForm: [
            { required: true, message: '请选择活动表现形式', trigger: 'change' }
          ],
          activityType: [
            { required: true, message: '请选择活动类型', trigger: 'change' }
          ],          
          activeName: [
            {required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'change' }
          ],
          showTime: [
            { required: true, message: '请选择展示时间', trigger: 'change' }
          ],
          failureTime: [
            { required: true, message: '请选择失效时间', trigger: 'change' }
          ]
        },
		activeId:'',
		showPart:1,
		activeData:'',
		winningList:'',
		goodsList:'',
		detailContent:'',
		tabList:[
			{
				id:1,
				img:'../images/aciveTab1.png',
				showImg:'../images/aciveTab1-1.png',
				label:'活动设置'
			},
			{
				id:2,
				img:'../images/aciveTab2.png',
				showImg:'../images/aciveTab2-1.png',
				label:'活动奖品'
			},{
				id:3,
				img:'../images/aciveTab3.png',
				showImg:'../images/aciveTab3-1.png',
				label:'中间名单'
			}
		],
		settingData:{
			activeName:'',
			startTime:'',
			endTime:'',
			showTime:'',
			failureTime:'',
			eventPeriod:'',			
			activityForm:'',
			activityType:'',
			description:'',
			points:'',
			lotteryNumber:'',
			endTips:'',
			notBeginningTips:'',
			noWinningTips:'',
			winningTips:'',
		},		
		Token: {},
		serachData:{
			activityForm:'',
			activeState:'',
			activityType:'',
			eventPeriod:[
				{
					'value':'day',
					'label':'一天',
				},
				{
					'value':'week',
					'label':'一周',
				},{
					'value':'month',
					'label':'一月',
				},
				{
					'value':'year',
					'label':'一年',
				}			
			], 
		},
		formInline: {
            pageSize: 10,
            pageNo: 1
       	},
		pagination: {
			pageSizes: [10, 20, 30], 
			pageSize: 10, 
			count: 0, 
			pageNo: 1
		},		
		pageNo: 1,
		fBgIsShow: false,
		editPopupShow:false,
		addPopupShow:false,
		goodsEdit:'',
		goodsIndex:'',
		newGoodsList:'',
		scene: [{
          label: '商户',
          cities: []
        }, {
          label: '平台',
          cities: []
        }],
        props: {
          value: 'label',
          children: 'cities'
        },
        options: [{
          value: '1',
          label: '优惠券'
        }, {
          value: '2',
          label: '商品'
        }],
        value5: [],
        page2:{
        	pageSizes: [3], 
			pageSize: 3, 
			count: 0, 
			pageNo: 1
        }
	},
	methods: {
		sceneChange(val) {
	        console.log('active item:', val);
	        setTimeout(_ => {
	          if (val.indexOf('商户') > -1 && !this.scene[0].cities.length) {
	            this.options2[0].cities = [{
	              label: '南京'
	            }];
	          } else if (val.indexOf('平台') > -1 && !this.scene[1].cities.length) {
	            this.options2[1].cities = [{
	              label: '杭州'
	            }];
	          }
	        }, 300);
      	},       	
		getData:function(){
			var that = this;
			var id = getParameter('activeId');
			that.activeId = id;
			var content = {
				id: id
			}
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/form', function(data) {
				console.log(data)
				that.activeData = data;
				console.log(that.activeData)
			},'','','','','','',4)
		},
		submitData:function(){//提交基础设置
			var that = this;
			var activeData = that.activeData;
			var content = {
				id: that.activeId,
				eventManId: activeData.eventManId,
				overRemark: activeData.overRemark,
				eventTypeId: activeData.eventTypeId,							
				outRemark: activeData.outRemark,
				eventName:activeData.eventName,
				msgHasNot:activeData.msgHasNot,
				beginTime:activeData.beginTime,
				msgEnd:activeData.msgEnd,
				endTime:activeData.endTime,
				eventPeriod:activeData.eventPeriod,
				releaseTime:activeData.releaseTime,				
				personCount:activeData.personCount,				
				stockoutTime:activeData.stockoutTime,
				deduction:activeData.deduction,
				description:activeData.description == undefined ? '' : activeData.description
			}
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/save', function(data) {
				console.log(data)
				that.activeData = data;
			},'','','','','','',4)
		},
		getWinningList:function(){//获取中奖名单
			var that = this;
			var content = {
				eventId: that.activeId,
				pageSize: 30,
				pageNo:1
			}
			PostAjax(that, 'post', content, '/layer/nyeventwinners/nyEventWinners/list', function(data) {
				console.log(data)
				that.winningList = data.result;
			},'','','','','','',4)
		},
		getGoodsList:function(){//获取奖品列表
			var that = this;
			var content = {
				id: that.activeId
			}
			PostAjax(that, 'post', content, '/layer/nyeventprizes/nyEventPrizes/list', function(data) {
				console.log(data)
				that.goodsList = data.result;
			})
		},
		setPrizePool:function(){//设置奖品池
			
		},
		addGoods:function(){//添加奖品
			///layer/nyeventprizes/nyEventPrizes/rank
			var that = this;
			
		},
		downloadTemplate:function(){//下载导入模板
			PostAjax(this, 'post', '', '/layer/nyeventprizes/nyEventPrizes/import/template', function(data) {
				window.location.href = 'http://192.168.0.216:10005'+data;
			})
		},
		exportPrizePool:function(){//导出奖品池
			PostAjax(this, 'post', '', '/layer/nyeventprizespool/nyEventPrizesPool/exportAll', function(data) {
				window.location.href = 'http://192.168.0.216:10005' + data;
			})
		},
		handleCurrentChange: function (val) {//中奖记录分页切换分页
            this.formInline.pageNo = val
            this.pagination.pageNo = val
//          this.query()
        },
        handleSizeChange: function (val) {//中奖记录改变显示数量
            this.formInline.pageSize = val
            this.pagination.pageSize = val
//          this.query()
        },
        delectFun(index) {//删除商品
        	var that = this;
        	var oldList = that.goodsList;
        	var list = oldList[index];
        	var textC = '确定删除"'+ list.prizeName +'"吗？';
	        that.$confirm(textC, '', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          confirmButtonClass:'confirm',
	          cancelButtonClass	:'is-round',
	          type: 'warning',
	          center: true
	        }).then(() => {        	
	          	PostAjax(that, 'post', {'id':list.id}, '/layer/nyeventprizes/nyEventPrizes/delete', function(data) {					
					that.goodsList.splice(index,1);
				})
	        }).catch(() => {
	          	
	        });
	    },
	    editFun:function(index){//编辑
	    	var that= this;	    	
	    	var oldList = that.goodsList;	    	
        	var list = oldList[index];
        	that.goodsEdit = list;
        	that.goodsIndex = index;
        	that.fBgIsShow = true;
			that.editPopupShow = true;	    	
	    },
	    submitForm(formName) {//活动奖品编辑提交
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
				var that = this;
				var goodsEdit = that.goodsEdit;
				var content = {
					id:goodsEdit.id,
					prizeName: goodsEdit.prizeName,
					prizeDesc: goodsEdit.prizeDesc,
					isAutoGet: goodsEdit.isAutoGet == '是' ? '1' : '0',							
					countTotal: goodsEdit.countTotal,
					prizeTypeId:goodsEdit.prizeTypeId,
				}
				console.log(content)
				PostAjax(that, 'post', content, '/layer/nyeventprizes/nyEventPrizes/save', function(data) {
					console.log(data);
					that.resetForm('goodsEdit');
				})
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
	    },
	    resetForm(formName) {//添加弹窗数据重置
	    	this.fBgIsShow = false;
			this.editPopupShow = false;       
	    },
	    sortFun:function(type,index){//排序
	    	var that = this;
	    	var oldList = that.goodsList;	    	
        	var list = oldList[index];
        	var id = list.id,
        	displayIn = list.displayIndex,
        	otherIn;
        	if(type == 'up'){
        		otherIn = index - 1;        		
        	}else if(type == 'down'){
        		otherIn = index + 1;        	
        	}
        	var otherList = oldList[otherIn];
        	var con = {
        		id1 : id,
        		id2 : otherList.id,
        		displayIndex1 : displayIn,
        		displayIndex2 : otherList.displayIndex,
        	}
        	console.log(con)
        	PostAjax(that, 'post', con , '/layer/nyeventprizes/nyEventPrizes/rank', function(data) {        		
        		list.displayIndex = otherList.displayIndex
        		otherList.displayIndex = displayIn;
        		Vue.set(that.goodsList, index, otherList);
        		Vue.set(that.goodsList, otherIn, list);
//	      		console.log(data)
			});		
	    },
	    getKeyWords:function(){//获取字典接口
	      	var that = this;
	      	//活动状态
	      	PostAjax(that, 'post', {"types":"activeState,activityType,CouponSpecifiedType"}, '/layer/dict/sysDict/listByTypes', function(data) {
	      		console.log(data)
				that.serachData.activeState = data.activeState;
				that.serachData.activityType = data.activityType;
				that.serachData.useRange = data.CouponSpecifiedType;
			},'','','','','',1,1);			
			//表现形式，活动类型
			PostAjax(that, 'post', '', '/layer/nyeventman/nyEventMan/list', function(data) {
	      		console.log(data)
				that.serachData.activityForm = data.men;
			},'','','','','',1,4)
	   	},
	    changeShow:function(id){//tab切换
	    	this.showPart = id;
	    	if(id == 3){
	    		this.getWinningList()
	    	}else if(id == 2){
	    		this.getGoodsList()
	    	}
	    },
	    // 获取oss秘钥
        beforeAvatarUpload: function (file) {
            var that = this;
            return new Promise(function (resolve) {
                PostAjax(that, 'post', {'user_dir': 'activeManage'}, '/layer/oss/ossUtil/policy', function (data) {
                    that.Token = data
                    that.Token.key = that.Token.dir + '/' + (+new Date()) + file.name
                    that.Token.OSSAccessKeyId = that.Token.accessid
                    that.ruleForm.storePic1 = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + that.Token.key
                    resolve()

                }, function (data) {
                    fadeInOut(data);
                })
            })
        },
        handleAvatarSuccess: function () {
            this.iconUrl = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + this.Token.key
        },
        getnNewList:function(){
        	var that = this;
        	PostAjax(that, 'post', {pageSize:'3',pageNo:that.page2.pageNo,eventId:that.activeId}, '/layer/nycoupontype/nyCouponType/listEvent', function (data) {
        		console.log(data)
                that.newGoodsList = data.result;
                that.page2.count = data.total;
            },'','','','','','',4)
        },
        addGoods:function(){//显示添加奖品弹窗
        	var that = this;
//      	that.getnNewList();        	
        	that.fBgIsShow = true;
			that.addPopupShow = true;			
        },
        currentChange: function (val) {//添加奖品弹窗页切换分页
			console.log(val)
            this.page2.pageNo = val
//          this.query()
        },
        getNewgoodsData:function(){//查询优惠券
        	var that = this;
        	that.page2.pageNo = 1;
        	that.getnNewList();
        },
        choseGoods:function(index,item){//添加奖品
        	var that = this;
        	var con = {
        		'eventId': that.activeId,
        		"prizeName": item.couponTypeName,
				"countTotal": item.countLeft,
				"prizeObject":{
					"id": item.id
				}
        	};
        	PostAjax(that, 'post', con, '/layer/nyeventprizes/nyEventPrizes/save', function (data) {
        		console.log(data)
        		that.getData();
        		that.getnNewList();
            })
        }
	},
	created: function() {
		var that = this;	
		that.getKeyWords();
		that.getData();		
	}
})
var options = {
  	debug: 'info',
	modules: {
	    toolbar: {
		    container: [
		      ['bold', 'italic', 'underline', 'strike'],
		      ['blockquote', 'code-block'],
		      [{ 'header': 1 }, { 'header': 2 }],
		      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
		      [{ 'script': 'sub' }, { 'script': 'super' }],
		      [{ 'indent': '-1' }, { 'indent': '+1' }],
		      [{ 'direction': 'rtl' }],
		      [{ 'size': ['small', false, 'large', 'huge'] }],
		      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		      [{ 'font': [] }],
		      [{ 'color': [] }, { 'background': [] }],
		      [{ 'align': [] }],
		      ['clean'],
		      ['link', 'image', 'video']
		    ],  // 工具栏
	      	handlers: {
		        'image': function (value) {
		        	 alert(1)
		          if (value) {
		            alert(1)
//			            document.querySelector('#quill-upload').click()
		          } else {
		          	alert('ddd')
//			            this.quill.format('image', false);
		          }
		        }
	      	},
	    }			    
	},
  	theme: 'snow'
}
var editor = new Quill('#editor', options);