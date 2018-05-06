//全局对象
var gps={};
var search_feature_source=null; //需要检索要素的图层源
var originalStyle=null;
var changedStyle=null;

 //内网瓦片地址
 var gpsTileURL="http://10.5.16.238:8080/EzServer7/tiles/";

var gps_layer_OpenStreet =function(options){
    var options=options ? options : {};
    var onLine=options.onLine ? options.onLine : 'onLine';
    var type=options.type ? options.type : 'map';
    var tile=new ol.layer.Tile({
        title:'openstreetmap',
        id:'openstreetmap',
        source: new ol.source.XYZ({
            url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            projection:'3857'
        })
    });
    return tile;
}

var gps_layer_Yahoo=function(options){
    var options=options ? options : {};
    var onLine=options.onLine ? options.onLine : 'onLine';
    var type=options.type ? options.type : 'map';
    var tile = new ol.layer.Tile({
        source: new ol.source.XYZ({
            tileSize: 512,
            url:'https://{0-3}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?lg=ENG&ppi=250&token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B',
            projection:'3857'
        })
    });
    return tile;
}

//天地图基础图层
var gps_layer_TianDi_Base=function(options){
    var options = options ? options : {};
    var onLine=options.onLine ? options.onLine :'onLine';
    var type=options.type ? options.type : 'map';
    var tile=new ol.layer.Tile({
        title:"天地图基础图层",
        id:"999999",
        source:new ol.source.XYZ({
            // url:"http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",
            tileUrlFunction:function(tileCoord){
                var z=tileCoord[0];
                var x=tileCoord[1];
                var y=-tileCoord[2]-1; 
                // console.log('天地图'+tileCoord[2]);
                // var y=tileCoord[2];                 
                if(onLine=='onLine' && type=='map'){
                //   return 'http://t4.tianditu.com/DataServer?T=vec_c&x='+x+'&y='+y+'&l='+z;    //在线 
                  return 'http://t4.tianditu.com/DataServer?T=vec_w&x='+x+'&y='+y+'&l='+z;    //在线                 
                }
                else if(onLine=='onLine' && type=='weixing'){
                  return 'http://t0.tianditu.com/DataServer?T=img_w&x='+x+'&y='+y+'&l='+z;
                }
                else if(onLine=='offLine' && type=='map'){
                  return gpsTileURL+"tilevecw/"+z+"/"+y+"/"+x+".png";                   //离线--3857
                  //return gpsTileURL+"tdtvec/"+z+"/"+y+"/"+x+".png";                   //离线--4326  
                }
                else if(onLine=='offLine' && type=='weixing'){
                  return gpsTileURL+"tileimgw/"+z+"/"+y+"/"+x+".png";                   //离线--3857 
                }                 
            },
            projection:"EPSG:3857"
        })
    })
    return tile;
}

//天地图标注图层
var gps_layer_TianDi_Marker=function(options){
  var options = options ? options : {};
  var onLine=options.onLine ? options.onLine :'onLine';
  var type=options.type ? options.type : 'map';
  var tile=new ol.layer.Tile({
      title:"天地图基础图层",
      source:new ol.source.XYZ({
          // url:"http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",
          tileUrlFunction:function(tileCoord){
              var z=tileCoord[0];
              var x=tileCoord[1];
              var y=-tileCoord[2]-1;
              if(onLine=='onLine' && type=='map'){
                // return 'http://t4.tianditu.com/DataServer?T=cva_w&x='+x+'&y='+y+'&l='+z;    //在线 
                return 'http://t4.tianditu.com/DataServer?T=cva_w&x='+x+'&y='+y+'&l='+z;    //在线                 
              }
              else if(onLine=='onLine' && type=='weixing'){
                return 'http://t0.tianditu.com/DataServer?T=cia_w&x='+x+'&y='+y+'&l='+z;
              }
              else if(onLine=='offLine' && type=='map'){
                return gpsTileURL+"tilecvaw/"+z+"/"+y+"/"+x+".png";                   //离线--3857
                //return gpsTileURL+"tdtvec/"+z+"/"+y+"/"+x+".png";                   //离线--4326  
              }
              else if(onLine=='offLine' && type=='weixing'){
                return gpsTileURL+"tileciaw/"+z+"/"+y+"/"+x+".png";                   //离线--3857 
              }                 
          },
          projection:"EPSG:3857"
      })
  })
  return tile;
}

//百度地图
var gps_layer_BaiDu=function(options){
    var options = options ? options : {};
    var onLine=options.onLine ? options.onLine :'onLine';
    var type=options.type ? options.type : 'map';
    var forEachPoint = function(func) {
    return function(input, opt_output, opt_dimension) {
      var len = input.length;
      var dimension = opt_dimension ? opt_dimension : 2;
      var output;
      if (opt_output) {
        output = opt_output;
      } else {
        if (dimension !== 2) {
          output = input.slice();
        } else {
          output = new Array(len);
        }
      }
      for (var offset = 0; offset < len; offset += dimension) {
        func(input, output, offset)
      }
      return output;
    };
  };
  
  var sphericalMercator = {}
  
  var RADIUS = 6378137;
  var MAX_LATITUDE = 85.0511287798;
  var RAD_PER_DEG = Math.PI / 180;
  
  sphericalMercator.forward = forEachPoint(function(input, output, offset) {
    var lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE);
    var sin = Math.sin(lat * RAD_PER_DEG);
  
    output[offset] = RADIUS * input[offset] * RAD_PER_DEG;
    output[offset + 1] = RADIUS * Math.log((1 + sin) / (1 - sin)) / 2;
  });
  
  sphericalMercator.inverse = forEachPoint(function(input, output, offset) {
    output[offset] = input[offset] / RADIUS / RAD_PER_DEG;
    output[offset + 1] = (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - (Math.PI / 2)) / RAD_PER_DEG;
  });
  
  
  var baiduMercator = {}
  
  var MCBAND = [12890594.86, 8362377.87,
      5591021, 3481989.83, 1678043.12, 0];
  
  var LLBAND = [75, 60, 45, 30, 15, 0];
  
  var MC2LL = [
      [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
          200.9824383106796, -187.2403703815547, 91.6087516669843,
          -23.38765649603339, 2.57121317296198, -0.03801003308653,
          17337981.2],
      [-7.435856389565537e-9, 0.000008983055097726239,
          -0.78625201886289, 96.32687599759846, -1.85204757529826,
          -59.36935905485877, 47.40033549296737, -16.50741931063887,
          2.28786674699375, 10260144.86],
      [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
          59.74293618442277, 7.357984074871, -25.38371002664745,
          13.45380521110908, -3.29883767235584, 0.32710905363475,
          6856817.37],
      [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
          40.31678527705744, 0.65659298677277, -4.44255534477492,
          0.85341911805263, 0.12923347998204, -0.04625736007561,
          4482777.06],
      [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
          23.10934304144901, -0.00023663490511, -0.6321817810242,
          -0.00663494467273, 0.03430082397953, -0.00466043876332,
          2555164.4],
      [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
          7.47137025468032, -0.00000353937994, -0.02145144861037,
          -0.00001234426596, 0.00010322952773, -0.00000323890364,
          826088.5]];
  
  var LL2MC = [
      [-0.0015702102444, 111320.7020616939, 1704480524535203,
          -10338987376042340, 26112667856603880,
          -35149669176653700, 26595700718403920,
          -10725012454188240, 1800819912950474, 82.5],
      [0.0008277824516172526, 111320.7020463578, 647795574.6671607,
          -4082003173.641316, 10774905663.51142, -15171875531.51559,
          12053065338.62167, -5124939663.577472, 913311935.9512032,
          67.5],
      [0.00337398766765, 111320.7020202162, 4481351.045890365,
          -23393751.19931662, 79682215.47186455, -115964993.2797253,
          97236711.15602145, -43661946.33752821, 8477230.501135234,
          52.5],
      [0.00220636496208, 111320.7020209128, 51751.86112841131,
          3796837.749470245, 992013.7397791013, -1221952.21711287,
          1340652.697009075, -620943.6990984312, 144416.9293806241,
          37.5],
      [-0.0003441963504368392, 111320.7020576856, 278.2353980772752,
          2485758.690035394, 6070.750963243378, 54821.18345352118,
          9540.606633304236, -2710.55326746645, 1405.483844121726,
          22.5],
      [-0.0003218135878613132, 111320.7020701615, 0.00369383431289,
          823725.6402795718, 0.46104986909093, 2351.343141331292,
          1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]];
  
  
  function getRange(v, min, max) {
    v = Math.max(v, min);
    v = Math.min(v, max);
  
    return v;
  }
  
  function getLoop(v, min, max) {
    var d = max - min;
    while (v > max) {
      v -= d;
    }
    while (v < min) {
      v += d;
    }
  
    return v;
  }
  
  function convertor(input, output, offset, table) {
    var px = input[offset];
    var py = input[offset + 1];
    var x = table[0] + table[1] * Math.abs(px);
    var d = Math.abs(py) / table[9];
    var y = table[2]
        + table[3]
        * d
        + table[4]
        * d
        * d
        + table[5]
        * d
        * d
        * d
        + table[6]
        * d
        * d
        * d
        * d
        + table[7]
        * d
        * d
        * d
        * d
        * d
        + table[8]
        * d
        * d
        * d
        * d
        * d
        * d;
  
    output[offset] = x * (px < 0 ? -1 : 1);
    output[offset + 1] = y * (py < 0 ? -1 : 1);
  }
  
  baiduMercator.forward = forEachPoint(function(input, output, offset) {
    var lng = getLoop(input[offset], -180, 180);
    var lat = getRange(input[offset + 1], -74, 74);
  
    var table = null;
    var j;
    for (j = 0; j < LLBAND.length; ++j) {
      if (lat >= LLBAND[j]) {
        table = LL2MC[j];
        break;
      }
    }
    if (table === null) {
      for (j = LLBAND.length - 1; j >= 0; --j) {
        if (lat <= -LLBAND[j]) {
          table = LL2MC[j];
          break;
        }
      }
    }
    output[offset] = lng;
    output[offset + 1] = lat;
    convertor(output, output, offset, table);
  });
  
  baiduMercator.inverse = forEachPoint(function(input, output, offset) {
    var y_abs = Math.abs(input[offset + 1]);
  
    var table = null;
    for (var j = 0; j < MCBAND.length; j++) {
      if (y_abs >= MCBAND[j]) {
        table = MC2LL[j];
        break;
      }
    }
  
    convertor(input, output, offset, table);
  });
  
  var gcj02 = {}
  
  var PI = Math.PI;
  var AXIS = 6378245.0;
  var OFFSET = 0.00669342162296594323;  // (a^2 - b^2) / a^2
  
  function delta(wgLon, wgLat) {
    var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * PI;
    var magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((AXIS * (1 - OFFSET)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);
    return [dLon, dLat];
  }
  
  function outOfChina(lon, lat) {
    if (lon < 72.004 || lon > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  }
  
  function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }
  
  function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
  }
  
  gcj02.toWGS84 = forEachPoint(function(input, output, offset) {
    var lng = input[offset];
    var lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
      var deltaD = delta(lng, lat);
      lng = lng - deltaD[0];
      lat = lat - deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
  });
  
  gcj02.fromWGS84 = forEachPoint(function(input, output, offset) {
    var lng = input[offset];
    var lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
      var deltaD = delta(lng, lat);
      lng = lng + deltaD[0];
      lat = lat + deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
  });
  
  var bd09 = {}
  
  var PI = Math.PI;
  var X_PI = PI * 3000 / 180;
  
  function toGCJ02(input, output, offset) {
    var x = input[offset] - 0.0065;
    var y = input[offset + 1] - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    output[offset] = z * Math.cos(theta);
    output[offset + 1] = z * Math.sin(theta);
    return output;
  }
  
  function fromGCJ02(input, output, offset) {
    var x = input[offset];
    var y = input[offset + 1];
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    output[offset] = z * Math.cos(theta) + 0.0065;
    output[offset + 1] = z * Math.sin(theta) + 0.006;
    return output;
  }
  
  bd09.toWGS84 = function(input, opt_output, opt_dimension) {
    var output = forEachPoint(toGCJ02)(input, opt_output, opt_dimension);
    return gcj02.toWGS84(output, output, opt_dimension);
  };
  
  bd09.fromWGS84 = function(input, opt_output, opt_dimension) {
    var output = gcj02.fromWGS84(input, opt_output, opt_dimension);
    return forEachPoint(fromGCJ02)(output, output, opt_dimension);
  };
  
  
  var projzh = {}
  
  projzh.smerc2bmerc = function(input, opt_output, opt_dimension) {
    var output = sphericalMercator.inverse(input, opt_output, opt_dimension);
    output = bd09.fromWGS84(output, output, opt_dimension);
    return baiduMercator.forward(output, output, opt_dimension);
  };
  
  projzh.bmerc2smerc = function(input, opt_output, opt_dimension) {
    var output = baiduMercator.inverse(input, opt_output, opt_dimension);
    output = bd09.toWGS84(output, output, opt_dimension);
    return sphericalMercator.forward(output, output, opt_dimension);
  };
  
  projzh.bmerc2ll = function(input, opt_output, opt_dimension) {
    var output = baiduMercator.inverse(input, opt_output, opt_dimension);
    return bd09.toWGS84(output, output, opt_dimension);
  };
  
  projzh.ll2bmerc = function(input, opt_output, opt_dimension) {
    var output = bd09.fromWGS84(input, opt_output, opt_dimension);
    return baiduMercator.forward(output, output, opt_dimension);
  };
  
  projzh.ll2smerc = sphericalMercator.forward;
  projzh.smerc2ll = sphericalMercator.inverse;
  
  
  
  var extent = [72.004, 0.8293, 137.8347, 55.8271];
  
  var baiduMercatorProj = new ol.proj.Projection({
    code: 'baidu',
    extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
    units: 'm'
  });
  
  ol.proj.addProjection(baiduMercatorProj);
  ol.proj.addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projzh.ll2bmerc, projzh.bmerc2ll);
  ol.proj.addCoordinateTransforms('EPSG:3857', baiduMercatorProj, projzh.smerc2bmerc, projzh.bmerc2smerc);
  
  var bmercResolutions = new Array(19);
  for (var i = 0; i < 19; ++i) {
    bmercResolutions[i] = Math.pow(2, 18 - i);
  }
  var tile = new ol.layer.Tile({
    source: new ol.source.XYZ({
      projection: 'baidu',
      maxZoom: 18,
      tileUrlFunction: function(tileCoord) {
        var x = tileCoord[1];
        var y = tileCoord[2];
        var z = tileCoord[0];
        // console.log('fff'+y);
       /* return "http://api0.map.bdimg.com/customimage/tile?x=" + x
          + "&y=" + y + "&z=" + z
          + "&udt=20170908&scale=2&ak=ZUONbpqGBsYGXNIYHicvbAbM"
          + "&styles=t%3Awater%7Ce%3Aall%7Cc%3A%23044161%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23004981%2Ct%3Aboundary%7Ce%3Ag%7Cc%3A%23064f85%2Ct%3Arailway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cc%3A%23004981%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23005b96%7Cl%3A1%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cc%3A%23004981%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%2300508b%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Aall%7Cv%3Aoff%7Cc%3A%23056197%2Ct%3Asubway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Aboundary%7Ce%3Ag.f%7Cc%3A%23029fd4%2Ct%3Abuilding%7Ce%3Aall%7Cc%3A%231a5787%2Ct%3Alabel%7Ce%3Aall%7Cv%3Aoff&t = 1505487396397";;
         */
        if(onLine=="onLine" && type=="map"){
            return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20151021&scaler=1&p=1";    //在线
        }
        else if(onLine=="offLine" && type=="map"){
             return "http://10.5.16.238:8080/EzServer7/"+"tiles/tilebd/"+z+"/"+y+"/"+x+".png";    //离线
        }
      },
      tileGrid: new ol.tilegrid.TileGrid({
        resolutions: bmercResolutions,
        origin: [0, 0],
        extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
        tileSize: [256, 256]
      })
    })
  });
  return tile;
}

// 自定义分辨率和瓦片坐标系
var baiduLayer=function(){
    var resolutions = [];
    var maxZoom = 18;
  
    // 计算百度使用的分辨率
    for(var i=0; i<=maxZoom; i++){
        resolutions[i] = Math.pow(2, maxZoom-i);
    }
    var tilegrid  = new ol.tilegrid.TileGrid({
        origin: [0,0],    // 设置原点坐标
        resolutions: resolutions    // 设置分辨率
    });
  
    // 创建百度地图的数据源
    var baiduSource = new ol.source.TileImage({
        projection: 'EPSG:3857',    
        tileGrid: tilegrid,
        tileUrlFunction: function(tileCoord, pixelRatio, proj){
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];
  
            // 百度瓦片服务url将负数使用M前缀来标识
            if(x<0){
                x = 'M' + (-x);
            }
            if(y<0){
                y = 'M' + (-y);
            }
  
            return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20160426&scaler=1&p=0";
        }
    });
  
      // 百度地图层
      var baiduMapLayer2 = new ol.layer.Tile({
          source: baiduSource
      });
      return baiduMapLayer2;
}

//谷歌地图
var gps_layer_Google=function(options){
    var url;
    var options = options ? options : {};
    var onLine=options.onLine ? options.onLine :'onLine';
    var type=options.type ? options.type : 'map';
    if(onLine=="onLine" && type=="map"){
        url="http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0";
    }
    var tile=new ol.layer.Tile({
        title:"谷歌地图",
        source:new ol.source.XYZ({
            url:url,
            projection:'EPSG:3857'
        }),
    })
    return tile;
}

//高德地图
var gps_layer_GaoDe=function(options){
    var url;
    var options = options ? options : {};
    var onLine=options.onLine ? options.onLine :'onLine';
    var type=options.type ? options.type : 'map';
    if(onLine=="onLine" && type=="map"){
        url="https://webst03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}";
    }
    var tile=new ol.layer.Tile({
        title:"高德地图",
        source:new ol.source.XYZ({
           /*  tileUrlFunction:function(bounds){
                var res = map.getResolution();
                var bbox = map.getMaxExtent();
                var size = tileSize;
                //计算列号 
                var tileX = Math.round((bounds.left - bbox.left) / (res * size.w));
                //计算行号
                var tileY = Math.round((bbox.top - bounds.top) / (res * size.h));
                //当前的等级 
                debugger;
                var tileZ = this.map.zoom-1;
                if (tileX < 0) tileX = tileX + Math.round(bbox.getWidth() / bounds.getWidth());
                if (tileY < 0) tileY = tileY + Math.round(bbox.getHeight() / bounds.getHeight());
                //tileY = (Math.pow(2, tileZ) - 1 - tileY);
                //tileY = Math.pow(2, tileZ)-tileY+Math.pow(2,this.map.zoom-3);
                tileY = 1+tileY+Math.pow(2,this.map.zoom-3);
                console.log(tileY+" =tileY");
                return "https://webst03.is.autonavi.com/appmaptile?style=7&x={tileX}&y={tileY}&z={this.map.zoom}"
                } */
                url: url
            })
        })
        return tile;
}

//高德大字体
var gaode_map_bigF=new ol.layer.Tile({
    title:"高德大字体",
    source:new ol.source.XYZ({
        url:"http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size={z}&style=7&scl={y}&ltype={x}"
    })
})
//高德卫星
var gaode_wx=new ol.layer.Tile({
    title:"高德卫星图",
    source:new ol.source.XYZ({
        url: "https://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
    })
})

/* 
//全屏
var ele=map.getTargetElement();
// requestFullScr(ele);
function requestFullScr(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

//添加比例尺控件
var scaleControl = new ol.control.ScaleLine({
    units: 'metric',
    target: 'scalebar',
    className: 'ol-scale-line'
});
map.addControl(scaleControl);
*/

//测量数据源
var gps_source_Vector_Measure = new ol.source.Vector();
//测量要素图层
var gps_layer_Vector_Measure = new ol.layer.Vector({
    source: gps_source_Vector_Measure,
    style: new ol.style.Style({
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
});
//将测量要素图层添加到地图中
// map.addLayer(gps_layer_Vector_Measure);

//定义绘图对象
var gps_drawMeasure;
//创建一个WGS84球体对象
var gps_wgs84Sphere = new ol.Sphere(6378137);
//创建一个当前要绘制的对象
var gps_measureSketch = new ol.Feature();
//创建一个帮助提示框对象
var gps_helpTooltipElement;
//记录生成的测量提示框
var gps_measureTooltipMap={};
//创建一个帮助提示信息对象popup
var gps_helpTooltip;
//创建一个测量提示框对象
var gps_measureTooltipElement;
//创建一个测量提示信息对象
var gps_measureTooltip;
//是否绘制结束
var gps_measureIsEnd=false;
//绘制点的数量
var gps_measureCount= 0;

//启动测量
var gps_tool_Measure=function(options){
    var options = options ? options : {};
    var measureType=options.type ? options.type :'LineString';

    //当鼠标移除地图视图的时为帮助提示要素添加隐藏样式
    $(map.getViewport()).on('mouseout', function () {
        $(gps_helpTooltipElement).addClass('hidden');
    });
    //触发pointermove事件
    map.on('pointermove', pointerMoveHandler);

    //创建一个交互式绘图对象
    gps_drawMeasure = new ol.interaction.Draw({
        //绘制的数据源
        source: gps_source_Vector_Measure,
        //绘制类型
        type: measureType,
        //样式
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color:'rgba(255,255,255,0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,0.5)',
                lineDash: [10, 10],
                width:2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color:'rgba(0,0,0,0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,0.2)'
                })
            })
        })
    });
    //将交互绘图对象添加到地图中
    map.addInteraction(gps_drawMeasure);
    //绘制开始
    gps_measureIsEnd=false;
    //创建测量提示框
    creategps_measureTooltip();
    //创建帮助提示框
    creategps_helpTooltip();

    //定义一个事件监听
    var measureListener;
    //定义一个控制鼠标点击次数的变量
     gps_measureCount= 0;
     var geom;
    //绘制开始事件
    gps_drawMeasure.on('drawstart', function (evt) {
        //The feature being drawn.
        gps_measureSketch = evt.feature;
        //提示框的坐标
        var tooltipCoord = evt.coordinate;
        
        //监听几何要素的change事件
        measureListener = gps_measureSketch.getGeometry().on('change', function (evt) {
            //获取绘制的几何对象
            geom = evt.target;
            //定义一个输出对象，用于记录面积和长度
            var outResult;
            if (geom instanceof ol.geom.Polygon) {
                map.removeEventListener('singleclick');
                map.removeEventListener('dblclick');
                //输出多边形的面积
                outResult = formatArea(geom);
                //获取多变形内部点的坐标
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                //输出多线段的长度
                outResult = formatLength(geom);
                //获取多线段的最后一个点的坐标
                tooltipCoord = geom.getLastCoordinate();
            }
            
            //设置测量提示框的内标签为最终输出结果
            gps_measureTooltipElement.innerHTML = outResult;
            //设置测量提示信息的位置坐标
            gps_measureTooltip.setPosition(tooltipCoord);
        });
        
        //地图单击事件
        map.on('singleclick', function (evt) {
            //设置测量提示信息的位置坐标，用来确定鼠标点击后测量提示框的位置
            gps_measureTooltip.setPosition(evt.coordinate);
            //如果是第一次点击，则设置测量提示框的文本内容为起点
            if (gps_measureCount== 0) {
                gps_measureTooltipElement.innerHTML = "起点";
            }
           //根据鼠标点击位置生成一个点
            var point = new ol.geom.Point(evt.coordinate);
            var feature=new ol.Feature(point);
            feature.setId(evt.coordinate.toString());
            //将该点要素添加到矢量数据源中
            gps_source_Vector_Measure.addFeature(feature);
            //更改测量提示框的样式，使测量提示框可见
            gps_measureTooltipElement.className = 'tooltip tooltip-static';
            //记录生成的测量提示框
            gps_measureTooltipMap[evt.coordinate.toString()]=gps_measureTooltip;
            //创建测量提示框
            creategps_measureTooltip();
            //点击次数增加
            gps_measureCount++;
        });

        //地图双击事件
        map.on('dblclick', function (evt) {
            var point = new ol.geom.Point(evt.coordinate);
            gps_source_Vector_Measure.addFeature(new ol.Feature(point));
        });
    }, this);

    //绘制结束事件
    gps_drawMeasure.on('drawend', function (evt) {
        var feature=evt.feature;
        var pointStr=evt.target.a.toString();
        gps_measureCount= 0;
        //标识绘制结束
        gps_measureIsEnd=true;
        //设置测量提示框的样式
        gps_measureTooltipElement.className = 'tooltip tooltip-static';
        //清空绘制要素
        gps_measureSketch = null;
        //清空测量提示要素
        var deleteSpan=$("<span style='margin-left:5px;cursor:pointer;' ><img class='measure_class' src='images/LB_DEL_SEL.png'/></span>");
        deleteSpan.attr("pointStr",pointStr);
        $(gps_measureTooltipElement).append(deleteSpan);
        gps_measureTooltipElement = null;
        //清空帮助提示信息
        $(gps_helpTooltipElement).remove();
        //移除事件监听
        ol.Observable.unByKey(measureListener);
        //移除地图单击事件
        map.removeEventListener('singleclick');
        //移除之前的绘制对象
        map.removeInteraction(gps_drawMeasure);
        deleteSpan.click(function(){
            var thisPointStr=$(this).attr("pointStr");
            gps_source_Vector_Measure.removeFeature(feature); //删除选中要素
            $(this).parent().remove();  //删除最后一个测量提示框
            //删除点要素
            $.each(gps_source_Vector_Measure.getFeatures(),function(index,value){
                var coordinate=value.getGeometry().getCoordinates().toString();
                if(thisPointStr.indexOf(coordinate)>-1){
                    gps_source_Vector_Measure.removeFeature(value); //点要素
                    map.removeOverlay(gps_measureTooltipMap[coordinate]);    //测量提示框
                }
            });
        });
         //记录生成的测量提示框
         gps_measureTooltipMap[pointStr]=gps_measureTooltip;
    }, this);
    map.removeLayer(gps_layer_Vector_Measure);
    return gps_layer_Vector_Measure;
}

//获取大地测量复选框
var geodesicCheckbox = true;
  
//鼠标移动触发的函数
var pointerMoveHandler = function (evt) {
    //如果是平移地图则直接结束
    if (evt.dragging) {
        return;
    }
    var helpMsg = '单击以开始';
    if (gps_measureSketch) {
        //获取绘图对象的几何要素
        var geom = gps_measureSketch.getGeometry();
        //如果当前绘制的几何要素是多边形、多面形，则将绘制提示信息设置为多边形绘制提示信息
        if (geom instanceof ol.geom.Polygon) {
            helpMsg="双击以结束";
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg="双击以结束";
        }
    }
    //设置帮助提示要素的内标签为帮助提示信息
    if(gps_helpTooltipElement){
         gps_helpTooltipElement.innerHTML = helpMsg;
        //设置帮助提示信息的位置
        gps_helpTooltip.setPosition(evt.coordinate);
        //移除帮助提示要素的隐藏样式
        $(gps_helpTooltipElement).removeClass('hidden');
     }
};

//创建帮助提示框
function creategps_helpTooltip() {
    //如果已经存在帮助提示框则移除
    if (gps_helpTooltipElement==null) {
        gps_helpTooltipElement = document.createElement('div');
    }
    
    //设置帮助提示要素的样式
    gps_helpTooltipElement.className = 'tooltip hidden';
    //创建一个帮助提示的覆盖标注
    gps_helpTooltip = new ol.Overlay({
        element: gps_helpTooltipElement,
        offset: [15, 0],
        positioning:'center-left',
        id:"clearedOverLayer"
    });
    //将帮助提示的覆盖标注添加到地图中
    map.addOverlay(gps_helpTooltip);
}

//创建测量提示框
function creategps_measureTooltip() {
    //创建测量提示框的div
    gps_measureTooltipElement = document.createElement('div');
    gps_measureTooltipElement.setAttribute('id','lengthLabel');
    //设置测量提示要素的样式
    gps_measureTooltipElement.className = 'tooltip tooltip-measure';
    //创建一个测量提示的覆盖标注
    gps_measureTooltip = new ol.Overlay({
        element: gps_measureTooltipElement,
        offset: [0, -15],
        positioning:'bottom-center',
        id:"clearedOverLayer"
    });
    //将测量提示的覆盖标注添加到地图中
    map.addOverlay(gps_measureTooltip);
}

//格式化测量长度
var formatLength = function (line) {
    //定义长度变量
    var length;
    //如果大地测量复选框被勾选，则计算球面距离
    if (geodesicCheckbox) {
        //获取坐标串
        var coordinates = line.getCoordinates();
        //初始长度为0
        length = 0;
        //获取源数据的坐标系
        var sourceProj = map.getView().getProjection();
        //进行点的坐标转换
        for (var i = 0; i < coordinates.length - 1; i++) {
            //第一个点
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            //第二个点
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            //获取转换后的球面距离
            length += gps_wgs84Sphere.haversineDistance(c1,c2);
        }
    } else {
        //计算平面距离
        length = Math.round(line.getLength() * 100) / 100;
    }
    //定义输出变量
    var outResult;
    //如果长度大于1000，则使用km单位，否则使用m单位
    if (length > 1000) {
        outResult = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'; //换算成KM单位
    } else {
        outResult = (Math.round(length * 100) / 100) + ' ' + 'm'; //m为单位
    }
    return outResult;
};

//格式化测量面积
var formatArea = function (polygon) {
    //定义面积变量
    var area;
    //如果大地测量复选框被勾选，则计算球面面积
    if (geodesicCheckbox) {
        //获取初始坐标系
        var sourceProj = map.getView().getProjection();
        //克隆该几何对象然后转换坐标系
        var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
        //获取多边形的坐标系
        var coordinates = geom.getLinearRing(0).getCoordinates();
        //获取球面面积
        area = Math.abs(gps_wgs84Sphere.geodesicArea(coordinates));
    } else {
        //获取平面面积
        area = polygon.getArea();
    }
    //定义输出变量
    var outResult;
    //当面积大于10000时，转换为平方千米，否则为平方米
    if (area > 10000) {
        outResult = (Math.round(area/1000000*100)/100) + ' ' + 'km<sup>2</sup>';
    } else {
        outResult = (Math.round(area*100)/100) + ' ' + 'm<sup>2</sup>';
    }
    return outResult; 
};

//清除多余痕迹
gps.clearTemporaryLayer=function(){
    //清除测量结果提示框
    $.each(gps_measureTooltipMap,function(key,value){
        map.removeOverlay(value);
    })
    gps_source_Vector_Measure.clear();
    map.removeLayer(gps_layer_Vector_Measure);

    //清除标注痕迹
    $(target).addClass('hidden');
    gps_source_Vector_DrawLabel.clear();
    map.removeLayer(gps_layer_Vector_DrawLabel);

    //清除绘制图形
    gps_source_Vector_DrawGraphic.clear();
    map.removeLayer(gps_layer_Vector_DrawGraphic);
}

//拉框放大、缩小
var gps_Interaction_Drag=new ol.interaction.DragPan({

});

var gps_tool_DragZoom=function(options){
    var options = options ? options : {};
    var type=true;
    if(options.type=='in'){
        type=true;
    }else if(options.type=='out'){
        type=false;
    }
    var dragZoomUp = new ol.interaction.DragZoom({
        condition: ol.events.condition.always,
        out: type, // 此处为设置拉框完成时放大还是缩小
      });
      map.addInteraction(dragZoomUp);
      stopAllInteractions();
      dragZoomUp.setActive(true);
      document.querySelector("#map").style.cursor = "crosshair";
      dragZoomUp.on("boxend",function(){
        this.setActive(false);
        gps_Interaction_Drag.setActive(true);
        document.querySelector("#map").style.cursor = "default";
    })
}

//禁止所有交互操作
var stopAllInteractions=function(){
    map.addInteraction(gps_Interaction_Drag);
    map.getInteractions().forEach(function(element,index,array){
        if(element instanceof ol.interaction.MouseWheelZoom){
            return;
        }
        element.setActive(false);
        // console.log(element instanceof ol.interaction.DragPan);
        //map.getInteractions().clear();
    })
}

//地图全屏
var fullScreen=null;
var gps_tool_FullScreen=function(options){
    if(fullScreen==null){
        var options=options ? options : {};
        var targetId =options.target ? options.target : "";
        var screenClass=options.className ? options.className : "gps-tool-fullScreen";
        var target=document.getElementById(targetId);
        var fullScreen=new ol.control.FullScreen({
            className:screenClass,
            target:target
        });
        map.addControl(fullScreen);
        var button= $("."+screenClass).find("button");
        button.attr("title","全屏");
        button.click(function(){
            if(button.hasClass("gps-tool-fullScreen-true")){
                button.attr("title","全屏");
            }
            else if(button.hasClass("gps-tool-fullScreen-false")){
                button.attr("title","退出全屏");
            }
        })
    }
}

/* 添加标注 */
var gpsLabelContentMap={};
var gpsLabelFeatureMap={};
var gps_layer_Vector_DrawLabel=new ol.layer.Vector();
var gps_source_Vector_DrawLabel=new ol.source.Vector();
gps_layer_Vector_DrawLabel.setZIndex(2);
gps_layer_Vector_DrawLabel.setSource(gps_source_Vector_DrawLabel);

var labelStr="<div id='gps_label_popup' class='gps_label_popup'>"+
            "<div class='gps_label_popup_title'><span>我的标注</span><button id='gps_label_popup_close' abc='dfds' featureID='dd' class=' btm_white_but'>关闭</button></div>"+
            "<div><span>名称：</span><input id='gps_label_popup_name' placeholder='点标注' maxLength='10'/></div>"+
            "<div><span>备注：</span><input id='gps_label_popup_note' placeholder='您最多可输入100个字' maxLength='100'/></div>"+
            "<div><button id='gps_label_popup_delete' class=' btm_white_but'>删除</button><button id='gps_label_popup_save' class=' btm_white_but'>保存</button></div>"+
            "<input type='hidden' id='lonLats'/></div>";
var target=$(labelStr)[0];
var thisFeatureID=null;
var thisFeatureCoord=null;
var firstPointLabel=0;
//点状标注
var gps_tool_PointLabel=function(options){
    thisFeatureID=null;
    var options=options ? options : {};
    var type=options.type ? options.type : 'Point';
    var draw=new ol.interaction.Draw({
        source:gps_source_Vector_DrawLabel,
        type:type,
        // maxPoints:10,
        style:function(){
            if(type=='Point'){
                return new ol.style.Style({
                    image:new ol.style.Icon({
                        src:"images/point_label.png"
                    })
                })
            }
            else if(type=='Polygon'){
                return new ol.style.Style({
                    fill:new ol.style.Fill({
                        color:'rgba(255,0,0,0.5)',
                    }),
                    stroke:new ol.style.Stroke({
                        color:'red',
                        width:2,
                        lineDash:[1,2,3,4,5,6,7,8]
                    }),
                    image:new ol.style.Circle({
                        radius:5,
                        fill:new ol.style.Fill({
                            color:'#ffcc33'
                        })
                    }),
                    text:new ol.style.Text({
                        font:'14px Calibri,sans-serif',
                        fill:new ol.style.Fill({
                            color:'red'
                        })
                    })
                })
            }
        }
    })
    map.addInteraction(draw);
    draw.on("drawend",function(evt){
        var time=new Date().getTime();
        var coord=[];
        if(type=='Point'){
            coord=evt.feature.getGeometry().getCoordinates();
        }else if(type=='Polygon'){
            var maxLat=0;
            var coordList=evt.feature.getGeometry().getCoordinates();
            $.each(coordList[0],function(index,value){
               if(value[1]>maxLat){
                   maxLat=value[1];
                   coord=value;
               }
            })
        }
        
        thisFeatureCoord=coord;
        var feature=evt.feature;
        //标注图标
        /* var feature=new ol.Feature({
            geometry:new ol.geom.Point(coord),
            // id:time
        }) */
        var pointStyle=new ol.style.Style({
            image:new ol.style.Icon({
                src:"images/point_label.png"
            }),
            text:new ol.style.Text({
                font:"24px Calibri,sans-serif",
                // textAlign:"center",
                padding:[20,20,20,20],
                fill:new ol.style.Fill({
                    color:"red"
                }),
                // text:"dfdsafdsf"
                offsetX:0,
                offsetY:-30
            })
        })
        var polygonStyle=new ol.style.Style({
            fill:new ol.style.Fill({
                color:'rgba(255,0,0,0.5)',
            }),
            stroke:new ol.style.Stroke({
                color:'red',
                width:2,
                lineDash:[1,2,3,4,5,6,7,8]
            }),
            image:new ol.style.Circle({
                radius:5,
                fill:new ol.style.Fill({
                    color:'#ffcc33'
                })
            }),
            text:new ol.style.Text({
                font:'14px Calibri,sans-serif',
                fill:new ol.style.Fill({
                    color:'red'
                })
            })
        }) 
        feature.setId(time);
        if(type=='Point'){
            feature.setStyle(pointStyle);
        }
        else{
            feature.setStyle(polygonStyle);
        }
        
        // gps_source_Vector_DrawLabel.addFeature(feature);
     
        //标注提示框
        $("#gps_label_popup_name").val("");
        $("#gps_label_popup_note").val("");
        
        // $(labelStr).attr("featureId",time);
        var overLay=addOverLay(target);
        overLay.setPosition(coord);
        map.removeInteraction(draw);

        gpsLabelFeatureMap[time]=feature;
        gpsLabelContentMap[time]={"x":thisFeatureCoord[0],"y":thisFeatureCoord[1]};
        console.log($("#gps_label_popup_close").attr("abc"));
        console.log($("#gps_label_popup_close").attr("abc")+"--"+time);
        $("#gps_label_popup_close").attr("featureID",time);
        $("#gps_label_popup_delete").attr("featureID",time);
        $("#gps_label_popup_save").attr("featureID",time);
        console.log($("#gps_label_popup_close").attr("featureID")+"--"+time);

    
    //标注关闭、保存事件
    if(firstPointLabel==0){
        firstPointLabel=1;
        $("#gps_label_popup_close").click(function(){
            $(target).addClass("isDisplay");
            if(!thisFeatureID){
                thisFeatureID=$(this).attr("featureID");
            }
            var info=gpsLabelContentMap[thisFeatureID];
            gpsLabelFeatureMap[thisFeatureID].getStyle().getText().setText(info.name);
            gps_source_Vector_DrawLabel.refresh();
        })
        $("#gps_label_popup_delete").click(function(){
            if(!thisFeatureID){
                thisFeatureID=$(this).attr("featureID");
            }
            $(target).addClass("isDisplay");
            if(gpsLabelFeatureMap[thisFeatureID]){
                gps_source_Vector_DrawLabel.removeFeature(gpsLabelFeatureMap[thisFeatureID]);
                gpsLabelContentMap[thisFeatureID]=null;
                gpsLabelFeatureMap[thisFeatureID]=null;
            }
            gps_source_Vector_DrawLabel.refresh();
        })
        $("#gps_label_popup_save").click(function(){
            if(!thisFeatureID){
                thisFeatureID=$(this).attr("featureID");
            }
            $(target).addClass("isDisplay");
            var name=$("#gps_label_popup_name").val();
            var note=$("#gps_label_popup_note").val();
            gpsLabelFeatureMap[thisFeatureID].getStyle().getText().setText(name);
            gpsLabelContentMap[thisFeatureID]["name"]=name;
            gpsLabelContentMap[thisFeatureID]["note"]=note;
            console.log("---++++++++--"+coord);
            gps_source_Vector_DrawLabel.refresh();
        })
    }
   
    })
    map.removeLayer(gps_layer_Vector_DrawLabel);
    return gps_layer_Vector_DrawLabel;
}

  
//添加信息弹框
var addOverLay=function(target){
    $(target).removeClass("isDisplay");
    var overLay=new ol.Overlay({
        element:target,
        offset:[0,-20],
        positioning:"bottom-center",
        autoPan:true,
        autoPanAnimate:{
            duration:250
        },
        autoPanMargin:20
    })
    map.addOverlay(overLay);
    return overLay;
}

//修改要素
var isModifyStatus=false;   //要素是否处于编辑状态，只要处于编辑状态时才能删除折点
var optionLayerType=null;   //图层要素操作类型  add  edit  delete
var layerType=null;     //图层类型，按照此字段区分图层
var layerName=null;     //图层名称，通过配置数据表发布的
var layerNameView=null;     //图层名称，通过配置视图发布的--与layerName的数据表一致
var optionType=null;   //标识右键触发各种操作类型
var modifiedFeatures=null;  //需要编辑的要素
var featureModify;  //要素编辑控件
var featureSelect;  //要素选择控件
var gps_layer_Vector_Modify=function(options){
    var options=options ? options : {};
    layerName=options.layerName ? options.layerName : '';
    layerNameView=options.layerNameView ? options.layerNameView : '';
    optionLayerType='edit';
    //初始化一个交互控件
    featureSelect=new ol.interaction.Select({
        condition:ol.events.condition.doubleClick
    });
    map.addInteraction(featureSelect);
    featureModify=new ol.interaction.Modify({
        features:featureSelect.getFeatures()
    })
    map.addInteraction(featureModify);
    //设置激活状态变更的处理
    // this.modifyEnd();
    featureModify.on('modifystart',function(evt){
        isModifyStatus=true;
        var geometry=evt.features.a[0].getGeometry();
        if(geometry.getType()==='Circle'){
            console.log("修改前的圆："+geometry.getCenter()+"--"+geometry.getRadius());
        }
        else{
            // console.log('修改前的经纬度：'+geometry.getCoordinates());
        }
    })
    featureModify.on('modifyend',function(evt){
        isModifyStatus=false;
        map.removeInteraction(featureSelect);
        var feature=evt.features.a[0];
        var geometry=evt.features.a[0].getGeometry();
        if(geometry.getType()==='Circle' && feature.get('class')==='circleSearch'){
            console.log("修改后的圆："+geometry.getCenter()+"--"+geometry.getRadius());
            var center=geometry.getCenter();
            var lastPoint=geometry.getLastCoordinate();
            var radius=gps_wgs84Sphere.haversineDistance(ol.proj.toLonLat(center),ol.proj.toLonLat(lastPoint)); 
            searchFeatureInCircle(center,radius);
        }
        else if(geometry.getType()==='Polygon'  && feature.get('class')==='regionSearch'){
            console.log('修改后的经纬度：'+geometry.getCoordinates());
            searchFeatureInPolygon(geometry.getCoordinates()[0]);
        }

        var geomType = evt.features.getArray()[0].getGeometry().getType().toLowerCase();  
        modifiedFeatures=evt.features;
    })
    return featureModify;
}
        
//删除要素
var gps_layer_Vector_Delete=function(options){
    var options=options ? options : {};
    layerName=options.layerName;
    layerNameView=options.layerNameView;
    optionLayerType='delete';
    //初始化一个交互控件
    featureSelect=new ol.interaction.Select({
        condition:ol.events.condition.click,
        style:new ol.style.Style({
            stroke:new ol.style.Stroke({
                color:'red',
                width:8
            })
        })
    });
    map.addInteraction(featureSelect);
};

//绘制点线面
var gps_drawGraphic;
var gps_drawGraphic_Points;
var gps_source_Vector_DrawGraphic=new ol.source.Vector({wrapX:false});
var gps_layer_Vector_DrawGraphic=new ol.layer.Vector({
    source:gps_source_Vector_DrawGraphic,
    style:new ol.style.Style({
        fill:new ol.style.Fill({
            color:'rgba(255,255,255,0.2)'
        }),
        stroke:new ol.style.Stroke({
            color:'#ffcc33',
            width:2
        }),
        image:new ol.style.Circle({
            radius:7,
            fill:new ol.style.Fill({
                color:'#ffcc33'
            })
        })
    })
});
// gps_layer_Vector_DrawGraphic.set('name','gps_layer_Vector_DrawGraphic');
var gps_tool_DrawGraphic=function(options){
    //将测量图层加入到map中，如果已存在，则不再添加
    map.removeLayer(gps_layer_Vector_DrawGraphic);
    map.addLayer(gps_layer_Vector_DrawGraphic);    
    /* var isExitLayer=false;
    $.each(map.getLayers().a,function(index,element){
        if(element.get('name')=='gps_layer_Vector_DrawGraphic'){
            isExitLayer=true;
        }
    });
    if(!isExitLayer){
        map.addLayer(gps_layer_Vector_DrawGraphic);
    } */
    optionLayerType='add';
    map.removeInteraction(gps_drawGraphic);
    var options=options ? options : {};
    drawType=options.drawType ? options.drawType : 'LineString';
    layerName=options.layerName ? options.layerName : '';
    var featureName=options.featureName ? options.featureName :'测试要素';
    var featureType=options.featureType ? options.featureType :'LINESTRING';
    var featureState=options.featureState ? options.featureState :1;
    var featureNote=options.featureNote ? options.featureNote :'备注';
    var featureLength=options.featureLength ? options.featureLength :10;
    var featureArea=options.featureArea ? options.featureArea :20;
    var addRole=options.addRole ? options.addRole :'1';
    var editRole=options.editRole ? options.editRole :'1';
    var deleteRole=options.deleteRole ? options.deleteRole :'1';
    var selectRole=options.selectRole ? options.selectRole :'1';
    layerType=options.layerType ? options.layerType :layerParsList[0];
    if(drawType!=='None'){
        var geometryFunction,maxPoints;
        if(drawType==='Square'){
            drawType="Circle";
            geometryFunction=ol.interaction.Draw.createRegularPolygon(4);
        }else if(drawType==='Box'){
            drawType='LineString';
            maxPoints=2;
            //设置几何信息变更函数，即设置长方形的坐标点
            geometryFunction=function(coordinates,geometry){
                if(!geometry){
                    geometry=new ol.geom.Polygon(null);
                }
                var start=coordinates[0];
                var end=coordinates[1];
                geometry.setCoordinates([[start,[start[0],end[1]],end,[end[0],start[1]],start]]);
                return geometry;
            }
        }
        //实例化交互绘制对象并添加到地图容器中
        gps_drawGraphic=new ol.interaction.Draw({
            source:gps_source_Vector_DrawGraphic,
            type:drawType,
            geometryFunction:geometryFunction,  //几何信息变更时的回调函数
            maxPoints:maxPoints
        });
        gps_drawGraphic.on('drawend',function(evt){
            var feature =evt.feature;
            map.removeInteraction(gps_drawGraphic);
            var style=new ol.style.Style({
                fill:new ol.style.Fill({
                    color:'rgba(255,0,0,0.5)',
                }),
                stroke:new ol.style.Stroke({
                    color:'red',
                    width:2,
                    lineDash:[1,2,3,4,5,6,7,8]
                }),
                image:new ol.style.Circle({
                    radius:5,
                    fill:new ol.style.Fill({
                        color:'red'
                    })
                }),
                text:new ol.style.Text({
                    font:'14px Calibri,sans-serif',
                    fill:new ol.style.Fill({
                        color:'red'
                    })
                })
            }) 
            feature.setStyle(style);
            feature.set('name',featureName);
            feature.set('type',featureType);
            feature.set('state',featureState);
            feature.set('note',featureNote);
            feature.set('length',featureLength);
            feature.set('area',featureArea);
            feature.set('add',addRole);
            feature.set('edit',editRole);
            feature.set('delete',deleteRole);
            feature.set('select',selectRole);
            feature.set('uuid',layerType);
            modifiedFeatures=feature;
            //保存绘制点线面
            saveFeatureOption();
        })
        map.addInteraction(gps_drawGraphic);
        return gps_drawGraphic;
    }
}
 

/*
 检索要素 
*/
var search_circle_element=null;
var search_circle_overlay=null;
var search_circle_feature=null;
var searchCircleMap={};
var firstToolTip=true;

// var editRadiuTarget=$(editRadiuStr)[0];
//创建周边检索半径提示框
function createRadiusToolTip(){
    var editRadiuStr='<div style="width:50px;"><div><span>修改半径:</span><input class="circle_radius_num"/><span>km</span></div>'
                    +'<div><button class="circle_radius_cancle btm_white_but">取消</button><button class="circle_radius_save btm_white_but">保存</button></div></div>';
    var thisTime=new Date().getTime();
    search_circle_element=document.createElement('div');
    search_circle_element.className='search_feature_tooltip';
    search_circle_element.setAttribute('featureID',thisTime);
    search_circle_overlay=new ol.Overlay({
        element:search_circle_element,
        positioning:'center-left',
        autoPan:true,
        offset:[10,0]
    })
    map.addOverlay(search_circle_overlay);

 /*    // if(search_circle_element && firstToolTip){
        $(search_circle_element).click(function(){
            var thisFeatureID=$(this).attr('featureID');
            $(editRadiuStr).removeClass('hidden');
            $(editRadiuStr).find('.circle_radius_num').val(searchCircleMap[thisFeatureID].radius);
            search_circle_overlay.setElement($(editRadiuStr)[0]);
            // search_circle_overlay.setPosition(searchCircleMap[thisFeatureID].center);
           
        })
         //取消  保存
         $(editRadiuStr).find('.circle_radius_cancle').click(function(){
            search_circle_overlay.setElement(search_circle_element);
        })
        $(editRadiuStr).find('.circle_radius_save').click(function(){
            search_circle_element.innerHTML=$(editRadiuStr).find('.circle_radius_num').val();
            search_circle_overlay.setElement(search_circle_element);
        })
        firstToolTip=false;
    // } */
    return thisTime;
}

//选中后的点样式
var searchFeatureStyle=new ol.style.Style({
    fill:new ol.style.Fill({
        color:'rgba(255,0,0,0.1)',
    }),
    stroke:new ol.style.Stroke({
        color:'red',
        width:2,
        lineDash:[1,2,3,4,5,6,7,8]
    }),
    image:new ol.style.Circle({
        radius:20,
        fill:new ol.style.Fill({
            color:'#ffcc33'
        })
    }),
    text:new ol.style.Text({
        font:'14px Calibri,sans-serif',
        fill:new ol.style.Fill({
            color:'red'
        })
    })
})

//周边检索时的圆心
var circlePointStyle=new ol.style.Style({
    /* image:new ol.style.Icon({
        src:'images/circlePoint.png'
    }) */
    image:new ol.style.Circle({
       radius:3,
       fill:new ol.style.Fill({
        color:'red'
       })
    })
})

//周边检索
var gps_source_Vector_SearchCircleFeature=function(options){
    map.removeInteraction(gps_drawGraphic);
    map.removeLayer(gps_layer_Vector_DrawGraphic);
    map.addLayer(gps_layer_Vector_DrawGraphic);
    var type=options.type ? options.type : 'Circle';
    search_feature_source=options.source ? options.source : '';
    originalStyle=options.originalStyle ? options.originalStyle : '';
    changedStyle=options.changedStyle ? options.changedStyle : '';
    

    gps_drawGraphic=new ol.interaction.Draw({
        source:gps_source_Vector_DrawGraphic,
        type:type,
    })
    //创建半径大小提示框
    var thisFeatureID=createRadiusToolTip();
    //注册鼠标移动事件
    map.on('pointermove',pointerMoveFeatureTooltip);
    //开始绘制时记录该要素
    gps_drawGraphic.on('drawstart',function(evt){
        
        search_circle_feature=evt.feature;
        search_circle_feature.set('type','search_feature_circle');
        console.log('开始绘制的圆心：');
        var coordinates=search_circle_feature.getGeometry().A;
        console.log([coordinates[0],coordinates[1]]);
        var feature=new ol.Feature({
            geometry:new ol.geom.Point([coordinates[0],coordinates[1]])
        })
        feature.setStyle(circlePointStyle);
        gps_source_Vector_DrawGraphic.addFeature(feature);
        search_circle_feature.getGeometry().on('change',function(evt){
            var target=evt.target;
            var center=target.getCenter();
            var radius=target.getRadius(); 
            var extent=target.getExtent();
            var lastPoint=target.getLastCoordinate();
            var firstPoint=target.getFirstCoordinate();
            var length=gps_wgs84Sphere.haversineDistance(ol.proj.toLonLat(center),ol.proj.toLonLat(lastPoint));    
            length=(length/1000).toFixed(1);
            search_circle_element.innerHTML=length+'km';
            if(isModifyStatus){
                search_circle_overlay.setPosition(lastPoint);
            }
        })
    })

    //绘制结束计算圆内全部地理要素
    gps_drawGraphic.on('drawend',function(evt){
        var feature=evt.feature;
        feature.set('class','circleSearch');
        var center=feature.getGeometry().getCenter();
        var lastPoint=feature.getGeometry().getLastCoordinate();
        var radius=gps_wgs84Sphere.haversineDistance(ol.proj.toLonLat(center),ol.proj.toLonLat(lastPoint)); 
        searchCircleMap[thisFeatureID]={'radius':(radius/1000).toFixed(1),'center':center};
        feature.setStyle(searchFeatureStyle);
        map.removeInteraction(gps_drawGraphic);
        map.un('pointermove',pointerMoveFeatureTooltip);
        var allSearchFeatures=search_feature_source.getFeatures();
        
        searchFeatureInCircle(center,radius);
    })
    map.addInteraction(gps_drawGraphic);
    return gps_drawGraphic;
}

function pointerMoveFeatureTooltip(evt){
    if(evt.dragging){
        return;
    }
    var coordinate=evt.coordinate;
    if(search_circle_feature){
        var geom=search_circle_feature.getGeometry();
        if(geom instanceof ol.geom.Circle){
            search_circle_overlay.setPosition(coordinate);
        }
    }
}

//区域检索
var gps_source_Vector_SearchPolygonFeature=function(options){
    map.removeInteraction(gps_drawGraphic);
    map.removeLayer(gps_layer_Vector_DrawGraphic);
    map.addLayer(gps_layer_Vector_DrawGraphic);
    var lonArray=[];
    var latArray=[];
    var options=options ? options : {};
    var type=options.type ? options.type : 'Polygon';
    search_feature_source=options.source ? options.source : '';
    originalStyle=options.originalStyle ? options.originalStyle : '';
    changedStyle=options.changedStyle ? options.changedStyle : '';
    //实例化交互绘制对象并添加到地图容器中
    gps_drawGraphic=new ol.interaction.Draw({
        source:gps_source_Vector_DrawGraphic,
        type:type
    })
    gps_drawGraphic.on('drawend',function(evt){
        var feature =evt.feature;
        feature.set('class','regionSearch');
        feature.setStyle(searchFeatureStyle);
        map.removeInteraction(gps_drawGraphic);

        var coordinates=feature.getGeometry().getCoordinates()[0];
        searchFeatureInPolygon(coordinates);
    })
    map.addInteraction(gps_drawGraphic);
    return gps_drawGraphic;
}

//判断点是否在多边形内
function isInPolygon(checkPoint, polygonPoints) {  
    var counter = 0;  
    var i;  
    var xinters;  
    var p1, p2;  
    var pointCount = polygonPoints.length;  
    p1 = polygonPoints[0];  
  
    for (i = 1; i <= pointCount; i++) {  
        p2 = polygonPoints[i % pointCount];  
        if (  
            checkPoint[0] > Math.min(p1[0], p2[0]) &&  
            checkPoint[0] <= Math.max(p1[0], p2[0])  
        ) {  
            if (checkPoint[1] <= Math.max(p1[1], p2[1])) {  
                if (p1[0] != p2[0]) {  
                    xinters =  
                        (checkPoint[0] - p1[0]) *  
                            (p2[1] - p1[1]) /  
                            (p2[0] - p1[0]) +  
                        p1[1];  
                    if (p1[1] == p2[1] || checkPoint[1] <= xinters) {  
                        counter++;  
                    }  
                }  
            }  
        }  
        p1 = p2;  
    }  
    if (counter % 2 == 0) {  
        return false;  
    } else {  
        return true;  
    }  
}  

//判断多边形内的要素
function searchFeatureInPolygon(coordinates){
    let selectSearchFeatures=[];
    var allSearchFeatures=search_feature_source.getFeatures();
  /*   两次过滤
  var coordinates=feature.getGeometry().getCoordinates()[0];
    $.each(coordinates,function(index,element){
        lonArray.push(element[0]);
        latArray.push(element[1]);
    })
    var minLon=Math.min.apply(null,lonArray);
    var maxLon=Math.max.apply(null,lonArray);
    var minLat=Math.min.apply(null,latArray);
    var maxLat=Math.max.apply(null,latArray);
    var allSearchFeatures=search_feature_source.getFeaturesInExtent([minLon,minLat,maxLon,maxLat]);
    var selectStyle=new ol.style.Style({
        image:new ol.style.Circle({
            radius:10,
            fill:new ol.style.Fill({
                color:'blue'
            })
        })
    }) */
    $.each(allSearchFeatures,function(index,element){
        var point =element.getGeometry().getCoordinates();
        if(isInPolygon(point,coordinates)){
            element.setStyle(changedStyle);
            search_feature_source.refresh();
            selectSearchFeatures.push(element);
        }else{
            // element.setStyle(originalStyle);
            // search_feature_source.refresh();
        }
    })
    return selectSearchFeatures; 
}

//判断圆形内的要素
function searchFeatureInCircle(center,radius){
    let selectSearchFeatures=[];
    var allSearchFeatures=search_feature_source.getFeatures();
    $.each(allSearchFeatures,function(idnex,element){
        var length=gps_wgs84Sphere.haversineDistance(ol.proj.toLonLat(element.getGeometry().getCoordinates()),ol.proj.toLonLat(center));
        if(length<=radius){
            element.setStyle(changedStyle);
            search_feature_source.refresh();
            selectSearchFeatures.push(element);
        }else{
            // element.setStyle(originalStyle);
            // search_feature_source.refresh();
        }
    }) 
    return selectSearchFeatures; 
}

var clusterstyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: '#fff'
      }),
      fill: new ol.style.Fill({
        color: 'red'
      })
    }),
    text: new ol.style.Text({
      text: '',
      fill: new ol.style.Fill({
        color: '#fff'
      })
    })
  });


/* 聚合功能 */
 var gps_layer_Vector_Cluster=function(options){
    var options=options ? options : {};
    var distance=options.distance ? options.distance : 20;
    // var style=options.style ? options.style : '';

    var coordinates=options.coordinates ? options.coordinates : [];
    var features=[];
    $.each(coordinates,function(index,element){
        var feature=new ol.Feature(new ol.geom.Point(element));
        feature.set('type','cluster');
        features.push(feature);
    })

    var source = new ol.source.Vector({
      features: features
    });

    var clusterSource = new ol.source.Cluster({
      distance: distance,
      source: source
    });
    var styleCache = {};
    var clustersLayer = new ol.layer.Vector({
      source: clusterSource,
       style: function(feature) {
        var size = feature.get('features').length;
        var thisColor='#3399CC';
        var thisRadius=10;
        if(size>10 && size<50){
            thisColor='yellow';
            thisRadius=12;
        }
        else if(size>50){
            thisColor='red';
            thisRadius=15;
        }
        var style = styleCache[size];
        if (!style) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                  radius: thisRadius,
                  stroke: new ol.style.Stroke({
                    color: '#fff'
                  }),
                  fill: new ol.style.Fill({
                    color: thisColor
                  })
                }),
                text: new ol.style.Text({
                  text: size>1 ? size.toString() :'',
                  fill: new ol.style.Fill({
                    color: '#fff'
                  })
                })
              });
              styleCache[size] = style;
        }
        return style;
      }  
    });
    // map.addLayer(clustersLayer);
    return clustersLayer;
} 

/* 热力图功能 */
var gps_layer_Vector_HeatMap=function(options){
    var options=options ? options : {};
    var distance=options.distance ? options.distance : 20;
    var coordinates=options.coordinates ? options.coordinates : [];
    var blur=options.blur ? options.blur : 15;
    var radius=options.radius ? options.radius : 5;

    var features=[];
    $.each(coordinates,function(index,element){
        features.push(new ol.Feature(new ol.geom.Point(element)));
    })

    var source = new ol.source.Vector({
      features: features
    });

    var heatMapLayer = new ol.layer.Heatmap({
      source: source,
      blur:blur,
      radius:radius
    });
    // map.addLayer(clustersLayer);
    return heatMapLayer; 
} 

//加载wfs服务
var wfsGeometryFeild=null;
var serverUrl=null;
var workspace=null;
var gps_layer_Vector_WFS=function(options){
    var options=options ? options : {};
    wfsGeometryFeild=options.geom ? options.geom : '';
    serverUrl=options.serverUrl ? options.serverUrl : '';
    workspace=options.workspace ? options.workspace : '';
    var url=options.url ? options.url : '';
    var style=options.style ? options.style : '';
    var wfsVectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON({
                geometryName: 'geometry'
            }),  
            url:url
        }),
        style: style
      });
    return wfsVectorLayer;
};
   
//保存图层要素
function saveFeatureOption(){
    var message='';
    if(optionLayerType=='add'){
        message='确定要保存新增的要素吗？';
    }
    else  if(optionLayerType=='edit'){
       message='确定要保存编辑的要素吗？';
    }
    else if(optionLayerType=='delete'){
       message='确定删除选中的要素吗？';
    }

   $.Ewin().confirm({ message:message }).on(function (e) {
       if (e) {
           var thisFeature;
           //如果是编辑要素
           if ('getLength' in modifiedFeatures && modifiedFeatures.getLength() > 0) {
                thisFeature = modifiedFeatures.item(0).clone();
               // 注意ID是必须，通过ID才能找到对应修改的feature
               var id=modifiedFeatures.item(0).getId();
               id=id.replace(layerNameView,layerName);
               thisFeature.setId(id);
               //设置几何字段名称，与数据库中一致
            //    thisFeature.set(wfsGeometryFeild,modifiedFeatures.getGeometry());            
            }
            //如果是新绘制要素
            else{
                thisFeature=modifiedFeatures;
            }
            var coordinate=thisFeature.getGeometry().getCoordinates();
            var geoType=thisFeature.getGeometry().getType();
            if(geoType=='Point'){
                coordinate=ol.proj.toLonLat(coordinate);
            }
            else if(geoType=='LineString'){
                coordinate.forEach(function(element,index){
                    coordinate[index]=ol.proj.toLonLat(element);
                });
            }
            else if(geoType=='Polygon'){
                coordinate[0].forEach(function(element,index){
                    coordinate[0][index]=ol.proj.toLonLat(element);
                });
            }
            thisFeature.getGeometry().setCoordinates(coordinate);
            // 调换经纬度坐标，以符合wfs协议中经纬度的位置
            thisFeature.getGeometry().applyTransform(function(flatCoordinates, flatCoordinates2, stride) {
                for (var j = 0; j < flatCoordinates.length; j += stride) {
                var y = flatCoordinates[j];
                var x = flatCoordinates[j + 1];
                flatCoordinates[j] = x;
                flatCoordinates[j + 1] = y;
                }
            });
            modifyWfs([thisFeature]);
       }
       else{
           return;
       }
   }); 
}
  // 把修改提交到服务器端
  function modifyWfs(features) {
    var WFSTSerializer = new ol.format.WFS();
    //编辑要素
    if(optionLayerType==='edit'){
        var featObject = WFSTSerializer.writeTransaction(null,
            features, null, {
            featureType: layerName, 
            // featureNS: 'http://geoserver.org/Test',  // 注意这个值必须为创建工作区时的命名空间URI
            featureNS:'Test',   //此值必须为创建工作区时的命令空间URL
            srsName: 'EPSG:4326'
          });
    }
    //删除要素
   else if(optionLayerType==='delete'){
    var featObject = WFSTSerializer.writeTransaction(null,
        null, features, {
        featureType: layerName, 
        // featureNS: 'http://geoserver.org/Test',  // 注意这个值必须为创建工作区时的命名空间URI
        featureNS:'Test',   //此值必须为创建工作区时的命令空间URL
        srsName: 'EPSG:4326'
      });
   }
   //新增要素
   else if(optionLayerType==='add'){
    var featObject = WFSTSerializer.writeTransaction(features,
        null, null, {
        featureType: layerName, 
        // featureNS: 'http://geoserver.org/Test',  // 注意这个值必须为创建工作区时的命名空间URI
        featureNS:'Test',   //此值必须为创建工作区时的命令空间URL
        srsName: 'EPSG:4326'
      });
   }
    // 转换为xml内容发送到服务器端
    var serializer = new XMLSerializer();
    var featString = serializer.serializeToString(featObject);
    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:8080/geoserver/wfs?service=wfs');
    // 指定内容为xml类型
    request.setRequestHeader('Content-Type', 'text/xml');
    request.send(featString);
    request.onreadystatechange=function(){
        if(request.readyState==4 && request.status==200){
            $.each(map.getLayers().a,function(index,element){
                if(layerParsList.indexOf(element.get('name'))!=-1){
                    element.getSource().clear();
                    element.getSource().refresh();
                }
            });
            alert('操作成功！');
        }
    }
  }


//提示是否确认修改
(function ($) {
     $.extend({
        Ewin : function () {
            var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
                                  '<div class="modal-dialog modal-sm">' +
                                      '<div class="modal-content">' +
                                          '<div class="modal-header hidden" >' +
                                              '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                                              '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
                                          '</div>' +
                                          '<div class="modal-body">' +
                                          '<p>[Message]</p>' +
                                          '</div>' +
                                           '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>' +
        '</div>' +
                                      '</div>' +
                                  '</div>' +
                              '</div>';
    
    
            var dialogdHtml = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
                                  '<div class="modal-dialog">' +
                                      '<div class="modal-content">' +
                                          '<div class="modal-header hidden">' +
                                              '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                                              '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
                                          '</div>' +
                                          '<div class="modal-body">' +
                                          '</div>' +
                                      '</div>' +
                                  '</div>' +
                              '</div>';
            var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
            var generateId = function () {
                var date = new Date();
                return 'mdl' + date.valueOf();
            }
            var init = function (options) {
                options = $.extend({}, {
                    title: "操作提示",
                    message: "提示内容",
                    btnok: "确定",
                    btncl: "取消",
                    width: 200,
                    auto: false
                }, options || {});
                var modalId = generateId();
                var content = html.replace(reg, function (node, key) {
                    return {
                        Id: modalId,
                        Title: options.title,
                        Message: options.message,
                        BtnOk: options.btnok,
                        BtnCancel: options.btncl
                    }[key];
                });
                $('body').append(content);
                $('#' + modalId).modal({
                    width: options.width,
                    backdrop: 'static'
                });
                $('#' + modalId).on('hide.bs.modal', function (e) {
                    $('body').find('#' + modalId).remove();
                });
                return modalId;
            }
    
            return {
                alert: function (options) {
                    if (typeof options == 'string') {
                        options = {
                            message: options
                        };
                    }
                    var id = init(options);
                    var modal = $('#' + id);
                    modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
                    modal.find('.cancel').hide();
    
                    return {
                        id: id,
                        on: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.find('.ok').click(function () { callback(true); });
                            }
                        },
                        hide: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.on('hide.bs.modal', function (e) {
                                    callback(e);
                                });
                            }
                        }
                    };
                },
                confirm: function (options) {
                    var id = init(options);
                    var modal = $('#' + id);
                    modal.find('.ok').removeClass('btn-primary').addClass('btn-success');
                    modal.find('.cancel').show();
                    return {
                        id: id,
                        on: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.find('.ok').click(function () { callback(true); });
                                modal.find('.cancel').click(function () { callback(false); });
                            }
                        },
                        hide: function (callback) {
                            if (callback && callback instanceof Function) {
                                modal.on('hide.bs.modal', function (e) {
                                    callback(e);
                                });
                            }
                        }
                    };
                },
                dialog: function (options) {
                    options = $.extend({}, {
                        title: 'title',
                        url: '',
                        width: 800,
                        height: 550,
                        onReady: function () { },
                        onShown: function (e) { }
                    }, options || {});
                    var modalId = generateId();
    
                    var content = dialogdHtml.replace(reg, function (node, key) {
                        return {
                            Id: modalId,
                            Title: options.title
                        }[key];
                    });
                    $('body').append(content);
                    var target = $('#' + modalId);
                    target.find('.modal-body').load(options.url);
                    if (options.onReady())
                        options.onReady.call(target);
                    target.modal();
                    target.on('shown.bs.modal', function (e) {
                        if (options.onReady(e))
                            options.onReady.call(target, e);
                    });
                    target.on('hide.bs.modal', function (e) {
                        $('body').find(target).remove();
                    });
                }
            }
        }
     })}(jQuery));  

var ddfdf=function (){
    console.log('dfdf');
}
/* var select = new ol.interaction.Select();
var modify = new ol.interaction.Modify({
    features:select.getFeatures()
});
map.addInteraction(select);
map.addInteraction(modify);
select.setActive(false);
modify.setActive(false);
$("#modifyFeature").click(function(){
    select.setActive(true);
    modify.setActive(true);
})
modify.on("modifyend",function(evt){
    alert(evt.feature.getGeometry().getCoordinates());
})
 */
/* //地图鹰眼
var overviewMapControl=new ol.control.OverviewMap({
    className:"ol-overviewmap ol-custom-overviewmap",
    //在鹰眼中加载相同坐标系下不同数据源的图层
    // layers:[gaode_wx],
    collapseLabel:"\u00BB", //展开时功能按钮上的标识
    label:"\u00AB",         //折叠时功能按钮上的标识
    collapsed:false         //初始化为展开方式
})
map.addControl(overviewMapControl); */


/*
//鼠标拖动旋转地图
var dragRotateAndZoom=new ol.interaction.DragRotateAndZoom({
    condition:ol.events.condition.always,
    out:false
})
map.addInteraction(dragRotateAndZoom);
dragRotateAndZoom.setActive(false);
$("#dragRotateAndZoom").click(function(){
    $(this).append($(".ol-rotate"));
    dragRotateAndZoom.setActive(true);
})


//全屏
var fullScreen=new ol.control.FullScreen({
    className:"position-relative",
    target:document.getElementById("fullScreen")
});
map.addControl(fullScreen);






//监听地图分辨率改变
var resolutionChangeEvent=function(){
    console.log("当前地图层级："+map.getView().getZoom());
    // console.log("当前地图分辨率："+map.getView().getResolutionForExtent());
    console.log("当前地图分辨率："+map.getView().getResolution());
}
map.getView().on("change:resolution",function(){
    resolutionChangeEvent();
})

//地图双击事件
map.on("dblclick",function(){
    select.setActive(false);
    modify.setActive(false);
})
 */
