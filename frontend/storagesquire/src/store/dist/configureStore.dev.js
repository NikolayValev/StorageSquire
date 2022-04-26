"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _auth = _interopRequireDefault(require("../reducers/auth"));

var _main = _interopRequireDefault(require("../reducers/main"));

var _files = _interopRequireDefault(require("../reducers/files"));

var _folders = _interopRequireDefault(require("../reducers/folders"));

var _filter = _interopRequireDefault(require("../reducers/filter"));

var _selectedItem = _interopRequireDefault(require("../reducers/selectedItem"));

var _uploads = _interopRequireDefault(require("../reducers/uploads"));

var _storage = _interopRequireDefault(require("../reducers/storage"));

var _quickFiles = _interopRequireDefault(require("../reducers/quickFiles"));

var _popupFile = _interopRequireDefault(require("../reducers/popupFile"));

var _settings = _interopRequireDefault(require("../reducers/settings"));

var _parent = _interopRequireDefault(require("../reducers/parent"));

var _addOptions = _interopRequireDefault(require("../reducers/addOptions"));

var _photoViewer = _interopRequireDefault(require("../reducers/photoViewer"));

var _routes = _interopRequireDefault(require("../reducers/routes"));

var _mover = _interopRequireDefault(require("../reducers/mover"));

var _folderTree = _interopRequireDefault(require("../reducers/folderTree"));

var _uploadStorageSwitcher = _interopRequireDefault(require("../reducers/uploadStorageSwitcher"));

var _mobileContextMenu = _interopRequireDefault(require("../reducers/mobileContextMenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default() {
  var store = (0, _redux.createStore)((0, _redux.combineReducers)({
    auth: _auth["default"],
    main: _main["default"],
    files: _files["default"],
    folders: _folders["default"],
    filter: _filter["default"],
    selectedItem: _selectedItem["default"],
    uploads: _uploads["default"],
    storage: _storage["default"],
    quickFiles: _quickFiles["default"],
    popupFile: _popupFile["default"],
    settings: _settings["default"],
    parent: _parent["default"],
    addOptions: _addOptions["default"],
    photoViewer: _photoViewer["default"],
    routes: _routes["default"],
    mover: _mover["default"],
    folderTree: _folderTree["default"],
    storageSwitcher: _uploadStorageSwitcher["default"],
    mobileContextMenu: _mobileContextMenu["default"]
  }), (0, _redux.applyMiddleware)(_reduxThunk["default"]));
  return store;
};

exports["default"] = _default;