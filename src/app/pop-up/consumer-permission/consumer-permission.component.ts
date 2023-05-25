import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-consumer-permission',
  templateUrl: './consumer-permission.component.html',
  styleUrls: ['./consumer-permission.component.css']
})
export class ConsumerPermissionComponent implements OnInit {

  @Input() public permission;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  groupList: any[] = [];
  moduleList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cgrupo: [''],
      cmodulo: [''],
      bindice: [false],
      bcrear: [false],
      bdetalle: [false],
      beditar: [false],
      beliminar: [false]
    });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {};
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
    if(this.permission){
      if(this.permission.type == 3){
        this.canSave = true;
      }else if(this.permission.type == 2){
        let params_group = {
          cgrupo: this.permission.cgrupo
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
        this.popup_form.get('cgrupo').setValue(this.permission.cgrupo);
        this.popup_form.get('cgrupo').disable();
        this.popup_form.get('cmodulo').setValue(this.permission.cmodulo);
        this.popup_form.get('cmodulo').disable();
        this.popup_form.get('bindice').setValue(this.permission.bindice);
        this.popup_form.get('bindice').disable();
        this.popup_form.get('bcrear').setValue(this.permission.bcrear);
        this.popup_form.get('bcrear').disable();
        this.popup_form.get('bdetalle').setValue(this.permission.bdetalle);
        this.popup_form.get('bdetalle').disable();
        this.popup_form.get('beditar').setValue(this.permission.beditar);
        this.popup_form.get('beditar').disable();
        this.popup_form.get('beliminar').setValue(this.permission.beliminar);
        this.popup_form.get('beliminar').disable();
        this.canSave = false;
      }else if(this.permission.type == 1){
        let params_group = {
          cgrupo: this.permission.cgrupo
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
        this.popup_form.get('cgrupo').setValue(this.permission.cgrupo);
        this.popup_form.get('cmodulo').setValue(this.permission.cmodulo);
        this.popup_form.get('bindice').setValue(this.permission.bindice);
        this.popup_form.get('bcrear').setValue(this.permission.bcrear);
        this.popup_form.get('bdetalle').setValue(this.permission.bdetalle);
        this.popup_form.get('beditar').setValue(this.permission.beditar);
        this.popup_form.get('beliminar').setValue(this.permission.beliminar);
        this.canSave = true;
        this.isEdit = true;
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

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let groupFilter = this.groupList.filter((option) => { return option.id == form.cgrupo; });
    let moduleFilter = this.moduleList.filter((option) => { return option.id == form.cmodulo; });
    this.permission.cgrupo = form.cgrupo;
    this.permission.xgrupo = groupFilter[0].value;
    this.permission.cmodulo = form.cmodulo;
    this.permission.xmodulo = moduleFilter[0].value;
    this.permission.bindice = form.bindice;
    this.permission.bcrear = form.bcrear;
    this.permission.bdetalle = form.bdetalle;
    this.permission.beditar = form.beditar;
    this.permission.beliminar = form.beliminar;
    this.activeModal.close(this.permission);
  }

  deletePermission(){
    this.permission.type = 4;
    if(!this.permission.create){
      this.permission.delete = true;
    }
    this.activeModal.close(this.permission);
  }
}
