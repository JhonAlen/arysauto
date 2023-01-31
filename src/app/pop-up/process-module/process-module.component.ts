import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-process-module',
  templateUrl: './process-module.component.html',
  styleUrls: ['./process-module.component.css']
})
export class ProcessModuleComponent implements OnInit {
  
  @Input() public module;
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
      cgrupo: ['', Validators.required],
      cmodulo: ['', Validators.required]
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
    if(this.module){
      if(this.module.type == 3){
        this.canSave = true;
      }else if(this.module.type == 2){
        let params_group = {
          cgrupo: this.module.cgrupo
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
        this.popup_form.get('cgrupo').setValue(this.module.cgrupo);
        this.popup_form.get('cgrupo').disable();
        this.popup_form.get('cmodulo').setValue(this.module.cmodulo);
        this.popup_form.get('cmodulo').disable();
        this.canSave = false;
      }else if(this.module.type == 1){
        let params_group = {
          cgrupo: this.module.cgrupo
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
        this.popup_form.get('cgrupo').setValue(this.module.cgrupo);
        this.popup_form.get('cmodulo').setValue(this.module.cmodulo);
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
    this.module.cgrupo = form.cgrupo;
    this.module.xgrupo = groupFilter[0].value;
    this.module.cmodulo = form.cmodulo;
    this.module.xmodulo = moduleFilter[0].value;
    this.activeModal.close(this.module);
  }

  deleteModule(){
    this.module.type = 4;
    if(!this.module.create){
      this.module.delete = true;
    }
    this.activeModal.close(this.module);
  }

}
