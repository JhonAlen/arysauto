import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-thirdparty-tracing',
  templateUrl: './notification-thirdparty-tracing.component.html',
  styleUrls: ['./notification-thirdparty-tracing.component.css']
})
export class NotificationThirdpartyTracingComponent implements OnInit {

  @Input() public tracing;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  tracingTypeList: any[] = [];
  tracingMotiveList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctiposeguimiento: ['', Validators.required],
      cmotivoseguimiento: ['', Validators.required],
      fdia: ['', Validators.required],
      fhora: ['', Validators.required],
      xobservacion: ['', Validators.required],
      bcerrado: [false, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/tracing-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.tracingTypeList.push({ id: response.data.list[i].ctiposeguimiento, value: response.data.list[i].xtiposeguimiento });
          }
          this.tracingTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.TRACINGTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/tracing-motive`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.tracingMotiveList.push({ id: response.data.list[i].cmotivoseguimiento, value: response.data.list[i].xmotivoseguimiento });
          }
          this.tracingMotiveList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.TRACINGMOTIVENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.tracing){
        if(this.tracing.type == 3){
          this.popup_form.get('bcerrado').disable();
          this.canSave = true;
        }else if(this.tracing.type == 2){
          this.popup_form.get('ctiposeguimiento').setValue(this.tracing.ctiposeguimiento);
          this.popup_form.get('ctiposeguimiento').disable();
          this.popup_form.get('cmotivoseguimiento').setValue(this.tracing.cmotivoseguimiento);
          this.popup_form.get('cmotivoseguimiento').disable();
          this.popup_form.get('fdia').setValue(this.tracing.fdia);
          this.popup_form.get('fdia').disable();
          this.popup_form.get('fhora').setValue(this.tracing.fhora);
          this.popup_form.get('fhora').disable();
          this.popup_form.get('xobservacion').setValue(this.tracing.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.popup_form.get('bcerrado').setValue(this.tracing.bcerrado ? this.tracing.bcerrado : false);
          this.popup_form.get('bcerrado').disable();
          this.canSave = false;
        }else if(this.tracing.type == 1){
          this.popup_form.get('ctiposeguimiento').setValue(this.tracing.ctiposeguimiento);
          this.popup_form.get('ctiposeguimiento').disable();
          this.popup_form.get('cmotivoseguimiento').setValue(this.tracing.cmotivoseguimiento);
          this.popup_form.get('cmotivoseguimiento').disable();
          this.popup_form.get('fdia').setValue(this.tracing.fdia);
          this.popup_form.get('fhora').setValue(this.tracing.fhora);
          this.popup_form.get('xobservacion').setValue(this.tracing.xobservacion);
          this.popup_form.get('bcerrado').setValue(this.tracing.bcerrado ? this.tracing.bcerrado : false);
          if(this.tracing.bcerrado){
            this.popup_form.get('fdia').disable();
            this.popup_form.get('fhora').disable();
            this.popup_form.get('xobservacion').disable();
            this.popup_form.get('bcerrado').disable();
          }
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
    let tracingTypeFilter = this.tracingTypeList.filter((option) => { return option.id == this.popup_form.get('ctiposeguimiento').value; });
    let tracingMotiveFilter = this.tracingMotiveList.filter((option) => { return option.id == this.popup_form.get('cmotivoseguimiento').value; });
    let fseguimiento = `${form.fdia}T${form.fhora}Z`;
    this.tracing.ctiposeguimiento = this.popup_form.get('ctiposeguimiento').value;
    this.tracing.xtiposeguimiento = tracingTypeFilter[0].value;
    this.tracing.cmotivoseguimiento = this.popup_form.get('cmotivoseguimiento').value;
    this.tracing.xmotivoseguimiento = tracingMotiveFilter[0].value;
    this.tracing.fseguimientotercero = fseguimiento;
    this.tracing.fdia = form.fdia;
    this.tracing.fhora = form.fhora;
    this.tracing.xobservacion = form.xobservacion;
    this.tracing.bcerrado = this.popup_form.get('bcerrado').value;
    this.activeModal.close(this.tracing);
  }

}
