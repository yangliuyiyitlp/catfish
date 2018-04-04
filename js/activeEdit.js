var couponType = new Vue({
	el: "#activeEdit",
	data: {
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
			
		},
		Token: {},
		serachData:{			
		},
		formInline: {
            pageSize: 10,
            pageNo: 1,
            storeName: ''
       	},
		pagination: {
			pageSizes: [10, 20, 30], 
			pageSize: 10, 
			count: 0, 
			pageNo: 1
		},		
		pageNo: 1,
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
		fBgIsShow: false,
		addPopupShow:false		
	},
	methods: {
		getData:function(){
			var that = this;
			var content = {
				id: '102891091fa949628d0e5350c84d28ed'
			}
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/form', function(data) {
				console.log(data)
				that.activeData = data;
			},'','','','','','',4)
		},
		submitData:function(){//提交基础设置
			var that = this;
			var content = {
				id: '122891091fa949628d0e5350c84d28ed'
			}
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/form', function(data) {
				console.log(data)
				that.activeData = data;
			},'','','','','','',4)
		},
		getWinningList:function(){//获取中奖名单
			var that = this;
			var content = {
				eventId: '002891091fa949628d0e5350c84d28ed',
				pageSize: 30,
				pageNo:1
			}
			PostAjax(that, 'post', content, '/layer/nyeventwinners/nyEventWinners/list', function(data) {
				console.log(data)
				that.winningList = data.result;
			},'','','','','','',4)
		},
		getGoodsList:function(){//获取中奖名单
			var that = this;
			var content = {
				id: '002891091fa949628d0e5350c84d28ed'
			}
			PostAjax(that, 'post', content, '/layer/nyeventprizes/nyEventPrizes/list', function(data) {
				console.log(data)
				that.goodsList = data.result;
			},'','','','','','',5)
		},
		downloadTemplate:function(){
			PostAjax(this, 'post', '', '/layer/nyeventprizes/nyEventPrizes/import/template', function(data) {
//				console.log(data)
				window.location.href = 'http://192.168.0.124:10005'+data;
			},'','','','','','',5)
		},
		exportPrizePool:function(){
			PostAjax(this, 'post', '', '/layer/nyeventprizespool/nyEventPrizesPool/exportAll', function(data) {
//				console.log(data)
				window.location.href = 'http://192.168.0.124:10005' + data;
			},'','','','','','',5)
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
	    changeFun(){
	    	var that = this;
	    	var content={
	    		'id':'002891091fa949628d0e5350c84d28ed',	    		
	    	}
	    	PostAjax(that, 'post', {}, '/layer/nyevent/nyEvent/delete/002891091fa949628d0e5350c84d28ed', function(data) {
				console.log(data);
			},'','','','','','',4)
	    },
	    getKeyWords:function(){
	      	var that = this;
	      	PostAjax(that, 'post', {"types":"activityType,activeState,activityForm"}, '/layer/dict/sysDict/listByTypes', function(data) {
	      		console.log(data)
				that.serachData.activeState = data.activeState;
				that.serachData.activityForm = data.activityForm;
				that.serachData.activityType = data.activityType;				

			},'','','','','',1,1)
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