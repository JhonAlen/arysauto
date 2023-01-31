import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-management-realcoverage',
  templateUrl: './fleet-contract-management-realcoverage.component.html',
  styleUrls: ['./fleet-contract-management-realcoverage.component.css']
})
export class FleetContractManagementRealcoverageComponent implements OnInit {

  private replacementGridApi;
  @Input() public recoverage;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  notificationList: any[] = [];
  purchaseOrder;
  coinList: any[] = []
  code;
  danos;
  serviceOrderList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ccobertura: [''],
      xcobertura: [''],
      mprima: [''],
      ccontratoflota: [''],
      msuma_aseg: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 71
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    if(this.recoverage.edit){
      if(this.recoverage.ccobertura > 12){
        if(this.recoverage.ititulo == "C"){
          this.canSave = true;
          this.editRecoverage();
        }
      }else{
        window.alert('Esta cobertura no se puede editar')
        this.activeModal.close();
      }
    }else{
      window.alert('Debe presionar el botón de editar')
      this.activeModal.close();
    }
  }

  editRecoverage(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccobertura: this.recoverage.ccobertura,
      ccontratoflota: this.recoverage.ccontratoflota
    };
    console.log(params)
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/detail-coverage`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.popup_form.get('ccobertura').setValue(response.data.ccobertura);
        this.popup_form.get('ccobertura').disable();
        this.popup_form.get('xcobertura').setValue(response.data.xcobertura);
        this.popup_form.get('xcobertura').disable();
        this.popup_form.get('ccontratoflota').setValue(response.data.ccontratoflota);
        this.popup_form.get('ccontratoflota').disable();
        this.popup_form.get('mprima').setValue(response.data.mprima);
        this.popup_form.get('mprima').enable();
        this.popup_form.get('msuma_aseg').setValue(response.data.msuma_aseg);
        this.popup_form.get('msuma_aseg').enable();
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  onSubmit(form){

    this.recoverage.ccontratoflota = this.popup_form.get('ccontratoflota').value;
    this.recoverage.ccobertura = this.popup_form.get('ccobertura').value;
    this.recoverage.mprima = form.mprima;
    this.recoverage.msuma_aseg = form.msuma_aseg;

    this.activeModal.close(this.recoverage);
  }

}
