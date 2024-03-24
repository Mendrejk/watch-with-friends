'use client'

import { useEffect, useRef, useState } from "react";
import { DefaultService } from "@/services/openapi/rooms"
import { OpenAPI } from "@/services/openapi/rooms"
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation'
import React from "react";
import ReactPlayer from 'react-player'

OpenAPI.BASE = "http://localhost/api/rooms"
const backend = "localhost"

export default function Page({ params }) {



    let ws = null;

    const [me, setMe] = useState(params.user)
    const [room, setRoom] = useState(null)
    const [users, setUsers] = useState([])
    const [owner, setOwner] = useState('')
    const [amIOwner, setAmIOwner] = useState(false)

    const [url, setUrl] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    const [serverProgress, setServerProgress] = useState(0)
    const [serverIsPlaying, setServerIsPlaying] = useState(false)

    const player = useRef(null);

    useEffect(() => {
        DefaultService.readRoomRoomRoomIdGet(params.id).then((data) => {
            setRoom(data.room)
        })
        DefaultService.readRoomUsersRoomRoomIdUsersGet(params.id).then((data) => {
            setUsers(data.users)
        })
        DefaultService.readRoomOwnerRoomRoomIdOwnerGet(params.id).then((data) => {
            setOwner(data.owner)
        })
        // DefaultService.joinRoomRoomRoomIdJoinUserNamePost(params.id, '1337').then((data) => {
        //     console.log(data)
        // })
        ws = new WebSocket('ws://' + backend + '/api/rooms/ws');
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

            if (isPlaying !== serverIsPlaying) {
                console.log("xd")
                setIsPlaying(serverIsPlaying)

            }
        }
    }, [player, amIOwner, progress, serverProgress, isPlaying, serverIsPlaying])

    useEffect(() => {
        if (me == owner[0]) {
            setAmIOwner(true)
        }
    }, [owner])

    useEffect(() => {
        if (amIOwner) {
            if (isPlaying) {
                console.log(" Setting play")
                DefaultService.playRoomRoomIdPlayPost(params.id)
            } else {
                console.log(" Setting pause")
                DefaultService.pauseRoomRoomIdPausePost(params.id)
            }

            DefaultService.setProgressRoomRoomIdSetProgressProgressPost(params.id, parseInt(progress), me)
        }
    }, [amIOwner, isPlaying, progress]);

    useEffect(() => {
        console.log("DUPA:" + isPlaying)
    }, [isPlaying])



    if (!room) return (<div>Loading...</div>)
    if (!users) return (<div>Loading...</div>)

    return (<>
        <div>Room: {params.id}</div>
        <div>{room.name}</div>
        <div>{room.owner}</div>
        <br></br>
        <div>Users:</div>
        <ul>
            {users.map((user) => (
                <li key={user[0]}>{user[0]} - {user[1]}</li>
            ))}
        </ul>
        <br></br>
        <div>Owner:</div>
        <div>{owner[0]} - {owner[1]}</div>

        <div>Playback</div>
        <div>{String(isPlaying)}</div>
        <div>{progress}</div>
        <br></br>

        <div>Server Playback</div>
        <div>{String(serverIsPlaying)}</div>
        <div>{serverProgress}</div>


        {amIOwner && <div>I am owner</div>}

        <ReactPlayer
            url='https://www.youtube.com/watch?v=LXb3EKWsInQ'
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onProgress={(x) => setProgress(x.playedSeconds)}
            controls={true}
            playing={isPlaying}
            muted={true}
            ref={player}
        />
    </>)
}