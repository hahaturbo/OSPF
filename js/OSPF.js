$(function () {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // JTopo 创建舞台和场景对象
  var stage = new JTopo.Stage(canvas);
  var scene = new JTopo.Scene(stage);
  //背景图片
  scene.background = "./img/bg.jpg";
  var currentNode = null;
  var currentLink = null;
  // 点集以及边集
  var routerNodes = [];
  var links = [];

  // var currentTopology = {};

  // min <=  < max
  function ramdomNum(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  // 随机生成拓扑信息
  function romTopology() {
    n = ramdomNum(50, 100);
    e = ramdomNum(1, Math.floor((n * (n - 1)) / 2));
    var array = new Array(n);
    for (var i = 0; i < array.length; i++) {
      array[i] = new Array(n);
      for (var j = 0; j < array[i].length; j++) {
        array[i][j] = 0;
      }
    }
    // for (var i = 0; i < n; i++) {
    //   var count = 0;
    //   for (var j = 0; j < n; j++) {
    //     if (i == j) continue;
    //     if (array[j][i] != 0) {
    //       array[i][j] = array[j][i];
    //     } else {
    //       if (count < e) {
    //         array[i][j] = ramdomNum(1, 100);
    //         count++;
    //       }
    //     }
    //   }
    // }
    console.time();
    for (var i = 0; i < e; ) {
      var j = ramdomNum(0, n);
      var k = ramdomNum(0, n);
      if (j != k) {
        if (array[j][k] == 0 && array[k][j] == 0) {
          array[j][k] = array[k][j] = ramdomNum(0, 100);
          i++;
        }
      }
    }
    console.timeEnd()
    function adjacent(array) {
      var adj = {};
      for (var i = 0; i < array.length; i++) {
        if (array[i] != 0) {
          adj["route" + i] = array[i];
          //   adj = JSON.parse(JSON.stringify(adj).replace(/route/g, "route" + i));
        }
      }
      return adj;
    }
    for (var i = 0; i < n; i++) {
      currentTopology[i] = {};
      currentTopology[i].name = "route" + i;
      currentTopology[i].adjacent = adjacent(array[i]);
    }
  }

  // 画拓扑结构
  function drawTopology() {
    var x = Math.ceil(Math.sqrt(n));
    var y = Math.ceil(n / x);
    console.log(n, x, y);
    for (var i = 0; i < n; i++) {
      var X = 30 + (window.innerWidth / x) * (i % x);
      var Y = 30 + (window.innerHeight / y) * Math.floor(i / x);
      var router = newRouter(currentTopology[i].name, X, Y);
      router.addEventListener("mouseup", function (event) {
        currentNode = this;
        routerMeunShow(event);
      });
      routerNodes.push(router);
    }
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        var cost = currentTopology[i].adjacent[currentTopology[j].name];
        if (cost) {
          var link = newLink(routerNodes[i], routerNodes[j], cost);
          link.addEventListener("mouseup", function (event) {
            currentLink = this;
            edgeMeunShow(event);
          });
          links.push(link);
        }
      }
    }
  }

  //绘制路由器
  function newRouter(name, X, Y) {
    var node = new JTopo.Node(name);
    node.setImage("img/router.png");
    node.setLocation(X, Y);
    node.setSize(20, 20);
    node.font = "20px Arial";
    node.showSelected = false; // 不显示选中矩形
    scene.add(node);
    return node;
  }
  //连线
  function newLink(nodeA, nodeZ, text) {
    var link = new JTopo.Link(nodeA, nodeZ, text);
    link.lineWidth = 5; // 线宽
    link.font = "20px SimHei";
    scene.add(link);
    return link;
  }
  //路由器右键菜单
  function routerMeunShow(event) {
    if (event.button == 2) {
      // 右键
      $(".edgeMeun").hide();
      // 当前位置弹出菜单（div）
      $(".routerMeun")
        .css({
          top: event.pageY,
          left: event.pageX,
        })
        .show();
    }
  }
  //边右键菜单
  function edgeMeunShow(event) {
    if (event.button == 2) {
      // 右键
      $(".routerMeun").hide();
      // 当前位置弹出菜单（div）
      $(".edgeMeun")
        .css({
          top: event.pageY,
          left: event.pageX,
        })
        .show();
    }
  }
  $(".contextmenu a").click(function (event) {
    var text = $(this).text();
    switch (text) {
      case "连接":
        console.log("连接");
        break;
      case "查看路由表":
        console.log("查看路由表");
        break;
      case "删除该路由":
        console.log("删除该路由");
        break;
      case "修改代价":
        console.log("修改代价");
        break;
      case "删除该连接":
        console.log("删除该连接");
        break;
    }
    $(".contextmenu").hide();
  });
  // 主体
  romTopology();
  ini();
  drawTopology();
});
