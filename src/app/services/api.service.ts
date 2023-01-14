import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'https://api.quotable.io/random';

  constructor(private httpClient: HttpClient) { }
  
  getQuote(){
    return this.httpClient.get(this.url);
  }
}
