eval $(minikube docker-env)

docker compose build
cd _kubernetes
./stop_all.sh
./start_all.sh
cd ..