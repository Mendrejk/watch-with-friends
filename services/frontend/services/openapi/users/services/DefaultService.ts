/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentData } from '../models/PaymentData';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
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
     * Read Item
     * @param itemId
     * @param q
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readItemItemsItemIdGet(
        itemId: number,
        q?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            query: {
                'q': q,
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
    /**
     * Register
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static registerRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static loginLoginPost(
        requestBody: UserCreate,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Checkout Session
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createCheckoutSessionCreateCheckoutSessionPost(
        requestBody: PaymentData,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/create-checkout-session/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stripe Webhook
     * @returns any Successful Response
     * @throws ApiError
     */
    public static stripeWebhookStripeWebhookPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stripe-webhook/',
        });
    }
    /**
     * Get Sessions
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSessionsSessionsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sessions/',
        });
    }
    /**
     * Check Premium Status
     * @param login
     * @returns any Successful Response
     * @throws ApiError
     */
    public static checkPremiumStatusSessionsPremiumLoginGet(
        login: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sessions/premium/{login}',
            path: {
                'login': login,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
