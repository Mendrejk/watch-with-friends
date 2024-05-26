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

    const me = params.userId
    const userName = params.userName
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

    // premiun account checking
    const [isPremium, setIsPremium] = useState(false)

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
            let chat_object = JSON.parse(event.data)
            let messages = []
            for (let i = 0; i < chat_object.length; i++) {
                let message_array = chat_object[i]
                messages.push({
                    user_name: message_array[0],
                    message: message_array[1]
                })
            }
            let chat = {
                id: 'todo',
                messages: messages
            }
            setChat(chat)
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
        const handleWindowClose = (event) => {
            if (me == owner[1]) {

                const confirmationMessage = 'Are you sure you want to leave?';
                event.returnValue = confirmationMessage;

                DefaultService.deleteRoomDeleteRoomRoomIdDelete(params.id).then(() => {
                    console.log("Room deleted");
                }).catch((error) => {
                    console.error("Error deleting room:", error);
                });
            }
        };

        window.addEventListener("beforeunload", handleWindowClose);

        return () => {
            window.removeEventListener("beforeunload", handleWindowClose);
        };
    }, [params.id, owner, room]);

    useEffect(() => {
        if (amIOwner) {
            DefaultService.setProgressRoomRoomIdSetProgressProgressPost(params.id, parseInt(progress), me)
        }
    }, [amIOwner, progress]);


    // get api request to `${backend_url}/api/users/check-premium/${userName}`, to check if user is premium or not
    // sorry, że nie async, nie lubię JSa
    useEffect(() => {
        fetch(`${backend_url}/api/users/check-premium/${userName}`)
            .then(response => response.json())
            .then(data => {
                if (data.premium) {
                    setIsPremium(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    function addAccount() {
        fetch(`${backend_url}/api/users/stripe-success/${userName}`)
            .then(response => response.json())
            .then(data => {
                // Handle the response data here
            })
            .catch(error => {
                console.error('Error:', error);
            });
        window.location.href = "https://buy.stripe.com/test_28o7vSgcTgeGbSgaEE";
    }

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

            {/* Premium account info */}
            <div>
                Nickname: {userName} <br></br>
                Konto premium: {String(isPremium)}
            </div>
            <div>
                {!isPremium && <button onClick={addAccount}>KUP PREMIUM</button>}
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
                <button
                    className="w-24"
                    onClick={() => {
                        setNewMessage('');
                        DefaultServiceChat.addMessageRoomRoomIdAddMessageMessageUserNamePost(params.id, newMessage, userName).then((data) => {
                            setChat(data.room);
                        });
                    }}
                    disabled={!isPremium} //Chat only for premium users
                >
                    Send
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
