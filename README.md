# An application for watching videos with your friends in real-time.

## Installation
1. Clone the repository
2. Install [rancher-desktop](https://rancherdesktop.io/) for managing the kubernetes cluster (use the moby option)
   1. Make sure that you don't have docker desktop running!
3. Make sure rancher is running and there are no issues in the diagnostics tab
4. Run the services/k8s_build script to build and apply the kubernetes services
5. In rancher-desktop, click the port-forwarding tab and forward kong-gateway-proxy - kong-proxy on port **2137**.
6. Backend should be running now, you can check it by visiting [http://localhost:2137/api/videos/](http://localhost:2137/api/videos/). You should see a hello message.
7. Install the frontend with `npm start` in the frontend directory.
8. Run the frontend with `npm run dev`.