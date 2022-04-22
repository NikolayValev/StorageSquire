//1.Use NFS to access multiple connections simultaneously
//2.Map the disk driectory in a unified way so its represented by the protobuffers
//3.allow users with authentication tokens to access all functions
//4.on change of structure update the map of paths
//5.On startup prompt the user if this is the master or the branch
#ifndef UNIFIED_SERVER_H_
#define UNIFIED_SERVER_H_
#include <string>
#include <memory>
class UnifiedServer{
  public:
  UnifiedServer() {}
  void UnifiedServer();
  /**
   * @brief Creates a new Database Manager and starts the RPC server.
   * @author Nikolay Valev
   * @date 03/11/2022
   */
  void Run();
  private:
  void RunRPCServer();
  std::shared_ptr<DBManager> db_manager_;
  std::unique_ptr<grpc::Server> rpc_server_;
}
#endif  // UNIFIED_SERVER_H_