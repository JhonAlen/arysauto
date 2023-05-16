import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteRequestReplacementComponent } from '@app/pop-up/quote-request-replacement/quote-request-replacement.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-quote-request-detail',
  templateUrl: './notification-quote-request-detail.component.html',
  styleUrls: ['./notification-quote-request-detail.component.css']
})
export class NotificationQuoteRequestDetailComponent implements OnInit {

  @Input() public quote2;
  private replacementsGridApi;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  editStatus: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  replacementList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xobservacion: ['', Validators.required],
      bcerrada: [false, Validators.required],
      mtotalcotizacion: ['', Validators.required],
      cmoneda: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 76
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
    if(this.quote2.ccotizacion, this.quote2.xobservacion, this.quote2.cproveedor){
      this.getQuoteRequestData();
    }
  }

  getQuoteRequestData(){
    console.log(this.quote2.cproveedor)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccotizacion: this.quote2.ccotizacion,
      cproveedor: this.quote2.cproveedor
    };
    this.http.post(`${environment.apiUrl}/api/notification/detail-quote-request`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.popup_form.get('xobservacion').setValue(response.data.xobservacion);
        this.popup_form.get('xobservacion').disable();
        this.popup_form.get('mtotalcotizacion').setValue(response.data.mtotalcotizacion);
        this.popup_form.get('mtotalcotizacion').disable();
        this.popup_form.get('bcerrada').setValue(response.data.bcerrada ? response.data.bcerrada : false);
        this.popup_form.get('bcerrada').enable();
        this.replacementList = [];
        if(response.data.replacements){
          for(let i =0; i < response.data.replacements.length; i++){
            this.replacementList.push({
              cgrid: i,
              create: false,
              crepuestocotizacion: response.data.replacements[i].crepuestocotizacion,
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ctiporepuesto: response.data.replacements[i].ctiporepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              cniveldano: response.data.replacements[i].cniveldano,
              bdisponible: response.data.replacements[i].bdisponible ? response.data.replacements[i].bdisponible : false,
              munitariorepuesto: response.data.replacements[i].munitariorepuesto,
              bdescuento: response.data.replacements[i].bdescuento ? response.data.replacements[i].bdescuento : false,
              mtotalrepuesto: response.data.replacements[i].mtotalrepuesto,
              cmoneda: response.data.replacements[i].cmoneda,
              xmoneda: response.data.replacements[i].xmoneda
            });
          }
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.QUOTEREQUESTS.QUOTEREQUESTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  replacementRowClicked(event: any){
    let replacement = {};
    if(this.editStatus){ 
      replacement = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        crepuestocotizacion: event.data.crepuestocotizacion,
        crepuesto: event.data.crepuesto,
        ctiporepuesto: event.data.ctiporepuesto,
        ncantidad: event.data.ncantidad,
        cniveldano: event.data.cniveldano,
        bdisponible: event.data.bdisponible,
        munitariorepuesto: event.data.munitariorepuesto,
        bdescuento: event.data.bdescuento,
        mtotalrepuesto: event.data.mtotalrepuesto,
        cmoneda: event.data.cmoneda,
        xmoneda: event.data.xmoneda,
        delete: false
      };
    }else{ 
      replacement = { 
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        crepuestocotizacion: event.data.crepuestocotizacion,
        crepuesto: event.data.crepuesto,
        ctiporepuesto: event.data.ctiporepuesto,
        ncantidad: event.data.ncantidad,
        cniveldano: event.data.cniveldano,
        bdisponible: event.data.bdisponible,
        munitariorepuesto: event.data.munitariorepuesto,
        bdescuento: event.data.bdescuento,
        mtotalrepuesto: event.data.mtotalrepuesto,
        cmoneda: event.data.cmoneda,
        xmoneda: event.data.xmoneda,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(QuoteRequestReplacementComponent);
    modalRef.componentInstance.replacement = replacement;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i <  this.replacementList.length; i++){
            if( this.replacementList[i].cgrid == result.cgrid){
              this.replacementList[i].bdisponible = result.bdisponible;
              this.replacementList[i].munitariorepuesto = result.munitariorepuesto;
              this.replacementList[i].bdescuento = result.bdescuento;
              this.replacementList[i].mtotalrepuesto = result.mtotalrepuesto;
              this.replacementList[i].cmoneda = result.cmoneda;
              this.replacementList[i].xmoneda = result.xmoneda;
              this.popup_form.get('cmoneda').setValue(result.cmoneda)
              this.replacementsGridApi.refreshCells();
            }
          }
          this.calculateQuoteTotal();
        }
      }
    });
  }

  onReplacementsGridReady(event){
    this.replacementsGridApi = event.api;
  }

  calculateQuoteTotal(){
    let total = 0;
    for(let i = 0; i < this.replacementList.length; i++){
      total += this.replacementList[i].mtotalrepuesto ? Number(this.replacementList[i].mtotalrepuesto) : 0;
    }
    this.popup_form.get('mtotalcotizacion').setValue(total);
  }

  onSubmit(form){

    this.quote2.xobservacion = form.xobservacion;
    this.quote2.repuestos = this.replacementList;
    this.quote2.mtotalcotizacion = this.popup_form.get('mtotalcotizacion').value;
    this.quote2.bcerrada = this.popup_form.get('bcerrada').value;

    this.activeModal.close(this.quote2);
  }

}
