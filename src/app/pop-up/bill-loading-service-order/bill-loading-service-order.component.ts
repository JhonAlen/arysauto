import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-bill-loading-service-order',
  templateUrl: './bill-loading-service-order.component.html',
  styleUrls: ['./bill-loading-service-order.component.css']
})
export class BillLoadingServiceOrderComponent implements OnInit {

  @Input() public orden;
  private serviceOrderGridApi;
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
  acceptedServiceOrderList;
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
    //Buscar las ordenes de servicios
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cproveedor: this.orden.cproveedor,
      ccliente: this.orden.ccliente,
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    console.log(params)
    this.http.post(`${environment.apiUrl}/api/administration/service-order`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.serviceOrderList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceOrderList.push({ corden: response.data.list[i].corden, xcliente: response.data.list[i].xcliente, xservicio: response.data.list[i].xservicio, mtotal: response.data.list[i].mtotal, mmontototal: response.data.list[i].mmontototal, xmonedagrua: response.data.list[i].xmonedagrua, xmonedacoti: response.data.list[i].xmonedacoti});
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
    let arrayPerform = this.serviceOrderList;
    arrayPerform = arrayPerform.filter((obj) => !obj.corden);
    for(let i = 0; i < arrayPerform.length; i ++){
      arrayPerform[i].cgrid = i;
    }
    
      arrayPerform = this.serviceOrderList;
      this.acceptedServiceOrderList = arrayPerform;
    
    this.canSave = true;
  }

  serviceOrderRowClicked(event: any){
      let eventObj = event.data;
      this.serviceOrderList = this.serviceOrderList.filter((obj) => obj.corden != eventObj.corden)
      this.serviceOrderGridApi.setRowData(this.serviceOrderList);
      this.acceptedServiceOrderList.push(eventObj);
      for(let i = 0; i < this.acceptedServiceOrderList.length; i++){
        this.acceptedServiceOrderList[i].cgrid = i;
        this.acceptedServiceOrderList[i].corden;
        this.acceptedServiceOrderList[i].xaccesorio;
        this.acceptedServiceOrderList[i].mmontomax;
        this.acceptedServiceOrderList[i].ptasa;
      }
      this.acceptedAccesoryGridApi.setRowData(this.acceptedServiceOrderList);
      this.canSave = true;
      if(this.acceptedServiceOrderList){
        this.showSaveButton = true
      }
  }

  onServiceOrderGridReady(event){
    this.serviceOrderGridApi = event.api;
  }

  onAcceptedServiceOrderGridReady(event){
    this.acceptedAccesoryGridApi = event.api;
  }

  onSubmit(form){

    this.submitted = true;
    this.loading = true;

    this.orden = this.acceptedServiceOrderList

    this.activeModal.close(this.acceptedServiceOrderList);
  }


}