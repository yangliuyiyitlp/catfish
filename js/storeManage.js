var store = new Vue({
    el: '#store',
    data: function () {
        return {
            activeName: 'first',
            title:'',
            storeLongCity:'',
            formInline: {
                pageSize: 30,
                pageNo: 1,
            },
            pointValue: '',
            weeks: [{
                value: '1',
                label: '周一'
            }, {
                value: '2',
                label: '周二'
            }, {
                value: '3',
                label: '周三'
            }, {
                value: '4',
                label: '周四'
            }, {
                value: '5',
                label: '周五'
            }, {
                value: '6',
                label: '周六'
            }, {
                value: '7',
                label: '周日'
            }],
            tableData: [],
            ruleForm: {},
            Weekday: [],
            Token: {},
            iconUrl: '',
            allCitys: [{
                value: '1',
                label: '安徽省',
                children: [{
                    value: '2',
                    label: '合肥市',
                    children: [{
                        value: '3',
                        label: '蜀山区',
                        children: [{
                            value: '4',
                            label: '明珠街道'
                        },
                            {
                                value: '89',
                                label: '海风街道'
                            }]
                    },
                        {
                            value: '9',
                            label: '瑶海区',
                            children: [{
                                value: '4',
                                label: '枫林街道'
                            }]
                        }]
                },
                    {
                        id: '89',
                        label: '芜湖市',
                        children: []
                    }
                ]
            }, {id: '5', label: '四川省'}],
            selectedOptions: [],
            rules: {
                storeName: [{required: true, message: '请输入门店名称', trigger: 'blur'},
                    {min: 0, max: 20, message: '长度小于20字符', trigger: 'blur'}],
                storeTel:{required: true, message: '请输入联系电话', trigger: 'blur'},
                storeCity:{required: true, message: '请选择区域', trigger: 'blur'},
                storeAddr:{required: true, message: '请输入详细地址', trigger: 'blur'},
                storePic1:{required: true, message: '请选择门店照片', trigger: 'blur'},
                businessTime:{required: true, message: '请选择运营时间', trigger: 'blur'},
                Weekday:{required: true, message: '请选择星期', trigger: 'blur'},
                storeRecommend:{required: true, message: '请输入商家推荐', trigger: 'blur'}
            },
            pagination: {pageSizes: [30, 40, 60, 100], pageSize: 30, count: 0, pageNo: 1},
            loadingshow:false
        }
    },
    methods: {
        mapSelect:function (longitude,latitude,storeAddr) {
            var that = this
            var marker

            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            var map = new BMap.Map("l-map");
            map.enableScrollWheelZoom(true); //缩放
            var point = new BMap.Point(longitude,latitude);
            map.centerAndZoom(point, 16);
            //将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(storeAddr, function(point){
                if (point) {
                    map.centerAndZoom(point, 16);
                    // 点坐标
                    marker = new BMap.Marker(point);// 创建标注
                    map.centerAndZoom(point, 16);
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        // that.pointValue= e.point.lng + "," + e.point.lat
                        that.ruleForm.longitude= e.point.lng
                        that.ruleForm.latitude= e.point.lat
                    })
                }else{
                    that.$message.warning('您选择地址没有解析到坐标')
                }
            });
            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }


                               // 初始化地图,设置城市和地图级别。
            //
            // // setTimeout(function(){
            // //     map.setZoom(14);
            // // }, 2000);  //2秒后放大到14级

            //
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {
                    "input": "suggestId"
                    , "location": map
                });
            ac.setInputValue(storeAddr)
            // that.ruleForm.storeAddr = storeAddr
            ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });
            var myValue =''
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                that.ruleForm.storeAddr =  myValue;// 后续添加
                setPlace();
            });

            function setPlace() {
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    // that.pointValue= pp.lng + "," + pp.lat
                    that.ruleForm.longitude= pp.lng
                    that.ruleForm.latitude= pp.lat
                    map.centerAndZoom(pp, 16);
                    marker=new BMap.Marker(pp)
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        // that.pointValue= e.point.lng + "," + e.point.lat
                        that.ruleForm.longitude= e.point.lng
                        that.ruleForm.latitude= e.point.lat
                    })
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }
        },
        storeBlur:function(){
            var that = this
            var marker
            // 点坐标
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            var map = new BMap.Map("l-map");
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(that.ruleForm.storeAddr, function(point){
                if (point) {
                    map.centerAndZoom(point, 16);
                    that.ruleForm.longitude= point.lng
                    that.ruleForm.latitude= point.lat
                    // 点坐标
                    marker = new BMap.Marker(point);// 创建标注
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        that.ruleForm.longitude= e.point.lng
                        that.ruleForm.latitude= e.point.lat
                    })
                    setPlace()
                }else{
                    that.$message.warning('您选择地址没有解析到坐标')
                }
            });

            function setPlace() {
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    that.ruleForm.longitude= pp.lng
                    that.ruleForm.latitude= pp.lat
                    map.centerAndZoom(pp, 16);
                    marker=new BMap.Marker(pp)
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        that.ruleForm.longitude= e.point.lng
                        that.ruleForm.latitude= e.point.lat
                    })
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(that.ruleForm.storeAddr);
            }
        },
        handleClick: function (tab, event) {
            if(this.activeName = 'second'){
                this.ruleForm = {}
                this.title='新增'
                this.mapSelect('121.478527','31.233212','')
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
        handleChange: function (value) {
            console.log(value)
        },
        // 获取oss秘钥
        beforeAvatarUpload: function (file) {
            var that = this;
            PostAjax(this, 'post',{'user_dir': 'storeManage'}, '/layer/oss/ossUtil/policy', function (data) {
                console.log(data);
                    this.Token = res.data
                    this.Token.key = this.Token.dir + '/' + (+new Date()) + file.name
                    this.Token.OSSAccessKeyId = this.Token.accessid
                    this.ruleForm.storePic1 = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + this.Token.key

            },function(data){fadeInOut(data.msg);},'','','','','',1)

            //     return new Promise(function(resolve){
            //         this.$ajax.get('http://192.168.0.167:10001/a/electric/ossutil/interface/policy', {params: {user_dir: 'storeManage'}})
            //         .then(function(res){
            //         this.Token = res.data
            //     this.Token.key = this.Token.dir + '/' + (+new Date()) + file.name
            //     this.Token.OSSAccessKeyId = this.Token.accessid
            //     this.ruleForm.iconUrl = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + this.Token.key
            //     resolve()
            // }
            // )
            // .catch(function(err) {
            //         console.log(err)
            // })})
        },
        handleAvatarSuccess: function () {
            alert(99)
            this.iconUrl = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + this.Token.key
            alert(this.iconUrl)
        },
        query: function () {
           PostAjax(this,'post',this.formInline,'/layer/customstore/nyCustomStore/list',function(data){
                   this.tableData =data.result
                   for(var i=0;i< this.tableData.length;i++){
                       this.tableData[i].businessTime = this.tableData[i].businessBeginTime + '-' + data.result[i].businessEndTime
                   }
                   this.pagination.count=data.total

           }.bind(this),function(data){fadeInOut(data.msg)})
        },
        isOnChange:function(row){
            var flag
            if(row.openFlag ='1'){
                flag = '0'
            }else if(row.openFlag ='0'){
                flag = '1'
            }
            PostAjax(this,'post',{'id':row.id,'openFlag':flag},'/layer/customstore/nyCustomStore/save',function(data){
                this.query()
            }.bind(this),function(data){fadeInOut(data.msg)},'','','','',1)
        },
        modifyRow: function (row) {
            this.activeName='second'
            this.title = '提交修改'
            this.moreInfo(row)
        },
        moreInfo: function (row) {
            var that =this
            PostAjax(this,'post','','/layer/customstore/nyCustomStore/form/'+row.id,function(data){
                that.ruleForm =data
                that.iconUrl = that.ruleForm.storePic1
                // 区号
                if (that.ruleForm.storeTel.indexOf('-') > -1) {
                    that.ruleForm.storeTop = that.ruleForm.storeTel.split('-'[0])
                    that.ruleForm.storeTel = that.ruleForm.storeTel.split('-'[0])
                }

                //星期
                that.Weekday =  that.ruleForm.businessWeekday.split(',');

                //地区
                that.storeLongCity = ''+ that.ruleForm.storeAddr;
                //地图
                that.mapSelect(that.ruleForm.longitude,that.ruleForm.latitude,that.ruleForm.storeAddr)

            }.bind(this),function(data){fadeInOut(data.msg)})
        },
        addForm: function () {
            this.activeName ='second'
            this.ruleForm = {}
            this.title='新增'
            this.mapSelect('121.478527','31.233212','')
        },
        resetForm: function (formName) {
            // this.$refs[formName].resetFields();
            this.ruleForm = {}
            return false;
        },
        submitForm: function (row) {
            // 区号合并
            if (this.ruleForm.storeTop) {
                this.ruleForm.storeTel = this.ruleForm.storeTop + '-' + this.ruleForm.storeTel
            }


        }
    }
})

