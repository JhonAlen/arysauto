import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-depreciation',
  templateUrl: './client-depreciation.component.html',
  styleUrls: ['./client-depreciation.component.css']
})
export class ClientDepreciationComponent implements OnInit {

  @Input() public depreciation;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  depreciationList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cdepreciacion: ['', Validators.required],
      pdepreciacion: ['', Validators.required],
      mdepreciacion: ['', Validators.required],
      fefectiva: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/depreciation`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.depreciationList.push({ id: response.data.list[i].cdepreciacion, value: response.data.list[i].xdepreciacion });
          }
          this.depreciationList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DEPRECIATIONNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.depreciation){
        if(this.depreciation.type == 3){
          this.canSave = true;
        }else if(this.depreciation.type == 2){
          this.popup_form.get('cdepreciacion').setValue(this.depreciation.cdepreciacion);
          this.popup_form.get('cdepreciacion').disable();
          this.popup_form.get('pdepreciacion').setValue(this.depreciation.pdepreciacion);
          this.popup_form.get('pdepreciacion').disable();
          this.popup_form.get('mdepreciacion').setValue(this.depreciation.mdepreciacion);
          this.popup_form.get('mdepreciacion').disable();
          this.popup_form.get('fefectiva').setValue(this.depreciation.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.canSave = false;
        }else if(this.depreciation.type == 1){
          this.popup_form.get('cdepreciacion').setValue(this.depreciation.cdepreciacion);
          this.popup_form.get('pdepreciacion').setValue(this.depreciation.pdepreciacion);
          this.popup_form.get('mdepreciacion').setValue(this.depreciation.mdepreciacion);
          this.popup_form.get('fefectiva').setValue(this.depreciation.fefectiva);
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
    let depreciationFilter = this.depreciationList.filter((option) => { return option.id == form.cdepreciacion; });
    this.depreciation.cdepreciacion = form.cdepreciacion;
    this.depreciation.xdepreciacion = depreciationFilter[0].value;
    this.depreciation.pdepreciacion = form.pdepreciacion;
    this.depreciation.mdepreciacion = form.mdepreciacion;
    this.depreciation.fefectiva = form.fefectiva;
    this.activeModal.close(this.depreciation);
  }

  deleteDepreciation(){
    this.depreciation.type = 4;
    if(!this.depreciation.create){
      this.depreciation.delete = true;
    }
    this.activeModal.close(this.depreciation);
  }

}
