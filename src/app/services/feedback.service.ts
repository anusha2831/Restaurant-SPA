import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { Observable, of, pipe } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProcessHttpMsgService } from '../services/process-http-msg.service';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  

  constructor(private http: HttpClient,
    private ProcessHttpMsgServie: ProcessHttpMsgService) { }

    
    postFeedback(feedback: Feedback): Observable<Feedback>{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-type': 'application/json'
        })
      };
      return this.http.post<Feedback>(baseURL+'feedback', feedback, httpOptions)
      .pipe(catchError(this.ProcessHttpMsgServie.handleError));
    }
}
