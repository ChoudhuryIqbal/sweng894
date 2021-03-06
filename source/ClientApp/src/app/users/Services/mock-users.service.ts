import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockUsersService {
    constructor() {
    }

    getUsers(): Observable<User[]> {
        return of(undefined);
    }

    getUser(id: string): Observable<User> {
        return of(undefined);
    }

    registerUser(id: string): void {
    }

    deactivateUser(id: string): Observable<boolean> {
        return of(undefined);
    }
}
