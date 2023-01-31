import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-excluded-provider',
  templateUrl: './client-excluded-provider.component.html',
  styleUrls: ['./client-excluded-provider.component.css']
})
export class ClientExcludedProviderComponent implements OnInit {

  @Input() public provider;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  providerList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cproveedor: ['', Validators.required],
      xobservacion: ['', Validators.required],
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
      this.http.post(`${environment.apiUrl}/api/valrep/provider`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.providerList.push({ id: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor });
          }
          this.providerList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PROVIDERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.provider){
        if(this.provider.type == 3){
          this.canSave = true;
        }else if(this.provider.type == 2){
          this.popup_form.get('cproveedor').setValue(this.provider.cproveedor);
          this.popup_form.get('cproveedor').disable();
          this.popup_form.get('xobservacion').setValue(this.provider.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.popup_form.get('fefectiva').setValue(this.provider.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.canSave = false;
        }else if(this.provider.type == 1){
          this.popup_form.get('cproveedor').setValue(this.provider.cproveedor);
          this.popup_form.get('xobservacion').setValue(this.provider.xobservacion);
          this.popup_form.get('fefectiva').setValue(this.provider.fefectiva);
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
    let providerFilter = this.providerList.filter((option) => { return option.id == form.cproveedor; });
    this.provider.cproveedor = form.cproveedor;
    this.provider.xproveedor = providerFilter[0].value;
    this.provider.xobservacion = form.xobservacion;
    this.provider.fefectiva = form.fefectiva;
    this.activeModal.close(this.provider);
  }

  deleteProvider(){
    this.provider.type = 4;
    if(!this.provider.create){
      this.provider.delete = true;
    }
    this.activeModal.close(this.provider);
  }

}
