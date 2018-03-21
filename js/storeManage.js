var store = new Vue({
    el: '#store',
    data: function () {
        return {
            isOn: false,
            activeName: 'first',
            formInline: {
                pageSize: 30,
                pageNo: 1,
                storeName: ''
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
            tableData: [{"id": '2'}],
            ruleForm: {},
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
                    {min: 0, max: 20, message: '长度小于20字符', trigger: 'blur'}]
            },
            pagination: {pageSizes: [30, 40, 60, 100], pageSize: 30, count: 0, pageNo: 1},
        }
    },
    methods: {
        mapSelect:function () {
            var that = this
            var marker
            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }

            var map = new BMap.Map("l-map");
            var point = new BMap.Point(116.331398,39.897445);
            map.centerAndZoom(point, 12);                   // 初始化地图,设置城市和地图级别。

            setTimeout(function(){
                map.setZoom(14);
            }, 2000);  //2秒后放大到14级
            map.enableScrollWheelZoom(true); //缩放

            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {
                    "input": "suggestId"
                    , "location": map
                });

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

            var myValue;
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                setPlace();
            });

            function setPlace() {
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    that.pointValue= pp.lng + "," + pp.lat
                    map.centerAndZoom(pp, 18);
                    marker=new BMap.Marker(pp)
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        that.pointValue= e.point.lng + "," + e.point.lat
                        // alert( e.point.lng + "," + e.point.lat)
                    })
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }


            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();


            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint('北京市', function(point){
                if (point) {
                    map.centerAndZoom(point, 16);
                    // 点坐标
                    marker = new BMap.Marker(point);// 创建标注
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        that.pointValue= e.point.lng + "," + e.point.lat
                        // alert( e.point.lng + "," + e.point.lat)
                        // that.pointValue = e.point.lng + "," + e.point.lat
                    })
                }else{
                    that.$message.warning('您选择地址没有解析到坐标')
                }
            });
        },
        handleClick: function (tab, event) {
            if(this.activeName === 'second'){
                this.mapSelect()
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
            PostAjax(this, {user_dir: 'storeManage'}, 'http://192.168.0.167:10001/a/electric/ossutil/interface/policy', function (data) {
                console.log(data);
                if (data.code == 200) {
                    this.Token = res.data
                    this.Token.key = this.Token.dir + '/' + (+new Date()) + file.name
                    this.Token.OSSAccessKeyId = this.Token.accessid
                    this.ruleForm.iconUrl = 'http://jjdcjavaweb.oss-cn-shanghai.aliyuncs.com/' + this.Token.key

                } else {
                    fadeInOut(data.msg)
                }
            })

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
            var that = this;
            PostAjax(this, this.formInline, 'url', function (data) {
                if (data.code == 200) {
                    console.log(data);
                    this.tableData = data.data
                    this.tableData.businessTime = this.tableData.businessBeginTime + '-' + this.tableData.businessEndTime

                } else {
                    fadeInOut(data.msg)
                }
            })
        },
        addForm: function () {

        },
        deleteRow: function (row) {
        },
        moreInfo: function () {
            var that = this;
            PostAjax(this, this.formInline, 'url', function (data) {
                if (data.code == 200) {
                    console.log(data);
                    this.ruleForm = data.data
                    // 区号
                    if (this.ruleForm.storeTel.indexOf('-') > -1) {
                        this.ruleForm.storeTop = this.ruleForm.storeTel.split('-'[0])
                        this.ruleForm.storeTel = this.ruleForm.storeTel.split('-'[0])
                    }
                } else {
                    fadeInOut(data.msg)
                }
            })
        },
        submitForm: function (row) {
            // 区号合并
            if (this.ruleForm.storeTop) {
                this.ruleForm.storeTel = this.ruleForm.storeTop + '-' + this.ruleForm.storeTel
            }


        },
        resetForm: function (row) {
        }


    }
})

