import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskGroups } from '../shared-interfaces.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }
  
  apiUrl: string = environment.apiUrl + '/list/';

  getLists() {
    return this.http.get<TaskGroups>(this.apiUrl);
  } 
}
