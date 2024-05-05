/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Read Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readRootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
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
     * Create Room
     * @param roomId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createRoomCreateRoomRoomIdPost(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/create_room/{room_id}',
            path: {
                'room_id': roomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Message
     * @param roomId
     * @param message
     * @param userName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addMessageRoomRoomIdAddMessageMessageUserNamePost(
        roomId: string,
        message: string,
        userName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/room/{room_id}/add_message/{message}/{user_name}',
            path: {
                'room_id': roomId,
                'message': message,
                'user_name': userName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Item
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readItemTestdbGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/testdb',
        });
    }
}
