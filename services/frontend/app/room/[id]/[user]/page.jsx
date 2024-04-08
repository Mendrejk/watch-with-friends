'use client'

import { useEffect, useRef, useState } from "react";
import { DefaultService } from "@/services/openapi/rooms"
import { OpenAPI } from "@/services/openapi/rooms"
import React from "react";
import ReactPlayer from 'react-player'
import { backend_url, backend_ws_url } from "@/app/backend";

OpenAPI.BASE = `${backend_url}/api/rooms`

export default function Page({ params }) {

    let ws = null;

    const [me, setMe] = useState(params.user)
    const [room, setRoom] = useState(null)
    const [users, setUsers] = useState([])
    const [owner, setOwner] = useState('')
    const [amIOwner, setAmIOwner] = useState(false)

    const [url, setUrl] = useState('')

    const [isPlaying, setIsPlaying] = useState(false)
    const [assumeLeader, setAssumeLeader] = useState(false)

    const [progress, setProgress] = useState(0)

    const [serverProgress, setServerProgress] = useState(0)
    const [serverIsPlaying, setServerIsPlaying] = useState(false)

    const player = useRef(null);

    useEffect(() => {
        DefaultService.readRoomRoomRoomIdGet(params.id).then((data) => { setRoom(data.room) })
        DefaultService.readRoomUsersRoomRoomIdUsersGet(params.id).then((data) => { setUsers(data.users) })
        DefaultService.readRoomOwnerRoomRoomIdOwnerGet(params.id).then((data) => { setOwner(data.owner) })

        ws = new WebSocket(`${backend_ws_url}/api/rooms/ws`);
        ws.addEventListener("message", (event) => {
            let rooms = JSON.parse(event.data)
            let myRoom = rooms[params.id]
            if (myRoom) {
                setServerIsPlaying(myRoom[1] === "PLAYING")
                setServerProgress(myRoom[0])
            }
        });
    }, [])

    useEffect(() => {
        if (!amIOwner && player.current) {
            console.log(player)
            if (Math.abs(progress - serverProgress) > 2) {
                setProgress(serverProgress)
                player.current.seekTo(serverProgress)
            }
        }

        if (player.current && !assumeLeader) {
            if (isPlaying !== serverIsPlaying) {
                console.log("Setting playing from server" + serverIsPlaying)
                setIsPlaying(serverIsPlaying)
            }
        }

    }, [player, amIOwner, progress, serverProgress, isPlaying, serverIsPlaying, assumeLeader])

    useEffect(() => {
        if (me == owner[0]) {
            setAmIOwner(true)
        }
    }, [owner])

    useEffect(() => {
        if (amIOwner) {
            DefaultService.setProgressRoomRoomIdSetProgressProgressPost(params.id, parseInt(progress), me)
        }
    }, [amIOwner, progress]);


    if (!room) return (<div>Loading...</div>)
    if (!users) return (<div>Loading...</div>)

    return (<>
        <div>
            Room: {params.id} <br></br>
            Name: {room.name}<br></br>
            Owner {room.owner[0]} - {room.owner[1]}<br></br>
        </div>

        <hr></hr>

        <div>Users:</div>
        <ul>
            {users.map((user) => (
                <li key={user[0]}>{user[0]} - {user[1]}</li>
            ))}
        </ul>

        <hr></hr>

        <div>
            Owner: {owner[0]} - {owner[1]}
            {amIOwner && <div>I am owner</div>}
        </div>


        <hr></hr>


        <div className="flex justify-around">
            <div>
                Playback <br></br>
                {String(isPlaying)} <br></br>
                {progress} <br></br>
            </div>

            <div>
                Server Playback <br></br>
                {String(serverIsPlaying)} <br></br>
                {serverProgress} <br></br>
            </div>
        </div>

        <ReactPlayer
            url='https://www.youtube.com/watch?v=LXb3EKWsInQ'
            onPlay={() => {
                console.log(" Setting play")
                setAssumeLeader(true)
                setTimeout(() => { setAssumeLeader(false) }, 1000);
                DefaultService.playRoomRoomIdPlayPost(params.id)
                setIsPlaying(true)
                // TODO: On pause/play - ask leader for their progress and synchronize with all users
            }}
            onPause={() => {
                console.log(" Setting pause")
                setAssumeLeader(true)
                setTimeout(() => { setAssumeLeader(false) }, 1000);
                DefaultService.pauseRoomRoomIdPausePost(params.id)
                setIsPlaying(false)
            }}
            onProgress={(x) => setProgress(x.playedSeconds)}
            controls={true}
            playing={isPlaying}
            muted={true}
            ref={player}
        />
    </>)
}
