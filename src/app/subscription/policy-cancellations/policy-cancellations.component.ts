import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CauseForCancellationComponent } from '@app/pop-up/cause-for-cancellation/cause-for-cancellation.component';

@Component({
  selector: 'app-policy-cancellations',
  templateUrl: './policy-cancellations.component.html',
  styleUrls: ['./policy-cancellations.component.css']
})
export class PolicyCancellationsComponent implements OnInit {

  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  clear: boolean = true;
  alert = { show: false, type: "", message: "" };
  chargeList: any[] = [];
  fleetContractList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  keyword = 'value';
  cancellationData: {};

  constructor(private formBuilder: UntypedFormBuilder, 
              private _formBuilder: FormBuilder,
              private authenticationService : AuthenticationService,
              private router: Router,
              private http: HttpClient,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      ccarga: [''],
      nfactura: [''],
      ncontrol: [''],
      ffactura: [''],
      frecepcion: [''],
      fvencimiento: [''],
      msumafactura: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 115
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    this.chargeList = [];
    this.keyword;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/charge`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.chargeList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.chargeList.push({ id: response.data.list[i].ccarga, value: `${response.data.list[i].xcliente} - Póliza Nro. ${response.data.list[i].xpoliza} - Placa ${response.data.list[i].xplaca}` });
        }
        this.chargeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  prueba(event){
    this.search_form.get('ccarga').setValue(event.id)
    if(this.search_form.get('ccarga').value){
      this.searchFleetContract(this.search_form.value)
    }
  }

  searchFleetContract(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccarga: form.ccarga,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.fleetContractList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.fleetContractList.push({ 
            ccontratoflota: response.data.list[i].ccontratoflota,
            xmarca: response.data.list[i].xmarca,
            xmodelo: response.data.list[i].xmodelo,
            xversion: response.data.list[i].xversion,
            xplaca: response.data.list[i].xplaca,
            xestatusgeneral: response.data.list[i].xestatusgeneral,
            xpoliza: response.data.list[i].xpoliza
          });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
      }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let cancellation = {ccarga: this.search_form.get('ccarga').value};
    const modalRef = this.modalService.open(CauseForCancellationComponent);
    modalRef.componentInstance.cancellation = cancellation;
    modalRef.result.then((result: any) => { 

      if(result){
        this.cancellationData = {
          ccarga: this.search_form.get('ccarga').value,
          ccausaanulacion: result.ccausaanulacion,
        }
        this.onSubmit()
      }
    });
  }

  onSubmit(){
    this.submitted = true;
    this.loading = true;

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      anulacion: this.cancellationData
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/cancellations`, params, options).subscribe((response : any) => {
      if(response.data.status){
        window.alert('Se ha anulado esta póliza con éxito')
        location.reload();
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
      }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
}
