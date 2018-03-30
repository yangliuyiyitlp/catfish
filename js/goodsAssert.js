var store = new Vue({
    el: '#goodsAssert',
    data: function () {
        return {
            activeName: 'first',
            title:'添加商品',
            formInline: {
                pageSize: 30,
                pageNo: 1,
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            exportForm: {},
            isOpen: [{
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '停用'
            },],
            tableData: [],
            ruleForm: {},
            Token: {},
            iconUrl: '',
            cityVisible:false,
            filterText:'',
            filterId:'',
            secondSection:[],
            rules: {
                storeName: [{required: true, message: '请输入门店名称', trigger: 'blur'},
                    {min: 0, max: 20, message: '长度小于20字符', trigger: 'blur'}]
            },
            pagination: {pageSizes: [30, 40, 60, 100], pageSize: 30, count: 0, pageNo: 1},
        }
    },
    created: function () {
        this.searchArea()
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
        searchMechanism :function (){
            this.cityVisible = true
            this.filterText = ''
        },
        searchArea:function(){
            var _this=this
            PostAjax(_this, 'post', '', '/layer/goods/nyGoodsCat/tree', function (data) {
              _this.secondSection = data

            }, function (msg) {
                fadeInOut(msg)
            },'','','','',1)
        },
        doModify:function () {
            this.cityVisible = false
            this.formInline.goodsCatId = this.filterId
        },
        modifyCancel:function () {
            this.cityVisible = false
        },
        filterNode:function (value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        handleNode :function(data) {
            this.filterText = data.name // 弹框树模型点击输入值
            this.filterId = data.id
        },
        query: function () {
            var _this = this
            _this.exportForm.goodsName = _this.formInline.goodsName
            PostAjax(_this, 'post', this.formInline, '/layer/goods/nyGoods/list', function (data) {
                _this.tableData = data.result
                _this.pagination.count = data.total
                fadeInOut('符合条件的数据为空')
            }, function (msg) {
                fadeInOut(msg)
            },'','','','',1)
        },
        isOnChange: function (row) {//开启关闭
            var _this = this
            if (row.openFlag == '1') {
                var openFlag = '0'
            } else {
                openFlag = '1'
            }
            PostAjax(_this, 'post', {
                'id': row.id,
                'openFlag': openFlag
            }, '/layer/customstore/nyCustomStore/list', function (data) {
                _this.query()
            }, function (msg) {
                fadeInOut(msg)
            }, '', '', '', '', 1)
        },
        isChangeBest: function (row) { // 地图推荐
            var _this = this
            if (row.openFlag == '1') {
                var openFlag = '0'
            } else {
                openFlag = '1'
            }
            PostAjax(_this, 'post', {
                'id': row.id,
                'openFlag': openFlag
            }, '/layer/customstore/nyCustomStore/list', function (data) {
                _this.query()
            }, function (msg) {
                fadeInOut(msg)
            }, '', '', '', '', 1)
        },
        exportForm: function () {
            var _this = this
            _this.exportForm.pageSize = ''
            _this.exportForm.pageNo = ''
            _this.$confirm('确定导出?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                _this.$refs.exportForm.action = ''
            }).catch(function () {
                return
            });

        },
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
        setEmptyForm: function () {
            // this.$refs['ruleForm'].resetFields()
        },
        resetForm: function (formName) {

        },
        submitForm: function (ruleForm) {
            var _this = this
        }
    }
})
