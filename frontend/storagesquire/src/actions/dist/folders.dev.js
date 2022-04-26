"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startRenameFolder = exports.editFolder = exports.startRemoveFolder = exports.removeFolder = exports.startSetFolders = exports.setFolders = exports.startAddFolder = exports.addFolder = void 0;

var _quickFiles = require("./quickFiles");

var _envFrontEnd = _interopRequireDefault(require("../enviroment/envFrontEnd"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _folderTree = require("./folderTree");

var _files = require("./files");

var _uuid = require("uuid");

var _axiosInterceptor = _interopRequireDefault(require("../axiosInterceptor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var addFolder = function addFolder(folder) {
  return {
    type: "ADD_FOLDER",
    folder: folder
  };
};

exports.addFolder = addFolder;

var startAddFolder = function startAddFolder(name, owner, parent, parentList) {
  var isGoogle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return function (dispatch) {
    if (_envFrontEnd["default"].uploadMode === '') {
      console.log("No Storage Accounts!");

      _sweetalert["default"].fire({
        icon: 'error',
        title: 'No Storage Accounts Active',
        text: 'Go to settings to add a storage account'
      });

      return;
    }

    if (name.length === 0) {
      return;
    }

    var storageType = _envFrontEnd["default"].uploadMode;
    var body = {
      name: name,
      parent: parent,
      owner: owner,
      parentList: parentList
    };
    if (storageType === "s3") body = _objectSpread({}, body, {
      personalFolder: true
    }); // TEMP FIX THIS

    var url = storageType === "drive" ? "/folder-service-google/upload" : "/folder-service/upload";

    _axiosInterceptor["default"].post(url, body).then(function (response) {
      var folder = response.data;
      dispatch(addFolder(folder));
      dispatch((0, _folderTree.addNewFolderTreeID)(folder._id, folder));
      dispatch((0, _files.startResetCache)());
      if (parent === "/") dispatch((0, _folderTree.setFirstLoadDetailsFolderTree)({
        status: "RESET",
        resetToken: _uuid.v4.v4()
      }));
    })["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.startAddFolder = startAddFolder;

var setFolders = function setFolders(folders) {
  return {
    type: "SET_FOLDERS",
    folders: folders
  };
};

exports.setFolders = setFolders;

var startSetFolders = function startSetFolders() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
  var sortby = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DEFAULT";
  var search = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var isGoogle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var storageType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "DEFAULT";
  return function (dispatch) {
    dispatch(setFolders([]));

    if (isGoogle) {
      _axiosInterceptor["default"].get("/folder-service-google/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType)).then(function (results) {
        var googleList = results.data;
        dispatch(setFolders(googleList));
      })["catch"](function (err) {
        console.log(err);
      });
    } else if (_envFrontEnd["default"].googleDriveEnabled && parent === "/") {
      // Temp Google Drive API
      _axiosInterceptor["default"].get("/folder-service-google-mongo/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType)).then(function (results) {
        var googleMongoList = results.data;
        dispatch(setFolders(googleMongoList));
      })["catch"](function (err) {
        console.log(err);
      });
    } else {
      _axiosInterceptor["default"].get("/folder-service/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType)).then(function (response) {
        var folders = response.data;
        dispatch(setFolders(folders)); //DISABLED TEMP
      })["catch"](function (err) {
        console.log(err);
      });
    }
  };
};

exports.startSetFolders = startSetFolders;

var removeFolder = function removeFolder(id) {
  return {
    type: "REMOVE_FOLDER",
    id: id
  };
};

exports.removeFolder = removeFolder;

var startRemoveFolder = function startRemoveFolder(id, parentList) {
  var isGoogle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var parent = arguments.length > 3 ? arguments[3] : undefined;
  var personalFolder = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return function (dispatch) {
    var data = {
      id: id,
      parentList: parentList
    };
    var url = isGoogle ? "/folder-service-google/remove" : personalFolder ? "/folder-service-personal/remove" : "/folder-service/remove";

    _axiosInterceptor["default"]["delete"](url, {
      data: data
    }).then(function (response) {
      dispatch(removeFolder(id));
      dispatch((0, _quickFiles.startSetQuickFiles)());
      dispatch((0, _folderTree.addDeleteFolderTreeID)(id, {
        _id: id
      }));
      dispatch((0, _files.startResetCache)());
      if (parent === "/") dispatch((0, _folderTree.setFirstLoadDetailsFolderTree)({
        status: "RESET",
        resetToken: _uuid.v4.v4()
      }));
    })["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.startRemoveFolder = startRemoveFolder;

var editFolder = function editFolder(id, folder) {
  return {
    type: "EDIT_FOLDER",
    id: id,
    folder: folder
  };
};

exports.editFolder = editFolder;

var startRenameFolder = function startRenameFolder(id, title) {
  var isGoogle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var parent = arguments.length > 3 ? arguments[3] : undefined;
  return function (dispatch) {
    var data = {
      id: id,
      title: title
    };
    var url = isGoogle ? "/folder-service-google/rename" : "/folder-service/rename";

    _axiosInterceptor["default"].patch(url, data).then(function (response) {
      dispatch(editFolder(id, {
        name: title
      }));
      dispatch((0, _folderTree.addRenameFolderTreeID)(id, {
        _id: id,
        name: title
      }));
      dispatch((0, _files.startResetCache)());
      if (parent === "/") dispatch((0, _folderTree.setFirstLoadDetailsFolderTree)({
        status: "RESET",
        resetToken: _uuid.v4.v4()
      }));
    })["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.startRenameFolder = startRenameFolder;