// © [2021] Cognizant. All rights reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
 
//     http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { HttpErrorResponse } from '@angular/common/http';

enum IMessageTypes {
    whitelistError = 'whitelist error'
}

export const DEFAULT_ERROR_MESSAGES = {
    E0: 'application is offline!',
    E400: 'invalid request, please check the inputs',
    E401: 'unauthorized, please login again to continue',
    E403: 'You don’t have required role or privilege to complete this action',
    E405: 'the action not supported yet',
    E409: 'resource conflict, please choose another name/id',
    E500: 'unable to procss the request'
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
function parseError(error: IErrorResponse, code: number): IParsedError {
    if (error && error.message) {
        return parseMessage(error.message);
    }
    return { message: DEFAULT_ERROR_MESSAGES[`E${code}`] };
}
export function parseApiError(error: HttpErrorResponse, message: string): IParsedError {
    if (typeof error.status === 'number') {
        switch (error.status) {
            case 0:
                return { message: DEFAULT_ERROR_MESSAGES.E0 };
            case 401:
                return { message: DEFAULT_ERROR_MESSAGES.E401 };
            case 403:
                return { message: DEFAULT_ERROR_MESSAGES.E403 };
            case 400:
            case 409:
            case 405:
            case 500:
                return parseError(error.error, error.status);
        }
    }
    return { message };
}
