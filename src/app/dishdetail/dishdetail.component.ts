import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location} from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService} from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {  Comment} from '../shared/comment';
import { visibility, flyInOut,expand } from '../animations/app.animation'

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style':'display:block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {
  
  dish : Dish;
  dishIds: string[];
  errMess: string;
  prev: string;
  next: string;
  dishDetailForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  visibility = 'shown';

  @ViewChild('ddform') dishDetailDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
  }
}
 
  constructor(private dishservice:DishService,
    private route:ActivatedRoute,
    private location:Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

  ngOnInit() {
    this.createForm();
    this.dishservice.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);
    
    this.route.params.pipe(switchMap((params: ParamMap) => {this.visibility = 'hidden'; return this.dishservice.getDish(params['id'])}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish;this.setPrevNext(dish.id);this.visibility = 'shown';},
     errmess => this.errMess = <any>errmess)
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.next = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.prev = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm(){
    this.dishDetailForm= this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating:5,
      comment: ['', Validators.required]      
    });
    this.dishDetailForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re) set form validation messages
  }
  onValueChanged(data?: any) {
    if (!this.dishDetailForm) { return; }
    const form = this.dishDetailForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  
  onSubmit(){
    this.comment = this.dishDetailForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
    .subscribe(dish =>{
      this.dish=dish;this.dishcopy=dish;
    },
    errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess})
    this.dishDetailDirective.resetForm();
    this.dishDetailForm.reset({
      author: '',
      rating: 5 ,
      comment: ''   
    });    
  }  
  

  goBack(): void{
    this.location.back();
  }

}
