import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskGroupsList, TaskList, NewTaskList } from '../models/shared.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getLists() {
    return this.http.get<TaskGroupsList>(environment.apiUrl + '/list/');
  }

  getTaskList(id: string) {
    return this.http.get<TaskList>(environment.apiUrl + `/list/${id}`)
  }

  createTaskGroup(task: string) {
    return this.http.post<NewTaskList>(environment.apiUrl + '/list/', { title: task });
  }
}
