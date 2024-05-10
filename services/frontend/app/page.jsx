// ./app/page.jsx

// Mark the component as a client-side component
'use client';

import { useEffect, useState } from "react";
import { DefaultService } from "../services/openapi/rooms";
import { OpenAPI } from "../services/openapi/rooms";
import { useRouter } from 'next/navigation';
import { backend_url } from "@/app/backend";
OpenAPI.BASE = `${backend_url}/api/rooms`;

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("NewUser");

  useEffect(() => { fetchRooms() }, []);

  let fetchRooms = () => {
    DefaultService.readRoomsRoomsGet().then((data) => {
      setRooms(data.rooms);
      setLoading(false);
    });
  }

  let onActionRoom = (name, role) => {
    if (role === "Admin") {
      DefaultService.createRoomCreateRoomRoomNameOwnerNamePost(name, userName).then((response) => {
        const roomId = response.room.id;
        router.push(`/room/${roomId}/${userName}`);
      }).catch((error) => {
        console.error("Error creating room:", error);
      });
    } 
  }

  const isNameEmpty = userName.trim() === "";

  const handleAddRoom = (newRoomName) => {
    onActionRoom(newRoomName, userRole);
  };

  const handleUserRoleChange = (role) => {
    setUserRole(role);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!rooms) return <p>No data</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md p-4">
        <input type="text" placeholder="Enter your name" value={userName} onChange={(event) => setUserName(event.target.value)} className="w-full px-4 py-2 mb-4 border rounded-lg" />
        <button onClick={() => handleUserRoleChange("Admin")} disabled={isNameEmpty} className="w-full px-4 py-2 mb-2 text-white bg-blue-500 rounded-lg disabled:bg-gray-400">Create Room</button>
        <button onClick={() => handleUserRoleChange("User")} disabled={isNameEmpty} className="w-full px-4 py-2 text-white bg-green-500 rounded-lg disabled:bg-gray-400">Join Room</button>
      </div>

      {(userRole === "User") && (
        <div className="w-full max-w-md p-4">
          <RoomList rooms={rooms} onRoomClick={(room) => { router.push(`/room/${room.id}/${userName}`) }} />
        </div>
      )}

      {(userRole === "Admin") && (
        <div className="w-full max-w-md p-4">
          <AddRoom onAddRoom={handleAddRoom} />
        </div>
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
      <input onChange={(event) => setNewRoomName(event.target.value)} placeholder="Enter room name"></input>
      <br />
      <button className="min-w-full" onClick={handleAddRoom}>Add Room</button>
    </div>
  );
}
