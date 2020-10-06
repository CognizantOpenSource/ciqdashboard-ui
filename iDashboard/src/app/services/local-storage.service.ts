import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LocalStorage {

  size: Observable<number>;
  prefix: string;

  constructor(private storage: StorageMap) {
    this.size = this.storage.size;
    this.prefix = environment.storagePrefix;
    if (this.prefix === '' || this.prefix === null) {
      this.prefix = 'idash-ui';
    }
    this.prefix += '.';
  }

  getItem(index: string): Observable<any> {
    return this.storage.get(this.prefix + index);
  }

  setItem(index: string, value: any): Observable<undefined> {
    return this.storage.set(this.prefix + index, value);
  }

  deleteItem(index: string): Observable<undefined> {
    return this.storage.delete(this.prefix + index);
  }

  clearAll(): Observable<undefined> {
    return this.storage.clear();
  }

  hasKey(index: string): Observable<boolean> {
    return this.storage.has(this.prefix + index);
  }

  allKeys(): Observable<string> {
    return this.storage.keys();
  }

  removeKeysStartswith(start: string) {
    this.allKeys().pipe(filter(key => key.startsWith(`${this.prefix}${start}`)), switchMap(key => this.storage.delete(key))).subscribe();
  }
  removeAll() {
    this.allKeys().pipe(switchMap(key => this.storage.delete(key))).subscribe();
  }

}
