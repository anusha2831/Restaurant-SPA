import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { Observable, of, pipe } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProcessHttpMsgService } from '../services/process-http-msg.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient,
    private ProcessHttpMsgServie: ProcessHttpMsgService ) { }

  getDishes():Observable<Dish[]>{
    //return of(DISHES).pipe(delay(2000));
    return this.http.get<Dish[]>(baseURL + 'dishes')
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));
  }

  getDish(id:string): Observable<Dish> {
    //return of(DISHES.filter((dish)=>(dish.id===id))[0]).pipe(delay(2000));
    return this.http.get<Dish>(baseURL + 'dishes/'+ id)
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));    
}

  getFeaturedDish(): Observable<Dish> {
    //return of(DISHES.filter((dish)=>dish.featured)[0]).pipe(delay(2000));
    return this.http.get<Dish>(baseURL + 'dishes?featured=true')
    .pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.ProcessHttpMsgServie.handleError));
}

getDishIds(): Observable<string[] | any> {
 
 // return of(DISHES.map(dish => dish.id ));
  return this.getDishes().pipe(map(dishes => dishes.map(dish =>dish.id)))
  .pipe(catchError(error => error));
}
putDish(dish: Dish): Observable<Dish>{
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };
  return this.http.put<Dish>(baseURL+'dishes/'+dish.id, dish, httpOptions)
  .pipe(catchError(this.ProcessHttpMsgServie.handleError));
}
 
}
