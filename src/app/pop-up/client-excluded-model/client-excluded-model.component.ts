import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-excluded-model',
  templateUrl: './client-excluded-model.component.html',
  styleUrls: ['./client-excluded-model.component.css']
})
export class ClientExcludedModelComponent implements OnInit {

  @Input() public model;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  modelList: any[] = [];
  brandList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cmarca: [''],
      cmodelo: [''],
      xobservacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.brandList.push({ id: response.data.list[i].cmarca, value: response.data.list[i].xmarca });
          }
          this.brandList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BRANDNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.model){
        if(this.model.type == 3){
          this.canSave = true;
        }else if(this.model.type == 2){
          this.popup_form.get('cmarca').setValue(this.model.cmarca);
          this.popup_form.get('cmarca').disable();
          this.modelDropdownDataRequest();
          this.popup_form.get('cmodelo').setValue(this.model.cmodelo);
          this.popup_form.get('cmodelo').disable();
          this.popup_form.get('xobservacion').setValue(this.model.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.canSave = false;
        }else if(this.model.type == 1){
          this.popup_form.get('cmarca').setValue(this.model.cmarca);
          this.modelDropdownDataRequest();
          this.popup_form.get('cmodelo').setValue(this.model.cmodelo);
          this.popup_form.get('xobservacion').setValue(this.model.xobservacion);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  modelDropdownDataRequest(){
    if(this.popup_form.get('cmarca').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.popup_form.get('cmarca').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.modelList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.modelList.push({ id: response.data.list[i].cmodelo, value: response.data.list[i].xmodelo });
          }
          this.modelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MODELNOTFOUND"; }
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
    let brandFilter = this.brandList.filter((option) => { return option.id == form.cmarca; });
    let modelFilter = this.modelList.filter((option) => { return option.id == form.cmodelo; });
    this.model.cmarca = form.cmarca;
    this.model.xmarca = brandFilter[0].value;
    this.model.cmodelo = form.cmodelo;
    this.model.xmodelo = modelFilter[0].value;
    this.model.xobservacion = form.xobservacion;
    this.activeModal.close(this.model);
  }

  deleteModel(){
    this.model.type = 4;
    if(!this.model.create){
      this.model.delete = true;
    }
    this.activeModal.close(this.model);
  }

}
