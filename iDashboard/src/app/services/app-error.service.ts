import { ToastrService } from 'ngx-toastr';
import { ErrorHandler, Injectable, Inject, forwardRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(@Inject(forwardRef(() => ToastrService)) private toastr: ToastrService) {
    }

    handleError(error) {
        error = error && error.rejection;
        if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
                this.toastr.error(`Application is Offline`, `Error`);
            } else {
                this.toastr.error(`${error.error && error.error.message || error.message}`, `Error Code: ${error.status}`);
            }
        } else if (error) {
            this.toastr.error(`${error.message || error.details || error.error || error}`, `Error`);
        }
        throw error;
    }
}
