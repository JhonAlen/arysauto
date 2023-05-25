import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fees-register-vehicle-type-interval',
  templateUrl: './fees-register-vehicle-type-interval.component.html',
  styleUrls: ['./fees-register-vehicle-type-interval.component.css']
})
export class FeesRegisterVehicleTypeIntervalComponent implements OnInit {

  @Input() public interval;
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
      fanoinicio: [''],
      fanofinal: [''],
      ptasainterna: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      if(this.interval){
        if(this.interval.type == 3){
          this.canSave = true;
        }else if(this.interval.type == 2){
          this.popup_form.get('fanoinicio').setValue(this.interval.fanoinicio);
          this.popup_form.get('fanoinicio').disable();
          this.popup_form.get('fanofinal').setValue(this.interval.fanofinal);
          this.popup_form.get('fanofinal').disable();
          this.popup_form.get('ptasainterna').setValue(this.interval.ptasainterna);
          this.popup_form.get('ptasainterna').disable();
          this.canSave = false;
        }else if(this.interval.type == 1){
          this.popup_form.get('fanoinicio').setValue(this.interval.fanoinicio);
          this.popup_form.get('fanofinal').setValue(this.interval.fanofinal);
          this.popup_form.get('ptasainterna').setValue(this.interval.ptasainterna);
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
    this.interval.fanoinicio = form.fanoinicio;
    this.interval.fanofinal = form.fanofinal;
    this.interval.ptasainterna = form.ptasainterna;
    this.activeModal.close(this.interval);
  }

  deleteInterval(){
    this.interval.type = 4;
    if(!this.interval.create){
      this.interval.delete = true;
    }
    this.activeModal.close(this.interval);
  }

}
