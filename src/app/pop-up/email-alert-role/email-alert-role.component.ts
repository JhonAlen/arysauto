import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-email-alert-role',
  templateUrl: './email-alert-role.component.html',
  styleUrls: ['./email-alert-role.component.css']
})
export class EmailAlertRoleComponent implements OnInit {

  @Input() public role;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  departmentList: any[] = [];
  roleList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cdepartamento: [''],
      crol: ['']
    });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {};
    this.http.post(`${environment.apiUrl}/api/valrep/department`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.departmentList.push({ id: response.data.list[i].cdepartamento, value: response.data.list[i].xdepartamento });
        }
        this.departmentList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.DEPARTMENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    if(this.role){
      if(this.role.type == 3){
        this.canSave = true;
      }else if(this.role.type == 2){
        let params_group = {
          cdepartamento: this.role.cdepartamento
        }
        this.http.post(`${environment.apiUrl}/api/valrep/role`, params_group, options).subscribe((response : any) => {
          if(response.data.status){
            for(let i = 0; i < response.data.list.length; i++){
              this.roleList.push({ id: response.data.list[i].crol, value: response.data.list[i].xrol });
            }
            this.roleList.sort((a,b) => a.value > b.value ? 1 : -1);
          }
        },
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "HTTP.ERROR.VALREP.ROLENOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
        this.popup_form.get('cdepartamento').setValue(this.role.cdepartamento);
        this.popup_form.get('cdepartamento').disable();
        this.popup_form.get('crol').setValue(this.role.crol);
        this.popup_form.get('crol').disable();
        this.canSave = false;
      }else if(this.role.type == 1){
        let params_group = {
          cdepartamento: this.role.cdepartamento
        }
        this.http.post(`${environment.apiUrl}/api/valrep/role`, params_group, options).subscribe((response : any) => {
          if(response.data.status){
            for(let i = 0; i < response.data.list.length; i++){
              this.roleList.push({ id: response.data.list[i].crol, value: response.data.list[i].xrol });
            }
            this.roleList.sort((a,b) => a.value > b.value ? 1 : -1);
          }
        },
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "HTTP.ERROR.VALREP.ROLENOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
        this.popup_form.get('cdepartamento').setValue(this.role.cdepartamento);
        this.popup_form.get('crol').setValue(this.role.crol);
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  roleDropdownDataRequest(){
    if(this.popup_form.get('cdepartamento').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cdepartamento: this.popup_form.get('cdepartamento').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/role`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.roleList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.roleList.push({ id: response.data.list[i].crol, value: response.data.list[i].xrol });
          }
          this.roleList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ROLENOTFOUND"; }
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
    let departmentFilter = this.departmentList.filter((option) => { return option.id == form.cdepartamento; });
    let roleFilter = this.roleList.filter((option) => { return option.id == form.crol; });
    this.role.cdepartamento = form.cdepartamento;
    this.role.xdepartamento = departmentFilter[0].value;
    this.role.crol = form.crol;
    this.role.xrol = roleFilter[0].value;
    this.activeModal.close(this.role);
  }

  deleteRole(){
    this.role.type = 4;
    if(!this.role.create){
      this.role.delete = true;
    }
    this.activeModal.close(this.role);
  }

}
