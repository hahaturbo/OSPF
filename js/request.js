req = {};

//读取文件中的数据
req.read = function (callback) {
  $.ajax({
    type: "get",
    url: "js/data.json",
    dataType: "json",
    async: true,
    success: function (data) {
      callback ? callback(data) : (function () {})();
    },
  });
};
req.write = function (saveTopology) {
  $.post({
    type: "POST",
    url: "js/data.json",
    data: saveTopology,
    dataType: "json",
    success: function (data) {
      console.log(data);
    },
  })
};
