import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-service-request-contract',
  templateUrl: './service-request-contract.component.html',
  styleUrls: ['./service-request-contract.component.css']
})
export class ServiceRequestContractComponent implements OnInit {

  @Input() public contract;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  clubContractManagementList: any[] = [];
  documentTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      xnombre: [''],
      xapellido: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.documentTypeList.push({ id: response.data.list[i].ctipodocidentidad, value: response.data.list[i].xtipodocidentidad });
          }
          this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
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
      ctipodocidentidad: form.ctipodocidentidad ? form.ctipodocidentidad : undefined,
      xnombre: form.xnombre ? form.xnombre : undefined,
      xapellido: form.xapellido ? form.xapellido : undefined,
      xdocidentidad: form.xdocidentidad ? form.xdocidentidad : undefined
    }
    this.http.post(`${environment.apiUrl}/api/v2/service-request/production/search/club-contract-management`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.clubContractManagementList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.clubContractManagementList.push({ 
            ccontratoclub: response.data.list[i].ccontratoclub,
            cplan: response.data.list[i].cplan,
            xnombre: response.data.list[i].xnombre,
            xapellido: response.data.list[i].xapellido,
            xdocidentidad: response.data.list[i].xdocidentidad,
            xplaca: response.data.list[i].xplaca,
            xmarca: response.data.list[i].xmarca,
            xmodelo: response.data.list[i].xmodelo,
            xversion: response.data.list[i].xversion,
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
      else if(code == 404){ message = "HTTP.ERROR.SERVICEREQUESTS.CLUBCONTRACTMANAGEMENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    this.contract.ccontratoclub = event.data.ccontratoclub;
    this.contract.cplan = event.data.cplan;
    this.contract.xnombre = event.data.xnombre;
    this.contract.xapellido = event.data.xapellido;
    this.contract.xdocidentidad = event.data.xdocidentidad;
    this.contract.xplaca = event.data.xplaca;
    this.contract.xmarca = event.data.xmarca;
    this.contract.xmodelo = event.data.xmodelo;
    this.contract.xversion = event.data.xversion;
    this.activeModal.close(this.contract);
  }

}
