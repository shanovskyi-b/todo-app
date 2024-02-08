import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskGroups } from '../models/shared.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getLists() {
    return this.http.get<TaskGroups>(environment.apiUrl + '/list/');
  } 
}
