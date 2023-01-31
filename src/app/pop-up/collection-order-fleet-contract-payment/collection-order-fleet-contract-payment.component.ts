import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-collection-order-fleet-contract-payment',
  templateUrl: './collection-order-fleet-contract-payment.component.html',
  styleUrls: ['./collection-order-fleet-contract-payment.component.css']
})
export class CollectionOrderFleetContractPaymentComponent implements OnInit {

  @Input() public payment;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      mpago: ['', Validators.required],
      bpagado: [false, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.payment){
      if(this.payment.type == 3){
        this.canSave = true;
      }else if(this.payment.type == 2){
        this.popup_form.get('mpago').setValue(this.payment.mpago);
        this.popup_form.get('mpago').disable();
        this.popup_form.get('bpagado').setValue(this.payment.bpagado);
        this.popup_form.get('bpagado').disable();
        this.canSave = false;
      }else if(this.payment.type == 1){
        this.popup_form.get('mpago').setValue(this.payment.mpago);
        this.popup_form.get('bpagado').setValue(this.payment.bpagado);
        if(this.payment.bpagado){
          this.popup_form.get('mpago').disable();
          this.popup_form.get('bpagado').disable();
          return;
        }
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onSubmit(form): void{
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    this.payment.mpago = form.mpago;
    this.payment.bpagado = form.bpagado;
    this.activeModal.close(this.payment);
  }

  deletePayment(): void{
    this.payment.type = 4;
    if(!this.payment.create){
      this.payment.delete = true;
    }
    this.activeModal.close(this.payment);
  }

}
