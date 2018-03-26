var store = new Vue({
    el: '#store',
    data: function () {
        return {
            activeName: 'first',
            title: '',
            storeLongCity: '',
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
            ruleForm: {
                longitude: '',
                latitude: '',
            },
            Weekday: [],
            Token: {},
            iconUrl: '',
            selectedOptions: [],
            rules: {
                storeName: [{required: true, message: '请输入门店名称', trigger: 'blur'},
                    {min: 0, max: 20, message: '长度小于20字符', trigger: 'blur'}],
                storeTel: {required: true, message: '请输入联系电话', trigger: 'blur'},
                selectedCities: {required: true, message: '请选择区域', trigger: 'blur'},
                storeAddr: {required: true, message: '请输入详细地址', trigger: 'blur'},
                storePic1: {required: true, message: '请选择门店照片', trigger: 'blur'},
                businessBeginTime: {required: true, message: '请选择运营时间', trigger: 'blur'},
                Weekday: {required: true, message: '请选择星期', trigger: 'blur'},
                storeRecommend: {required: true, message: '请输入商家推荐', trigger: 'blur'}
            },
            pagination: {pageSizes: [30, 40, 60, 100], pageSize: 30, count: 0, pageNo: 1},
            loadingshow: false,
            allCities: [],
            props: {
                value: 'value',
                id: 'label',
                children: 'children'
            },
            selectedCities: [],
            cityNames:''
        }
    },
    created: function () {
        this.getCity()
    },
    methods: {
        mapSelect: function (longitude, latitude, storeAddr) {
            var that = this
            var marker

            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            var map = new BMap.Map("l-map");
            map.enableScrollWheelZoom(true); //缩放


            var point = new BMap.Point(longitude, latitude);
            map.centerAndZoom(point, 16);
            //将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(storeAddr, function (point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    // 点坐标
                    marker = new BMap.Marker(point);// 创建标注
                    map.centerAndZoom(point, 16);
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        // that.pointValue= e.point.lng + "," + e.point.lat
                        that.ruleForm.longitude = e.point.lng
                        that.ruleForm.latitude = e.point.lat
                    })
                } else {
                    that.$message.warning('您选择地址没有解析到坐标')
                }
            });

            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }

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
            var myValue = ''
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                that.ruleForm.storeAddr = myValue;// 后续添加
                setPlace();
            });

            function setPlace() {
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    // that.pointValue= pp.lng + "," + pp.lat
                    that.ruleForm.longitude = pp.lng
                    that.ruleForm.latitude = pp.lat
                    map.centerAndZoom(pp, 16);
                    marker = new BMap.Marker(pp)
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        // that.pointValue= e.point.lng + "," + e.point.lat
                        that.ruleForm.longitude = e.point.lng
                        that.ruleForm.latitude = e.point.lat
                    })
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }
        },
        storeBlur: function (val) {
            var that = this

            // that.ruleForm.storeLongCity = that.cityNames+ myValue
            // console.log(88888,that.ruleForm.storeLongCity);
            // console.log(444,val);

            // console.log(5555,that.ruleForm.storeAddr);
            // that.ruleForm.storeLongCity = that.cityNames+ myValue
            // console.log(88888,that.ruleForm.storeLongCity);
            var marker
            // 点坐标
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            var map = new BMap.Map("l-map");
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(that.ruleForm.storeAddr, function (point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    that.ruleForm.longitude = point.lng
                    that.ruleForm.latitude = point.lat
                    // 点坐标
                    marker = new BMap.Marker(point);// 创建标注
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        that.ruleForm.longitude = e.point.lng
                        that.ruleForm.latitude = e.point.lat
                    })
                    setPlace()
                } else {
                    that.$message.warning('您选择地址没有解析到坐标')
                }
            });



            function setPlace() {
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    that.ruleForm.longitude = pp.lng
                    that.ruleForm.latitude = pp.lat
                    map.centerAndZoom(pp, 16);
                    marker = new BMap.Marker(pp)
                    marker.enableDragging()
                    map.addOverlay(marker);
                    marker.addEventListener("dragend", function (e) {
                        that.ruleForm.longitude = e.point.lng
                        that.ruleForm.latitude = e.point.lat
                    })
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(that.ruleForm.storeAddr);
            }
        },
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
        query: function () {
            PostAjax(this, 'post', this.formInline, '/layer/customstore/nyCustomStore/list', function (data) {
                this.tableData = data.result
                for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].businessBeginTime && data.result[i].businessEndTime) {
                        this.tableData[i].businessTime = this.tableData[i].businessBeginTime + '-' + data.result[i].businessEndTime
                    }
                }
                this.pagination.count = data.total

            }.bind(this), function (data) {
                fadeInOut(data.msg)
            })
        },
        isOnChange: function (row) {
            var flag
            if (row.openFlag == '1') {
                flag = '0'
            } else if (row.openFlag == '0') {
                flag = '1'
            }
            PostAjax(this, 'post', {
                'id': row.id,
                'openFlag': flag
            }, '/layer/customstore/nyCustomStore/save', function (data) {
                this.query()
            }.bind(this), function (data) {
                fadeInOut(data.msg)
            }, '', '', '', '', 1)
        },
        modifyRow: function (row) {
            this.activeName = 'second'
            this.title = '提交修改'
            this.moreInfo(row)
        },
        moreInfo: function (row) {
            var that = this
            PostAjax(this, 'post', '', '/layer/customstore/nyCustomStore/form/' + row.id, function (data) {
                that.ruleForm = data
                that.iconUrl = that.ruleForm.storePic1
                // 区号
                if (that.ruleForm.storeTel.indexOf('-') > -1) {
                    that.ruleForm.storeTop = that.ruleForm.storeTel.split('-')[0]
                    that.ruleForm.storeTel = that.ruleForm.storeTel.split('-')[1]
                }

                //星期
                that.Weekday = that.ruleForm.businessWeekday.split(',');

                //地区
                that.selectedCities =[]
                that.selectedCities.push(that.ruleForm.storeProvinceid, that.ruleForm.storeCityid, that.ruleForm.storeRegionid, that.ruleForm.storeStreetid)
                // that.ruleForm.storeLongCity = trim(that.ruleForm.storeProvinceName +that.ruleForm.storeCityName +that.ruleForm.storeRegionName +that.ruleForm.storeStreeName + that.ruleForm.storeAddr);
                // console.log(666666,that.ruleForm.storeLongCity);
                //地图
                that.mapSelect(that.ruleForm.longitude, that.ruleForm.latitude, that.ruleForm.storeAddr)

            }.bind(this), function (data) {
                fadeInOut(data.msg)
            })
        },
        addForm: function () {
            this.setEmptyForm()
            this.activeName = 'second'
        },
        setEmptyForm:function(){
            this.$refs['ruleForm'].resetFields()
            this.iconUrl = ''
            this.cityNames = ''
            this.selectedCities =[]
            this.Weekday =[]
            this.title = '新增'
            this.ruleForm = {'longitude': '121.487899', 'latitude': '31.249162','storeTel':'','selectedCities':[]}
            this.mapSelect(this.ruleForm.longitude, this.ruleForm.latitude, '上海市')
        },
        resetForm: function (formName) {
            this.$refs[formName].resetFields();
            this.selectedCities =[]
            this.iconUrl = ''
            this.Weekday =[]
            this.ruleForm.Weekday =[]
            this.ruleForm = {}
            return false;
        },
        submitForm: function (ruleForm) {
            var _this = this
            _this.ruleForm.businessWeekday = _this.Weekday.join(',')
            _this.ruleForm.Weekday = _this.Weekday.join(',')
            // 地区
            _this.ruleForm.selectedCities =_this.selectedCities
            console.log(89,_this.selectedCities)
            _this.$refs[ruleForm].validate(function (valid) {
                if (valid) {
                    // 区号合并
                    if (_this.ruleForm.storeTop) {
                        _this.ruleForm.storeTel = _this.ruleForm.storeTop + '-' + _this.ruleForm.storeTel
                    }
                    _this.ruleForm.longitude = String(_this.ruleForm.longitude)
                    _this.ruleForm.latitude =String(_this.ruleForm.latitude)
                    PostAjax(_this, 'post', _this.ruleForm, '/layer/customstore/nyCustomStore/save', function (data) {
                        _this.activeName = 'first'
                        _this.query()
                    }, function (msg) {
                        if (_this.ruleForm.storeTel.indexOf('-') > -1) {
                            _this.ruleForm.storeTop = _this.ruleForm.storeTel.split('-')[0]
                            _this.ruleForm.storeTel = _this.ruleForm.storeTel.split('-')[1]
                        }
                        fadeInOut(msg)
                    }, '', '', '', '', '')
                } else {
                    return false;
                }
            });
        },
        getCity: function () {
            var _this = this
            PostAjax(_this, 'post', '', '/layer/position/provices/1', function (data) {
                _this.allCities = data
            }, function (msg) {
            }, '', '', '', 'application/x-www-form-urlencoded', 1, 3)
        },
        handleItemChange: function (val) {
            var _this = this
            if (val && val.length == 1) {
                _this.ruleForm.storeProvinceid = val[0]
                PostAjax(_this, 'post', '', '/layer/position/cities/' + val[0], function (data) {
                    for (var i = 0; i < _this.allCities.length; i++) {
                        if (val == _this.allCities[i].value) {
                            _this.allCities[i].children = data
                        }
                    }

                }, function (msg) {
                }, '', '', '', 'application/x-www-form-urlencoded', 1, 3)
            } else if (val && val.length == 2) {
                console.log(33, val[0])
                _this.ruleForm.storeCityid = val[1]
                PostAjax(_this, 'post', '', '/layer/position/counties/' + val[1], function (data) {
                    for (var i = 0; i < _this.allCities.length; i++) {
                        var secondChild = _this.allCities[i].children
                        if (secondChild.length > 0) {
                            for (var j = 0; j < secondChild.length; j++) {
                                if (val[1] == secondChild[j].value) {
                                    secondChild[j].children = data
                                }
                            }
                        }
                    }

                }, function (msg) {
                }, '', '', '', 'application/x-www-form-urlencoded', 1, 3)
            } else if (val && val.length == 3) {
                console.log(33, val[0])
                _this.ruleForm.storeRegionid = val[2]
                PostAjax(_this, 'post', '', '/layer/position/towns/' + val[2], function (data) {
                    for (var i = 0; i < _this.allCities.length; i++) {
                        var secondChild = _this.allCities[i].children
                        if (secondChild.length > 0) {
                            for (var j = 0; j < secondChild.length; j++) {
                                var throwChild = secondChild[j].children
                                if (throwChild.length > 0) {
                                    for (var k = 0; k < throwChild.length; k++) {
                                        if (val[2] == throwChild[k].value) {
                                            throwChild[k].children = data
                                        }
                                    }
                                }

                            }
                        }

                    }

                }, function (msg) {
                }, '', '', '', 'application/x-www-form-urlencoded', 1, 3)
            } else if (val && val.length == 4) {
                _this.ruleForm.storeStreetid = val[3]
            }

        }
    }
})
