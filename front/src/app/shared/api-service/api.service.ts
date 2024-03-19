import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskGroupsList, TaskList, NewTaskList } from '../models/shared.models';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getLists(): Observable<TaskGroupsList> {
    return this.http.get<TaskGroupsList>(environment.apiUrl + '/list/');
  }

  getTaskList(id: string): Observable<TaskList> {
    return this.http.get<TaskList>(environment.apiUrl + `/list/${id}`)
  }

  createTaskGroup(task: string): Observable<NewTaskList> {
    return this.http.post<NewTaskList>(environment.apiUrl + '/list/', { title: task });
  }

  renameTaskGroup(id: string, title: string): Observable<NewTaskList> {
    return this.http.put<NewTaskList>(environment.apiUrl + `/list/${id}`, { list: { id: id, title: title }});
  }
  deleteTaskList(id: string): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + `/list/${id}`);
  }
}
