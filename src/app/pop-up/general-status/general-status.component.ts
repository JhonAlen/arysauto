import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-general-status',
  templateUrl: './general-status.component.html',
  styleUrls: ['./general-status.component.css']
})
export class GeneralStatusComponent implements OnInit {

  @Input() public generalStatus;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  generalStatusList: any[] = [];
  groupList: any[] = [];
  moduleList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    console.log(this.generalStatus);
    this.popup_form = this.formBuilder.group({
      cestatusgeneral: [''],
      bdefault: [false],
      cgrupo: [''],
      cmodulo: [''],
      bgestionable: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/general-status`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.generalStatusList.push({ id: response.data.list[i].cestatusgeneral, value: response.data.list[i].xestatusgeneral });
          }
          this.generalStatusList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.GENERALSTATUSNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/group`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.groupList.push({ id: response.data.list[i].cgrupo, value: response.data.list[i].xgrupo });
          }
          this.groupList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.GROUPNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.generalStatus){
        if(this.generalStatus.type == 3){
          this.canSave = true;
        }else if(this.generalStatus.type == 2){
          if(this.generalStatus.bdefault){
            let params_group = {
              cgrupo: this.generalStatus.cgrupo
            }
            this.http.post(`${environment.apiUrl}/api/valrep/module`, params_group, options).subscribe((response : any) => {
              if(response.data.status){
                for(let i = 0; i < response.data.list.length; i++){
                  this.moduleList.push({ id: response.data.list[i].cmodulo, value: response.data.list[i].xmodulo });
                }
                this.moduleList.sort((a,b) => a.value > b.value ? 1 : -1);
              }
            },
            (err) => {
              let code = err.error.data.code;
              let message;
              if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
              else if(code == 404){ message = "HTTP.ERROR.VALREP.MODULENOTFOUND"; }
              else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
              this.alert.message = message;
              this.alert.type = 'danger';
              this.alert.show = true;
            });
          }
          this.popup_form.get('cestatusgeneral').setValue(this.generalStatus.cestatusgeneral);
          this.popup_form.get('cestatusgeneral').disable();
          this.popup_form.get('bdefault').setValue(this.generalStatus.bdefault);
          this.popup_form.get('bdefault').disable();
          this.popup_form.get('cgrupo').setValue(this.generalStatus.cgrupo);
          this.popup_form.get('cgrupo').disable();
          this.popup_form.get('cmodulo').setValue(this.generalStatus.cmodulo);
          this.popup_form.get('cmodulo').disable();
          this.popup_form.get('bgestionable').setValue(this.generalStatus.bgestionable);
          this.popup_form.get('bgestionable').disable();
          this.canSave = false;
        }else if(this.generalStatus.type == 1){
          if(this.generalStatus.bdefault){
            let params_group = {
              cgrupo: this.generalStatus.cgrupo
            }
            this.http.post(`${environment.apiUrl}/api/valrep/module`, params_group, options).subscribe((response : any) => {
              if(response.data.status){
                for(let i = 0; i < response.data.list.length; i++){
                  this.moduleList.push({ id: response.data.list[i].cmodulo, value: response.data.list[i].xmodulo });
                }
                this.moduleList.sort((a,b) => a.value > b.value ? 1 : -1);
              }
            },
            (err) => {
              let code = err.error.data.code;
              let message;
              if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
              else if(code == 404){ message = "HTTP.ERROR.VALREP.MODULENOTFOUND"; }
              else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
              this.alert.message = message;
              this.alert.type = 'danger';
              this.alert.show = true;
            });
          }
          this.popup_form.get('cestatusgeneral').setValue(this.generalStatus.cestatusgeneral);
          this.popup_form.get('bdefault').setValue(this.generalStatus.bdefault);
          this.popup_form.get('cgrupo').setValue(this.generalStatus.cgrupo);
          this.popup_form.get('cmodulo').setValue(this.generalStatus.cmodulo);
          if(!this.generalStatus.bdefault){
            this.popup_form.get('cgrupo').disable();
            this.popup_form.get('cmodulo').disable();
          }
          this.popup_form.get('bgestionable').setValue(this.generalStatus.bgestionable);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  moduleDropdownDataRequest(){
    if(this.popup_form.get('cgrupo').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cgrupo: this.popup_form.get('cgrupo').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/module`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.moduleList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.moduleList.push({ id: response.data.list[i].cmodulo, value: response.data.list[i].xmodulo });
          }
          this.moduleList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MODULENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  onDefaultCheckChanged(){
    if(this.popup_form.get('bdefault').value){
      this.popup_form.get('cgrupo').enable();
      this.popup_form.get('cmodulo').enable();
    }else{
      this.popup_form.get('cgrupo').disable();
      this.popup_form.get('cmodulo').disable();
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let generalStatusFilter = this.generalStatusList.filter((option) => { return option.id == form.cestatusgeneral; });
    this.generalStatus.cestatusgeneral = form.cestatusgeneral;
    this.generalStatus.xestatusgeneral = generalStatusFilter[0].value;
    this.generalStatus.bdefault = form.bdefault;
    if(form.bdefault){
      this.generalStatus.cgrupo = form.cgrupo;
      this.generalStatus.cmodulo = form.cmodulo;
    }else{
      this.generalStatus.cgrupo = '';
      this.generalStatus.cmodulo = '';
    }
    this.generalStatus.bgestionable = form.bgestionable;
    this.activeModal.close(this.generalStatus);
  }

  deleteGeneralStatus(){
    this.generalStatus.type = 4;
    if(!this.generalStatus.create){
      this.generalStatus.delete = true;
    }
    this.activeModal.close(this.generalStatus);
  }

}
