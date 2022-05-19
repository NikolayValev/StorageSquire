"use strict";

var PROTO_PATH = __dirname + '../protos/route_guide.proto';

var grpc = require('@grpc/grpc-js');

var protoLoader = require('@grpc/proto-loader'); // Suggested options for similarity to existing grpc.load behavior


var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition); // The protoDescriptor object has the full package hierarchy

var routeguide = protoDescriptor.routeguide;
var call = client.listDrives(user_id);
call.on('data', function (drive) {
  console.log('Found drive called "' + drive.human_friendly_name);
});
call.on('end', function () {// The server has finished sending
});
call.on('error', function (e) {// An error has occurred and the stream has been closed.
});
call.on('status', function (status) {// process status
});