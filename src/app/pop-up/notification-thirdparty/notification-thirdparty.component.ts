import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationThirdpartyTracingComponent } from '@app/pop-up/notification-thirdparty-tracing/notification-thirdparty-tracing.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-thirdparty',
  templateUrl: './notification-thirdparty.component.html',
  styleUrls: ['./notification-thirdparty.component.css']
})
export class NotificationThirdpartyComponent implements OnInit {

  @Input() public thirdparty;
  private tracingGridApi;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  documentTypeList: any[] = [];
  tracingList: any[] = [];
  alert = { show : false, type : "", message : "" }
  tracingDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xnombre: [''],
      xapellido: [''],
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xemail: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xtelefonocasa: [''],
      xobservacion: ['']
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
      if(this.thirdparty){
        if(this.thirdparty.type == 3){
          this.canSave = true;
        }else if(this.thirdparty.type == 2){
          this.popup_form.get('xnombre').setValue(this.thirdparty.xnombre);
          this.popup_form.get('xnombre').disable();
          this.popup_form.get('xapellido').setValue(this.thirdparty.xapellido);
          this.popup_form.get('xapellido').disable();
          this.popup_form.get('ctipodocidentidad').setValue(this.thirdparty.ctipodocidentidad);
          this.popup_form.get('ctipodocidentidad').disable();
          this.popup_form.get('xdocidentidad').setValue(this.thirdparty.xdocidentidad);
          this.popup_form.get('xdocidentidad').disable();
          this.popup_form.get('xtelefonocelular').setValue(this.thirdparty.xtelefonocelular);
          this.popup_form.get('xtelefonocelular').disable();
          this.popup_form.get('xemail').setValue(this.thirdparty.xemail);
          this.popup_form.get('xemail').disable();
          this.popup_form.get('xtelefonocasa').setValue(this.thirdparty.xtelefonocasa);
          this.popup_form.get('xtelefonocasa').disable();
          this.popup_form.get('xobservacion').setValue(this.thirdparty.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.tracingList = this.thirdparty.tracings;
          this.canSave = false;
        }else if(this.thirdparty.type == 1){
          this.popup_form.get('xnombre').setValue(this.thirdparty.xnombre);
          this.popup_form.get('xapellido').setValue(this.thirdparty.xapellido);
          this.popup_form.get('ctipodocidentidad').setValue(this.thirdparty.ctipodocidentidad);
          this.popup_form.get('xdocidentidad').setValue(this.thirdparty.xdocidentidad);
          this.popup_form.get('xtelefonocelular').setValue(this.thirdparty.xtelefonocelular);
          this.popup_form.get('xemail').setValue(this.thirdparty.xemail);
          this.popup_form.get('xtelefonocasa').setValue(this.thirdparty.xtelefonocasa);
          this.popup_form.get('xobservacion').setValue(this.thirdparty.xobservacion);
          for(let i =0; i < this.thirdparty.tracings.length; i++){
            this.tracingList.push({
              cgrid: i,
              create: this.thirdparty.tracings[i].create,
              cseguimientotercero: this.thirdparty.tracings[i].cseguimientotercero,
              ctiposeguimiento: this.thirdparty.tracings[i].ctiposeguimiento,
              xtiposeguimiento: this.thirdparty.tracings[i].xtiposeguimiento,
              cmotivoseguimiento: this.thirdparty.tracings[i].cmotivoseguimiento,
              xmotivoseguimiento: this.thirdparty.tracings[i].xmotivoseguimiento,
              fdia: this.thirdparty.tracings[i].fdia,
              fhora: this.thirdparty.tracings[i].fhora,
              fseguimientotercero: this.thirdparty.tracings[i].fseguimientotercero,
              bcerrado: this.thirdparty.tracings[i].bcerrado,
              xcerrado: this.thirdparty.tracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              xobservacion: this.thirdparty.tracings[i].xobservacion
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  addTracing(){
    let tracing = { type: 3 };
    const modalRef = this.modalService.open(NotificationThirdpartyTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.tracingList.push({
            cgrid: this.tracingList.length,
            create: true,
            ctiposeguimiento: result.ctiposeguimiento,
            xtiposeguimiento: result.xtiposeguimiento,
            cmotivoseguimiento: result.cmotivoseguimiento,
            xmotivoseguimiento: result.xmotivoseguimiento,
            fdia: result.fdia,
            fhora: result.fhora,
            fseguimientotercero: result.fseguimientotercero,
            bcerrado: result.bcerrado,
            xcerrado: result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: result.xobservacion
          });
          this.tracingGridApi.setRowData(this.tracingList);
        }
      }
    });
  }

  tracingRowClicked(event: any){
    let tracing = {};
    if(this.isEdit){ 
      tracing = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cseguimientotercero: event.data.cseguimientotercero,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientotercero: event.data.fseguimientotercero,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      };
    }else{ 
      tracing = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cseguimientotercero: event.data.cseguimientotercero,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientotercero: event.data.fseguimientotercero,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationThirdpartyTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i <  this.tracingList.length; i++){
            if( this.tracingList[i].cgrid == result.cgrid){
              this.tracingList[i].ctiposeguimiento = result.ctiposeguimiento;
              this.tracingList[i].xtiposeguimiento = result.xtiposeguimiento;
              this.tracingList[i].cmotivoseguimiento = result.cmotivoseguimiento;
              this.tracingList[i].xmotivoseguimiento = result.xmotivoseguimiento;
              this.tracingList[i].fdia = result.fdia;
              this.tracingList[i].fhora = result.fhora;
              this.tracingList[i].fseguimientotercero = result.fseguimientotercero;
              this.tracingList[i].bcerrado = result.bcerrado;
              this.tracingList[i].xcerrado = result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              this.tracingList[i].xobservacion = result.xobservacion;
              this.tracingGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.tracingDeletedRowList.push({ cseguimientotercero: result.cseguimientotercero });
          }
          this.tracingList = this.tracingList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.tracingList.length; i++){
            this.tracingList[i].cgrid = i;
          }
          this.tracingGridApi.setRowData(this.tracingList);
        }
      }
    });
  }

  onTracingsGridReady(event){
    this.tracingGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    this.thirdparty.xnombre = form.xnombre;
    this.thirdparty.xapellido = form.xapellido;
    this.thirdparty.ctipodocidentidad = form.ctipodocidentidad;
    this.thirdparty.xdocidentidad = form.xdocidentidad;
    this.thirdparty.xtelefonocelular = form.xtelefonocelular;
    this.thirdparty.xemail = form.xemail;
    this.thirdparty.xtelefonocasa = form.xtelefonocasa;
    this.thirdparty.xobservacion = form.xobservacion;
    this.thirdparty.tracings = this.tracingList;
    if(this.thirdparty.cterceronotificacion){
      let updateTracingList = this.tracingList.filter((row) => { return !row.create; });
      let createTracingList = this.tracingList.filter((row) => { return row.create; });
      this.thirdparty.tracingsResult = {
        create: createTracingList,
        update: updateTracingList,
        delete: this.tracingDeletedRowList
      };
    }
    this.activeModal.close(this.thirdparty);
  }

}
