import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationVehicleComponent } from '@app/pop-up/notification-vehicle/notification-vehicle.component';
import { NotificationNoteComponent } from '@app/pop-up/notification-note/notification-note.component';
import { NotificationSearchReplacementComponent } from '@app/pop-up/notification-search-replacement/notification-search-replacement.component';
import { NotificationReplacementComponent } from '@app/pop-up/notification-replacement/notification-replacement.component';
import { NotificationThirdpartyComponent } from '@app/pop-up/notification-thirdparty/notification-thirdparty.component';
import { NotificationMaterialDamageComponent } from '@app/pop-up/notification-material-damage/notification-material-damage.component';
import { NotificationThirdpartyVehicleComponent } from '@app/pop-up/notification-thirdparty-vehicle/notification-thirdparty-vehicle.component';
import { NotificationTracingComponent } from '@app/pop-up/notification-tracing/notification-tracing.component';
import { NotificationSearchProviderComponent } from '@app/pop-up/notification-search-provider/notification-search-provider.component';
import { NotificationProviderComponent } from '@app/pop-up/notification-provider/notification-provider.component';
import { NotificationQuoteComponent } from '@app/pop-up/notification-quote/notification-quote.component';
import { NotificationServiceOrderComponent } from '@app/pop-up/notification-service-order/notification-service-order.component';
import { NotificationSettlementComponent } from '@app/pop-up/notification-settlement/notification-settlement.component';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ignoreElements } from 'rxjs/operators';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  private noteGridApi;
  private replacementGridApi;
  private thirdpartyGridApi;
  private materialDamageGridApi;
  private thirdpartyVehicleGridApi;
  private providerGridApi;
  private tracingGridApi;
  private quoteGridApi;
  private serviceOrderGridApi;
  private settlementGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  stateList: any[] = [];
  cityList: any[] = [];
  notificationTypeList: any[] = [];
  claimCauseList: any[] = [];
  noteList: any[] = [];
  replacementList: any[] = [];
  thirdpartyList: any[] = [];
  materialDamageList: any[] = [];
  thirdpartyVehicleList: any[] = [];
  providerList: any[] = [];
  quoteList: any[] = [];
  tracingList: any[] = [];
  thirdPartyTracingList: any[] = [];
  fleetNotificationThirdpartyTracingList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  editBlock: boolean = false;
  noteDeletedRowList: any[] = [];
  replacementDeletedRowList: any[] = [];
  thirdpartyDeletedRowList: any[] = [];
  materialDamageDeletedRowList: any[] = [];
  thirdpartyVehicleDeletedRowList: any[] = [];
  serviceOrderList: any[] = [];
  serviceList: any[] = [];
  notificationList: any[] = [];
  aditionalServiceList: any[] = [];
  notificationsData: any[] = [];
  documentationList: any[] = [];
  collectionsList: any [] = [];
  fcreacion;
  settlementList: any[] = [];
  settlement: {};

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cnotificacion: [{ value: '', disabled: true }],
      ccontratoflota: ['', Validators.required],
      xcliente: [{ value: '', disabled: true }],
      fdesde_pol: [{ value: '', disabled: true }],
      fhasta_pol: [{ value: '', disabled: true }],
      xmarca: [{ value: '', disabled: true }],
      xmodelo: [{ value: '', disabled: true }],
      xtipo: [{ value: '', disabled: true }],
      xplaca: [{ value: '', disabled: true }],
      xestatusgeneral: [{ value: '', disabled: true }],
      fano: [{ value: '', disabled: true }],
      xcolor: [{ value: '', disabled: true }],
      xserialcarroceria: [{ value: '', disabled: true }],
      xserialmotor: [{ value: '', disabled: true }],
      xnombrepropietario: [{ value: '', disabled: true }],
      xapellidopropietario: [{ value: '', disabled: true }],
      xtipodocidentidadpropietario: [{ value: '', disabled: true }],
      xdocidentidadpropietario: [{ value: '', disabled: true }],
      xdireccionpropietario: [{ value: '', disabled: true }],
      xtelefonocelularpropietario: [{ value: '', disabled: true }],
      xemailpropietario: [{ value: '', disabled: true }],
      ctiponotificacion: ['', Validators.required],
      ccausasiniestro: ['', Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      xtelefono: ['', Validators.required],
      xnombrealternativo: [''],
      xapellidoalternativo: [''],
      xtelefonoalternativo: [''],
      bdano: [false, Validators.required],
      btransitar: [false, Validators.required],
      bdanootro: [false, Validators.required],
      blesionado: [false, Validators.required],
      bpropietario: [false, Validators.required],
      fdia: ['', Validators.required],
      fhora: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xdireccion: ['', Validators.required],
      xdescripcion: ['', Validators.required],
      btransito: [false, Validators.required],
      bcarga: [false, Validators.required],
      bpasajero: [false, Validators.required],
      npasajero: [''],
      xobservacion: ['', Validators.required],
      xtiponotificacion: [''],
      crecaudo: [''],
      xrecaudos: [''],
      cdocumento: [''],
      xdocumentos: [''],
      ncantidad: [''],
      cestatusgeneral: [''],
      ccausaanulacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 76
      };
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
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.notificationTypeList = [];
    this.http.post(`${environment.apiUrl}/api/valrep/notification-type`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.notificationTypeList.push({ id: response.data.list[i].ctiponotificacion, value: response.data.list[i].xtiponotificacion });
        }
        //this.notificationTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/claim-cause`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.claimCauseList.push({ id: response.data.list[i].ccausasiniestro, value: response.data.list[i].xcausasiniestro });
        }
        //this.claimCauseList.sort((a, b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLAIMCAUSENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
        }
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLAIMCAUSENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getNotificationData();
        this.searchOwner();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });
  }

  getNotificationData(){ 
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cnotificacion: this.code
    };
    this.http.post(`${environment.apiUrl}/api/notification/detail`, params, options).subscribe((response: any) => {
      
        console.log(response)
        this.detail_form.get('cnotificacion').setValue(response.data.cnotificacion);
        this.detail_form.get('ccontratoflota').setValue(response.data.ccontratoflota);
        this.detail_form.get('ccontratoflota').disable();
        this.detail_form.get('xcliente').setValue(response.data.xcliente);
        console.log(response.data.fdesde_pol)
        console.log(response.data.fhasta_pol)
        if(response.data.fdesde_pol) {
          let dateFormat = new Date(response.data.fdesde_pol).toISOString().substring(0, 10);
          this.detail_form.get('fdesde_pol').setValue(dateFormat);
        }
        if(response.data.fhasta_pol) {
          let dateFormat = new Date(response.data.fhasta_pol).toISOString().substring(0, 10);
          this.detail_form.get('fhasta_pol').setValue(dateFormat);
        }
        this.detail_form.get('xmarca').setValue(response.data.xmarca);
        this.detail_form.get('xmodelo').setValue(response.data.xmodelo);
        this.detail_form.get('xtipo').setValue(response.data.xtipo);
        this.detail_form.get('xplaca').setValue(response.data.xplaca);
        this.detail_form.get('fano').setValue(response.data.fano);
        this.detail_form.get('xcolor').setValue(response.data.xcolor);
        this.detail_form.get('xserialcarroceria').setValue(response.data.xserialcarroceria);
        this.detail_form.get('xserialmotor').setValue(response.data.xserialmotor);
        this.detail_form.get('xnombrepropietario').setValue(response.data.xnombrepropietario);
        this.detail_form.get('xapellidopropietario').setValue(response.data.xapellidopropietario);
        this.detail_form.get('xdocidentidadpropietario').setValue(response.data.xdocidentidadpropietario);
        this.detail_form.get('xdireccionpropietario').setValue(response.data.xdireccionpropietario);
        this.detail_form.get('xtelefonocelularpropietario').setValue(response.data.xtelefonocelularpropietario);
        this.detail_form.get('xemailpropietario').setValue(response.data.xemailpropietario);
        this.detail_form.get('ctiponotificacion').setValue(response.data.ctiponotificacion);
        this.detail_form.get('ctiponotificacion').disable();
        if(this.detail_form.get('ctiponotificacion').value){
          this.searchCollections();
        }
        this.detail_form.get('crecaudo').setValue(response.data.crecaudo);
        this.detail_form.get('crecaudo').disable();
        if(this.detail_form.get('crecaudo').value){
          this.searchDocumentation();
        }
        this.detail_form.get('ccausasiniestro').setValue(response.data.ccausasiniestro);
        this.detail_form.get('ccausasiniestro').disable();
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xnombre').disable();
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xapellido').disable();
        this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
        this.detail_form.get('xtelefono').disable();
        this.detail_form.get('xnombrealternativo').setValue(response.data.xnombrealternativo);
        this.detail_form.get('xnombrealternativo').disable();
        this.detail_form.get('xapellidoalternativo').setValue(response.data.xapellidoalternativo);
        this.detail_form.get('xapellidoalternativo').disable();
        this.detail_form.get('xtelefonoalternativo').setValue(response.data.xtelefonoalternativo);
        this.detail_form.get('xtelefonoalternativo').disable();
        this.detail_form.get('bdano').setValue(response.data.bdano);
        this.detail_form.get('bdano').disable();
        this.detail_form.get('btransitar').setValue(response.data.btransitar);
        this.detail_form.get('btransitar').disable();
        this.detail_form.get('bdanootro').setValue(response.data.bdanootro);
        this.detail_form.get('bdanootro').disable();
        this.detail_form.get('blesionado').setValue(response.data.blesionado);
        this.detail_form.get('blesionado').disable();
        this.detail_form.get('bpropietario').setValue(response.data.bpropietario);
        this.detail_form.get('bpropietario').disable();
        if(response.data.fevento){
          let dayFormat = new Date(response.data.fevento).toISOString().substring(0, 10);
          let timeFormat = new Date(response.data.fevento).toISOString().substring(11, 16);
          this.detail_form.get('fdia').setValue(dayFormat);
          this.detail_form.get('fdia').disable();
          this.detail_form.get('fhora').setValue(timeFormat);
          this.detail_form.get('fhora').disable();
        }
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('xdescripcion').setValue(response.data.xdescripcion);
        this.detail_form.get('xdescripcion').disable();
        this.detail_form.get('btransito').setValue(response.data.btransito);
        this.detail_form.get('btransito').disable();
        this.detail_form.get('bcarga').setValue(response.data.bcarga);
        this.detail_form.get('bcarga').disable();
        this.detail_form.get('bpasajero').setValue(response.data.bpasajero);
        this.detail_form.get('bpasajero').disable();
        this.detail_form.get('npasajero').setValue(response.data.npasajero);
        this.detail_form.get('npasajero').disable();
        this.detail_form.get('xobservacion').setValue(response.data.xobservacion);
        this.detail_form.get('xobservacion').disable();
        this.detail_form.get('xestatusgeneral').setValue(response.data.xestatusgeneral);
        this.detail_form.get('xestatusgeneral').disable();
        this.noteList = [];
        if(response.data.notes){
          for(let i = 0; i < response.data.notes.length; i++){
            this.noteList.push({
              cgrid: i,
              create: false,
              cnotanotificacion: response.data.notes[i].cnotanotificacion,
              xnotanotificacion: response.data.notes[i].xnotanotificacion,
              xcausafiniquito: response.data.notes[i].xcausafiniquito,
              xrutaarchivo: response.data.notes[i].xrutaarchivo,
              cfiniquito: response.data.notes[i].cfiniquito
            });
          }
        }
        this.replacementList = [];
        if(response.data.replacements){
          for(let i = 0; i < response.data.replacements.length; i++){
            this.replacementList.push({
              cgrid: i,
              create: false,
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ctiporepuesto: response.data.replacements[i].ctiporepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              cniveldano: response.data.replacements[i].cniveldano
            });
          }
        }
        this.materialDamageList = [];
        if(response.data.materialDamages){
          for(let i = 0; i < response.data.materialDamages.length; i++){
            this.materialDamageList.push({
              cgrid: i,
              create: false,
              cdanomaterialnotificacion: response.data.materialDamages[i].cdanomaterialnotificacion,
              cdanomaterial: response.data.materialDamages[i].cdanomaterial,
              xdanomaterial: response.data.materialDamages[i].xdanomaterial,
              cniveldano: response.data.materialDamages[i].cniveldano,
              xniveldano: response.data.materialDamages[i].xniveldano,
              xobservacion: response.data.materialDamages[i].xobservacion,
              ctipodocidentidad: response.data.materialDamages[i].ctipodocidentidad,
              xdocidentidad: response.data.materialDamages[i].xdocidentidad,
              xnombre: response.data.materialDamages[i].xnombre,
              xapellido: response.data.materialDamages[i].xapellido,
              cestado: response.data.materialDamages[i].cestado,
              cciudad: response.data.materialDamages[i].cciudad,
              xdireccion: response.data.materialDamages[i].xdireccion,
              xtelefonocelular: response.data.materialDamages[i].xtelefonocelular,
              xtelefonocasa: response.data.materialDamages[i].xtelefonocasa,
              xemail: response.data.materialDamages[i].xemail
            });
          }
        }
        this.thirdPartyTracingList = [];
        this.thirdpartyList = [];
        if(response.data.thirdparties){
          for(let i = 0; i < response.data.thirdparties.length; i++){
            let tracings = [];
            for(let j = 0; j < response.data.thirdparties[i].tracings.length; j++){
              let dayFormat = new Date(response.data.thirdparties[i].tracings[j].fseguimientotercero).toISOString().substring(0, 10);
              let timeFormat = new Date(response.data.thirdparties[i].tracings[j].fseguimientotercero).toISOString().substring(11, 16);
              let dateFormat = `${dayFormat}T${timeFormat}Z`
              tracings.push({
                create: false,
                cseguimientotercero: response.data.thirdparties[i].tracings[j].cseguimientotercero,
                ctiposeguimiento: response.data.thirdparties[i].tracings[j].ctiposeguimiento,
                xtiposeguimiento: response.data.thirdparties[i].tracings[j].xtiposeguimiento,
                cmotivoseguimiento: response.data.thirdparties[i].tracings[j].cmotivoseguimiento,
                xmotivoseguimiento: response.data.thirdparties[i].tracings[j].xmotivoseguimiento,
                fdia: dayFormat,
                fhora: timeFormat,
                fseguimientotercero: dateFormat,
                bcerrado: response.data.thirdparties[i].tracings[j].bcerrado,
                xcerrado: response.data.thirdparties[i].tracings[j].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
                xobservacion: response.data.thirdparties[i].tracings[j].xobservacion
              });
            }
            this.thirdPartyTracingList = tracings;
            this.thirdpartyList.push({
              cgrid: i,
              create: false,
              cterceronotificacion: response.data.thirdparties[i].cterceronotificacion,
              ctipodocidentidad: response.data.thirdparties[i].ctipodocidentidad,
              xdocidentidad: response.data.thirdparties[i].xdocidentidad,
              xnombre: response.data.thirdparties[i].xnombre,
              xapellido: response.data.thirdparties[i].xapellido,
              xtelefonocelular: response.data.thirdparties[i].xtelefonocelular,
              xtelefonocasa: response.data.thirdparties[i].xtelefonocasa,
              xemail: response.data.thirdparties[i].xemail,
              xobservacion: response.data.thirdparties[i].xobservacion,
              tracings: tracings
            });
          }
        }
        this.thirdpartyVehicleList = [];
        if(response.data.thirdpartyVehicles){
          for(let i = 0; i < response.data.thirdpartyVehicles.length; i++){
            let replacements = [];
            for(let j = 0; j < response.data.thirdpartyVehicles[i].replacements.length; j++){
              replacements.push({
                create: false,
                crepuesto: response.data.thirdpartyVehicles[i].replacements[j].crepuesto,
                xrepuesto: response.data.thirdpartyVehicles[i].replacements[j].xrepuesto,
                ctiporepuesto: response.data.thirdpartyVehicles[i].replacements[j].ctiporepuesto,
                ncantidad: response.data.thirdpartyVehicles[i].replacements[j].ncantidad,
                cniveldano: response.data.thirdpartyVehicles[i].replacements[j].cniveldano
              });
            }
            this.thirdpartyVehicleList.push({
              cgrid: i,
              create: false,
              cvehiculoterceronotificacion: response.data.thirdpartyVehicles[i].cvehiculoterceronotificacion,
              ctipodocidentidadconductor: response.data.thirdpartyVehicles[i].ctipodocidentidadconductor,
              xdocidentidadconductor: response.data.thirdpartyVehicles[i].xdocidentidadconductor,
              xnombreconductor: response.data.thirdpartyVehicles[i].xnombreconductor,
              xapellidoconductor: response.data.thirdpartyVehicles[i].xapellidoconductor,
              xtelefonocelularconductor: response.data.thirdpartyVehicles[i].xtelefonocelularconductor,
              xtelefonocasaconductor: response.data.thirdpartyVehicles[i].xtelefonocasaconductor,
              xemailconductor: response.data.thirdpartyVehicles[i].xemailconductor,
              xobservacionconductor: response.data.thirdpartyVehicles[i].xobservacionconductor,
              xplaca: response.data.thirdpartyVehicles[i].xplaca,
              cmarca: response.data.thirdpartyVehicles[i].cmarca,
              xmarca: response.data.thirdpartyVehicles[i].xmarca,
              cmodelo: response.data.thirdpartyVehicles[i].cmodelo,
              xmodelo: response.data.thirdpartyVehicles[i].xmodelo,
              cversion: response.data.thirdpartyVehicles[i].cversion,
              xversion: response.data.thirdpartyVehicles[i].xversion,
              fano: response.data.thirdpartyVehicles[i].fano,
              ccolor: response.data.thirdpartyVehicles[i].ccolor,
              xobservacionvehiculo: response.data.thirdpartyVehicles[i].xobservacionvehiculo,
              ctipodocidentidadpropietario: response.data.thirdpartyVehicles[i].ctipodocidentidadpropietario,
              xdocidentidadpropietario: response.data.thirdpartyVehicles[i].xdocidentidadpropietario,
              xnombrepropietario: response.data.thirdpartyVehicles[i].xnombrepropietario,
              xapellidopropietario: response.data.thirdpartyVehicles[i].xapellidopropietario,
              cestado: response.data.thirdpartyVehicles[i].cestado,
              cciudad: response.data.thirdpartyVehicles[i].cciudad,
              xdireccion: response.data.thirdpartyVehicles[i].xdireccion,
              xtelefonocelularpropietario: response.data.thirdpartyVehicles[i].xtelefonocelularpropietario,
              xtelefonocasapropietario: response.data.thirdpartyVehicles[i].xtelefonocasapropietario,
              xemailpropietario: response.data.thirdpartyVehicles[i].xemailpropietario,
              xobservacionpropietario: response.data.thirdpartyVehicles[i].xobservacionpropietario,
              replacements: replacements
            });
          }
        }
        this.providerList = [];
        if(response.data.providers){
          for(let i = 0; i < response.data.providers.length; i++){
            let replacements = [];
            for(let j = 0; j < response.data.providers[i].replacements.length; j++){
              replacements.push({
                create: false,
                crepuesto: response.data.providers[i].replacements[j].crepuesto,
                xrepuesto: response.data.providers[i].replacements[j].xrepuesto,
                ctiporepuesto: response.data.providers[i].replacements[j].ctiporepuesto,
                xtiporepuesto: response.data.providers[i].replacements[j].xtiporepuesto,
                ncantidad: response.data.providers[i].replacements[j].ncantidad,
                cniveldano: response.data.providers[i].replacements[j].cniveldano,
                xniveldano: response.data.providers[i].replacements[j].xniveldano
              });
            }
            this.providerList.push({
              cgrid: i,
              create: false,
              ccotizacion: response.data.providers[i].ccotizacion,
              cproveedor: response.data.providers[i].cproveedor,
              xnombre: response.data.providers[i].xnombre,
              xobservacion: response.data.providers[i].xobservacion,
              replacements: replacements
            });
          }
        }
        this.quoteList = [];
        if(response.data.quotes){
          for(let i = 0; i < response.data.quotes.length; i++){
            let replacements = [];
            for(let j = 0; j < response.data.quotes[i].replacements.length; j++){
              replacements.push({
                create: false,
                crepuestocotizacion: response.data.quotes[i].replacements[j].crepuestocotizacion,
                crepuesto: response.data.quotes[i].replacements[j].crepuesto,
                xrepuesto: response.data.quotes[i].replacements[j].xrepuesto,
                ctiporepuesto: response.data.quotes[i].replacements[j].ctiporepuesto,
                ncantidad: response.data.quotes[i].replacements[j].ncantidad,
                cniveldano: response.data.quotes[i].replacements[j].cniveldano,
                bdisponible: response.data.quotes[i].replacements[j].bdisponible,
                xdisponible: response.data.quotes[i].replacements[j].bdisponible ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
                munitariorepuesto: response.data.quotes[i].replacements[j].munitariorepuesto,
                bdescuento: response.data.quotes[i].replacements[j].bdescuento,
                mtotalrepuesto: response.data.quotes[i].replacements[j].mtotalrepuesto,
                cmoneda: response.data.quotes[i].replacements[j].cmoneda,
                xmoneda: response.data.quotes[i].replacements[j].xmoneda,
                cnotificacion: this.code,
              });
            }
            this.quoteList.push({
              cgrid: i,
              create: false,
              ccotizacion: response.data.quotes[i].ccotizacion,
              cproveedor: response.data.quotes[i].cproveedor,
              xnombre: response.data.quotes[i].xnombre,
              xobservacion: response.data.quotes[i].xobservacion,
              mtotalcotizacion: response.data.quotes[i].mtotalcotizacion,
              bcerrada: response.data.quotes[i].bcerrada,
              replacements: replacements,
              cnotificacion: this.code,
              mmontoiva: response.data.quotes[i].mmontoiva,
              mtotal: response.data.quotes[i].mtotal,
              cimpuesto: response.data.quotes[i].cimpuesto,
              pimpuesto: response.data.quotes[i].pimpuesto,
              baceptacion: response.data.quotes[i].baceptacion,
              cmoneda: response.data.quotes[i].cmoneda,
              xmoneda: response.data.quotes[i].xmoneda
            });
          }
        }
        this.tracingList = [];
        if(response.data.tracings){
          for(let i = 0; i < response.data.tracings.length; i++){
            let dayFormat = new Date(response.data.tracings[i].fseguimientonotificacion).toISOString().substring(0, 10);
            let timeFormat = new Date(response.data.tracings[i].fseguimientonotificacion).toISOString().substring(11, 16);
            let dateFormat = `${dayFormat}T${timeFormat}Z`
            this.tracingList.push({
              cgrid: i,
              create: false,
              cseguimientonotificacion: response.data.tracings[i].cseguimientonotificacion,
              ctiposeguimiento: response.data.tracings[i].ctiposeguimiento,
              xtiposeguimiento: response.data.tracings[i].xtiposeguimiento,
              cmotivoseguimiento: response.data.tracings[i].cmotivoseguimiento,
              xmotivoseguimiento: response.data.tracings[i].xmotivoseguimiento,
              fdia: dayFormat,
              fhora: timeFormat,
              fseguimientonotificacion: dateFormat,
              bcerrado: response.data.tracings[i].bcerrado,
              xcerrado: response.data.tracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              xobservacion: response.data.tracings[i].xobservacion
            });
          }
        }
        this.serviceOrderList = [];
        let xservicio;
        if(response.data.serviceOrder){
          for(let i = 0; i < response.data.serviceOrder.length; i++){
            if(response.data.serviceOrder[i].xservicio){
              xservicio = response.data.serviceOrder[i].xservicio
            }else{
              xservicio = response.data.serviceOrder[i].xservicioadicional
            }
            this.serviceOrderList.push({
              cgrid: i,
              createServiceOrder: false,
              cnotificacion: response.data.serviceOrder[i].cnotificacion,
              corden: response.data.serviceOrder[i].corden,
              cservicio: response.data.serviceOrder[i].cservicio,
              cservicioadicional: response.data.serviceOrder[i].cservicioadicional,
              xservicio: xservicio,
              xobservacion: response.data.serviceOrder[i].xobservacion,
              xfecha: response.data.serviceOrder[i].xfecha,
              xdanos: response.data.serviceOrder[i].xdanos,
              fajuste: response.data.serviceOrder[i].fajuste.substring(0,10),
              xdesde: response.data.serviceOrder[i].xdesde,
              xhacia: response.data.serviceOrder[i].xhacia,
              mmonto: response.data.serviceOrder[i].mmonto,
              cmoneda: response.data.serviceOrder[i].cmoneda,
              xmoneda: response.data.serviceOrder[i].xmoneda,
              cproveedor: response.data.serviceOrder[i].cproveedor,
              bactivo: response.data.serviceOrder[i].bactivo
            });
          }
        }
      
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  
  }

  cityDropdownDataRequest(){
    if(this.detail_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.detail_form.get('cestado').value
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

  searchVehicle(){
    let vehicle = {};
    const modalRef = this.modalService.open(NotificationVehicleComponent, { size: 'xl' });
    modalRef.componentInstance.vehicle = vehicle;
    modalRef.result.then((result: any) => {
      if(result){
        this.detail_form.get('ccontratoflota').setValue(result.ccontratoflota);
        if(result.fdesde_pol) {
          let dateFormat = new Date(result.fdesde_pol).toISOString().substring(0, 10);
          this.detail_form.get('fdesde_pol').setValue(dateFormat);
        }
        if(result.fhasta_pol) {
          let dateFormat = new Date(result.fhasta_pol).toISOString().substring(0, 10);
          this.detail_form.get('fhasta_pol').setValue(dateFormat);
        }
        this.detail_form.get('xcliente').setValue(result.xcliente);
        this.detail_form.get('xestatusgeneral').setValue(result.xestatusgeneral);
        this.detail_form.get('cestatusgeneral').setValue(result.cestatusgeneral);
        if(this.detail_form.get('cestatusgeneral').value == 13){
          if(window.confirm("Este usuario está en estatus pendiente, por ende, no se le prestará ningun servicio.")){
            this.router.navigate([`events/notification-index`]);
          }else{
            this.router.navigate([`events/notification-index`]);
          }
        }
        this.detail_form.get('xmarca').setValue(result.xmarca);
        this.detail_form.get('xmodelo').setValue(result.xmodelo);
        this.detail_form.get('xtipo').setValue(result.xtipo);
        this.detail_form.get('xplaca').setValue(result.xplaca);
        this.detail_form.get('fano').setValue(result.fano);
        this.detail_form.get('xcolor').setValue(result.xcolor);
        this.detail_form.get('xserialcarroceria').setValue(result.xserialcarroceria);
        this.detail_form.get('xserialmotor').setValue(result.xserialmotor);
        this.detail_form.get('xnombrepropietario').setValue(result.xnombrepropietario);
        this.detail_form.get('xapellidopropietario').setValue(result.xapellidopropietario);
        this.detail_form.get('xdocidentidadpropietario').setValue(result.xdocidentidadpropietario);
        this.detail_form.get('xdireccionpropietario').setValue(result.xdireccionpropietario);
        this.detail_form.get('xtelefonocelularpropietario').setValue(result.xtelefonocelularpropietario);
        this.detail_form.get('xemailpropietario').setValue(result.xemailpropietario);
      }
    });
  }

  editNotification(){
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
    this.editBlock = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getNotificationData();
    }else{
      this.router.navigate([`/events/notification-index`]);
    }
  }

  addNote(){
    let note = { type: 3, cfiniquito: this.noteList, ccompania: this.currentUser.data.ccompania };
    const modalRef = this.modalService.open(NotificationNoteComponent);
    modalRef.componentInstance.note = note;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.noteList.push({
            cgrid: this.noteList.length,
            create: true,
            xnotanotificacion: result.xnotanotificacion,
            xrutaarchivo: result.xrutaarchivo
          });
          this.noteGridApi.setRowData(this.noteList);
        }
      }
    });
  }

  addReplacement(){
    let replacement = { from: 1 }
    const modalRef = this.modalService.open(NotificationSearchReplacementComponent, { size: 'xl' });
    modalRef.componentInstance.replacement = replacement;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.replacementList.push({
            cgrid:  this.replacementList.length,
            create: true,
            crepuesto: result.crepuesto,
            xrepuesto: result.xrepuesto,
            ctiporepuesto: result.ctiporepuesto,
            ncantidad: result.ncantidad,
            cniveldano: result.cniveldano
          });
          this.replacementGridApi.setRowData(this.replacementList);
        }
      }
    });
  }

  addThirdparty(){
    let thirdparty = { type: 3 };
    const modalRef = this.modalService.open(NotificationThirdpartyComponent, { size: 'xl' });
    modalRef.componentInstance.thirdparty = thirdparty;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.thirdpartyList.push({
            cgrid: this.thirdpartyList.length,
            create: true,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            xnombre: result.xnombre,
            xapellido: result.xapellido,
            xtelefonocelular: result.xtelefonocelular,
            xtelefonocasa: result.xtelefonocasa,
            xemail: result.xemail,
            xobservacion: result.xobservacion,
            tracings: result.tracings
          });
          this.thirdpartyGridApi.setRowData(this.thirdpartyList);
        }
      }
    });
  }

  addMaterialDamage(){
    let materialDamage = { type: 3 };
    const modalRef = this.modalService.open(NotificationMaterialDamageComponent, { size: 'xl' });
    modalRef.componentInstance.materialDamage = materialDamage;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.materialDamageList.push({
            cgrid: this.materialDamageList.length,
            create: true,
            cdanomaterial: result.cdanomaterial,
            xdanomaterial: result.xdanomaterial,
            cniveldano: result.cniveldano,
            xniveldano: result.xniveldano,
            xobservacion: result.xobservacion,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            xnombre: result.xnombre,
            xapellido: result.xapellido,
            cestado: result.cestado,
            cciudad: result.cciudad,
            xdireccion: result.xdireccion,
            xtelefonocelular: result.xtelefonocelular,
            xtelefonocasa: result.xtelefonocasa,
            xemail: result.xemail
          });
          this.materialDamageGridApi.setRowData(this.materialDamageList);
        }
      }
    });
  }

  addThirdpartyVehicle(){
    let thirdpartyVehicle = { type: 3 };
    const modalRef = this.modalService.open(NotificationThirdpartyVehicleComponent, {size: 'xl'});
    modalRef.componentInstance.thirdpartyVehicle = thirdpartyVehicle;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.thirdpartyVehicleList.push({
            cgrid: this.thirdpartyVehicleList.length,
            create: true,
            ctipodocidentidadconductor: result.ctipodocidentidadconductor,
            xdocidentidadconductor: result.xdocidentidadconductor,
            xnombreconductor: result.xnombreconductor,
            xapellidoconductor: result.xapellidoconductor,
            xtelefonocelularconductor: result.xtelefonocelularconductor,
            xtelefonocasaconductor: result.xtelefonocasaconductor,
            xemailconductor: result.xemailconductor,
            xobservacionconductor: result.xobservacionconductor,
            xplaca: result.xplaca,
            cmarca: result.cmarca,
            xmarca: result.xmarca,
            cmodelo: result.cmodelo,
            xmodelo: result.xmodelo,
            cversion: result.cversion,
            xversion: result.xversion,
            fano: result.fano,
            ccolor: result.ccolor,
            xobservacionvehiculo: result.xobservacionvehiculo,
            ctipodocidentidadpropietario: result.ctipodocidentidadpropietario,
            xdocidentidadpropietario: result.xdocidentidadpropietario,
            xnombrepropietario: result.xnombrepropietario,
            xapellidopropietario: result.xapellidopropietario,
            cestado: result.cestado,
            cciudad: result.cciudad,
            xdireccion: result.xdireccion,
            xtelefonocelularpropietario: result.xtelefonocelularpropietario,
            xtelefonocasapropietario: result.xtelefonocasapropietario,
            xemailpropietario: result.xemailpropietario,
            xobservacionpropietario: result.xobservacionpropietario,
            replacements: result.replacements
          });
          this.thirdpartyVehicleGridApi.setRowData(this.thirdpartyVehicleList);
        }
      }
    });
  }

  addProvider(){
    if(this.code){
      let provider = { 
        ctiponotificacion: this.detail_form.get('ctiponotificacion').value,
        cnotificacion: this.code
       };
      const modalRef = this.modalService.open(NotificationSearchProviderComponent, {size: 'xl'});
      modalRef.componentInstance.provider = provider;
      modalRef.result.then((result: any) => { 
        if(result){
          if(result.type == 3){
            this.providerList.push({
              cgrid: this.providerList.length,
              create: true,
              editable: true,
              cproveedor: result.cproveedor,
              xnombre: result.xnombre,
              xobservacion: result.xobservacion,
              replacements: result.replacements
            });
            this.providerGridApi.setRowData(this.providerList);
          }
        }
      });
    }
  }

  addTracing(){
    let tracing = { type: 3 };
    const modalRef = this.modalService.open(NotificationTracingComponent);
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
            fseguimientonotificacion: result.fseguimientonotificacion,
            bcerrado: result.bcerrado,
            xcerrado: result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: result.xobservacion
          });
          this.tracingGridApi.setRowData(this.tracingList);
        }
      }
    });
  }

  noteRowClicked(event: any){
    let note = {};
    if(this.editStatus){ 
      note = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cnotanotificacion: event.data.cnotanotificacion,
        xnotanotificacion: event.data.xnotanotificacion,
        xrutaarchivo: event.data.xrutaarchivo,
        cfiniquito: event.data.cfiniquito,
        ccompania: this.currentUser.data.ccompania,
        delete: false
      };
    }else{ 
      note = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cnotanotificacion: event.data.cnotanotificacion,
        xnotanotificacion: event.data.xnotanotificacion,
        xrutaarchivo: event.data.xrutaarchivo,
        cfiniquito: event.data.cfiniquito,
        ccompania: this.currentUser.data.ccompania,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationNoteComponent);
    modalRef.componentInstance.note = note;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.noteList.length; i++){
            if(this.noteList[i].cgrid == result.cgrid){
              this.noteList[i].xnotanotificacion = result.xnotanotificacion;
              this.noteList[i].xrutaarchivo = result.xrutaarchivo;
              this.noteGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.noteDeletedRowList.push({ cnotanotificacion: result.cnotanotificacion });
          }
          this.noteList = this.noteList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.noteList.length; i++){
            this.noteList[i].cgrid = i;
          }
          this.noteGridApi.setRowData(this.noteList);
        }
      }
    });
  }

  replacementRowClicked(event: any){
    let replacement = {};
    if(this.editStatus){ 
      replacement = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        crepuesto: event.data.crepuesto,
        ctiporepuesto: event.data.ctiporepuesto,
        ncantidad: event.data.ncantidad,
        cniveldano: event.data.cniveldano,
        delete: false
      };
    }else{ 
      replacement = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        crepuesto: event.data.crepuesto,
        ctiporepuesto: event.data.ctiporepuesto,
        ncantidad: event.data.ncantidad,
        cniveldano: event.data.cniveldano,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationReplacementComponent);
    modalRef.componentInstance.replacement = replacement;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i <  this.replacementList.length; i++){
            if( this.replacementList[i].cgrid == result.cgrid){
              this.replacementList[i].crepuesto = result.crepuesto;
              this.replacementList[i].xrepuesto = result.xrepuesto;
              this.replacementList[i].ctiporepuesto = result.ctiporepuesto;
              this.replacementList[i].ncantidad = result.ncantidad;
              this.replacementList[i].cniveldano = result.cniveldano;
              this.replacementGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.replacementDeletedRowList.push({ crepuesto: result.crepuesto });
          }
          this.replacementList = this.replacementList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.replacementList.length; i++){
            this.replacementList[i].cgrid = i;
          }
          this.replacementGridApi.setRowData(this.replacementList);
        }
      }
    });
  }

  thirdpartyRowClicked(event: any){
    let thirdparty = {};
    if(this.editStatus){ 
      thirdparty = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cterceronotificacion: event.data.cterceronotificacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        xobservacion: event.data.xobservacion,
        tracings: event.data.tracings,
        delete: false
      };
    }else{ 
      thirdparty = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cterceronotificacion: event.data.cterceronotificacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        xobservacion: event.data.xobservacion,
        tracings: event.data.tracings,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationThirdpartyComponent, { size: 'xl' });
    modalRef.componentInstance.thirdparty = thirdparty;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.thirdpartyList.length; i++){
            if(this.thirdpartyList[i].cgrid == result.cgrid){
              this.thirdpartyList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.thirdpartyList[i].xdocidentidad = result.xdocidentidad;
              this.thirdpartyList[i].xnombre = result.xnombre;
              this.thirdpartyList[i].xapellido = result.xapellido;
              this.thirdpartyList[i].xtelefonocelular = result.xtelefonocelular;
              this.thirdpartyList[i].xtelefonocasa = result.xtelefonocasa;
              this.thirdpartyList[i].xemail = result.xemail;
              this.thirdpartyList[i].xobservacion = result.xobservacion;
              this.thirdpartyList[i].tracings = result.tracings;
              this.thirdpartyList[i].tracingsResult = result.tracingsResult;
              this.thirdpartyGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.thirdpartyDeletedRowList.push({ cterceronotificacion: result.cterceronotificacion });
          }
          this.thirdpartyList = this.thirdpartyList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.thirdpartyList.length; i++){
            this.thirdpartyList[i].cgrid = i;
          }
          this.thirdpartyGridApi.setRowData(this.thirdpartyList);
        }
      }
    });
  }

  materialDamageRowClicked(event: any){
    let materialDamage = {};
    if(this.editStatus && !this.editBlock){ 
      materialDamage = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cdanomaterialnotificacion: event.data.cdanomaterialnotificacion,
        cdanomaterial: event.data.cdanomaterial,
        cniveldano: event.data.cniveldano,
        xobservacion: event.data.xobservacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        delete: false
      };
    }else{ 
      materialDamage = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdanomaterialnotificacion: event.data.cdanomaterialnotificacion,
        cdanomaterial: event.data.cdanomaterial,
        cniveldano: event.data.cniveldano,
        xobservacion: event.data.xobservacion,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelular: event.data.xtelefonocelular,
        xtelefonocasa: event.data.xtelefonocasa,
        xemail: event.data.xemail,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationMaterialDamageComponent, { size: 'xl' });
    modalRef.componentInstance.materialDamage = materialDamage;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.materialDamageList.length; i++){
            if(this.materialDamageList[i].cgrid == result.cgrid){
              this.materialDamageList[i].cdanomaterial = result.cdanomaterial;
              this.materialDamageList[i].xdanomaterial = result.xdanomaterial;
              this.materialDamageList[i].cniveldano = result.cniveldano;
              this.materialDamageList[i].xniveldano = result.xniveldano;
              this.materialDamageList[i].xobservacion = result.xobservacion;
              this.materialDamageList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.materialDamageList[i].xdocidentidad = result.xdocidentidad;
              this.materialDamageList[i].xnombre = result.xnombre;
              this.materialDamageList[i].xapellido = result.xapellido;
              this.materialDamageList[i].cestado = result.cestado;
              this.materialDamageList[i].cciudad = result.cciudad;
              this.materialDamageList[i].xdireccion = result.xdireccion;
              this.materialDamageList[i].xtelefonocelular = result.xtelefonocelular;
              this.materialDamageList[i].xtelefonocasa = result.xtelefonocasa;
              this.materialDamageList[i].xemail = result.xemail;
              this.materialDamageGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.materialDamageDeletedRowList.push({ cdanomaterialnotificacion: result.cdanomaterialnotificacion });
          }
          this.materialDamageList = this.materialDamageList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.materialDamageList.length; i++){
            this.materialDamageList[i].cgrid = i;
          }
          this.materialDamageGridApi.setRowData(this.materialDamageList);
        }
      }
    });
  }

  thirdpartyVehicleRowClicked(event: any){
    let thirdpartyVehicle = {};
    if(this.editStatus && !this.editBlock){ 
      thirdpartyVehicle = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cvehiculoterceronotificacion: event.data.cvehiculoterceronotificacion,
        ctipodocidentidadconductor: event.data.ctipodocidentidadconductor,
        xdocidentidadconductor: event.data.xdocidentidadconductor,
        xnombreconductor: event.data.xnombreconductor,
        xapellidoconductor: event.data.xapellidoconductor,
        xtelefonocelularconductor: event.data.xtelefonocelularconductor,
        xtelefonocasaconductor: event.data.xtelefonocasaconductor,
        xemailconductor: event.data.xemailconductor,
        xobservacionconductor: event.data.xobservacionconductor,
        xplaca: event.data.xplaca,
        cmarca: event.data.cmarca,
        cmodelo: event.data.cmodelo,
        cversion: event.data.cversion,
        fano: event.data.fano,
        ccolor: event.data.ccolor,
        xobservacionvehiculo: event.data.xobservacionvehiculo,
        ctipodocidentidadpropietario: event.data.ctipodocidentidadpropietario,
        xdocidentidadpropietario: event.data.xdocidentidadpropietario,
        xnombrepropietario: event.data.xnombrepropietario,
        xapellidopropietario: event.data.xapellidopropietario,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelularpropietario: event.data.xtelefonocelularpropietario,
        xtelefonocasapropietario: event.data.xtelefonocasapropietario,
        xemailpropietario: event.data.xemailpropietario,
        xobservacionpropietario: event.data.xobservacionpropietario,
        replacements: event.data.replacements,
        delete: false
      };
    }else{ 
      thirdpartyVehicle = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cvehiculoterceronotificacion: event.data.cvehiculoterceronotificacion,
        ctipodocidentidadconductor: event.data.ctipodocidentidadconductor,
        xdocidentidadconductor: event.data.xdocidentidadconductor,
        xnombreconductor: event.data.xnombreconductor,
        xapellidoconductor: event.data.xapellidoconductor,
        xtelefonocelularconductor: event.data.xtelefonocelularconductor,
        xtelefonocasaconductor: event.data.xtelefonocasaconductor,
        xemailconductor: event.data.xemailconductor,
        xobservacionconductor: event.data.xobservacionconductor,
        xplaca: event.data.xplaca,
        cmarca: event.data.cmarca,
        cmodelo: event.data.cmodelo,
        cversion: event.data.cversion,
        fano: event.data.fano,
        ccolor: event.data.ccolor,
        xobservacionvehiculo: event.data.xobservacionvehiculo,
        ctipodocidentidadpropietario: event.data.ctipodocidentidadpropietario,
        xdocidentidadpropietario: event.data.xdocidentidadpropietario,
        xnombrepropietario: event.data.xnombrepropietario,
        xapellidopropietario: event.data.xapellidopropietario,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccion: event.data.xdireccion,
        xtelefonocelularpropietario: event.data.xtelefonocelularpropietario,
        xtelefonocasapropietario: event.data.xtelefonocasapropietario,
        xemailpropietario: event.data.xemailpropietario,
        xobservacionpropietario: event.data.xobservacionpropietario,
        replacements: event.data.replacements,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationThirdpartyVehicleComponent, {size: 'xl'});
    modalRef.componentInstance.thirdpartyVehicle = thirdpartyVehicle;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.thirdpartyVehicleList.length; i++){
            if(this.thirdpartyVehicleList[i].cgrid == result.cgrid){
              this.thirdpartyVehicleList[i].ctipodocidentidadconductor = result.ctipodocidentidadconductor;
              this.thirdpartyVehicleList[i].xdocidentidadconductor = result.xdocidentidadconductor;
              this.thirdpartyVehicleList[i].xnombreconductor = result.xnombreconductor;
              this.thirdpartyVehicleList[i].xapellidoconductor = result.xapellidoconductor;
              this.thirdpartyVehicleList[i].xtelefonocelularconductor = result.xtelefonocelularconductor;
              this.thirdpartyVehicleList[i].xtelefonocasaconductor = result.xtelefonocasaconductor;
              this.thirdpartyVehicleList[i].xemailconductor = result.xemailconductor;
              this.thirdpartyVehicleList[i].xobservacionconductor = result.xobservacionconductor;
              this.thirdpartyVehicleList[i].xplaca = result.xplaca;
              this.thirdpartyVehicleList[i].cmarca = result.cmarca;
              this.thirdpartyVehicleList[i].xmarca = result.xmarca;
              this.thirdpartyVehicleList[i].cmodelo = result.cmodelo;
              this.thirdpartyVehicleList[i].xmodelo = result.xmodelo;
              this.thirdpartyVehicleList[i].cversion = result.cversion;
              this.thirdpartyVehicleList[i].xversion = result.xversion;
              this.thirdpartyVehicleList[i].fano = result.fano;
              this.thirdpartyVehicleList[i].ccolor = result.ccolor;
              this.thirdpartyVehicleList[i].xobservacionvehiculo = result.xobservacionvehiculo;
              this.thirdpartyVehicleList[i].ctipodocidentidadpropietario = result.ctipodocidentidadpropietario;
              this.thirdpartyVehicleList[i].xdocidentidadpropietario = result.xdocidentidadpropietario;
              this.thirdpartyVehicleList[i].xnombrepropietario = result.xnombrepropietario;
              this.thirdpartyVehicleList[i].xapellidopropietario = result.xapellidopropietario;
              this.thirdpartyVehicleList[i].cestado = result.cestado;
              this.thirdpartyVehicleList[i].cciudad = result.cciudad;
              this.thirdpartyVehicleList[i].xdireccion = result.xdireccion;
              this.thirdpartyVehicleList[i].xtelefonocelularpropietario = result.xtelefonocelularpropietario;
              this.thirdpartyVehicleList[i].xtelefonocasapropietario = result.xtelefonocasapropietario;
              this.thirdpartyVehicleList[i].xemailpropietario = result.xemailpropietario;
              this.thirdpartyVehicleList[i].xobservacionpropietario = result.xobservacionpropietario;
              this.thirdpartyVehicleList[i].replacements = result.replacements;
              this.thirdpartyVehicleList[i].replacementsResult = result.replacementsResult;
              this.thirdpartyGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.thirdpartyVehicleDeletedRowList.push({ cvehiculoterceronotificacion: result.cvehiculoterceronotificacion});
          }
          this.thirdpartyVehicleList = this.thirdpartyVehicleList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.thirdpartyVehicleList.length; i++){
            this.thirdpartyVehicleList[i].cgrid = i;
          }
          this.thirdpartyVehicleGridApi.setRowData(this.thirdpartyVehicleList);
        }
      }
    });
  }

  providerRowClicked(event: any){
    let provider = {};
    if(this.editStatus && event.data.create){ 
      provider = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xobservacion: event.data.xobservacion,
        replacements: event.data.replacements,
        delete: false
      };
    }else{ 
      provider = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xobservacion: event.data.xobservacion,
        replacements: event.data.replacements,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationProviderComponent, {size: 'xl'});
    modalRef.componentInstance.provider = provider;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.providerList.length; i++){
            if(this.providerList[i].cgrid == result.cgrid){
              this.providerList[i].cproveedor = result.cproveedor;
              this.providerList[i].xproveedor = result.xproveedor;
              this.providerList[i].xobservacion = result.xobservacion;
              this.providerList[i].replacements = result.replacements;
              this.providerList[i].replacementsResult = result.replacementsResult;
              this.providerGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          this.providerList = this.providerList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.providerList.length; i++){
            this.providerList[i].cgrid = i;
          }
          this.providerGridApi.setRowData(this.providerList);
        }
      }
    });
  }

  quoteRowClicked(event: any){
    let quote = {};
    let notificacion = this.code;
    if(this.editStatus){ 
      quote = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xnombre: event.data.xnombre,
        replacements: event.data.replacements,
        cnotificacion: notificacion,
        baceptacion: event.data.baceptacion,
        mtotalcotizacion: event.data.mtotalcotizacion,
        cimpuesto: 13,
        delete: false
      };
    }else{ 
      quote = { 
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccotizacion: event.data.ccotizacion,
        cproveedor: event.data.cproveedor,
        xnombre: event.data.xnombre,
        replacements: event.data.replacements,
        cnotificacion: notificacion,
        baceptacion: event.data.baceptacion,
        mtotalcotizacion: event.data.mtotalcotizacion,
        cimpuesto: 13,
        delete: false
      }; 
    }
 
    const modalRef = this.modalService.open(NotificationQuoteComponent, {size: 'xl'});
    modalRef.componentInstance.quote = quote;
    modalRef.result.then((result: any) => {
      if(result){
        this.serviceOrderList.push(result);
        this.serviceOrderGridApi.setRowData(this.serviceOrderList);
          for(let i = 0; i < this.quoteList.length; i++){
            if(this.quoteList[i].cgrid == result.cgrid){
              this.quoteList[i].replacements = result.replacements;
              this.quoteList[i].baceptacion = result.baceptacion;
              //this.quoteList[i].mtotalcotizacion = result.mtotalcotizacion;
              this.quoteList[i].cimpuesto = 13;
              //console.log(this.quoteList[i].mtotalcotizacion)
              this.quoteGridApi.refreshCells();
              return;
            }
          }
      }
    });
  }

  tracingRowClicked(event: any){
    let tracing = {};
    if(this.editStatus){ 
      tracing = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cseguimientonotificacion: event.data.cseguimientonotificacion,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientonotificacion: event.data.fseguimientonotificacion,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      };
    }else{ 
      tracing = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cseguimientonotificacion: event.data.cseguimientonotificacion,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientonotificacion: event.data.fseguimientonotificacion,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.tracingList.length; i++){
            if(this.tracingList[i].cgrid == result.cgrid){
              this.tracingList[i].ctiposeguimiento = result.ctiposeguimiento;
              this.tracingList[i].xtiposeguimiento = result.xtiposeguimiento;
              this.tracingList[i].cmotivoseguimiento = result.cmotivoseguimiento;
              this.tracingList[i].xmotivoseguimiento = result.xmotivoseguimiento;
              this.tracingList[i].fdia = result.fdia;
              this.tracingList[i].fhora = result.fhora;
              this.tracingList[i].fseguimientonotificacion = result.fseguimientonotificacion;
              this.tracingList[i].bcerrado = result.bcerrado;
              this.tracingList[i].xcerrado = result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              this.tracingList[i].xobservacion = result.xobservacion;
              this.tracingGridApi.refreshCells();
              return;
            }
          }
        }
      }
    });
  }

  addServiceOrder(){
    if(this.code){
      let notificacion = {cnotificacion: this.code, repuestos: this.replacementList, createServiceOrder: true, cestado: this.detail_form.get('cestado').value};
      const modalRef = this.modalService.open(NotificationServiceOrderComponent, {size: 'xl'});
      modalRef.componentInstance.notificacion = notificacion;
      modalRef.result.then((result: any) => { 

        this.serviceOrderList.push({
        cgrid: this.serviceOrderList.length,
        createServiceOrder: true,
        edit: false,
        cnotificacion: result.cnotificacion,
        corden: result.corden,
        cservicio: result.cservicio,
        xservicio: result.xservicio,
        cservicioadicional: result.cservicioadicional,
        xobservacion: result.xobservacion,
        xfecha: result.xfecha,
        xdanos: result.xdanos,
        fajuste: result.fajuste.substring(0,10),
        xdesde: result.xdesde,
        xhacia: result.xhacia,
        mmonto: result.mmonto,
        cimpuesto: 13,
        cmoneda: result.cmoneda,
        xmoneda: result.xmoneda,
        cproveedor: result.cproveedor,
        bactivo: result.bactivo,
        ccotizacion: result.ccotizacion,
        cestatusgeneral: result.cestatusgeneral,
        ccausaanulacion: result.ccausaanulacion
       });
       this.serviceOrderGridApi.setRowData(this.serviceOrderList);
      });
    }
  }

  addSettlement(){
    if(this.code){
      let notificacion = {cnotificacion: this.code, repuestos: this.replacementList, createSettlement: true};
      const modalRef = this.modalService.open(NotificationSettlementComponent, {size: 'xl'});
      modalRef.componentInstance.notificacion = notificacion;
      modalRef.result.then((result: any) => { 


        this.settlement = {
          //cgrid: this.settlementList.length,
          createSettlement: true,
          edit: false,
          cnotificacion: result.cnotificacion,
          xobservacion: result.xobservacion,
          xdanos: result.xdanos,
          mmontofiniquito: result.mmontofiniquito,
          ccausafiniquito: result.ccausafiniquito,
          cmoneda: result.cmoneda
        }
      });
      console.log(this.settlement)
    }
  }

  onNotesGridReady(event){
    this.noteGridApi = event.api;
  }

  onReplacementsGridReady(event){
    this.replacementGridApi = event.api;
  }

  onThirdpartiesGridReady(event){
    this.thirdpartyGridApi = event.api;
  }

  onMaterialDamagesGridReady(event){
    this.materialDamageGridApi = event.api;
  }

  onThirdpartiesVehiclesGridReady(event){
    this.thirdpartyVehicleGridApi = event.api;
  }

  onProvidersGridReady(event){
    this.providerGridApi = event.api;
  }

  onQuotesGridReady(event){
    this.quoteGridApi = event.api;
  }

  onTracingsGridReady(event){
    this.tracingGridApi = event.api;
  }

  onServiceOrderGridReady(event){
    this.serviceOrderGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      if(!this.detail_form.get('ccontratoflota').value){
        this.alert.message = "EVENTS.NOTIFICATIONS.REQUIREDCONTRACT";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
      this.loading = false;
      return;
    }
    let fevento = `${form.fdia}T${form.fhora}Z`;
    let params;
    let url;
    if(this.code){
      let updateNoteList = this.noteList.filter((row) => { return !row.create; });
      let createNoteList = this.noteList.filter((row) => { return row.create; });
      let updateReplacementList = this.replacementList.filter((row) => { return !row.create; });
      let createReplacementList = this.replacementList.filter((row) => { return row.create; });
      let updateThirdpartyList = this.thirdpartyList.filter((row) => { return !row.create; });
      let updateProviderList = this.providerList.filter((row) => { return !row.create; });
      let createProviderList = this.providerList.filter((row) => { return row.create; });
      let updateTracingList = this.tracingList.filter((row) => { return !row.create; });
      let createTracingList = this.tracingList.filter((row) => { return row.create; });
      let updateQuoteList = this.quoteList.filter((row) => { return !row.create; });

      let updateServiceOrderList = []
      for(let i = 0; i < this.serviceOrderList.length; i++){
        if(this.serviceOrderList[i].edit){
          updateServiceOrderList.push({
            orden: this.serviceOrderList[i]
          })
        }
      }
      //let updateServiceOrderList = this.serviceOrderList.filter((row) => { return row.edit; });
      let createServiceOrderList = this.serviceOrderList.filter((row) => { return row.createServiceOrder; });
      params = {
        cnotificacion: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        notes: {
          create: createNoteList,
          update: updateNoteList,
          delete: this.noteDeletedRowList
        },
        replacements: {
          create: createReplacementList,
          update: updateReplacementList,
          delete: this.replacementDeletedRowList
        },
        thirdparties: {
          update: updateThirdpartyList
        },
        providers: {
          create: createProviderList,
          update: updateProviderList
        },
        tracings: {
          create: createTracingList,
          update: updateTracingList
        },
        serviceOrder: {
          create: createServiceOrderList,
          update: updateServiceOrderList
        },
        quotes: {
          update: updateQuoteList
        },
        settlement: {
          create: this.settlement
        }
      };
      url = `${environment.apiUrl}/api/notification/update`;
      this.sendFormData(params, url);
    }else{
      let tracing = { type: 3 }; 
      console.log(this.detail_form.get('crecaudo').value)
      const modalRef = this.modalService.open(NotificationTracingComponent);
      modalRef.componentInstance.tracing = tracing;
      modalRef.result.then((result: any) => { 
        if(result){
          if(result.type == 3){
            params = {
              cpais: this.currentUser.data.cpais,
              ccompania: this.currentUser.data.ccompania,
              ccontratoflota: form.ccontratoflota,
              ctiponotificacion: form.ctiponotificacion,
              crecaudo: this.detail_form.get('crecaudo').value,
              ccausasiniestro: form.ccausasiniestro,
              xnombre: form.xnombre,
              xapellido: form.xapellido,
              xtelefono: form.xtelefono,
              xnombrealternativo: form.xnombrealternativo ? form.xnombrealternativo : undefined,
              xapellidoalternativo: form.xapellidoalternativo ? form.xapellidoalternativo : undefined,
              xtelefonoalternativo: form.xtelefonoalternativo ? form.xtelefonoalternativo : undefined,
              bdano: form.bdano,
              btransitar: form.btransitar,
              bdanootro: form.bdanootro,
              blesionado: form.blesionado,
              bpropietario: form.bpropietario,
              fevento: fevento,
              cestado: form.cestado,
              cciudad: form.cciudad,
              xdireccion: form.xdireccion,
              xdescripcion: form.xdescripcion,
              btransito: form.btransito,
              bcarga: form.bcarga,
              bpasajero: form.bpasajero,
              npasajero: form.npasajero ? form.npasajero : undefined,
              xobservacion: form.xobservacion,
              ctiposeguimiento: result.ctiposeguimiento,
              cmotivoseguimiento: result.cmotivoseguimiento,
              fseguimientonotificacion: result.fseguimientonotificacion,
              xobservacionseguimiento: result.xobservacion,
              cusuariocreacion: this.currentUser.data.cusuario,
              notes: this.noteList,
              replacements: this.replacementList,
              thirdparties: this.thirdpartyList,
              materialDamages: this.materialDamageList,
              thirdpartyVehicles: this.thirdpartyVehicleList,
              serviceOrder: this.serviceOrderList
            };
            url = `${environment.apiUrl}/api/notification/create`;
            this.sendFormData(params, url);
          }
        }else{
          this.loading = false;
          return;
        }
      });
    }
  }

  sendFormData(params, url){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/events/notification-detail/${response.data.cnotificacion}`]);
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  serviceOrderRowClicked(event: any){
    let notificacion = {};
    if(this.editStatus){ 
      notificacion = { 
        edit: true,
        createServiceOrder: false,
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cnotificacion: event.data.cnotificacion,
        corden: event.data.corden,
        cservicioadicional: event.data.cservicioadicional,
        xservicio: event.data.xservicio,
        xservicioadicional: event.data.xservicioadicional,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xdanos: event.data.xdanos,
        xobservacion: event.data.xobservacion,
        xfecha: event.data.xfecha,
        fajuste: event.data.fajuste.substring(0, 10),
        xdesde: event.data.xdesde,
        xhacia: event.data.xhacia,
        mmonto: event.data.mmonto,
        cimpuesto: 13,
        cmoneda: event.data.cmoneda,
        xmoneda: event.data.xmoneda,
        cestatusgeneral: event.data.cestatusgeneral,
        ccausaanulacion: event.data.ccausaanulacion,
        bactivo: event.data.bactivo,
        delete: false
      };
      console.log(notificacion)
    }else{
      notificacion = { 
        edit: this.editStatus,
        createServiceOrder: false,
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cnotificacion: event.data.cnotificacion,
        corden: event.data.corden,
        cservicioadicional: event.data.cservicioadicional,
        xservicio: event.data.xservicio,
        xservicioadicional: event.data.xservicioadicional,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        xdanos: event.data.xdanos,
        xobservacion: event.data.xobservacion,
        xfecha: event.data.xfecha,
        fajuste: event.data.fajuste.substring(0, 10),
        xdesde: event.data.xdesde,
        xhacia: event.data.xhacia,
        mmonto: event.data.mmonto,
        cimpuesto: 13,
        cmoneda: event.data.cmoneda,
        xmoneda: event.data.xmoneda,
        cestatusgeneral: event.data.cestatusgeneral,
        ccausaanulacion: event.data.ccausaanulacion,
        bactivo: event.data.bactivo,
        delete: false
      }
      console.log(notificacion)
    }
    if(this.editStatus){
    const modalRef = this.modalService.open(NotificationServiceOrderComponent, {size: 'xl'});
    modalRef.componentInstance.notificacion = notificacion;
    modalRef.result.then((result: any) => {

      let index = this.serviceOrderList.findIndex(el=> el.corden == result.corden);
      this.serviceOrderList[index].cnotificacion = result.cnotificacion;
      this.serviceOrderList[index].corden = result.corden;
      this.serviceOrderList[index].cservicio = result.cservicio;
      this.serviceOrderList[index].cservicioadicional = result.cservicioadicional;
      this.serviceOrderList[index].xservicioadicional = result.xservicioadicional;
      this.serviceOrderList[index].cproveedor = result.cproveedor;
      this.serviceOrderList[index].xobservacion = result.xobservacion;
      this.serviceOrderList[index].xdanos = result.xdanos;
      this.serviceOrderList[index].xfecha = result.xfecha;
      this.serviceOrderList[index].fajuste = result.fajuste.substring(0, 10);
      this.serviceOrderList[index].xdesde = result.xdesde;
      this.serviceOrderList[index].xhacia = result.xhacia;
      this.serviceOrderList[index].mmonto = result.mmonto;
      this.serviceOrderList[index].cimpuesto = 13;
      this.serviceOrderList[index].cmoneda = result.cmoneda;
      this.serviceOrderList[index].cestatusgeneral = result.cestatusgeneral;
      this.serviceOrderList[index].ccausaanulacion = result.ccausaanulacion;
      this.serviceOrderList[index].bactivo = result.bactivo;
      this.serviceOrderList[index].edit = this.editStatus;
      this.serviceOrderGridApi.refreshCells();
      return;
    });
  }else{
    const modalRef = this.modalService.open(NotificationServiceOrderComponent, {size: 'xl'});
    modalRef.componentInstance.notificacion = notificacion;
  }
  }

  searchOwner(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.code
    };
    this.http.post(`${environment.apiUrl}/api/notification/notification-owner`, params, options).subscribe((response : any) => {
      if(this.code){
         this.detail_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
         this.detail_form.get('cnotificacion').disable();
         this.detail_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
         this.detail_form.get('ccontratoflota').disable();
         this.detail_form.get('xnombre').setValue(response.data.list[0].xnombre);
         this.detail_form.get('xnombre').disable();
         this.detail_form.get('xapellido').setValue(response.data.list[0].xapellido);
         this.detail_form.get('xapellido').disable();
         this.detail_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
         this.detail_form.get('xnombrealternativo').disable();
         this.detail_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
         this.detail_form.get('xapellidoalternativo').disable();
         this.detail_form.get('xcliente').setValue(response.data.list[0].xcliente);
         this.detail_form.get('xcliente').disable();
         this.detail_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
         this.detail_form.get('xtelefono').disable();
         this.detail_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
         this.detail_form.get('xdescripcion').disable();
         this.detail_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
         this.detail_form.get('xnombrepropietario').disable();
         this.detail_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
         this.detail_form.get('xapellidopropietario').disable();
         this.detail_form.get('xplaca').setValue(response.data.list[0].xplaca);
         this.detail_form.get('xplaca').disable();
         this.detail_form.get('xcolor').setValue(response.data.list[0].xcolor);
         this.detail_form.get('xcolor').disable();
         if(response.data.list[0].fcreacion){
          let dateFormat = new Date(response.data.list[0].fcreacion);
          let dd = dateFormat.getDay();
          let mm = dateFormat.getMonth();
          let yyyy = dateFormat.getFullYear();
          this.fcreacion = dd + '-' + mm + '-' + yyyy;
          let fcreacion = this.fcreacion;
         }
         this.detail_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
         this.detail_form.get('xmodelo').disable();
         this.detail_form.get('xmarca').setValue(response.data.list[0].xmarca);
         this.detail_form.get('xmarca').disable();
         this.detail_form.get('fano').setValue(response.data.list[0].fano);
         this.detail_form.get('fano').disable();
         this.detail_form.get('xcliente').setValue(response.data.list[0].xcliente);
         this.detail_form.get('xcliente').disable();
         this.detail_form.get('ctiponotificacion').setValue(response.data.list[0].ctiponotificacion);
         this.detail_form.get('ctiponotificacion').disable();
         this.detail_form.get('xtiponotificacion').setValue(response.data.list[0].xtiponotificacion);
         this.detail_form.get('xtiponotificacion').disable();
         this.detail_form.get('xserialcarroceria').setValue(response.data.list[0].xserialcarroceria);
         this.detail_form.get('xserialcarroceria').disable();
          
        this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion, xtiponotificacion: response.data.list[0].xtiponotificacion});
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
  }

  getMonthAsString(month) {
    month = month + 1;
    if (month == 1) {
      return 'Enero'
    }
    if (month == 2) {
      return 'Febrero'
    }
    if (month == 3) {
      return 'Marzo'
    }
    if (month == 4) {
      return 'Abril'
    }
    if (month == 5) {
      return 'Mayo'
    }
    if (month == 6) {
      return 'Junio'
    }
    if (month == 7) {
      return 'Julio'
    }
    if (month == 8) {
      return 'Agosto'
    }
    if (month == 9) {
      return 'Septiembre'
    }
    if (month == 10) {
      return 'Octubre'
    }
    if (month == 11) {
      return 'Noviembre'
    }
    if (month == 12) {
      return 'Diciembre'
    }
  }

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  searchCollections(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctiponotificacion: this.detail_form.get('ctiponotificacion').value
    };
    this.http.post(`${environment.apiUrl}/api/notification/notification-collections`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.collectionsList.push({ crecaudo: response.data.list[i].crecaudo, xrecaudo: response.data.list[i].xrecaudo});
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
  }

  changeTypeNotification(){
    this.collectionsList = [];
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctiponotificacion: this.detail_form.get('ctiponotificacion').value
    }
    this.http.post(`${environment.apiUrl}/api/notification/notification-collections`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.collectionsList.push({ crecaudo: response.data.list[i].crecaudo, xrecaudo: response.data.list[i].xrecaudo});
        }
      }
      this.searchDocumentation();
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
  }

  searchDocumentation(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crecaudo: this.detail_form.get('crecaudo').value
    };
    this.documentationList = [];
    this.http.post(`${environment.apiUrl}/api/notification/notification-documentation`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
         this.documentationList.push({cdocumento: response.data.list[i].cdocumento, xdocumentos: response.data.list[i].xdocumentos, ncantidad: response.data.list[i].ncantidad});
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
  }

  buildCollectionsBody(){
    let body = [];
    this.documentationList.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.ncantidad, border:[false, false, false, false]});
      dataRow.push({text: row.xdocumentos, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
  }

  collectionsPdf(){
    const pdfDefinition: any = {
      content: [
        {
          columns: [
            {
              style: 'header',
              width: 140,
              height: 60,
              image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
              'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
              '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
              '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
              'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
              'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
              'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
              'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
              'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
              'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
              'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
              'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
              'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
              'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
              'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
              'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
              'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
              '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
              '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
              'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
              'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
              '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC',
              alignment: 'left',
            },
          ]
        },
        {
          alignment: 'center',
          style: 'title',
          text: [
            {text: '\nSolicitud de Recaudos', bold: true}
          ]
        },
        {
          style: 'title',
          text: ' '
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, true, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              style: 'data',
              text: [
                {text: 'NOTIFICACION:   ', bold: true}, {text: `${this.code}`}
              ]
            },
            {
              alignment: 'center',
              text: [
                {text: ''}
              ]
            },
            {
              table: {
                widths: [170, '*', 190],
                body: [
                  [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                ]
              },
            },
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'ATENCION: ', bold: true}, {text: `${this.detail_form.get('xcliente').value}`},

              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'Sirva la presente para solicitarle la entrega hasta la fecha tope indicada de los siguientes recaudos, con el objeto de tramitar su notificación concerniente a: '}, {text: `${this.detail_form.get('xtiponotificacion').value}`, bold: true}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'VEHÍCULO: ', bold: true}, {text: `${this.detail_form.get('xmarca').value} ${this.detail_form.get('xmodelo').value}`}, {text: ',  Año ', bold: true}, {text: this.detail_form.get('fano').value}, {text: ',  Placa nro.: ', bold: true}, {text: `${this.detail_form.get('xplaca').value}`}, {text: ',  Serial Carr.: ', bold: true}, {text: `${this.detail_form.get('xserialcarroceria').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, true]}]
            ]
          }
        },
        {
          columns: [
            {
              alignment: 'left',
              width: 60,
              style: 'data',
              text: [
                {text: 'CANTIDAD     ', bold: true}
              ]
            },
            {
              alignment: 'left',
              width: 350,
              style: 'data',
              text: [
                {text: 'RECAUDOS    ', bold: true}
              ]
            },
            {
              alignment: 'right',
              width: 50,
              style: 'data',
              text: [
                {text: '     ', bold: true}
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, true, false, false]}]
            ]
          }
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'data',
          table: {
            widths: [50, 350, 70],
            body: this.buildCollectionsBody()
          }
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'Sin más a que hacer referencia, me despido'}
              ]
            }
          ]
        },
       /* {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'ENTREGAR EL AJUSTE ANTES DE: '}, {text: [{text: this.changeDateFormat(this.detail_form.get('fajuste').value)}], border:[false, false, true, true]}
              ]
            }
          ]
        },*/
      ],
      styles: {
        data: {
          fontSize: 10
        },
        title: {
          fontSize: 15,
          bold: true,
          alignment: 'center'
        },
        color1: {
          color: '#1D4C01'
        },
        color2: {
          color: '#7F0303'
        },
      }
    }
    pdfMake.createPdf(pdfDefinition).open();

    //pdfMake.createPdf(pdfDefinition).download('file.pdf', function() { alert('your pdf is done'); });
  }
}
