import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-type-service',
  templateUrl: './notification-type-service.component.html',
  styleUrls: ['./notification-type-service.component.css']
})
export class NotificationTypeServiceComponent implements OnInit {

  @Input() public service;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  serviceList: any[] = [];
  serviceTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctiposervicio: [''],
      cservicio: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/service-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceTypeList.push({ id: response.data.list[i].ctiposervicio, value: response.data.list[i].xtiposervicio });
          }
          this.serviceTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICETYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.service){
        if(this.service.type == 3){
          this.canSave = true;
        }else if(this.service.type == 2){
          this.popup_form.get('ctiposervicio').setValue(this.service.ctiposervicio);
          this.popup_form.get('ctiposervicio').disable();
          this.serviceDropdownDataRequest();
          this.popup_form.get('cservicio').setValue(this.service.cservicio);
          this.popup_form.get('cservicio').disable();
          this.canSave = false;
        }else if(this.service.type == 1){
          this.popup_form.get('ctiposervicio').setValue(this.service.ctiposervicio);
          this.serviceDropdownDataRequest();
          this.popup_form.get('cservicio').setValue(this.service.cservicio);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  serviceDropdownDataRequest(){
    if(this.popup_form.get('ctiposervicio').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ctiposervicio: this.popup_form.get('ctiposervicio').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/service`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.serviceList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceList.push({ id: response.data.list[i].cservicio, value: response.data.list[i].xservicio });
          }
          this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let serviceTypeFilter = this.serviceTypeList.filter((option) => { return option.id == form.ctiposervicio; });
    let serviceFilter = this.serviceList.filter((option) => { return option.id == form.cservicio; });
    this.service.ctiposervicio = form.ctiposervicio;
    this.service.xtiposervicio = serviceTypeFilter[0].value;
    this.service.cservicio = form.cservicio;
    this.service.xservicio = serviceFilter[0].value;
    this.activeModal.close(this.service);
  }

  deleteService(){
    this.service.type = 4;
    if(!this.service.create){
      this.service.delete = true;
    }
    this.activeModal.close(this.service);
  }

}
