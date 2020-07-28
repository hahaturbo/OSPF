$(function () {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // JTopo 创建舞台和场景对象
  var stage = new JTopo.Stage(canvas);
  var scene = new JTopo.Scene(stage);

  var currentNode = null;
  var currentLink = null;
  // 点集以及边集
  var routerNodes = [];
  var links = [];

  var currentTopology = {};

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
      var y = Math.floor(n / x);
    for (var i = 0; i < n; i++) {
      x = (window.innerWidth / x) * i;
      y = (window.innerHeight / y) * i;
		var router = newRouter(currentTopology[i].name, x, y);
		router.addEventListener("mouseup", function (event) {
			currentNode = this;
			routerMeunShow(event);
		});
		routerNodes.push(router);
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
	//路由器右键菜单
	function routerMeunShow(event) {
		if (event.button == 2) {
		  // 右键
		  // 当前位置弹出菜单（div）
		  $(".routerMeun")
			.css({
			  top: event.pageY,
			  left: event.pageX,
			})
			.show();
		
  // 主体
  ini();
  drawTopology();
});
