
var map = new ol.Map({
    target: 'map',
    layers: [],
    view: new ol.View({
        center: new ol.proj.fromLonLat([118.18462,24.49499]),
        // center:[118.18462,24.49499],
        zoom: 12,
        maxZoom: 20,
        projection:'EPSG:3857'
    }),
    interactions: ol.interaction.defaults({
        doubleClickZoom:false,
    })    
});

//百度地图
 var baidu_map_online=new gps_layer_BaiDu();
map.addLayer(baidu_map_online);
 var baidu_map_online=new gps_layer_BaiDu({
    onLine:'onLine',
    type:'map'
});
map.addLayer(baidu_map_online);   

//高德地图
var gaode_map_online=new gps_layer_GaoDe({
    onLine:'onLine',
    type:'map'
});
map.addLayer(gaode_map_online); 

 //谷歌地图
var google_map_online=new gps_layer_Google({
    onLine:'onLine',
    type:'map'
});
map.addLayer(google_map_online);  

 //天地卫星图
var tiandi_wx_online_base=new gps_layer_TianDi_Base({
    onLine:'onLine',
    type:'weixing'
});
map.addLayer(tiandi_wx_online_base);

var tiandi_wx_online_marker=new gps_layer_TianDi_Marker({
    onLine:'onLine',
    type:'weixing'
});
map.addLayer(tiandi_wx_online_marker); 

//天地图
 var tiandi_map_online_base=new gps_layer_TianDi_Base({
    onLine:'onLine',
    type:'map'
  });
  map.addLayer(tiandi_map_online_base);

var tiandi_map_online_marker=new gps_layer_TianDi_Marker({
    onLine:'onLine',
    type:'map'
  });
  map.addLayer(tiandi_map_online_marker);  


 
//canvas网格
var gridTileLayer=new ol.layer.Tile({
    source:new ol.source.TileDebug({
        projection:'EPSG:3857',
        // tileGrid:myBaiduLayer.getSource().getTileGrid()
        // tileGrid:baidu_map_online.getSource().getTileGrid()        
        // tileGrid:tiandi_map_online_base.getSource().getTileGrid()
        // tileGrid:gaode_map_online.getSource().getTileGrid()
        // tileGrid:google_map_online.getSource().getTileGrid()        
    })
})
// map.addLayer(gridTileLayer);

//地图单击事件
map.on("singleclick",function(evt){
    // console.log(ol.proj.toLonLat(evt.coordinate));
    console.log(evt.coordinate);    
    if(optionLayerType=='edit' && featureSelect && featureSelect.getFeatures().getLength()>0){
        featureModify.removePoint();
    }
    else if(optionLayerType=='delete' && featureSelect && featureSelect.getFeatures().getLength()>0){
        modifiedFeatures=featureSelect.getFeatures();
        saveFeatureOption();
    }
}); 
//地图双击事件
map.on('dblclick',function(evt){
    // map.removeInteraction(featureModify);
    // featureModify.removePoint();
});


//隐藏全部地图
function hideAllLayers(){
    tiandi_map_online_base.setVisible(false);
    tiandi_map_online_marker.setVisible(false);
    tiandi_wx_online_base.setVisible(false);
    tiandi_wx_online_marker.setVisible(false);
    baidu_map_online.setVisible(false);
    gaode_map_online.setVisible(false);
    google_map_online.setVisible(false); 
    // openStreet_map_online.setVisible(false);
    // yahoo_map_online.setVisible(false);
   /*  map.removeLayer(tiandi_map_online_base);
    map.removeLayer(tiandi_map_online_marker);
    map.removeLayer(tiandi_wx_online_base);
    map.removeLayer(tiandi_wx_online_marker);
    map.removeLayer(baidu_map_online);
    map.removeLayer(gaode_map_online);
    map.removeLayer(google_map_online); */
};

//标题栏下拉
$('.title-common').click(function(){
    $('.ul-common').addClass('hidden');
    $(this).find('ul').toggleClass('hidden').css('color','black');  
});

//组件选中  let const 为es6的新语法
$('.ul-common').children('li').click(function(ev){
    $('.ul-common').addClass('hidden');
    let id=$(this).attr('id');
    //天地图
    if(id==='tiandi_map_online'){
        hideAllLayers();
        // map.addLayer(tiandi_map_online_base);
        // map.addLayer(tiandi_map_online_marker);
        tiandi_map_online_base.setVisible(true);
        tiandi_map_online_marker.setVisible(true);
    }
    //天地卫星图
    else if(id==='tiandi_wx_online'){
        hideAllLayers();
        // map.addLayer(tiandi_wx_online_base);
        // map.addLayer(tiandi_wx_online_marker);
        tiandi_wx_online_base.setVisible(true);
        tiandi_wx_online_marker.setVisible(true);
    }
    //百度地图
    else if(id==='baidu_map_online'){
        hideAllLayers();
        // map.addLayer(baidu_map_online);
        baidu_map_online.setVisible(true);
    }
    //谷歌地图
    else if(id==='google_map_online'){
        hideAllLayers();
        // map.addLayer(google_map_online);
        google_map_online.setVisible(true);
    }
    //高德地图
    else if(id==='gaode_map_online'){
        hideAllLayers();
        // map.addLayer(gaode_map_online);
        gaode_map_online.setVisible(true);
    }
     //openStreet
     else if(id==='openStreet_map_online'){
        hideAllLayers();
        // map.addLayer(gaode_map_online);
        openStreet_map_online.setVisible(true);
    }
     //yahoo
     else if(id==='yahoo_map_online'){
        hideAllLayers();
        // map.addLayer(gaode_map_online);
        yahoo_map_online.setVisible(true);
    }

    //区域检索
   else if(id==='Polygon_search'){
        var SearchFeature= new gps_source_Vector_SearchPolygonFeature({
            type:'Polygon',
            source:testSource,
            originalStyle:originalStyle,
            changedStyle:changedStyle
        });
    }
    //周边检索
    else if(id==='Circle_search'){
        var SearchFeature= new gps_source_Vector_SearchCircleFeature({
            type:'Circle',
            source:testSource,
            originalStyle:originalStyle,
            changedStyle:changedStyle
        });
    } 

    //汇聚
    else if(id==='cluster'){
        $(this).toggleClass('tem');
        var style = new ol.style.Style({
             image: new ol.style.Circle({
               radius: 10,
               stroke: new ol.style.Stroke({
                 color: '#fff'
               }),
               fill: new ol.style.Fill({
                 color: '#3399CC'
               }) 
             }),
              text: new ol.style.Text({
               text: '',
               fill: new ol.style.Fill({
                 color: '#fff'
               })
             }) 
         });
         var distance=20;
         var coordinates=[];
         for (var i = 0; i < 10000; ++i) {
            coordinates[i] = [13145303.80295976+Math.random()*10000, 2809037.8586050086+Math.random()*10000];
         }
     
         if($(this).hasClass('tem')){
             var cluster=new gps_layer_Vector_Cluster({
                 distance:distance,
                 style:style,
                 coordinates:coordinates
             })
             cluster.set('name','cluster');
             map.addLayer(cluster);
         }
         else{
             map.getLayers().forEach(function(element,index){
                 if(element.get('name')==='cluster'){
                     map.removeLayer(element);
                 }
             })
         }
    }

    //热力图
    else if(id==='heatMap'){
        $(this).toggleClass('tem');
        var blur=20;
        var radius=5;
        // var blur=document.getElementById('blur');
        // var radius=document.getElementById('radius');
    
        var coordinates=[];
        for (var i = 0; i < 10000; ++i) {
            coordinates[i] = [13145303.80295976+Math.random()*10000, 2809037.8586050086+Math.random()*10000];
        }
        if($(this).hasClass('tem')){
            var heatMapLayer=new gps_layer_Vector_HeatMap({
                coordinates:coordinates,
                blur:5,
                radius:2
            }); 
            heatMapLayer.set('name','heatMap');
            map.addLayer(heatMapLayer);
        }
       else{
            map.getLayers().forEach(function(element,index){
                if(element.get('name')==='heatMap'){
                    map.removeLayer(element);
                }
            })
       }
    
      /*   blur.addEventListener('input',function(){
            heatMapLayer.setBlur(parseInt(blur.value,10));
            blur.setAttribute('title',blur.value);
        })
        radius.addEventListener('input',function(){
            heatMapLayer.setRadius(parseInt(radius.value,10));
            radius.setAttribute('title',radius.value);
        }) */
    }
    else if(id==='massPoint'){
        $(this).toggleClass('tem');
        //加载geoserver的wms服务
      
        if($(this).hasClass('tem')){
            var wmsUrl='http://localhost:8080/geoserver/Test/wms';
            // var wmsUrl='http://localhost:8080/geoserver/Test/wms?service=WMS';
             roadsLayer=new ol.layer.Tile({
                source:new ol.source.TileWMS({
                    params:{
                        // 'LAYERS':'cite:roads',
                        //  'LAYERS':'Test:County',
                        'LAYERS':'Test:points',            
                        // 'LAYERS':'Test:xmRoad-one'
                        // 'LAYERS':'Test:xiamenshp'
                        /* 'VERSION':'1.1.0',
                        'BBOX':[113.029319763184,22.7097873687744,113.95068359375,23.7140617370605],
                        'CRS':'EPSG:4326',
                        'WIDTH':704,
                        'HEIGHT':768 */
                    },
                    projection:'EPSG:4326',
                    url:wmsUrl
                })
            })
            roadsLayer.setZIndex(20);
            // roadsLayer.setOpacity(0);
            map.addLayer(roadsLayer);
            roadsLayer.setVisible(true);
        }
        else{
            roadsLayer.setVisible(false);
        }
    }

    //长度测量
    else if(id==='length-measure'){
        measureTool=new gps_tool_Measure({
            type:'LineString'
        })
        map.addLayer(measureTool);
    }

    //面积测量
    else if(id==='area-measure'){
        measureTool=new gps_tool_Measure({
            type:'Polygon'
        })
        map.addLayer(measureTool);
    }

    //点标注
    else if(id==='point_label'){
        var point_label_layer=new gps_tool_Label({
            type:'Point'
        });
        map.addLayer(point_label_layer);
    }

     //面标注
     else if(id==='polygon_label'){
        var polygon_label_layer=new gps_tool_Label({
            type:'Polygon'
        });
        map.addLayer(polygon_label_layer);
    }

    //拉框放大
    else if(id==='zoom_out'){
        var zoom_out=new gps_tool_DragZoom({
            type:"out"
        })
    }

     //拉框缩小
     else if(id==='zoom_in'){
        var zoom_in=new gps_tool_DragZoom({
            type:"in"
        })
    }

     //拉框缩小
     else if(id==='zoom_in'){
        var zoom_in=new gps_tool_DragZoom({
            type:"in"
        })
    }

    //图层管理
    else if(id==='myLine'){
        if($('#myLine').find('input').prop("checked")){
            wfsVectorLayer.setVisible(true);
        }else{
            wfsVectorLayer.setVisible(false);
        }
    }

    //绘制图形
    else if(id==='Point' || id==='LineString' || id==='Polygon'){
         coords=new gps_tool_DrawGraphic({
            drawType:id,
            layerName:'testInfo',
            featureName:'测试要素',
            featureType:'LINESTRING',
            featureState:1,
            featureNote:'备注',
            featureLength:10,
            featureArea:20,
            addRole:'1',
            editRole:'1',
            deleteRole:'1',
            selectRole:'1',
            layerType:layerParsList[0]
        });
        coords.on('drawend',function(evt){
            var gps_drawGraphic_Points= evt.feature.getGeometry();
            if(gps_drawGraphic_Points.getType()=='Circle'){
                gps_drawGraphic_Points=gps_drawGraphic_Points.getCenter()+'---'+gps_drawGraphic_Points.getRadius();
            }
            else{
                gps_drawGraphic_Points=gps_drawGraphic_Points.getCoordinates();
            }
            console.log(gps_drawGraphic_Points);
        })
        
    }
});

//编辑要素
$('.title-common').click(function(){
    var id=$(this).attr('id');
     //编辑要素
    if(id==='modifyFeature'){
        var modifyLayer=new gps_layer_Vector_Modify({
            layerName:'testInfo',
            layerNameView:'testInfoView'
        });
     /*    modifyLayer.on('modifyend',function(evt){
            var geometry=evt.features.a[0].getGeometry();
            if(geometry.getType()==='Circle'){
                console.log("修改后的圆："+geometry.getCenter()+"--"+geometry.getRadius());
            }
            else{
                console.log('修改后的经纬度：'+geometry.getCoordinates());
            }
        }) */
    }
    else if(id==='deleteFeature'){
        var deleteLayer=new gps_layer_Vector_Delete({
            layerName:'testInfo',
            layerNameView:'testInfoView'
        })
    }
    else if(id==='clearOtherLayers'){
        gps.clearTemporaryLayer();
    }
})

//指定视图范围
var extentTo=new ol.control.ZoomToExtent({
    extent:[
        114.4250, 23.0890,
        110.9250, 25.9890
    ]
})
map.addControl(extentTo);

// var hcExtent=[[117.882252,24.646378],[118.090497,24.646378],[117.882252,24.441127],[118.090497,24.441127]];
var hcExtent=[[117.982998,24.536045],[118.014435,24.487532],[117.989934,24.524936],[117.912594,24.542551],[117.911705,24.545305]];
var style=new ol.style.Style({
    image:new ol.style.Circle({
        radius:5,
        stroke:new ol.style.Stroke({
            color:"#fff"
        }),
        fill:new ol.style.Fill({
            color:"red"
        })
    })
})

//地图鹰眼
var overviewMapControl=new ol.control.OverviewMap({
    className:"ol-overviewmap ol-custom-overviewmap",
    //在鹰眼中加载相同坐标系下不同数据源的图层
    // layers:[gaode_wx],
    collapseLabel:"\u00BB", //展开时功能按钮上的标识
    label:"\u00AB",         //折叠时功能按钮上的标识
    collapsed:false         //初始化为展开方式
})
// map.addControl(overviewMapControl);

var testPoints3=[[117.982998,24.536045],
[118.014435,24.487532],
[117.989934,24.524936],
[118.008287,24.524553],
[118.014343,24.534672],
[117.974207,24.527646],
[117.9226112,24.55126762],
[118.059181,24.50251],
[118.005013,24.536982],
[118.024989,24.490307],
[118.0399203,24.49246287],
[118.014986,24.536039],
[117.951967,24.533966],
[117.912594,24.542551],
[117.911705,24.545305],
[118.04816,24.52398],
[118.025801,24.496692],
[118.04873,24.52403]
];

var testPoints4=[];
var testLayer=new ol.layer.Vector();
var testSource=new ol.source.Vector();
testLayer.setSource(testSource);
map.addLayer(testLayer);
var originalStyle=new ol.style.Style({
    fill: new ol.style.Fill({
        color:'rgba(255,255,255,0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: '#e21e0a',
        width:2
    }),
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color:'red'
        })
    })
})
var changedStyle=new ol.style.Style({
    image:new ol.style.Circle({
        radius:10,
        fill:new ol.style.Fill({
            color:'blue'
        })
    })
})

$.each(testPoints3,function(index,element){
    var feature=new ol.Feature({
        geometry:new ol.geom.Point(new ol.proj.fromLonLat([element[0],element[1]])),
        // geometry:new ol.geom.Point([element[0],element[1]]),        
    })
    feature.set('type','test');
    feature.setStyle(originalStyle);
    testSource.addFeature(feature); 
})
/* for(let i=0;i<200000;i++){
    var feature=new ol.Feature({
        geometry:new ol.geom.Point(new ol.proj.fromLonLat([117.911705,24.545305])),
        // geometry:new ol.geom.Point([element[0],element[1]]),        
    })
    feature.set('type','test');
    feature.setStyle(originalStyle);
    testSource.addFeature(feature); 
}  */

//地图全屏
var fullScreen=new gps_tool_FullScreen({
    className:"gps-tool-fullScreen",
    target:"fullScreen"
});
       

//要素点击事件
var selectClick=new ol.interaction.Select({
    condition:ol.events.condition.click,
    style:changeStyle
})

var changeStyle=function(feature){
    /* var ftype=feature.get("featuretype");
    if(ftype=='point'){
        return new ol.style.Style({
            fill:new ol.style.Fill({
                color:"red"
            }),
            stroke:new ol.style.Stroke({
                color:"blue",
                width:5
            })
        })
    } */
}
map.addInteraction(selectClick);

function clickEvent(evt){
    //矢量图层查询
    var pixel=map.getEventPixel(evt.originalEvent);
    var featureInfo=map.forEachFeatureAtPixel(pixel,function(feature,layer){
        return {'feature':feature,'layer':layer};
    })
    if(featureInfo!==undefined && featureInfo!==null && featureInfo.layer!==null){
        var feature=featureInfo.feature;
        var layer=featureInfo.layer;
        var id=feature.getId();
        thisFeatureID=id;
        var info=gpsLabelContentMap[id];
        var type=feature.get('type');
        console.log(feature.get('type'));
        if(type=='cluster'){
            alert('聚类点');
        }
        if(info){
            // var name=$("#"+id).find(".gps_label_popup_name").val();
            // feature.getStyle().getText().setText(info.name);
            $("#gps_label_popup").removeClass("isDisplay");
            // var target=$(labelStr)[0];
            var overLay=addOverLay(target);
            overLay.setPosition([info.x,info.y]);
            // $(".gps_label_popup").removeClass("isDisplay");            
            $("#gps_label_popup_name").val(info.name);
            $("#gps_label_popup_note").val(info.note);
        }
    }
    //隐藏全部ul
    $('.ul-common').addClass('hidden');

    return;
    //geoserver的wms图层查询
    var viewResolution=map.getView().getResolution();
    var url=roadsLayer.getSource().getGetFeatureInfoUrl(evt.coordinate,viewResolution,'EPSG:3857',{
        'INFO_FORMAT':'text/javascript',    //geoserver支持jsonp才能输出为jsonp的格式
        'FEATURE_COUNT':50  //点击查询能返回的数量上限
    });
    $.ajax({
        type:'GET',
        url:url,
        dataType:'jsonp',
        jsonp:'format_options',
        jsonpCallback:'callback:geoserverCallback'
    });

  
}

let geojsonFormat=new ol.format.GeoJSON({defaultDataProjection:'EPSG:3857'});
function geoserverCallback(res){
    var features=geojsonFormat.readFeatures(res);
    console.log('点击查询返回的结果如下：');
    console.log(features);
}

map.on("click",clickEvent);


//加载geoserver的wfs服务   Test:roads   roads_copy    roadsView  &maxFeatures=50   Test:line_defined_view  Test:line_defined  Test:temtableline
// var wfsUrl='http://localhost:8080/geoserver/Test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Test:line_defined_view&outputFormat=application%2Fjson';
//var wfsUrl='http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=Test:line_defined&outputFormat=application/json&srsname=EPSG:4326&viewparams=id:'+wfsID;

//自定义Array的原型方法
Array.prototype.indexOf=function(val){
    for(var i=0;i<this.length;i++){
        if(this[i]==val) return i;
    }
    return -1;
}

Array.prototype.remove=function(val){
    var index=this.indexOf(val);
    if(index>-1){
        this.splice(index,1);
    }
}

//获取当前选中的图层
var layerParsList=[];
$.each($('.layer-manager').find('input'),function(index,element){
    if($(element).prop('checked')){
        layerParsList.push($(element).val());
    }
});
$('.layer-manager').find('input').click(function(){
    var val=$(this).val();
    if($(this).prop('checked')){
        $(this).prop('checked',true);
        layerParsList.push(val);
        showSingleLayer(val);
    }
    else{
        $(this).prop('checked',false);
        layerParsList.remove(val);
        hideSingleLayer(val);
    }
    // roundLoadLayer(layerParsList);
});

  //wfs图层地址  testInfoView  testInfo
var wfsUrl='http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=Test:testInfoView&outputFormat=application/json&srsname=EPSG:4326';
//图层服务地址
var serverUrl='http://localhost:8080/geoserver/wfs?service=wfs';
var wfsFeild='geometry';
var layerWorkspace='Test';
var wfsStyle= new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 5
      }),
      image:new ol.style.Circle({
          radius:5,
          fill:new ol.style.Fill({
              color:'red'
          })
      }),
      fill:new ol.style.Fill({
          color:'yellow'
      })
    });
//循环加载图层
roundLoadLayerView();
// roundLoadLayer();
function roundLoadLayerView(){
    $.each(layerParsList,function(index,value){
        var url=wfsUrl+'&viewparams=uuid:'+value;
        var wfsLayer=new gps_layer_Vector_WFS({
            geom:wfsFeild,
            url:url,
            serverUrl:serverUrl,
            style:wfsStyle,
            workspace:layerWorkspace
        });
        wfsLayer.set('name',value);
        map.addLayer(wfsLayer); 
    });
}
function roundLoadLayer(){
    var url=wfsUrl;
    var wfsLayer=new gps_layer_Vector_WFS({
        geom:wfsFeild,
        url:url,
        serverUrl:serverUrl,
        style:wfsStyle,
        workspace:layerWorkspace
    });
    // wfsLayer.set('name',value);
    map.addLayer(wfsLayer); 
}

//隐藏指定图层
function hideSingleLayer(name){
    $.each(map.getLayers().a,function(index,element){
        if(element.get('name')==name){
            element.setVisible(false);
            console.log(name);
        }
    });
    // wfsVectorLayer.getSource().refresh();
}

//显示指定图层
function showSingleLayer(name){
    $.each(map.getLayers().a,function(index,element){
        if(element.get('name')==name){
            element.setVisible(true);
            console.log(name);
        }
    });
    // wfsVectorLayer.getSource().refresh();
}

/* var wfsVectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        format: new ol.format.GeoJSON({
            geometryName: 'geometry'
        }),  
     url:wfsUrl
    }),
    style:wfsStyle
  });
  map.addLayer(wfsVectorLayer); */

  //鼠标右键监听事件
$(map.getViewport()).on("contextmenu", function(e){
    e.preventDefault();
    // 书写事件触发后的函数
    saveFeatureOption();
    map.removeInteraction(gps_drawGraphic);
});

//监听键盘
window.document.onkeydown=function(evt){
    evt=(evt)?evt:window.event;
    if(evt.keyCode){
        if(evt.keyCode==67){
            coords.removeLastPoint();
            if(featureModify){
                featureModify.removePoint();
            }
        }
    }
}

/* 点击左侧导航栏 */
$('.navbar').find('li').click(function(){
    $(this).find('.trangle').toggleClass('hidden');
    $('.workzone').toggleClass('hidden');
    if($('.workzone').hasClass('hidden')){
        $('.mapContainer').css({'left':'120px'});
        $('.toolMenu').css({'right':'50px'});
    }
   else{
    $('.mapContainer').css({'left':'320px'});
    $('.toolMenu').css({'right':'250px'});
   }
})
