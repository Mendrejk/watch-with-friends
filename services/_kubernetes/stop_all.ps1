minikube kubectl -- delete -f rooms/rooms.yaml
minikube kubectl -- delete -f rooms/rooms-service.yaml
minikube kubectl -- delete -f rooms-db/rooms-db.yaml
minikube kubectl -- delete -f rooms-db/rooms-db-service.yaml
minikube kubectl -- delete -f rooms-db/rooms-db-volume.yaml
minikube kubectl -- delete -f rooms-db/rooms-db-volume-claim.yaml

minikube kubectl -- delete -f users/users.yaml
minikube kubectl -- delete -f users/users-service.yaml
minikube kubectl -- delete -f users-db/users-db.yaml
minikube kubectl -- delete -f users-db/users-db-service.yaml
minikube kubectl -- delete -f users-db/users-db-volume.yaml
minikube kubectl -- delete -f users-db/users-db-volume-claim.yaml

minikube kubectl -- delete -f chat/chat.yaml
minikube kubectl -- delete -f chat/chat-service.yaml
minikube kubectl -- delete -f chat-db/chat-db.yaml
minikube kubectl -- delete -f chat-db/chat-db-service.yaml
minikube kubectl -- delete -f chat-db/chat-db-volume.yaml
minikube kubectl -- delete -f chat-db/chat-db-volume-claim.yaml

minikube kubectl -- delete -f videos/videos.yaml
minikube kubectl -- delete -f videos/videos-service.yaml
minikube kubectl -- delete -f videos-db/videos-db.yaml
minikube kubectl -- delete -f videos-db/videos-db-service.yaml
minikube kubectl -- delete -f videos-db/videos-db-volume.yaml
minikube kubectl -- delete -f videos-db/videos-db-volume-claim.yaml

minikube kubectl -- delete -f zookeeper/zookeeper.yaml
minikube kubectl -- delete -f zookeeper/zookeeper-service.yaml
minikube kubectl -- delete -f kafka/kafka.yaml
minikube kubectl -- delete -f kafka/kafka-service.yaml
minikube kubectl -- delete -f ingress.yaml