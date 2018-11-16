import { Injectable } from '@angular/core';
import {Promotion} from '../shared/promotion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpMsgService } from '../services/process-http-msg.service';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import{ PROMOTIONS} from '../shared/promotions';
import { Observable, of, pipe } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private ProcessHttpMsgServie: ProcessHttpMsgService) { }
  
  getPromotions():Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));
  }
   
  getPromotion(id:string): Observable<Promotion> { 
    return this.http.get<Promotion>(baseURL + 'promotions/'+ id)
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));   
   // return of(PROMOTIONS.filter((promo)=>(promo.id===id))[0]).pipe(delay(2000));
}

  getFeaturedPromotion():Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
    .pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));
    //return of(PROMOTIONS.filter((promotion)=>promotion.featured)[0]).pipe(delay(2000));
}

}
