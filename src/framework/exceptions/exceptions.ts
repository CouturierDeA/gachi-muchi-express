import {
    constants
} from "http2";

const {
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_BAD_REQUEST
} = constants;

export class ApiException {
    constructor(public message: string, public status: number) {

    }

    static internal(message: string) {
        return new ApiException(
            message,
            HTTP_STATUS_INTERNAL_SERVER_ERROR
        )
    }

    static userError(message: string) {
        return new ApiException(
            message,
            240
        )
    }

    static notFound(message: string) {
        return new ApiException(
            message,
            HTTP_STATUS_NOT_FOUND
        )
    }

    static notAuthorized(message: string) {
        return new ApiException(
            message,
            HTTP_STATUS_UNAUTHORIZED
        )
    }
}