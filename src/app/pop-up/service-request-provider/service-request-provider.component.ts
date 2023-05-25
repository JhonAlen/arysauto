import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-service-request-provider',
  templateUrl: './service-request-provider.component.html',
  styleUrls: ['./service-request-provider.component.css']
})
export class ServiceRequestProviderComponent implements OnInit {

  @Input() public provider;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  providerList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cestado: [''],
      cciudad: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
          }
          this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.STATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  cityDropdownDataRequest(){
    if(this.popup_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.popup_form.get('cestado').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.cityList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.cityList.push({ id: response.data.list[i].cciudad, value: response.data.list[i].xciudad });
          }
          this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CITYNOTFOUND"; }
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
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 87
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cestado: form.cestado,
      cciudad: form.cciudad,
      ctiposervicio: this.provider.ctiposervicio,
      cservicio: this.provider.cservicio
    }
    this.http.post(`${environment.apiUrl}/api/v2/service-request/production/search/provider`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.providerList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ 
            cproveedor: response.data.list[i].cproveedor,
            xproveedor: response.data.list[i].xproveedor,
            xrazonsocial: response.data.list[i].xrazonsocial,
            xdireccion: response.data.list[i].xdireccion,
            xestado: response.data.list[i].xestado,
            xciudad: response.data.list[i].xciudad,
            xactivo: response.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEREQUESTS.PROVIDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    this.provider.cproveedor = event.data.cproveedor;
    this.provider.xproveedor = event.data.xproveedor;
    this.provider.xrazonsocial = event.data.xrazonsocial;
    this.provider.xdireccion = event.data.xdireccion;
    this.provider.xestado = event.data.xestado;
    this.provider.xciudad = event.data.xciudad;
    this.activeModal.close(this.provider);
  }

}
