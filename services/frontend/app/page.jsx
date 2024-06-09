'use client';

import { useEffect, useState } from "react";
import { DefaultService } from "@/services/openapi/rooms";
import { OpenAPI } from "@/services/openapi/rooms";
import { useRouter } from 'next/navigation';
import { backend_url } from "@/app/backend";
OpenAPI.BASE = `${backend_url}/api/rooms`;

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("NewUser");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRooms();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  let fetchRooms = () => {
    DefaultService.readRoomsRoomsGet().then((data) => {
      setRooms(data.rooms);
      setLoading(false);
    });
  };

  let onActionRoom = (name, role) => {
    if (role === "Admin") {
      DefaultService.createRoomCreateRoomRoomNameOwnerNamePost(name, userName, userId).then((response) => {
        const roomId = response.room.id;
        router.push(`/room/${roomId}/${userId}/${userName}`);
      }).catch((error) => {
        console.error("Error creating room:", error);
      });
    }
  };

  const isNameEmpty = userName.trim() === "";

  const handleAddRoom = (newRoomName) => {
    onActionRoom(newRoomName, userRole);
  };

  const handleUserRoleChange = (role) => {
    setUserRole(role);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backend_url}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setUserName(formData.username);
        // setUserId(data.user_id); // Assuming user_id is returned in response
      } else {
        console.error(data.detail);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleRegister = async () => {
    try {
      const response = await fetch(`${backend_url}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoginForm(true);
      } else {
        console.error(data.detail);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!rooms) return <p>No data</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!isAuthenticated ? (
        <div className="w-full max-w-md p-4">
          {isLoginForm ? (
            <>
              <h2>Login</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 mb-2 text-white bg-blue-500 rounded-lg"
              >
                Login
              </button>
              <p onClick={() => setIsLoginForm(false)} className="cursor-pointer text-blue-500">Dont have an account? Register</p>
            </>
          ) : (
            <>
              <h2>Register</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <button
                onClick={handleRegister}
                className="w-full px-4 py-2 mb-2 text-white bg-green-500 rounded-lg"
              >
                Register
              </button>
              <p onClick={() => setIsLoginForm(true)} className="cursor-pointer text-blue-500">Already have an account? Login</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="w-full max-w-md p-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              readOnly
            />
            <button
              onClick={() => handleUserRoleChange("Admin")}
              className="w-full px-4 py-2 mb-2 text-white bg-blue-500 rounded-lg"
            >
              Create Room
            </button>
            <button
              onClick={() => handleUserRoleChange("User")}
              className="w-full px-4 py-2 text-white bg-green-500 rounded-lg"
            >
              Join Room
            </button>
          </div>

          {userRole === "User" && (
            <div className="w-full max-w-md p-4">
              <RoomList rooms={rooms} onRoomClick={(room) => { router.push(`/room/${room.id}/${userId}/${userName}`) }} />
            </div>
          )}

          {userRole === "Admin" && (
            <div className="w-full max-w-md p-4">
              <AddRoom onAddRoom={handleAddRoom} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RoomList({ rooms, onRoomClick }) {
  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id} onClick={() => onRoomClick(room)}>
          <li>{room.name}</li>
        </div>
      ))}
    </div>
  );
}

function AddRoom({ onAddRoom }) {
  const [newRoomName, setNewRoomName] = useState("");

  const handleAddRoom = () => {
    if (newRoomName.trim() !== "") {
      onAddRoom(newRoomName);
      setNewRoomName("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter room name"
        value={newRoomName}
        onChange={(event) => setNewRoomName(event.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      />
      <button className="w-full px-4 py-2 mb-2 text-white bg-blue-500 rounded-lg" onClick={handleAddRoom}>
        Add Room
      </button>
    </div>
  );
}
