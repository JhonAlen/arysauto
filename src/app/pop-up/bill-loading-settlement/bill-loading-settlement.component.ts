import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-bill-loading-settlement',
  templateUrl: './bill-loading-settlement.component.html',
  styleUrls: ['./bill-loading-settlement.component.css']
})
export class BillLoadingSettlementComponent implements OnInit {

  @Input() public finiquito;
  private settlementGridApi;
  private acceptedSettlementGridApi;
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
  settlementList: any[] = [];
  code;
  acceptedSettlementList;
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
        cmodulo: 111
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
    let params = {
      ccliente: this.finiquito.ccliente,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/administration/settlement`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.settlementList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.settlementList.push({ cfiniquito: response.data.list[i].cfiniquito, xcliente: response.data.list[i].xcliente, xdanos: response.data.list[i].xdanos, mmontofiniquito: response.data.list[i].mmontofiniquito, xmoneda: response.data.list[i].xmoneda});
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
    let arrayPerform = this.settlementList;
    arrayPerform = arrayPerform.filter((obj) => !obj.cfiniquito);
    for(let i = 0; i < arrayPerform.length; i ++){
      arrayPerform[i].cgrid = i;
    }
    
      arrayPerform = this.settlementList;
      this.acceptedSettlementList = arrayPerform;
    
    this.canSave = true;
  }

  settlementRowClicked(event: any){
      let eventObj = event.data;
      this.settlementList = this.settlementList.filter((obj) => obj.cfiniquito != eventObj.cfiniquito)
      this.settlementGridApi.setRowData(this.settlementList);
      this.acceptedSettlementList.push(eventObj);
      for(let i = 0; i < this.acceptedSettlementList.length; i++){
        this.acceptedSettlementList[i].cgrid = i;
        this.acceptedSettlementList[i].cfiniquito;
        this.acceptedSettlementList[i].xaccesorio;
        this.acceptedSettlementList[i].mmontomax;
        this.acceptedSettlementList[i].ptasa;
      }
      this.acceptedSettlementGridApi.setRowData(this.acceptedSettlementList);
      this.canSave = true;
      if(this.acceptedSettlementList){
        this.showSaveButton = true
      }
  }

  onSettlementGridReady(event){
    this.settlementGridApi = event.api;
  }

  onAcceptedSettlementGridReady(event){
    this.acceptedSettlementGridApi = event.api;
  }

  onSubmit(form){

    this.submitted = true;
    this.loading = true;

    this.finiquito = this.acceptedSettlementList

    this.activeModal.close(this.acceptedSettlementList);
  }
}
