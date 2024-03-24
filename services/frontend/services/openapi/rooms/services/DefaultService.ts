/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Create Room
     * @param roomName
     * @param ownerName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createRoomCreateRoomRoomNameOwnerNamePost(
        roomName: string,
        ownerName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/create_room/{room_name}/{owner_name}',
            path: {
                'room_name': roomName,
                'owner_name': ownerName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Room
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteRoomDeleteRoomRoomIdDelete(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/delete_room/{room_id}',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Room
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readRoomRoomRoomIdGet(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/room/{room_id}',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Room Owner
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readRoomOwnerRoomRoomIdOwnerGet(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/room/{room_id}/owner',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Room Users
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readRoomUsersRoomRoomIdUsersGet(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/room/{room_id}/users',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Join Room
     * @param roomId
     * @param userName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static joinRoomRoomRoomIdJoinUserNamePost(
        roomId: string,
        userName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/room/{room_id}/join/{user_name}',
            path: {
                'room_id': roomId,
                'user_name': userName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Leave Room
     * @param roomId
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static leaveRoomRoomRoomIdLeaveUserIdDelete(
        roomId: string,
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/room/{room_id}/leave/{user_id}',
            path: {
                'room_id': roomId,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Play
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static playRoomRoomIdPlayPost(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/room/{room_id}/play',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pause
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static pauseRoomRoomIdPausePost(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/room/{room_id}/pause',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Video
     * @param roomId
     * @param videoUrl
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static setVideoRoomRoomIdSetVideoVideoUrlUserIdPost(
        roomId: string,
        videoUrl: string,
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/room/{room_id}/set_video/{video_url}/{user_id}',
            path: {
                'room_id': roomId,
                'video_url': videoUrl,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Video
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readVideoRoomRoomIdVideoGet(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/room/{room_id}/video',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Status
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readStatusRoomRoomIdStatusGet(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/room/{room_id}/status',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Progress
     * @param roomId
     * @param progress
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static setProgressRoomRoomIdSetProgressProgressPost(
        roomId: string,
        progress: number,
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/room/{room_id}/set_progress/{progress}',
            path: {
                'room_id': roomId,
                'progress': progress,
            },
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Progress
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readProgressRoomRoomIdProgressGet(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/room/{room_id}/progress',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Rooms
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readRoomsRoomsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rooms',
        });
    }
}
