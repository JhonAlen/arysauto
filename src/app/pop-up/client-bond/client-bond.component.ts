import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-bond',
  templateUrl: './client-bond.component.html',
  styleUrls: ['./client-bond.component.css']
})
export class ClientBondComponent implements OnInit {

  @Input() public bond;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      pbono: ['', Validators.required],
      mbono: ['', Validators.required],
      fefectiva: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      if(this.bond){
        if(this.bond.type == 3){
          this.canSave = true;
        }else if(this.bond.type == 2){
          this.popup_form.get('pbono').setValue(this.bond.pbono);
          this.popup_form.get('pbono').disable();
          this.popup_form.get('mbono').setValue(this.bond.mbono);
          this.popup_form.get('mbono').disable();
          this.popup_form.get('fefectiva').setValue(this.bond.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.canSave = false;
        }else if(this.bond.type == 1){
          this.popup_form.get('pbono').setValue(this.bond.pbono);
          this.popup_form.get('mbono').setValue(this.bond.mbono);
          this.popup_form.get('fefectiva').setValue(this.bond.fefectiva);
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
    this.bond.pbono = form.pbono;
    this.bond.mbono = form.mbono;
    this.bond.fefectiva = form.fefectiva;
    this.activeModal.close(this.bond);
  }

  deleteBond(){
    this.bond.type = 4;
    if(!this.bond.create){
      this.bond.delete = true;
    }
    this.activeModal.close(this.bond);
  }

}
