import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PasswordValidator } from '@app/_validators/password.validator';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  sub;
  change_password_form: UntypedFormGroup;
  matching_xpasswords_group: UntypedFormGroup;
  token: string;
  cusuario: number;
  submitted: boolean = false;
  loading: boolean = false;
  disable_button: boolean = false;
  alert = { show : false, type : "", message : "" }

  constructor(private formBuilder: UntypedFormBuilder,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.matching_xpasswords_group = new UntypedFormGroup({
      xcontrasena: new UntypedFormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#?&])[a-zA-Z0-9$@$!%*#?&]+$')
      ])),
      verify_xcontrasena: new UntypedFormControl('', Validators.required)
    }, (formGroup: UntypedFormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
    this.change_password_form = this.formBuilder.group({
      matching_xcontrasena: this.matching_xpasswords_group
    });
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.token = params.get('id');
      if(this.token){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let params = {
          token: this.token
        }
        this.http.post(`${environment.apiUrl}/api/control/change-password-token-verification`, params, options).subscribe((response: any) => {
          if(response.data.status){
            this.cusuario = response.data.cusuario;
          }else{
            this.disable_button = true;
            this.change_password_form.get('matching_xcontrasena').get('xcontrasena').disable();
            this.change_password_form.get('matching_xcontrasena').get('verify_xcontrasena').disable();
            this.alert.message = "CHANGEPASSWORD.TOKENDONTEXIST";
            this.alert.type = 'danger';
            this.alert.show = true;
          }
        }, 
        (err) => {
          this.disable_button = true;
          this.change_password_form.get('matching_xcontrasena').get('xcontrasena').disable();
          this.change_password_form.get('matching_xcontrasena').get('verify_xcontrasena').disable();
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
      }
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.change_password_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      token: this.token,
      cusuario: this.cusuario,
      xcontrasena: form.matching_xcontrasena.xcontrasena
    }
    this.http.post(`${environment.apiUrl}/api/user/change-password`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.disable_button = true;
        this.change_password_form.get('matching_xcontrasena').get('xcontrasena').setValue('');
        this.change_password_form.get('matching_xcontrasena').get('verify_xcontrasena').setValue('');
        this.change_password_form.get('matching_xcontrasena').get('xcontrasena').disable();
        this.change_password_form.get('matching_xcontrasena').get('verify_xcontrasena').disable();
        this.alert.message = "CHANGEPASSWORD.PASSWORDCHANGEDSUCCESSFULLY";
        this.alert.type = 'success';
        this.alert.show = true;
      }
      this.loading = false;
    }, (err) => {
      this.loading = false;
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SIGNIN.USERNOTFOUND"; }
      else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

}
