'use client'

import { useEffect, useState } from "react";
import { DefaultService } from "../services/openapi/rooms"
import { OpenAPI } from "../services/openapi/rooms"
import { useRouter } from 'next/navigation'
import { backend_url } from "@/app/backend"
OpenAPI.BASE = `${backend_url}/api/rooms`

const admin_user = "1337"
const normal_user = "jan"

function RoomListWithAdd({ rooms, onRoomClick, onAddRoom }) {
  let [newRoomName, setNewRoomName] = useState("")
  return (
    <div>
      <input onChange={(event) => setNewRoomName(event.target.value)}></input>
      <br />
      <button className="min-w-full" onClick={() => onAddRoom(newRoomName)}>Add room</button>
      {rooms.map((room) => (
        <div key={room.id} onClick={() => onRoomClick(room)}>
          <li>{room.name}</li>
        </div>
      ))}
    </div>
  )
}

function Room({ room }) {
  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.owner}</p>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [rooms, setRooms] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => { fetchRooms() }, [])

  let fetchRooms = () => {
    DefaultService.readRoomsRoomsGet().then((data) => {
      setRooms(data.rooms)
      setLoading(false)
    })
  }

  let onAddRoom = (name, creator) => {
    DefaultService.createRoomCreateRoomRoomNameOwnerNamePost(name, creator).then(() =>
      fetchRooms()
    )
  }

  if (isLoading) return <p>Loading...</p>
  if (!rooms) return <p>No data</p>

  return (
    <>
      <div className="flex justify-center gap-4">
        <RoomListWithAdd
          rooms={rooms}
          onRoomClick={(room) => { router.push("/room/" + room.id + "/" + admin_user) }}
          onAddRoom={(name) => onAddRoom(name, admin_user)} />

        <RoomListWithAdd
          rooms={rooms}
          onRoomClick={(room) => { router.push("/room/" + room.id + "/" + normal_user) }}
          onAddRoom={(name) => onAddRoom(name, normal_user)} />
      </div>

    </>
  )
}
