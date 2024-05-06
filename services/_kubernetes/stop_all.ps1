kubectl delete -f rooms/rooms.yaml
kubectl delete -f rooms/rooms-service.yaml
kubectl delete -f rooms-db/rooms-db.yaml
kubectl delete -f rooms-db/rooms-db-service.yaml
kubectl delete -f rooms-db/rooms-db-volume.yaml
kubectl delete -f rooms-db/rooms-db-volume-claim.yaml

kubectl delete -f users/users.yaml
kubectl delete -f users/users-service.yaml
kubectl delete -f users-db/users-db.yaml
kubectl delete -f users-db/users-db-service.yaml
kubectl delete -f users-db/users-db-volume.yaml
kubectl delete -f users-db/users-db-volume-claim.yaml

kubectl delete -f chat/chat.yaml
kubectl delete -f chat/chat-service.yaml
kubectl delete -f chat-db/chat-db.yaml
kubectl delete -f chat-db/chat-db-service.yaml
kubectl delete -f chat-db/chat-db-volume.yaml
kubectl delete -f chat-db/chat-db-volume-claim.yaml

kubectl delete -f videos/videos.yaml
kubectl delete -f videos/videos-service.yaml
kubectl delete -f videos-db/videos-db.yaml
kubectl delete -f videos-db/videos-db-service.yaml
kubectl delete -f videos-db/videos-db-volume.yaml
kubectl delete -f videos-db/videos-db-volume-claim.yaml

kubectl delete -f zookeeper/zookeeper.yaml
kubectl delete -f zookeeper/zookeeper-service.yaml
kubectl delete -f kafka/kafka.yaml
kubectl delete -f kafka/kafka-service.yaml

kubectl delete -f kong/gateway.yaml
kubectl delete -f kong/gateway_class.yaml

kubectl delete -f kong/videos_route.yaml
kubectl delete -f kong/chat_route.yaml
kubectl delete -f kong/rooms_route.yaml
kubectl delete -f kong/users_route.yaml
kubectl delete -f kong/frontend_route.yaml

kubectl delete -f frontend/frontend.yaml
kubectl delete -f frontend/frontend-service.yaml
