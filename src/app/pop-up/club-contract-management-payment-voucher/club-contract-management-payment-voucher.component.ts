import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-club-contract-management-payment-voucher',
  templateUrl: './club-contract-management-payment-voucher.component.html',
  styleUrls: ['./club-contract-management-payment-voucher.component.css']
})
export class ClubContractManagementPaymentVoucherComponent implements OnInit {

  @Input() public paymentVoucher;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  bankList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cbanco: [''],
      ctransaccion: [''],
      creferenciatransaccion: ['']
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
      if(this.paymentVoucher){
        if(this.paymentVoucher.type == 3){
          this.canSave = true;
        }else if(this.paymentVoucher.type == 2){
          this.popup_form.get('cbanco').setValue(this.paymentVoucher.cbanco);
          this.popup_form.get('cbanco').disable();
          this.popup_form.get('ctransaccion').setValue(this.paymentVoucher.ctransaccion);
          this.popup_form.get('ctransaccion').disable();
          this.popup_form.get('creferenciatransaccion').setValue(this.paymentVoucher.creferenciatransaccion);
          this.popup_form.get('creferenciatransaccion').disable();
          this.canSave = false;
        }else if(this.paymentVoucher.type == 1){
          this.popup_form.get('cbanco').setValue(this.paymentVoucher.cbanco);
          this.popup_form.get('ctransaccion').setValue(this.paymentVoucher.ctransaccion);
          this.popup_form.get('creferenciatransaccion').setValue(this.paymentVoucher.creferenciatransaccion);
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
    this.paymentVoucher.cbanco = form.cbanco;
    this.paymentVoucher.xbanco = bankFilter[0].value;
    this.paymentVoucher.ctransaccion = form.ctransaccion;
    this.paymentVoucher.creferenciatransaccion = form.creferenciatransaccion;
    this.activeModal.close(this.paymentVoucher);
  }

  deletePaymentVoucher(){
    this.paymentVoucher.type = 4;
    if(!this.paymentVoucher.create){
      this.paymentVoucher.delete = true;
    }
    this.activeModal.close(this.paymentVoucher);
  }

}
