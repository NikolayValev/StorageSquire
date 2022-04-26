"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startResetCache = exports.startRenameFile = exports.startRemoveFile = exports.removeFile = exports.startAddFile = exports.addFile = exports.startLoadMoreFiles = exports.loadMoreFiles = exports.startSetFiles = exports.startSetAllItems = exports.startSetFileAndFolderItems = exports.editFileMetadata = exports.editFile = exports.setFiles = void 0;

var _uploads = require("./uploads");

var _main = require("./main");

var _selectedItem = require("./selectedItem");

var _quickFiles = require("./quickFiles");

var _storage = require("./storage");

var _uuid = require("uuid");

var _axiosInterceptor = _interopRequireDefault(require("../axiosInterceptor"));

var _axios = _interopRequireDefault(require("axios"));

var _envFrontEnd = _interopRequireDefault(require("../enviroment/envFrontEnd"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _mobileCheck = _interopRequireDefault(require("../utils/mobileCheck"));

var _folders = require("./folders");

var _reduceQuickItemList = _interopRequireDefault(require("../utils/reduceQuickItemList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//TODO(nvalev) fix this

/*
const http = require('http');
const https = require('https');
*/
var cachedResults = {};

var setFiles = function setFiles(files) {
  return {
    type: "SET_FILES",
    files: files
  };
};

exports.setFiles = setFiles;

var editFile = function editFile(id, file) {
  return {
    type: "EDIT_FILE",
    id: id,
    file: file
  };
};

exports.editFile = editFile;

var editFileMetadata = function editFileMetadata(id, metadata) {
  return {
    type: "EDIT_FILE_METADATA",
    id: id,
    metadata: metadata
  };
};

exports.editFileMetadata = editFileMetadata;

var startSetFileAndFolderItems = function startSetFileAndFolderItems(historyKey) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/";
  var sortby = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "DEFAULT";
  var search = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var isGoogle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var storageType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "DEFAULT";
  var folderSearch = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  return function (dispatch) {
    if (cachedResults[historyKey]) {
      var _cachedResults$histor = cachedResults[historyKey],
          fileList = _cachedResults$histor.fileList,
          folderList = _cachedResults$histor.folderList;
      dispatch(setFiles(fileList));
      dispatch((0, _folders.setFolders)(folderList));
      dispatch((0, _main.setLoading)(false));

      if (fileList.length === limit) {
        dispatch((0, _main.loadMoreItems)(true));
      } else {
        dispatch((0, _main.loadMoreItems)(false));
      }

      delete cachedResults[historyKey];
      return;
    } //isGoogle = env.googleDriveEnabled;


    var limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);
    var fileURL = "";
    var folderURL = "";

    if (search && search !== "") {
      if (_envFrontEnd["default"].googleDriveEnabled) {
        fileURL = "/file-service-google-mongo/list?search=".concat(search);
        folderURL = "/folder-service-google-mongo/list?search=".concat(search);
      } else {
        fileURL = "/file-service/list?search=".concat(search);
        folderURL = "/folder-service/list?search=".concat(search);
      }
    } else {
      fileURL = isGoogle ? "/file-service-google/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType) : _envFrontEnd["default"].googleDriveEnabled && parent === "/" ? "/file-service-google-mongo/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType) : "/file-service/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType);
      folderURL = isGoogle ? "/folder-service-google/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType) : _envFrontEnd["default"].googleDriveEnabled && parent === "/" ? "/folder-service-google-mongo/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType) : "/folder-service/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType);
    }

    dispatch(setFiles([]));
    dispatch((0, _folders.setFolders)([]));
    dispatch((0, _main.setLoading)(true));
    var itemList = [_axiosInterceptor["default"].get(fileURL), _axiosInterceptor["default"].get(folderURL)];
    Promise.all(itemList).then(function (values) {
      var fileList = values[0].data;
      var folderList = values[1].data;
      dispatch(setFiles(fileList));
      dispatch((0, _folders.setFolders)(folderList));
      dispatch((0, _main.setLoading)(false));

      if (fileList.length === limit) {
        dispatch((0, _main.loadMoreItems)(true));
      } else {
        dispatch((0, _main.loadMoreItems)(false));
      }

      cachedResults[historyKey] = {
        fileList: fileList,
        folderList: folderList
      };
    })["catch"](function (e) {
      console.log("Get All Items Error", e);
    });
  };
};

exports.startSetFileAndFolderItems = startSetFileAndFolderItems;

var startSetAllItems = function startSetAllItems(clearCache) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/";
  var sortby = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "DEFAULT";
  var search = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var isGoogle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var storageType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "DEFAULT";
  return function (dispatch) {
    if (clearCache) cachedResults = {}; //isGoogle = env.googleDriveEnabled;

    if (cachedResults[parent]) {
      var _cachedResults$parent = cachedResults[parent],
          fileList = _cachedResults$parent.fileList,
          folderList = _cachedResults$parent.folderList,
          quickItemList = _cachedResults$parent.quickItemList;
      dispatch(setFiles(fileList));
      dispatch((0, _folders.setFolders)(folderList));
      dispatch((0, _quickFiles.setQuickFiles)(quickItemList));
      dispatch((0, _main.setLoading)(false));

      if (fileList.length === limit) {
        dispatch((0, _main.loadMoreItems)(true));
      } else {
        dispatch((0, _main.loadMoreItems)(false));
      }

      cachedResults = {};
      cachedResults[parent] = {
        fileList: fileList,
        folderList: folderList,
        quickItemList: quickItemList
      };
      return;
    }

    var limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);
    var fileURL = isGoogle ? "/file-service-google/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType) : _envFrontEnd["default"].googleDriveEnabled && parent === "/" ? "/file-service-google-mongo/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType) : "/file-service/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType);
    var folderURL = isGoogle ? "/folder-service-google/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType) : _envFrontEnd["default"].googleDriveEnabled && parent === "/" ? "/folder-service-google-mongo/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType) : "/folder-service/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&storageType=").concat(storageType);
    var quickItemsURL = !_envFrontEnd["default"].googleDriveEnabled ? "/file-service/quick-list" : "/file-service-google-mongo/quick-list";
    dispatch(setFiles([]));
    dispatch((0, _folders.setFolders)([]));
    dispatch((0, _quickFiles.setQuickFiles)([]));
    dispatch((0, _main.setLoading)(true));
    var itemList = [_axiosInterceptor["default"].get(fileURL), _axiosInterceptor["default"].get(folderURL), _axiosInterceptor["default"].get(quickItemsURL)];
    Promise.all(itemList).then(function (values) {
      var fileList = values[0].data;
      var folderList = values[1].data;
      var quickItemList = (0, _reduceQuickItemList["default"])(values[2].data);
      dispatch(setFiles(fileList));
      dispatch((0, _folders.setFolders)(folderList));
      dispatch((0, _quickFiles.setQuickFiles)(quickItemList));
      dispatch((0, _main.setLoading)(false));

      if (fileList.length === limit) {
        dispatch((0, _main.loadMoreItems)(true));
      } else {
        dispatch((0, _main.loadMoreItems)(false));
      }

      cachedResults = {};
      cachedResults[parent] = {
        fileList: fileList,
        folderList: folderList,
        quickItemList: quickItemList
      };
    })["catch"](function (e) {
      console.log("Get All Items Error", e);
    });
  };
};

exports.startSetAllItems = startSetAllItems;

var startSetFiles = function startSetFiles() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
  var sortby = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DEFAULT";
  var search = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var isGoogle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var storageType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "DEFAULT";
  return function (dispatch) {
    var limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);
    dispatch(setFiles([]));
    dispatch((0, _main.setLoading)(true));

    if (_envFrontEnd["default"].googleDriveEnabled) {
      _axiosInterceptor["default"].get("/file-service-google/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType)).then(function (results) {
        var googleList = results.data; //dispatch(loadMoreFiles(googleList))

        dispatch(setFiles(googleList));
        dispatch((0, _main.setLoading)(false));

        if (googleList.length === limit) {
          dispatch((0, _main.loadMoreItems)(true));
        } else {
          dispatch((0, _main.loadMoreItems)(false));
        }
      })["catch"](function (err) {
        console.log(err);
      });
    } else if (_envFrontEnd["default"].googleDriveEnabled && parent === "/") {
      // Temp Google Drive API
      _axiosInterceptor["default"].get("/file-service-google-mongo/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType)).then(function (results) {
        // console.log("Google Data", results.data.data.files);
        // const convertedList = convertDriveListToMongoList(results.data.data.files);
        // console.log("Converted List", convertedList);
        var googleMongoList = results.data; //dispatch(loadMoreFiles(googleList))
        //dispatch(setLoading(true))

        dispatch(setFiles(googleMongoList));
        dispatch((0, _main.setLoading)(false));

        if (results.data.length === limit) {
          dispatch((0, _main.loadMoreItems)(true));
        } else {
          dispatch((0, _main.loadMoreItems)(false));
        }
      })["catch"](function (err) {
        console.log(err);
      });
    } else {
      _axiosInterceptor["default"].get("/file-service/list?parent=".concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&limit=").concat(limit, "&storageType=").concat(storageType)).then(function (results) {
        var mongoData = results.data; //dispatch(setLoading(true))

        dispatch(setFiles(mongoData));
        dispatch((0, _main.setLoading)(false));

        if (results.data.length === limit) {
          dispatch((0, _main.loadMoreItems)(true));
        } else {
          dispatch((0, _main.loadMoreItems)(false));
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  };
};

exports.startSetFiles = startSetFiles;

var loadMoreFiles = function loadMoreFiles(files) {
  return {
    type: "LOAD_MORE_FILES",
    files: files
  };
};

exports.loadMoreFiles = loadMoreFiles;

var startLoadMoreFiles = function startLoadMoreFiles() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
  var sortby = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DEFAULT";
  var search = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var startAtDate = arguments.length > 3 ? arguments[3] : undefined;
  var startAtName = arguments.length > 4 ? arguments[4] : undefined;
  var pageToken = arguments.length > 5 ? arguments[5] : undefined;
  var isGoogle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  return function (dispatch) {
    dispatch((0, _main.setLoadingMoreItems)(true));
    var limit = window.localStorage.getItem("list-size") || 50;
    limit = parseInt(limit);

    if (isGoogle) {
      // Temp Google Drive API
      _axiosInterceptor["default"].get("/file-service-google/list?limit=".concat(limit, "&parent=").concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&startAt=", true, "&startAtDate=").concat(startAtDate, "&startAtName=").concat(startAtName, "&pageToken=").concat(pageToken)).then(function (results) {
        dispatch(loadMoreFiles(results.data));

        if (results.data.length !== limit) {
          dispatch((0, _main.loadMoreItems)(false));
        } else {
          dispatch((0, _main.loadMoreItems)(true));
        }

        dispatch((0, _main.setLoadingMoreItems)(false)); //dispatch(setLoading(false))
      })["catch"](function (err) {
        console.log(err);
      });
    } else {
      _axiosInterceptor["default"].get("/file-service/list?limit=".concat(limit, "&parent=").concat(parent, "&sortby=").concat(sortby, "&search=").concat(search, "&startAt=", true, "&startAtDate=").concat(startAtDate, "&startAtName=").concat(startAtName)).then(function (results) {
        //console.log("load more files result", results.data.length)
        dispatch(loadMoreFiles(results.data));

        if (results.data.length !== limit) {
          dispatch((0, _main.loadMoreItems)(false));
        } else {
          dispatch((0, _main.loadMoreItems)(true));
        } // dispatch(setLoading(false))


        dispatch((0, _main.setLoadingMoreItems)(false));
      })["catch"](function (err) {
        console.log(err);
      });
    }
  };
};

exports.startLoadMoreFiles = startLoadMoreFiles;

var addFile = function addFile(file) {
  return {
    type: "ADD_FILE",
    file: file
  };
};

exports.addFile = addFile;

var startAddFile = function startAddFile(uploadInput, parent, parentList, storageSwitcherType) {
  return function (dispatch, getState) {
    if (_envFrontEnd["default"].uploadMode === '') {
      console.log("No Storage Accounts!");

      _sweetalert["default"].fire({
        icon: 'error',
        title: 'No Storage Accounts Active',
        text: 'Go to settings to add a storage account'
      });

      return;
    } // Store the parent, incase it changes.


    var prevParent = getState().parent.parent;

    var _loop = function _loop(i) {
      var currentFile = uploadInput.files[i];
      var currentID = (0, _uuid.v4)();
      var CancelToken = _axios["default"].CancelToken;
      var source = CancelToken.source(); //TODO(nvalev)change this to access via GRCP

      var httpAgent = null
      /*new http.Agent({ keepAlive: true })*/
      ;
      var httpsAgent = null
      /*new https.Agent({ keepAlive: true })*/
      ;
      var config = {
        headers: {
          httpAgent: httpAgent,
          httpsAgent: httpsAgent,
          'Content-Type': 'multipart/form-data',
          'Transfere-Encoding': "chunked"
        },
        onUploadProgress: function onUploadProgress(progressEvent) {
          var currentProgress = Math.round(progressEvent.loaded / progressEvent.total * 100);

          if (currentProgress !== 100) {
            dispatch((0, _uploads.editUpload)(currentID, currentProgress));
          }
        },
        cancelToken: source.token
      };
      dispatch((0, _uploads.addUpload)({
        id: currentID,
        progress: 0,
        name: currentFile.name,
        completed: false,
        source: source,
        canceled: false,
        size: currentFile.size
      }));
      var storageType = _envFrontEnd["default"].uploadMode;
      var data = new FormData();
      data.append('filename', currentFile.name);
      data.append("parent", parent);
      data.append("parentList", parentList);
      data.append("currentID", currentID);
      data.append("size", currentFile.size);
      if (storageType === "s3") data.append("personal-file", true);
      data.append('file', currentFile);
      var url = storageType === "drive" ? '/file-service-google/upload' : storageType === "s3" ? '/file-service-personal/upload' : '/file-service/upload';

      _axiosInterceptor["default"].post(url, data, config).then(function (response) {
        var currentParent = getState().parent.parent; // This can change by the time the file uploads

        if (prevParent === currentParent) {
          dispatch(addFile(response.data));
        }

        dispatch((0, _quickFiles.addQuickFile)(response.data));
        dispatch((0, _uploads.editUpload)(currentID, 100, true));
        dispatch((0, _selectedItem.resetSelected)());
        dispatch((0, _storage.startSetStorage)());
        cachedResults = {};
      })["catch"](function (error) {
        console.log(error);
        dispatch((0, _uploads.cancelUpload)(currentID));
      });
    };

    for (var i = 0; i < uploadInput.files.length; i++) {
      _loop(i);
    }
  };
};

exports.startAddFile = startAddFile;

var removeFile = function removeFile(id) {
  return {
    type: "REMOVE_FILE",
    id: id
  };
};

exports.removeFile = removeFile;

var startRemoveFile = function startRemoveFile(id) {
  var isGoogle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var isPersonal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch) {
    var data = {
      id: id
    };

    if (isGoogle) {
      _axiosInterceptor["default"]["delete"]("/file-service-google/remove", {
        data: data
      }).then(function () {
        dispatch(removeFile(id));
        dispatch((0, _storage.startSetStorage)());
        dispatch((0, _quickFiles.startSetQuickFiles)());
        cachedResults = {};
      })["catch"](function (err) {
        console.log(err);
      });
    } else {
      var url = !isPersonal ? "/file-service/remove" : "/file-service-personal/remove";

      _axiosInterceptor["default"]["delete"](url, {
        data: data
      }).then(function () {
        dispatch(removeFile(id));
        dispatch((0, _storage.startSetStorage)());
        dispatch((0, _quickFiles.startSetQuickFiles)());
        cachedResults = {};
      })["catch"](function (err) {
        console.log(err);
      });
    }
  };
};

exports.startRemoveFile = startRemoveFile;

var startRenameFile = function startRenameFile(id, title) {
  var isGoogle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch) {
    var data = {
      id: id,
      title: title
    };

    if (isGoogle) {
      _axiosInterceptor["default"].patch("/file-service-google/rename", data).then(function () {
        dispatch(editFile(id, {
          filename: title
        }));
        cachedResults = {};
      })["catch"](function (err) {
        console.log(err);
      });
    } else {
      _axiosInterceptor["default"].patch("/file-service/rename", data).then(function () {
        dispatch(editFile(id, {
          filename: title
        }));
        cachedResults = {};
      })["catch"](function (err) {
        console.log(err);
      });
    }
  };
};

exports.startRenameFile = startRenameFile;

var startResetCache = function startResetCache() {
  return function (dispatch) {
    cachedResults = {};
  };
};

exports.startResetCache = startResetCache;