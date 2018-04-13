var couponType = new Vue({
	el: "#activeList",
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
        newSerachData:{
        	activeStateVal:'',//活动状态值
			activityFormVal:'',//活动表现形式值
			activityTypeVal:'',//活动类型值
        },
		serachData:{
			activeStateVal:'',//活动状态值
			activityFormVal:'',//活动表现形式值
			activityTypeVal:'',//活动类型值
			activeState: '',//活动状态列表
			activityForm: '',//活动表现形式列表
			activityType: ''//活动类型列表
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
		loadingShow: false, //loading
		pAdd: {
			activityForm: '',
			activityType: '',
			activeName:'',
			startTime:'',
			endTime:'',
			showTime:'',
			failureTime:''			
		},
		activeList: [],
		fBgIsShow: false,
		addPopupShow:false,
		auditPopupShow:false,
		audit:{
			id:'',
			index:'',
			auditId:3,
			auditList:[
				{
					value:3,
					label:'通过'
				},
				{
					value:2,
					label:'未通过'
				}
			],
			auditTips:''
		}
	},
	methods: {
		getSerach:function(){
			var that = this;
			that.formInline.pageNo = 1;
			that.newSerachData.activeStateVal = that.serachData.activeStateVal;//活动状态值
			that.newSerachData.activityFormVal = that.serachData.activityFormVal;//活动表现形式值
			that.newSerachData.activityTypeVal = that.serachData.activityTypeVal;//活动类型值
			that.getData();
		},
		getData:function(){//搜索获取活动列表
			var that = this;			
			var content = {
				eventTypeId: that.newSerachData.activityTypeVal,
				eventManId: that.newSerachData.activityFormVal,
				newEventStatus: that.newSerachData.activeStateVal,							
				pageSize: that.formInline.pageSize,
				pageNo:that.formInline.pageNo
			}
			console.log(content)
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/list', function(data) {
				console.log(data)
				that.activeList = data.result;
				that.pagination.count = data.total
			},'','','','','','',4)
		},
		submitForm(formName) {//添加活动提交
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
				var that = this;
				var pAdd = that.pAdd;
				var content = {
					eventName: pAdd.activeName,
					eventTypeId: pAdd.activityType,
					eventManId: pAdd.activityForm,							
					beginTime: pAdd.startTime,
					endTime:pAdd.endTime,
					releaseTime:pAdd.showTime,
					stockoutTime:pAdd.failureTime,
				}
				console.log(content)
				PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/save', function(data) {
					console.log(data);
					that.getData();
					that.resetForm('pAdd');
				},'','','','','','',4)
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
	    },
	    resetForm(formName) {//添加弹窗数据重置
	    	this.fBgIsShow = false;
			this.addPopupShow = false;
	        this.$refs[formName].resetFields();	        
	    },
		handleCurrentChange: function (val) {
			console.log(val)
            this.formInline.pageNo = val;
            this.pagination.pageNo = val;
            console.log(this.pagination)
            this.getData();
        },
        handleSizeChange: function (val) {
            this.formInline.pageSize = val
            this.pagination.pageSize = val
            this.getData();
        },
        delectFun(index) {//删除活动
        	var that = this;
        	var oldList = that.activeList;
        	var list = oldList[index];
        	var textC = '确定删除"'+ list.eventName +'"吗？';
	        that.$confirm(textC, '', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          confirmButtonClass:'confirm',
	          cancelButtonClass	:'is-round',
	          type: 'warning',
	          center: true
	        }).then(() => {        	
	          	PostAjax(that, 'post', {'id':list.id}, '/layer/nyevent/nyEvent/delete', function(data) {					
					that.activeList.splice(index,1);
					that.getData();
				},'','','','','','',4)
	        }).catch(() => {
	          	
	        });
	    },
	    updataFun(index) {
	    	var that = this;
	    	var oldList = that.activeList;
        	var list = oldList[index];
	        that.$confirm('确定提交？', '', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          confirmButtonClass:'confirm',
	          cancelButtonClass	:'is-round',
	          type: 'warning',
	          center: true
	        }).then(() => {
	          	PostAjax(that, 'post', {'id':list.id}, '/layer/nyevent/nyEvent/submit', function(data) {
	          		console.log(data);
	          		Vue.set(that.activeList, index, data)
//					console.log(that.activeList)
				},'','','','','','',4)
	        }).catch(() => {
	          
	        });
	    },
	    auditFun(index,id){//审核弹窗
	    	 this.auditPopupShow = true;
	    	 this.fBgIsShow = true;
	    	 this.audit.id = id;
	    	 this.audit.index = index;
	    },
	    changeFun(index){//修改活动状态
	    	var that = this;
	    	var oldList = that.activeList;
        	var list = oldList[index];        	
        	var con = {
        		'id':list.id
        	}
        	console.log(con);
	    	PostAjax(that, 'post', con, '/layer/nyevent/nyEvent/status', function(data) {
				console.log(data);
				Vue.set(that.activeList, index, data)
			},'','','','','','',4)
	    },
	    getKeyWords:function(){
	      	var that = this;
	      	//活动状态
	      	PostAjax(that, 'post', {"types":"activeState,activityType"}, '/layer/dict/sysDict/listByTypes', function(data) {
	      		console.log(data)
				that.serachData.activeState = data.activeState;
				that.serachData.activityType = data.activityType;
			},'','','','','',1,1);			
			//表现形式，活动类型
			PostAjax(that, 'post', '', '/layer/nyeventman/nyEventMan/list', function(data) {
	      		console.log(data)
				that.serachData.activityForm = data.men;
//				that.serachData.activityType = data.types;
			},'','','','','',1,4)
	   },
	   editFun:function(id){//跳转到编辑页面
	   		window.location.href = 'activeEdit.html?activeId='+ id;
	   },
	   submitAudit() {//审核
	        var that = this;
			var audit = that.audit;
			var content = {
				id: audit.id,
				auditStatus: audit.auditId,
				auditComment: audit.auditTips,
			}
			console.log(content)
			PostAjax(that, 'post', content, '/layer/nyevent/nyEvent/audit', function(data) {
				console.log(data);
				Vue.set(that.activeList, audit.index, data)
				that.resetAudit('audit');
			},'','','','','','',4)
	    },
	    resetAudit(formName) {//审核弹窗数据重置
	    	this.fBgIsShow = false;
			this.auditPopupShow = false;
	        this.$refs[formName].resetFields();	        
	    },
	},
	created: function() {
		var that = this;	
		that.getKeyWords();
	}
})