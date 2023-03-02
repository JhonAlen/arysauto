import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-valuation-apov',
  templateUrl: './plan-valuation-apov.component.html',
  styleUrls: ['./plan-valuation-apov.component.css']
})
export class PlanValuationApovComponent implements OnInit {

  @Input() public apov;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  valuationList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      msuma_aseg: [''],
      ptasa_par_rus: [''],
      mprima_par_rus: [''],
      ptasa_carga: [''],
      mprima_carga: [''],
    });
    this.canSave = true;
    this.popup_form.get('ptasa_par_rus').setValue(this.apov.ptasa_par_rus);
    this.popup_form.get('ptasa_carga').setValue(this.apov.ptasa_carga);
    this.popup_form.get('mprima_par_rus').disable();
    this.popup_form.get('mprima_carga').disable();
  }

  amountCalculation(){
    if(this.popup_form.get('msuma_aseg').value){
      if(this.apov.ptasa_par_rus){
        this.amountCalculation1();
      }
      if(this.apov.ptasa_carga){
        this.amountCalculation2();
      }
    }
  }

  amountCalculation1(){
    if(this.popup_form.get('msuma_aseg').value){
      let calculo = this.popup_form.get('msuma_aseg').value * this.apov.ptasa_par_rus / 1000;

      this.popup_form.get('mprima_par_rus').setValue(calculo)
    }
  }

  amountCalculation2(){
    if(this.popup_form.get('msuma_aseg').value){
      let calculo = this.popup_form.get('msuma_aseg').value * this.apov.ptasa_carga / 1000;

      this.popup_form.get('mprima_carga').setValue(calculo)
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    this.valuationList.push({
      cplan: this.apov.cplan,
      ccobertura: this.apov.ccobertura,
      msuma_aseg: this.popup_form.get('msuma_aseg').value,
      ptasa_par_rus: form.ptasa_par_rus,
      mprima_par_rus: this.popup_form.get('mprima_par_rus').value,
      ptasa_carga: form.ptasa_carga,
      mprima_carga: this.popup_form.get('mprima_carga').value,
    });

    this.apov = this.valuationList;

    this.activeModal.close(this.apov);
  }

}
