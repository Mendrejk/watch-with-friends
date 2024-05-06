kubectl apply -f rooms/rooms.yaml &
kubectl apply -f rooms/rooms-service.yaml &
kubectl apply -f rooms-db/rooms-db.yaml&
kubectl apply -f rooms-db/rooms-db-service.yaml&
kubectl apply -f rooms-db/rooms-db-volume.yaml&
kubectl apply -f rooms-db/rooms-db-volume-claim.yaml&

kubectl apply -f users/users.yaml&
kubectl apply -f users/users-service.yaml&
kubectl apply -f users-db/users-db.yaml&
kubectl apply -f users-db/users-db-service.yaml&
kubectl apply -f users-db/users-db-volume.yaml&
kubectl apply -f users-db/users-db-volume-claim.yaml&

kubectl apply -f chat/chat.yaml&
kubectl apply -f chat/chat-service.yaml&
kubectl apply -f chat-db/chat-db.yaml&
kubectl apply -f chat-db/chat-db-service.yaml&
kubectl apply -f chat-db/chat-db-volume.yaml&
kubectl apply -f chat-db/chat-db-volume-claim.yaml&

kubectl apply -f videos/videos.yaml&
kubectl apply -f videos/videos-service.yaml&
kubectl apply -f videos-db/videos-db.yaml&
kubectl apply -f videos-db/videos-db-service.yaml&
kubectl apply -f videos-db/videos-db-volume.yaml&
kubectl apply -f videos-db/videos-db-volume-claim.yaml&

kubectl apply -f zookeeper/zookeeper.yaml&
kubectl apply -f zookeeper/zookeeper-service.yaml&
kubectl apply -f kafka/kafka.yaml&
kubectl apply -f kafka/kafka-service.yaml&

kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml&
kubectl apply -f kong/gateway.yaml&
kubectl apply -f kong/gateway_class.yaml&

helm repo add kong https://charts.konghq.com&
helm repo update&
helm install kong kong/ingress -n kong --create-namespace &

kubectl apply -f kong/videos_route.yaml&
kubectl apply -f kong/chat_route.yaml&
kubectl apply -f kong/rooms_route.yaml&
kubectl apply -f kong/users_route.yaml&
kubectl apply -f kong/frontend_route.yaml&

kubectl apply -f frontend/frontend.yaml&
kubectl apply -f frontend/frontend-service.yaml&

wait