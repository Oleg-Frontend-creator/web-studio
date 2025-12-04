import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {UserRequestOrderType} from "../../../types/user-request-order.type";
import {HttpClient} from "@angular/common/http";
import {UserRequestConsultationType} from "../../../types/user-request-consultation.type";

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  constructor(private http: HttpClient) { }

  sendRequestOrder(body: UserRequestOrderType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);
  }

  sendRequestConsultation(body: UserRequestConsultationType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);
  }
}
