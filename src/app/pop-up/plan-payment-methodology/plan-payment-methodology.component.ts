import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-payment-methodology',
  templateUrl: './plan-payment-methodology.component.html',
  styleUrls: ['./plan-payment-methodology.component.css']
})
export class PlanPaymentMethodologyComponent implements OnInit {

  @Input() public paymentMethodology;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  paymentMethodologyList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cmetodologiapago: ['', Validators.required],
      mmetodologiapago: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/payment-methodology`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.paymentMethodologyList.push({ id: response.data.list[i].cmetodologiapago, value: response.data.list[i].xmetodologiapago });
          }
          this.paymentMethodologyList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PAYMENTMETHODOLOGYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.paymentMethodology){
        if(this.paymentMethodology.type == 3){
          this.canSave = true;
        }else if(this.paymentMethodology.type == 2){
          this.popup_form.get('cmetodologiapago').setValue(this.paymentMethodology.cmetodologiapago);
          this.popup_form.get('cmetodologiapago').disable();
          this.popup_form.get('mmetodologiapago').setValue(this.paymentMethodology.mmetodologiapago);
          this.popup_form.get('mmetodologiapago').disable();
          this.canSave = false;
        }else if(this.paymentMethodology.type == 1){
          this.popup_form.get('cmetodologiapago').setValue(this.paymentMethodology.cmetodologiapago);
          this.popup_form.get('mmetodologiapago').setValue(this.paymentMethodology.mmetodologiapago);
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
    let paymentMethodologyFilter = this.paymentMethodologyList.filter((option) => { return option.id == form.cmetodologiapago; });
    this.paymentMethodology.cmetodologiapago = form.cmetodologiapago;
    this.paymentMethodology.xmetodologiapago = paymentMethodologyFilter[0].value;
    this.paymentMethodology.mmetodologiapago = form.mmetodologiapago;
    this.activeModal.close(this.paymentMethodology);
  }

  deletePaymentMethodology(){
    this.paymentMethodology.type = 4;
    if(!this.paymentMethodology.create){
      this.paymentMethodology.delete = true;
    }
    this.activeModal.close(this.paymentMethodology);
  }

}
