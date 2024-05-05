Invoke-Expression "yarn openapi -i http://localhost:2137/api/rooms/openapi.json -o services/openapi/rooms"
Invoke-Expression "yarn openapi -i http://localhost:2137/api/chat/openapi.json -o services/openapi/chat"
Invoke-Expression "yarn openapi -i http://localhost:2137/api/videos/openapi.json -o services/openapi/videos"
Invoke-Expression "yarn openapi -i http://localhost:2137/api/users/openapi.json -o services/openapi/users"