import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  codeclient : any;
  signin_form : UntypedFormGroup;
  loading : boolean = false;
  submitted : boolean = false;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal, 
              private formBuilder : UntypedFormBuilder, 
              private authenticationService : AuthenticationService, 
              private route : ActivatedRoute, 
              private router : Router) { 
  }

  ngOnInit(): void {
    this.signin_form = this.formBuilder.group({
      xemail : ['', Validators.required],
      xcontrasena : ['', Validators.required]
    });
  }

  onSubmit(form) {
    this.submitted = true;
    this.loading = true;
    if (this.signin_form.invalid) {
      this.loading = false;
      return;
    }
    this.authenticationService.login(form.xemail, form.xcontrasena).pipe(first()).subscribe((data : any) => {
      this.loading = false;
      if(data.data.ctipo_sistema == 1 ){ 
        this.router.navigate(['/dashboard']).then(() =>{ window.location.reload(); });
      }
      else if(data.data.ctipo_sistema){ this.router.navigate(['/home']).then(() =>{ window.location.reload(); }); }
    },
    
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 401){ 
        let condition = err.error.data.condition;
        if(condition == 'bad-password'){ message = "HTTP.ERROR.SIGNIN.BADPASSWORD"; }
        else if(condition == 'user-blocked'){ message = "HTTP.ERROR.SIGNIN.USERBLOCKED"; }
        else if(condition == 'change-password'){
          this.activeModal.dismiss('Programmatically closed.');
          let token = err.error.data.token;
          this.router.navigate([`/change-password/${token}`]);
        }
      }
      else if(code == 404){ message = "HTTP.ERROR.SIGNIN.USERNOTFOUND"; }
      else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}