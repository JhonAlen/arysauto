import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-management-worker',
  templateUrl: './fleet-contract-management-worker.component.html',
  styleUrls: ['./fleet-contract-management-worker.component.css']
})
export class FleetContractManagementWorkerComponent implements OnInit {

  @Input() public worker;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  workerList: any[] = [];
  documentTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

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
      ccliente: this.worker.ccliente,
      ctipodocidentidad: form.ctipodocidentidad ? form.ctipodocidentidad : undefined,
      xdocidentidad: form.xdocidentidad ? form.xdocidentidad : undefined,
      xnombre: form.xnombre ? form.xnombre : undefined,
      xapellido: form.xapellido ? form.xapellido : undefined
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search/client/worker`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.workerList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.workerList.push({ 
            ctrabajador: response.data.list[i].ctrabajador,
            xnombre: response.data.list[i].xnombre,
            xapellido: response.data.list[i].xapellido,
            ctipodocidentidad: response.data.list[i].ctipodocidentidad,
            xdocidentidad: response.data.list[i].xdocidentidad,
            xdireccion: response.data.list[i].xdireccion,
            xtelefonocelular: response.data.list[i].xtelefonocelular,
            xemail: response.data.list[i].xemail
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.WORKERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let documentTypeFilter = this.documentTypeList.filter((option) => { return option.id == event.data.ctipodocidentidad; });
    this.worker.ctrabajador = event.data.ctrabajador;
    this.worker.xtipodocidentidad = documentTypeFilter[0].value;
    this.worker.xdocidentidad = event.data.xdocidentidad;
    this.worker.xnombre = event.data.xnombre;
    this.worker.xtelefonocelular = event.data.xtelefonocelular;
    this.worker.xdireccion = event.data.xdireccion;
    this.worker.xemail = event.data.xemail;
    this.activeModal.close(this.worker);
  }

}
