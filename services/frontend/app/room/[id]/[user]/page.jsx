'use client'

import { useEffect, useRef, useState } from "react";
import { DefaultService } from "@/services/openapi/rooms"
import { OpenAPI } from "@/services/openapi/rooms"
import React from "react";
import ReactPlayer from 'react-player'
import { backend_url, backend_ws_url } from "@/app/backend";

import { DefaultService as DefaultServiceChat } from "@/services/openapi/chat"
import { OpenAPI as OpenAPIChat } from "@/services/openapi/chat"

OpenAPI.BASE = `${backend_url}/api/rooms`
OpenAPIChat.BASE = `${backend_url}/api/chat`

export default function Page({ params }) {

    let ws = null;
    let chat_ws = null;

    const [me, setMe] = useState(params.user)
    const [room, setRoom] = useState(null)
    const [users, setUsers] = useState([])
    const [chat, setChat] = useState([])
    const [owner, setOwner] = useState('')
    const [amIOwner, setAmIOwner] = useState(false)

    const [newMessage, setNewMessage] = useState('')

    const [url, setUrl] = useState('')

    const [isPlaying, setIsPlaying] = useState(false)
    const [assumeLeader, setAssumeLeader] = useState(false)

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

        DefaultServiceChat.readRoomRoomRoomIdGet(params.id).then((data) => {
            if (data.room) {
                setChat(data.room)
            } else {
                DefaultServiceChat.createRoomCreateRoomRoomIdPost(params.id).then((data) => {
                    setChat(data.room)
                })
            }


        })

        ws = new WebSocket(`${backend_ws_url}/api/rooms/ws`);
        ws.addEventListener("message", (event) => {
            let rooms = JSON.parse(event.data)
            let myRoom = rooms[params.id]
            if (myRoom) {
                setServerIsPlaying(myRoom[1] === "PLAYING")
                setServerProgress(myRoom[0])
            }
        });


        chat_ws = new WebSocket(`${backend_ws_url}/api/chat/ws/${params.id}`);
        chat_ws.addEventListener("message", (event) => {
            let chat = JSON.parse(event.data)
            let messages = []
            for (let i = 0; i < chat.size; i++) {
                messages.push(chat[i])
            }
            // setChat(chat)
            // console.log(typeof(chat))
        });
    }, [])

    useEffect(() => {
        if (!amIOwner && player.current) {
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

    useEffect(() => {
        const interval = setInterval(() => {
            DefaultServiceChat.readRoomRoomRoomIdGet(params.id).then((data) => {
                if (data.room) {
                    setChat(data.room)
                } else {
                    DefaultServiceChat.createRoomCreateRoomRoomIdPost(params.id).then((data) => {
                        setChat(data.room)
                    })
                }
            })
        }, 100); // Fetch chat messages every 100ms

        // Clean up function
        return () => {
            clearInterval(interval);
        };
    }, [params.id]); // Re-run the effect when `params.id` changes

    if (!room) return (<div>Loading...</div>)
    if (!users) return (<div>Loading...</div>)
    if (!chat) return (<div>Loading...</div>)

    return (<>
        <div className="h-full w-full">
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
                    setTimeout(() => {
                        setAssumeLeader(false)
                    }, 1000);
                    DefaultService.playRoomRoomIdPlayPost(params.id)
                    setIsPlaying(true)
                    // TODO: On pause/play - ask leader for their progress and synchronize with all users
                }}
                onPause={() => {
                    console.log(" Setting pause")
                    setAssumeLeader(true)
                    setTimeout(() => {
                        setAssumeLeader(false)
                    }, 1000);
                    DefaultService.pauseRoomRoomIdPausePost(params.id)
                    setIsPlaying(false)
                }}
                onProgress={(x) => setProgress(x.playedSeconds)}
                controls={true}
                playing={isPlaying}
                muted={true}
                ref={player}
            />

            <div className="mt-5 flex flex-col items-center">
                <input className="w-full" type="text" value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}></input>
                <button className="w-24" onClick={() => {
                    setNewMessage('')
                    DefaultServiceChat.addMessageRoomRoomIdAddMessageMessageUserNamePost(params.id, newMessage, me).then((data) => {
                        setChat(data.room)
                    })
                }}>Send
                </button>
            </div>

            <div className="flex flex-1 mt-5 justify-center h-full border-amber-500 border-2">
                {chat.messages && chat.messages.length > 0 &&
                    <ul>
                        {chat.messages.map((message, index) => (
                            <li key={index}>{message.user_name} - {message.message}</li>
                        ))}
                    </ul>}
            </div>
        </div>
    </>)
}
