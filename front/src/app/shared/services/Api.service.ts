import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getLists() {
    return this.http.get<Lists>('http://localhost:3000/list/');
  } 
  
}

export interface List  {
  id: string;
  title: string;
}

export interface Lists {
  lists: List[];
}
