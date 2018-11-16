import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpMsgService } from '../services/process-http-msg.service';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { Observable, of, pipe} from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private ProcessHttpMsgServie: ProcessHttpMsgService) { }

  getLeaders():Observable<Leader[]>{
    //return of(LEADERS).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));
  }
    
  getSpecLeader(id:string):Observable<Leader> {    
   // return of(LEADERS.filter((lead)=>(lead.id===id))[0]).pipe(delay(2000));
    return this.http.get<Leader>(baseURL + 'leadership/'+ id)
    .pipe(catchError(this.ProcessHttpMsgServie.handleError)); 
}

  getFeaturedLeader():Observable<Leader> {
   // return of(LEADERS.filter((leader)=>leader.featured)[0]).pipe(delay(2000));
    return this.http.get<Leader>(baseURL + 'leadership?featured=true')
    .pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));
}

}
