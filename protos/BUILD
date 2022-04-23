load("@org_pubref_rules_protobuf//cpp:rules.bzl", "cc_proto_library")

cc_proto_library (
  name = "unipserver_proto_cc",
  protos = [
      "helperstructs.proto",
      "status.proto",
      "server.proto",
  ],
  with_grpc = True,
  visibility = ["//visibility:public"],
)
