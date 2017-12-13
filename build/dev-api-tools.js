/**
 * this module is dev data module, developer can add api to apiRoutes
 * so you can use http://localhost:9528/api/data/login to get data
 * apiRoutes.post:post method
 * apiRoutes.get: get method
 */


module.exports = apiTools = {

  apiData: function (app,express) {
    //添加本地测试数据 begin
    //login begin
    var apiRoutes = express.Router();


    var loginData = require('../data/login.json');
    apiRoutes.post('/user/login', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS",
        data: loginData
      });
    });
    //login end

    var userinfoData = require("../data/userinfo.json");
    apiRoutes.get('/user/info', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS",
        data: userinfoData
      });
    });

    apiRoutes.post('/user/logout', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS"
      });
    });
    var exampleListData = require("../data/exampleList.json");
    apiRoutes.get('/table/list', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS",
        data:exampleListData
      });
    });
    var moduleListData = require("../data/module.json");
    apiRoutes.get('/permission/module/list', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS",
        data:moduleListData
      });
    });
    app.use('/api/data', apiRoutes);

    var roleListData = require("../data/roleList.json");
    apiRoutes.get('/permission/role/list', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS",
        data:roleListData
      });
    });
    app.use('/api/data', apiRoutes);

    var userListData = require("../data/userList.json");
    apiRoutes.get('/permission/user/list', function (req, res) {
      res.json({
        code: 20000,
        errMessage:"SUCCESS",
        data:userListData
      });
    });
    app.use('/api/data', apiRoutes);
    //end


  }
}
