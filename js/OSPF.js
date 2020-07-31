$(function () {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // JTopo 创建舞台和场景对象
  var stage = new JTopo.Stage(canvas);
  stage.wheelZoom = 1.2;
  stage.eagleEye.visible = true;
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
    n = ramdomNum(10, 20);
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
    console.timeEnd();
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
      var temp = {};
      temp.name = "route" + i;
      temp.adjacent = adjacent(array[i]);
      currentTopology.push(temp);
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
      var router = new newRouter(currentTopology[i].name, X, Y);
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
          var link = new newLink(routerNodes[i], routerNodes[j], cost);
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
  // 手动连线
  function drawLink(event) {
    var beginNode = currentNode;
    var tempNodeA = currentNode;
    var tempNodeZ = new JTopo.Node("tempZ");
    tempNodeZ.setSize(1, 1);
    tempNodeZ.setLocation(event.x, event.y);

    var link = new newLink(tempNodeA, tempNodeZ);

    scene.mouseup(function (event) {
      if (event.button == 2 || beginNode == null) {
        scene.remove(link);
        return;
      }
      if (event.target != null && event.target instanceof JTopo.Node) {
        if (beginNode !== event.target) {
          var endNode = event.target;
          var isExist = false; //新的线是否存在
          for (var i = 0; i < e; i++) {
            if (
              links[i].nodeA.text == beginNode.text &&
              links[i].nodeZ.text == endNode.text
            ) {
              isExist = true;
              break;
            } else if (
              links[i].nodeZ.text == beginNode.text &&
              links[i].nodeA.text == endNode.text
            ) {
              isExist = true;
              break;
            }
          }
          // 线不存在，连线
          if (!isExist) {
            isExist = false;
            var l = new newLink(beginNode, endNode);
            l.addEventListener("mouseup", function (event) {
              currentLink = this;
              edgeMeunShow(event);
            });
            currentTopology[getIndex(beginNode.text)].adjacent[
              endNode.text
            ] = 0;
            currentTopology[getIndex(endNode.text)].adjacent[
              beginNode.text
            ] = 0;
            e++;
            buildTopology();
            $(".cost").val("");
            $(".editCost").show();
            links.push(l);
            currentLink = l;
          }
          beginNode = null;
          scene.remove(link);
        } else {
          beginNode = null;
          scene.remove(link);
        }
      } else {
        beginNode = null;
        scene.remove(link);
      }
    });

    scene.mousemove(function (event) {
      tempNodeZ.setLocation(event.x, event.y);
    });
  }
  //拖动窗口移动
  $(".routerTable,.editCost,.inputRouter").mousedown(function (event) {
    var obj = $(this);
    var isMove = true;
    var mouseDownPosiX = event.pageX;
    var mouseDownPosiY = event.pageY;
    var InitPositionX = obj.css("left").replace("px", "");
    var InitPositionY = obj.css("top").replace("px", "");

    $(document)
      .mousemove(function (event) {
        if (isMove) {
          var tempX =
            parseInt(event.pageX) -
            parseInt(mouseDownPosiX) +
            parseInt(InitPositionX);
          var tempY =
            parseInt(event.pageY) -
            parseInt(mouseDownPosiY) +
            parseInt(InitPositionY);
          obj.css("left", tempX + "px").css("top", tempY + "px");
        }
      })
      .mouseup(function () {
        isMove = false;
      });
  });
  //查看路由表
  function showRouterTable() {
    $(".table").remove();
    var html = "";
    var num = 0;
    var routerTable = routers[getIndex(currentNode.text)];
    var table = $(document.createElement("table"));
    table.addClass("table");
    html +=
      "<thead><tr><th>源路由</th><th>目的路由</th><th>下一跳</th><th>最短路径</th><th>总代价</th></tr></thead>";
    html += "<tbody>";

    for (var key in routerTable.information) {
      if (routerTable.information.hasOwnProperty(key) === true) {
        if (getCost(routerTable, key) == Infinity) {
          continue;
        }
        var path = getPath(routerTable, key);
        var s = "";
        for (var i = 0; i < path.length; i++) {
          s += path[i];
          if (i != path.length - 1) {
            s += "->";
          }
        }
        html += "<tr><td>" + path[0] + "</td>";
        html += "<td>" + key + "</td>";
        html += "<td>" + path[1] + "</td>";
        html += "<td class='patha '>" + s + "</td>";
        html += "<td>" + getCost(routerTable, key) + "</td></tr>";
        num++;
      }
    }
    if (num == 0) {
      html += "<tr><td colspan='5'>该路由器不在自治系统内！</td></tr>";
    }

    html += "</tbody>";
    table.append(html);

    $(".routerTable").append(table);
    $(".routerTable").show();
  }
  //点击关闭
  $(".routerTable .cancel").click(function (event) {
    event.preventDefault();
    $(".routerTable").hide();
  });
  $(".editCost .cancel").click(function (event) {
    event.preventDefault();
    $(".editCost").hide();
  });
  $(".inputRouter .cancel").click(function (event) {
    event.preventDefault();
    $(".inputRouter").hide();
  });
  //输入代价后点击确定
  $(".cost_enter").click(function () {
    var cost = $(".cost").val();
    if (!isNaN(cost) && cost.length != 0) {
      currentTopology[getIndex(currentLink.nodeA.text)].adjacent[
        currentLink.nodeZ.text
      ] = cost;
      currentTopology[getIndex(currentLink.nodeZ.text)].adjacent[
        currentLink.nodeA.text
      ] = cost;
      buildTopology();
      // currentLink.text = cost;
      $(".editCost").hide();
    }
  });
  //输入路由器名称后确定
  $(".name_enter").click(function () {
    var name = $(".routerName").val();
    if (name.length == 0) {
      return;
    }
    var router = new newRouter(
      name,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    router.addEventListener("mouseup", function (event) {
      currentNode = this;
      routerMeunShow(event);
    });
    currentTopology.push({ name: name, adjacent: {} });
    n++;
    buildTopology();
    routerNodes.push(router);
    $(".inputRouter").hide();
  });
  //左键隐藏菜单
  stage.click(function (event) {
    if (event.button == 0) {
      // 左键
      // 关闭弹出菜单（div）
      $(".contextmenu").hide();
    }
  });
  // 右键功能菜单
  $(".contextmenu a").click(function (event) {
    var text = $(this).text();
    switch (text) {
      case "连接":
        drawLink(event);
        console.log("连接");
        break;
      case "查看路由表":
        showRouterTable();
        console.log("查看路由表");
        break;
      case "删除该路由":
        scene.remove(currentNode);
        for (var i = 0; i < n; i++) {
          // 拓扑结构删除结点
          if (currentTopology[i].name == currentNode.text) {
            currentTopology.splice(i, 1);
            n--;
            i--;
          } else {
            // 拓扑结构其他结点删除相关边
            if (currentTopology[i].adjacent[currentNode.text]) {
              delete currentTopology[i].adjacent[currentNode.text];
            }
          }
        }
        // 遍历删除连线
        for (var j = 0; j < e; j++) {
          if (links[j].nodeA == currentNode || links[j].nodeZ == currentNode) {
            links.splice(j, 1);
            e--;
          }
        }
        // 链路状态库更新
        buildTopology();
        currentNode = null;
        console.log("删除该路由");
        break;
      case "修改代价":
        $(".editCost").show();
        console.log("修改代价");
        break;
      case "删除该连接":
        console.log("删除该连接");
        scene.remove(currentLink);
        for (var i = 0; i < e; i++) {
          if (
            (link[i].nodeA =
              currentLink.nodeA && link[i].nodeZ == currentLink.nodeZ)
          ) {
            link.splice(i, 1);
            e--;
            i--;
          }
        }
        delete currentTopology[
          getIndex(currentLink.nodeA.text)
        ].adjacent[currentLink.nodeZ.text];
        delete currentTopology[
          getIndex(currentLink.nodeZ.text)
        ].adjacent[currentLink.nodeA.text];
        break;
    }
    $(".contextmenu").hide();
  });
  //点击新建路由器
  $(".newRouter").click(function () {
    $(".inputRouter").show();
  });
  //点击刷新
  $(".refresh").click(function () {
    scene.clear();
    routerNodes.splice(0, routerNodes.length);
    links.splice(0, links.length);
    drawTopology();
  });

  //点击清除
  $(".clear").click(function () {
    scene.clear();
    routerNodes.splice(0, routerNodes.length);
    links.splice(0, links.length);
    currentTopology.splice(0, currentTopology.length);
  });

  // 主体
  console.time();
  romTopology();
  console.timeEnd();
  console.time();
  ini();
  console.timeEnd();
  console.time();
  drawTopology();
  console.timeEnd();
});
