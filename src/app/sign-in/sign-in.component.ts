import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  codeclient : any;
  signin_form : UntypedFormGroup;
  loading : boolean = false;
  submitted : boolean = false;
  alert = { show : false, type : "", message : "", }

  constructor(public activeModal: NgbActiveModal, 
              private formBuilder : UntypedFormBuilder, 
              private authenticationService : AuthenticationService, 
              private route : ActivatedRoute, 
              private router : Router,
              private toast: MatSnackBar) { 
  }

  ngOnInit(): void {
    this.signin_form = this.formBuilder.group({
      xemail : [''],
      xcontrasena : ['']
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
      let intentos = err.error.data.attempt;
      if (intentos === 1) {
        message = 'Contraseña incorrecta. Te queda 2 intentos';
      } else if (intentos === 2) {
        message = `Contraseña incorrecta. Te queda 1 intento`;
      }
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 401){ 
        let condition = err.error.data.condition;
        if(condition == 'bad-password'){message}
        else if(condition == 'user-blocked'){ message = "Usuario bloqueado. Comuniquese con el operador."; }
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

      setTimeout(() => {
        this.alert.show = false;
      }, 3000);

      this.loading = false;
    });
  }
}
