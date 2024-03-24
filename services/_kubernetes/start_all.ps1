minikube kubectl -- apply -f rooms/rooms.yaml
minikube kubectl -- apply -f rooms/rooms-service.yaml

minikube kubectl -- apply -f rooms-db/rooms-db.yaml
minikube kubectl -- apply -f rooms-db/rooms-db-service.yaml
minikube kubectl -- apply -f rooms-db/rooms-db-volume.yaml
minikube kubectl -- apply -f rooms-db/rooms-db-volume-claim.yaml

# --

minikube kubectl -- apply -f users/users.yaml
minikube kubectl -- apply -f users/users-service.yaml

minikube kubectl -- apply -f users-db/users-db.yaml
minikube kubectl -- apply -f users-db/users-db-service.yaml
minikube kubectl -- apply -f users-db/users-db-volume.yaml
minikube kubectl -- apply -f users-db/users-db-volume-claim.yaml

# --

minikube kubectl -- apply -f chat/chat.yaml
minikube kubectl -- apply -f chat/chat-service.yaml

minikube kubectl -- apply -f chat-db/chat-db.yaml
minikube kubectl -- apply -f chat-db/chat-db-service.yaml
minikube kubectl -- apply -f chat-db/chat-db-volume.yaml
minikube kubectl -- apply -f chat-db/chat-db-volume-claim.yaml

# --

minikube kubectl -- apply -f videos/videos.yaml
minikube kubectl -- apply -f videos/videos-service.yaml

minikube kubectl -- apply -f videos-db/videos-db.yaml
minikube kubectl -- apply -f videos-db/videos-db-service.yaml
minikube kubectl -- apply -f videos-db/videos-db-volume.yaml
minikube kubectl -- apply -f videos-db/videos-db-volume-claim.yaml

# --

minikube kubectl -- apply -f zookeeper/zookeeper.yaml
minikube kubectl -- apply -f zookeeper/zookeeper-service.yaml
minikube kubectl -- apply -f kafka/kafka.yaml
minikube kubectl -- apply -f kafka/kafka-service.yaml
minikube kubectl -- apply -f ingress.yaml
