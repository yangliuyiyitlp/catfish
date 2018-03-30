var store = new Vue({
    el: '#goodsAssert',
    data: function () {
        return {
            activeName: 'first',
            title: '',
            formInline: {
                pageSize: 30,
                pageNo: 1,
            },
            isOpen:[{
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '停用'
            }, ],
            tableData: [{'id':'1'}],
            ruleForm: {},
            Token: {},
            iconUrl: '',
            rules: {
                storeName: [{required: true, message: '请输入门店名称', trigger: 'blur'},
                    {min: 0, max: 20, message: '长度小于20字符', trigger: 'blur'}]
            },
            pagination: {pageSizes: [30, 40, 60, 100], pageSize: 30, count: 0, pageNo: 1},
        }
    },
    created: function () {
    },
    methods: {
        handleClick: function (tab, event) {
            console.log(tab.name)
            if (tab.name = 'second') {
                this.setEmptyForm()
            }
        },
        handleSizeChange: function (val) {
            this.formInline.pageSize = val
            this.pagination.pageSize = val
            this.query()
        },
        handleCurrentChange: function (val) {
            this.formInline.pageNo = val
            this.pagination.pageNo = val
            this.query()
        },
        // 获取oss秘钥
        beforeAvatarUpload: function (file) {
            var that = this;
            // PostAjax(that, 'post',{'user_dir':'storeManage'}, '/layer/oss/ossUtil/policy', function (data) {
            //     console.log(data);
            //         that.Token = data
            //         that.Token.key = that.Token.dir + '/' + (+new Date()) + file.name
            //         that.Token.OSSAccessKeyId = that.Token.accessid
            //         that.ruleForm.storePic1 = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + that.Token.key
            //     console.log(9696,that.Token);
            //
            // },function(data){fadeInOut(data.msg);},'','','','application/json','',1)

            return new Promise(function (resolve) {
                PostAjax(that, 'post', {'user_dir': 'storeManage'}, '/layer/oss/ossUtil/policy', function (data) {
                    that.Token = data
                    that.Token.key = that.Token.dir + '/' + (+new Date()) + file.name
                    that.Token.OSSAccessKeyId = that.Token.accessid
                    that.ruleForm.storePic1 = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + that.Token.key
                    resolve()

                }, function (data) {
                    fadeInOut(data.msg);
                }, '', '', '', 'application/json', '', 1)
            })
        },
        handleAvatarSuccess: function () {
            this.iconUrl = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + this.Token.key
        },
        isChangeBest:function(){},
        query: function () {
            PostAjax(this, 'post', this.formInline, '/layer/customstore/nyCustomStore/list', function (data) {
                this.tableData = data.result
                for (var i = 0; i < this.tableData.length; i++) {

                }
                this.pagination.count = data.total

            }.bind(this), function (msg) {
                fadeInOut(msg)
            })
        },
        exportForm:function(){},
        modifyRow: function (row) {
            this.activeName = 'second'
            this.title = '提交修改'
            this.moreInfo(row)
        },
        moreInfo: function (row) {
            var that = this
        },
        addForm: function () {
            this.setEmptyForm()
            this.activeName = 'second'
        },
        setEmptyForm:function(){
            // this.$refs['ruleForm'].resetFields()
        },
        resetForm: function (formName) {

        },
        submitForm: function (ruleForm) {
            var _this = this
        }
    }
})
