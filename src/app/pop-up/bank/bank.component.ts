import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  @Input() public bank;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  bankList: any[] = [];
  bankAccountTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cbanco: ['', Validators.required],
      ctipocuentabancaria: ['', Validators.required],
      xnumerocuenta: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/bank`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.bankList.push({ id: response.data.list[i].cbanco, value: response.data.list[i].xbanco });
          }
          this.bankList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BANKNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/bank-account-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.bankAccountTypeList.push({ id: response.data.list[i].ctipocuentabancaria, value: response.data.list[i].xtipocuentabancaria });
          }
          this.bankAccountTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BANKACCOUNTTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.bank){
        if(this.bank.type == 3){
          this.canSave = true;
        }else if(this.bank.type == 2){
          this.popup_form.get('cbanco').setValue(this.bank.cbanco);
          this.popup_form.get('cbanco').disable();
          this.popup_form.get('ctipocuentabancaria').setValue(this.bank.ctipocuentabancaria);
          this.popup_form.get('ctipocuentabancaria').disable();
          this.popup_form.get('xnumerocuenta').setValue(this.bank.xnumerocuenta);
          this.popup_form.get('xnumerocuenta').disable();
          this.canSave = false;
        }else if(this.bank.type == 1){
          this.popup_form.get('cbanco').setValue(this.bank.cbanco);
          this.popup_form.get('ctipocuentabancaria').setValue(this.bank.ctipocuentabancaria);
          this.popup_form.get('xnumerocuenta').setValue(this.bank.xnumerocuenta);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let bankFilter = this.bankList.filter((option) => { return option.id == form.cbanco; });
    let bankAccountTypeFilter = this.bankAccountTypeList.filter((option) => { return option.id == form.ctipocuentabancaria; });
    this.bank.cbanco = form.cbanco;
    this.bank.xbanco = bankFilter[0].value;
    this.bank.ctipocuentabancaria = form.ctipocuentabancaria;
    this.bank.xtipocuentabancaria = bankAccountTypeFilter[0].value;
    this.bank.xnumerocuenta = form.xnumerocuenta;
    this.activeModal.close(this.bank);
  }

  deleteBank(){
    this.bank.type = 4;
    if(!this.bank.create){
      this.bank.delete = true;
    }
    this.activeModal.close(this.bank);
  }

}
