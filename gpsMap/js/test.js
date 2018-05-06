
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
    console.log(ol.proj.toLonLat(evt.coordinate));
    if(featureSelect && featureSelect.getFeatures().getLength()>0){
        featureModify.removePoint();
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
             coordinates[i] = [13151479.913912134+Math.random()*10000, 2813639.367474509+Math.random()*10000];
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
            coordinates[i] = [13151479.913912134+Math.random()*10000, 2813639.367474509+Math.random()*10000];
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
        var point_label_layer=new gps_tool_PointLabel({
            type:'Point'
        });
        map.addLayer(point_label_layer);
    }

     //面标注
     else if(id==='polygon_label'){
        var polygon_label_layer=new gps_tool_PointLabel({
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
    else{
         coords=new gps_tool_DrawGraphic({
            type:id
        })
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

  //鼠标右键监听事件
  $(map.getViewport()).on("contextmenu", function(e){
    e.preventDefault();
    // 书写事件触发后的函数
    if(optionType=='wfsEdit'){
        onSave(optionFeatures,optionLayerType,layerName);
    }
    //移除绘制事件
    else if(optionType=='drawGraph'){
        map.removeInteraction(gps_drawGraphic);
    }
});

//编辑要素
$('.title-common').click(function(){
    var id=$(this).attr('id');
     //编辑要素
    if(id==='modifyFeature'){
        var modify=Modify.init();
        modify.on('modifyend',function(evt){
            var geometry=evt.features.a[0].getGeometry();
            if(geometry.getType()==='Circle'){
                console.log("修改后的圆："+geometry.getCenter()+"--"+geometry.getRadius());
            }
            else{
                console.log('修改后的经纬度：'+geometry.getCoordinates());
            }
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

//测试点位
var testPoints=[[118.045093,24.490142],
[118.031742,24.452112],
[118.014359,24.534681],
[118.02716,24.482126],
[117.931976,24.565038],
[118.034237,24.493912],
[118.018692,24.48311],
[117.930831,24.566979],
[118.027885,24.495832],
[118.031599,24.497045],
[118.043639,24.49513],
[118.034966,24.498954],
[118.034034,24.495757],
[118.0306828,24.50247824],
[118.039855,24.484365],
[117.934067,24.563194],
[117.976974,24.533457],
[117.963922,24.484482],
[117.961102,24.580934],
[118.031029,24.49666],
[118.032459,24.497087],
[117.960015,24.580316],
[117.977734,24.491855],
[118.0463898,24.48837519],
[118.029324,24.459666],
[118.050995,24.492718],
[118.012312,24.538188],
[118.029171,24.493702],
[117.991987,24.519621],
[117.992209,24.527601],
[117.985878,24.519716],
[118.028862,24.466191],
[117.950761,24.57027376],
[117.985878,24.519716],
[118.005309,24.525495],
[118.042277,24.490917],
[117.9539073,24.55364406],
[117.985714,24.529395],
[118.008846,24.475652],
[117.92092,24.554815],
[117.912594,24.542551],
[118.032736,24.454339],
[117.99574,24.52202],
[118.012312,24.538188],
[117.932388,24.569272],
[118.023216,24.487225],
];

var testPoints2=[[118.027142,24.496869],
[117.93145,24.552975],
[118.0517,24.49891],
[118.043731,24.493127],
[118.039162,24.492752],
[118.003418,24.5160923],
[118.027603,24.479732],
[118.053125,24.499274],
[118.026778,24.474087],
[118.0262384,24.48252529],
[117.92353,24.567007],
[117.944499,24.59654],
[118.000069,24.5285],
[118.039139,24.492807],
[118.047279,24.525633],
[118.025191,24.497471],
[118.0388743,24.49419826],
[118.029117,24.458822],
[117.975037,24.572955],
[117.937869,24.560396],
[117.974716,24.517481],
[118.0154599,24.53451052],
[118.011818,24.52347],
[117.9311863,24.56086189],
[117.9606342,24.57927257],
[118.010094,24.530573],
[117.963922,24.484482],
[118.02993,24.501564],
[118.034965,24.504415],
[117.9168391,24.55572143],
[118.012115,24.535091],
[118.006865,24.526296],
[118.004783,24.533566],
[117.970772,24.460764],
[118.055172,24.5226],
[118.0390406,24.52771246],
[118.020194,24.490255],
[118.013035,24.523043],
[117.9770333,24.46560524],
[118.037683,24.499296],
[118.02758,24.501186],
[117.914373,24.554311],
[117.998154,24.459072],
[118.0328232,24.50369596],
[118.02058,24.48528],
[118.023689,24.47425],
[118.04034,24.499781],
[118.02251,24.481358],
[117.976067,24.482774],
[118.0264342,24.45292443],
[117.990178,24.46887],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.042277,24.490917],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.044203,24.49218],
[117.996189,24.525069],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.027407,24.483476],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[117.950798,24.554684],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.022972,24.488543],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.034237,24.493912],
[117.93445,24.55978],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.0581969,24.50039953],
[117.9923058,24.52144146],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[117.996208,24.525984],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.055172,24.5226],
[118.02302,24.478957],
[118.014706,24.471279],
[118.022401,24.478209],
[118.010033,24.530521],
[118.015411,24.537418],
[118.0278826,24.53235805],
[118.026972,24.488291],
[118.0269116,24.48432237],
[118.033066,24.451857],
[117.95179,24.540285],
[118.044121,24.492762],
[117.9918766,24.46849465],
[118.0254364,24.48772877],
[117.992797,24.469985],
[117.914939,24.557666],
[118.00269,24.53058],
[117.9246175,24.57726359],
[117.981483,24.503684],
[118.0035335,24.52949882],
[118.03698,24.48041],
[117.990992,24.526825],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[117.99496,24.520952],
[117.9169,24.5557],
[117.92655,24.55493],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[117.9880595,24.4834895],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.0001807,24.46033001],
[118.03698,24.48041],
[118.03698,24.48041],
[118.03698,24.48041],
[118.027407,24.483476],
[118.03698,24.48041],
[118.03698,24.48041],
[118.031742,24.452112]];

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
        console.log('打印选择要素');
        console.log(feature);
        console.log('打印选择要素所属Layer');
        console.log(layer);
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


//加载geoserver的wms服务
var wmsUrl='http://localhost:8080/geoserver/Test/wms';
// var wmsUrl='http://localhost:8080/geoserver/Test/wms?service=WMS';
var roadsLayer=new ol.layer.Tile({
    source:new ol.source.TileWMS({
        params:{
            // 'LAYERS':'cite:roads',
             'LAYERS':'Test:County',
            // 'LAYERS':'Test:points'
            // 'LAYERS':'Test:point_defined'
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
roadsLayer.setOpacity(0);
// map.addLayer(roadsLayer);

//加载geoserver的wfs服务   Test:roads   roads_copy    roadsView  &maxFeatures=50   Test:line_defined_view  Test:line_defined
// var wfsUrl='http://localhost:8080/geoserver/Test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Test:line_defined_view&outputFormat=application%2Fjson';
var wfsUrl='http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=Test:line_defined_view&outputFormat=application/json&srsname=EPSG:4326&viewparams=id:'+wfsID;

var wfsVectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        // format:new ol.format.GeoJSON(),
    format: new ol.format.GeoJSON({
        geometryName: 'geometry'
      }),  
    //   url: 'http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=tiger:tiger_roads&outputFormat=application/json&srsname=EPSG:4326'
     url:wfsUrl
    }),
    style: function(feature, resolution) {
      return new ol.style.Style({
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
    }
  });
//   wfsVectorLayer.set('geometryName','geom');
map.addLayer(wfsVectorLayer);



/* $(function(){
    ddf='fff';
   var f= new food();
   f.add(1,2);
})

var food=function(){
    this.name='apple';
}
food.prototype.add=function(a,b){
    console.log(this.name+a+b);
}

console.log('df'+window.hh+':'+window.ddf);

var name="lf外面";  
var doSomething=function (){  
    var name="lf";  
    var innerSay=function(){  
        alert(name);  
    }  
    innerSay();  
}  
// alert(name); //脚本错误  
// doSomething();
// var doSome=new doSomething(); //脚本错误
// innerSay();

var name = 'lf';  
function echo() {  
    alert(name);  
}
function env() {  
     var name = 'brizer';  
   
     echo();  
}  

env();  
alert(name);

　function f1(){

　　　　var n=999;

　　　　nAdd=function(){n+=1}

　　　　function f2(){
　　　　　　alert(n);
　　　　}
        f2();

// 　　　　return f2;

　　}

　　var result=f1();

// 　　result(); // 999

// 　　nAdd();

// 　　result(); // 1000 */

var testss;
var testhh=null;
var testgg=undefined;

var testlist=[];
var teststr={'dfd':'dfd'};
var testF=function(){
    console.log('uuuuu');
}

function Person(){
    this.name='name';
    this.id='id';
    this.fun=function(){
        console.log(this.name);
    }
}

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