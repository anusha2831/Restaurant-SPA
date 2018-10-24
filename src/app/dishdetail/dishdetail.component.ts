import { Component, OnInit, Input } from '@angular/core';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  @Input()
  dish = DISHES;
  constructor() { }

  ngOnInit() {
  }

}
