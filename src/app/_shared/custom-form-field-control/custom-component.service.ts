import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CustomeComponentService {
constructor(private httpClient: HttpClient) { }
getList(){
    return this.httpClient.get('https://randomuser.me/api/?results=10&inc=gender,name&noinfo');
  }
}