import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { FleetContractIndividualAccessoryAmountComponent } from '@app/pop-up/fleet-contract-individual-accessory-amount/fleet-contract-individual-accessory-amount.component';

@Component({
  selector: 'app-fleet-contract-individual-accessorys',
  templateUrl: './fleet-contract-individual-accessorys.component.html',
  styleUrls: ['./fleet-contract-individual-accessorys.component.css']
})
export class FleetContractIndividualAccessorysComponent implements OnInit {

  @Input() public accessory;
  private accesorryGridApi;
  private acceptedAccesoryGridApi;
  currentUser;
  submitted: boolean = false;
  popup_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  editStatus: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  accesoryList: any[] = [];
  acceptedReplacementList: any[] = [];
  serviceOrderList: any[] = [];
  code;
  acceptedAccesoryList;
  accessoryListResult: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService: AuthenticationService,
              private formBuilder: UntypedFormBuilder,
              private http: HttpClient,
              private modalService : NgbModal,
              private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cnotificacion: [''],
      corden: [''],
      cservicio: [''],
      cservicioadicional: [''],
      cproveedor: [''],
      xproveedor: [''],
      ccontratoflota: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 95
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
    //Buscar los accesorios
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    this.http.post(`${environment.apiUrl}/api/valrep/accesory`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.accesoryList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.accesoryList.push({ caccesorio: response.data.list[i].caccesorio, xaccesorio: response.data.list[i].xaccesorio, mmontomax: response.data.list[i].mmontomax, ptasa: response.data.list[i].ptasa});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    // Pasar valores a la lista
    let arrayPerform = this.accesoryList;
    arrayPerform = arrayPerform.filter((obj) => !obj.caccesorio);
    for(let i = 0; i < arrayPerform.length; i ++){
      arrayPerform[i].cgrid = i;
    }
    
      arrayPerform = this.accesoryList;
      this.acceptedAccesoryList = arrayPerform;
  }

  accesoryRowClicked(event: any){
      let eventObj = event.data;
      this.accesoryList = this.accesoryList.filter((obj) => obj.caccesorio != eventObj.caccesorio)
      this.accesorryGridApi.setRowData(this.accesoryList);
      this.acceptedAccesoryList.push(eventObj);
      for(let i = 0; i < this.acceptedAccesoryList.length; i++){
        this.acceptedAccesoryList[i].cgrid = i;
        this.acceptedAccesoryList[i].caccesorio;
        this.acceptedAccesoryList[i].xaccesorio;
        this.acceptedAccesoryList[i].mmontomax;
        this.acceptedAccesoryList[i].ptasa;
      }
      if(this.acceptedAccesoryList){
        window.alert('Recuerda darle click al accesorio seleccionado para establecer suma asegurada.')
      }
      this.acceptedAccesoryGridApi.setRowData(this.acceptedAccesoryList);
  }

  accesoryAmountRowClicked(event: any){
    let accesorio = {caccesorio: event.data.caccesorio, mmontomax: event.data.mmontomax, ptasa: event.data.ptasa};
    const modalRef = this.modalService.open(FleetContractIndividualAccessoryAmountComponent);
    modalRef.componentInstance.accesorio = accesorio;
    modalRef.result.then((result: any) => { 

    if(result){
      for(let i = 0; i < this.acceptedAccesoryList.length; i++){
        if(this.acceptedAccesoryList[i].caccesorio == result.caccesorio){
          this.acceptedAccesoryList[i].cgrid == i;
          this.acceptedAccesoryList[i].caccesorio = result.caccesorio;
          this.acceptedAccesoryList[i].msuma_aseg = result.msuma_aseg;
          this.acceptedAccesoryList[i].mprima = result.mprima;
        }
      }
      this.canSave = true;
    }
    })
  }

  onAccesoryGridReady(event){
    this.accesorryGridApi = event.api;
  }

  onAcceptedAccesoryGridReady(event){
    this.acceptedAccesoryGridApi = event.api;
  }

  onSubmit(form){

    this.submitted = true;
    this.loading = true;

    this.accessory = this.acceptedAccesoryList

    this.activeModal.close(this.acceptedAccesoryList);
  }
}
