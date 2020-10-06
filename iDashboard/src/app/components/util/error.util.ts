import { HttpErrorResponse } from '@angular/common/http';

enum IMessageTypes {
    whitelistError = 'whitelist error'
}
interface IErrorResponse {
    error: string;
    message: string;
    path: string;
    status: number;
    timestamp: string;
}
interface IParsedError {
    title?: string;
    message: string;
}
function parseMessage(message: string): IParsedError {
    /**
     * strip field names if exist
     */
    if (/^\w+.\w+\s?:/.test(message)) {
        message = message.substring(message.indexOf(':') + 1);
    }
    const title = Object.keys(IMessageTypes).map(type => IMessageTypes[type]).find(error => message.startsWith(error));
    if (title) {
        message = message.replace(title + ' -', '').trim();
        return { title, message };
    }
    return { message };
}
function parse400(error: IErrorResponse): IParsedError {
   if (error && error.message) {
        return parseMessage(error.message);
    }
    return { message: 'invalid request, please check the inputs' };
}
function parse405(error: IErrorResponse): IParsedError {
    if (error && error.message) {
        return parseMessage(error.message);
    }
    return { message: 'the action not supported yet' };
}
function parse409(error: IErrorResponse): IParsedError {
   if (error && error.message) {
        return parseMessage(error.message);
    }
    return { message: 'resource conflict, please choose another name/id' };
}
function parse500(error: IErrorResponse): IParsedError {
    if (error && error.message) {
        return parseMessage(error.message);
    }
    return { message: 'unable to procss the request' };
}
export function parseApiError(error: HttpErrorResponse, message: string): IParsedError {
    if (typeof error.status === 'number') {
        switch (error.status) {
            case 0:
                return { message: 'application is offline!' };
            case 401:
                return { message: 'unauthorized, please login again to continue' };
            case 400:
                return parse400(error.error);
            case 409:
                return parse409(error.error);
            case 405:
                return parse405(error.error);
            case 500:
                return parse500(error.error);
        }
    }
    return { message };
}
