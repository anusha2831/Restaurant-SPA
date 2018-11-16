import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Feedback, ContactType} from '../shared/feedback';
import { Location} from '@angular/common';
import { FeedbackService} from '../services/feedback.service';
import { flyInOut,visibility, expand } from '../animations/app.animation';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
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
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;  
  fbErrMess: string;
  visibility = 'shown';
  showFormData:boolean = false;
  showFeedbackForm:boolean = true;
  submittedForm:boolean=false;
  contactType=ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  }

  constructor(private feedbackservice:FeedbackService,
    private location:Location,
    private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['0', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree:false,
      contacttype:'None',
      message:''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re) set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
    this.feedback = this.feedbackForm.value;    
    this.showFeedbackForm = false;
    this.submittedForm = true;
   // console.log(this.feedback);
    this.feedbackservice.postFeedback(this.feedback)
    .subscribe(feedback =>{ 
      this.feedback = feedback;
      this.visibility = 'hidden';
      this.showFormData = true;
      this.submittedForm = false;
      setTimeout (() => {
        this.showFeedbackForm = true;
        this.showFormData = false;
     }, 5000);
    },
    errmess => {this.visibility = 'shown',  this.fbErrMess = <any>errmess})
    
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0, 
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
