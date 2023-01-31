import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-individual-accessory-amount',
  templateUrl: './fleet-contract-individual-accessory-amount.component.html',
  styleUrls: ['./fleet-contract-individual-accessory-amount.component.css']
})
export class FleetContractIndividualAccessoryAmountComponent implements OnInit {

  @Input() public accesorio;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  showSaveButton: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
            private modalService: NgbModal,
            private authenticationService : AuthenticationService,
            private http: HttpClient,
            private formBuilder: UntypedFormBuilder,
            private activatedRoute: ActivatedRoute,
            private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      msuma_aseg: [''],
      mprima: [''],
      ptasa:['']
    });
    this.popup_form.get('ptasa').setValue(this.accesorio.ptasa);
    this.popup_form.get('ptasa').disable();
    this.canSave = true;
  }

  calculatedAmount(form){
    if(form.msuma_aseg > this.accesorio.mmontomax){
      window.alert("Te excediste del monto máximo.");
      this.activeModal.close();
    }else{
      let calculo = form.msuma_aseg * this.accesorio.ptasa / 100;
      this.popup_form.get('mprima').setValue(calculo);
      this.popup_form.get('mprima').disable();
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    this.accesorio.msuma_aseg = form.msuma_aseg;
    this.accesorio.mprima = this.popup_form.get('mprima').value;
    this.accesorio.caccesorio = this.accesorio.caccesorio

    this.activeModal.close(this.accesorio);
  }

}
