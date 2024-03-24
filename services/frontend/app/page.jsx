'use client'


import { useEffect, useState } from "react";
import { DefaultService } from "../services/openapi/rooms"
import { OpenAPI } from "../services/openapi/rooms"
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation'

OpenAPI.BASE = "http://localhost/api/rooms"

const backend = "localhost"
const user = "1337"

export function RoomListWithAdd({ rooms, onRoomClick, onAddRoom }) {
  var [newRoomName, setNewRoomName] = useState("")
  return (
    <div>
      <input onChange={(event) => setNewRoomName(event.target.value)}></input>
      <button onClick={() => onAddRoom(newRoomName)}>Add room</button>
      {rooms.map((room) => (
        <div key={room.id} onClick={() => onRoomClick(room)}>
          <h1>{room.name}</h1>
        </div>
      ))}
    </div>
  )
}

export function Room({ room }) {
  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.owner}</p>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const ws = new WebSocket('ws://' + backend + '/api/chat/ws');
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
    DefaultService.createRoomCreateRoomRoomNameOwnerNamePost(name, creator).then(() => fetchRooms())
  }

  ws.addEventListener('open', (event) => { console.log(event) })
  ws.addEventListener('message', (event) => { console.log(event) })

  if (isLoading) return <p>Loading...</p>
  if (!rooms) return <p>No data</p>

  return (
    <>
      <RoomListWithAdd
        rooms={rooms}
        onRoomClick={(room) => {
          router.push("/room/" + room.id + "/" + "1337")
        }}
        onAddRoom={(name) => onAddRoom(name, user)} />


      <RoomListWithAdd
        rooms={rooms}
        onRoomClick={(room) => {
          router.push("/room/" + room.id + "/" + "michał")
        }}
        onAddRoom={(name) => onAddRoom(name, user)} />
    </>
  )
}
