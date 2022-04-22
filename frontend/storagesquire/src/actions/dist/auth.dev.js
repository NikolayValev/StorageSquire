"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startLogout = exports.startLogoutAll = exports.startLoginCheck = exports.startCreateAccount = exports.startLogin = exports.logout = exports.login = void 0;

var _main = require("./main");

var _AppRouter = require("../routers/AppRouter");

var _uploads = require("./uploads");

var _axiosInterceptor = _interopRequireDefault(require("../axiosInterceptor"));

var _envFrontEnd = _interopRequireDefault(require("../enviroment/envFrontEnd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login(id) {
  return {
    type: "LOGIN",
    id: id
  };
};

exports.login = login;

var logout = function logout() {
  return {
    type: "LOGOUT"
  };
};

exports.logout = logout;

var startLogin = function startLogin(email, password, currentRoute) {
  return function (dispatch) {
    var dt = {
      email: email,
      password: password
    };

    _axiosInterceptor["default"].post("/user-service/login", dt).then(function (response) {
      // console.log("USER SERVICE LOGIN RESPONSE")
      var id = response.data.user._id;
      var emailVerified = response.data.user.emailVerified;
      _envFrontEnd["default"].googleDriveEnabled = response.data.user.googleDriveEnabled;
      _envFrontEnd["default"].s3Enabled = response.data.user.s3Enabled;
      _envFrontEnd["default"].activeSubscription = response.data.user.activeSubscription;
      _envFrontEnd["default"].emailAddress = response.data.user.email;
      _envFrontEnd["default"].name = response.data.user.name || ""; //window.localStorage.setItem("token", token);

      if (emailVerified) {
        dispatch((0, _main.setLoginFailed)(false));
        dispatch(login(id));

        _AppRouter.history.push(currentRoute);
      } else {
        console.log("Email Not Verified");
        dispatch((0, _main.setLoginFailed)("Unverified Email", 404));
      }
    })["catch"](function (err) {
      console.log("USER SERVICE LOGIN ERROR");
      var code = err.response.status;
      dispatch((0, _main.setLoginFailed)("Incorrect Email or Password", code));
      console.log(err);
    });
  };
};

exports.startLogin = startLogin;

var startCreateAccount = function startCreateAccount(email, password) {
  return function (dispatch) {
    var dt = {
      email: email,
      password: password
    };

    _axiosInterceptor["default"].post("/user-service/create", dt).then(function (response) {
      var token = response.data.token;
      var id = response.data.user._id;
      var emailVerified = response.data.user.emailVerified; // window.localStorage.setItem("token", token);

      if (emailVerified) {
        dispatch((0, _main.setLoginFailed)(false));
        dispatch(login(id));

        _AppRouter.history.push("/home");
      } else {
        console.log("Email Not Verified");
        dispatch((0, _main.setLoginFailed)("Unverified Email", 404));
        dispatch((0, _main.setCreateNewAccount)(true));
      }
    })["catch"](function (err) {
      console.log(err);

      if (err.response) {
        var errStatus = err.response.status;

        if (errStatus === 401) {
          dispatch((0, _main.setLoginFailed)("Create Blocked By Admin"));
        } else {
          dispatch((0, _main.setLoginFailed)("Duplicate Email, or Invalid Password"));
        }
      } else {
        dispatch((0, _main.setLoginFailed)("Duplicate Email, or Invalid Password"));
      }
    });
  };
};

exports.startCreateAccount = startCreateAccount;

var reload = function reload() {
  setTimeout(function () {
    window.location.reload(true);
  }, 3000);
};

var startLoginCheck = function startLoginCheck(currentRoute) {
  return function (dispatch) {
    _axiosInterceptor["default"].get("/user-service/user").then(function (response) {
      var emailVerified = response.data.emailVerified;
      var id = response.data._id;
      _envFrontEnd["default"].googleDriveEnabled = response.data.googleDriveEnabled;
      _envFrontEnd["default"].s3Enabled = response.data.s3Enabled;
      _envFrontEnd["default"].activeSubscription = response.data.activeSubscription;
      _envFrontEnd["default"].emailAddress = response.data.email;
      _envFrontEnd["default"].name = response.data.name || "";

      if (emailVerified) {
        dispatch((0, _main.setLoginFailed)(false));
        dispatch(login(id));

        _AppRouter.history.push(currentRoute);
      } else {
        console.log("Email Not Verified");
        dispatch((0, _main.setLoginFailed)("Unverified Email", 404));
      } //reload();

    })["catch"](function (err) {
      console.log("login check error", err, err.response.data, err.data, err.response); // window.localStorage.removeItem("token")

      dispatch((0, _main.setLoginFailed)("Login Expired")); // history.push("/login")
    });
  };
};

exports.startLoginCheck = startLoginCheck;

var startLogoutAll = function startLogoutAll() {
  return function (dispatch) {
    _axiosInterceptor["default"].post("/user-service/logout-all").then(function () {
      window.localStorage.removeItem("token");
      dispatch((0, _uploads.resetUpload)());
      dispatch((0, _main.setLoginFailed)(false));
      dispatch(logout());

      _AppRouter.history.push("/");
    })["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.startLogoutAll = startLogoutAll;

var startLogout = function startLogout() {
  return function (dispatch) {
    _axiosInterceptor["default"].post("/user-service/logout").then(function () {
      window.localStorage.removeItem("token");
      dispatch((0, _uploads.resetUpload)());
      dispatch((0, _main.setLoginFailed)(false));
      dispatch(logout());

      _AppRouter.history.push("/");
    })["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.startLogout = startLogout;