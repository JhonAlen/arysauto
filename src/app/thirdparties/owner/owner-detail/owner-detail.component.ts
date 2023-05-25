import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerDocumentComponent } from '@app/pop-up/owner-document/owner-document.component';
import { OwnerVehicleComponent } from '@app/pop-up/owner-vehicle/owner-vehicle.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.css']
})
export class OwnerDetailComponent implements OnInit {
  
  private documentGridApi;
  private vehicleGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  documentTypeList: any[] = [];
  civilStatusList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  relationshipList: any[] = [];
  documentList: any[] = [];
  vehicleList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  documentDeletedRowList: any[] = [];
  vehicleDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xnombre: [''],
      xapellido: [''],
      cestadocivil: [''],
      fnacimiento: [''],
      xprofesion: [''],
      xocupacion: [''],
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      cestado: [''],
      cciudad: [''],
      xdireccion: [''],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xtelefonocelular: [''],
      xtelefonocasa: [''],
      xfax: [''],
      cparentesco: [''],
      bactivo: [true],
      cprocedencia: [{ value: null, disabled: true }]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 69
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
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
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
    this.http.post(`${environment.apiUrl}/api/valrep/civil-status`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.civilStatusList.push({ id: response.data.list[i].cestadocivil, value: response.data.list[i].xestadocivil });
        }
        this.civilStatusList.sort((a,b) => a.value > b.value ? 1 : -1);
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
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
        }
        this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.STATENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/relationship`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.relationshipList.push({ id: response.data.list[i].cparentesco, value: response.data.list[i].xparentesco });
        }
        this.relationshipList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.RELATIONSHIPNOTFOUND"; }
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
        this.getOwnerData();
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

  getOwnerData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 69
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cpropietario: this.code
    };
    this.http.post(`${environment.apiUrl}/api/v2/owner/production/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xnombre').disable();
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xapellido').disable();
        this.detail_form.get('cestadocivil').setValue(response.data.cestadocivil);
        this.detail_form.get('cestadocivil').disable();
        if(response.data.fnacimiento){
          let dateFormat = new Date(response.data.fnacimiento).toISOString().substring(0, 10);
          this.detail_form.get('fnacimiento').setValue(dateFormat);
          this.detail_form.get('fnacimiento').disable();
        }
        response.data.xprofesion ? this.detail_form.get('xprofesion').setValue(response.data.xprofesion) : false;
        this.detail_form.get('xprofesion').disable();
        response.data.xprofesion ? this.detail_form.get('xocupacion').setValue(response.data.xocupacion) : false;
        this.detail_form.get('xocupacion').disable();
        this.detail_form.get('ctipodocidentidad').setValue(response.data.ctipodocidentidad);
        this.detail_form.get('ctipodocidentidad').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        this.detail_form.get('xtelefonocelular').setValue(response.data.xtelefonocelular);
        this.detail_form.get('xtelefonocelular').disable();
        response.data.xtelefonocasa ? this.detail_form.get('xtelefonocasa').setValue(response.data.xtelefonocasa) : false;
        this.detail_form.get('xtelefonocasa').disable();
        response.data.xfax ? this.detail_form.get('xfax').setValue(response.data.xfax) : false;
        this.detail_form.get('xfax').disable();
        this.detail_form.get('cparentesco').setValue(response.data.cparentesco);
        this.detail_form.get('cparentesco').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.detail_form.get('cprocedencia').setValue(response.data.cprocedencia);
        if(response.data.cprocedencia == 'API'){ this.showEditButton = false;  }
        this.documentList = [];
        if(response.data.documents){
          for(let i =0; i < response.data.documents.length; i++){
            this.documentList.push({
              cgrid: i,
              create: false,
              cdocumentopropietario: response.data.documents[i].cdocumentopropietario,
              cdocumento: response.data.documents[i].cdocumento,
              xdocumento: response.data.documents[i].xdocumento,
              xrutaarchivo: response.data.documents[i].xrutaarchivo
            });
          }
        }
        this.vehicleList = [];
        if(response.data.vehicles){
          for(let i =0; i < response.data.vehicles.length; i++){
            let images = [];
            for(let j =0; j < response.data.vehicles[i].images.length; j++){
              images.push({
                create: false,
                cimagen: response.data.vehicles[i].images[j].cimagen,
                ximagen: response.data.vehicles[i].images[j].ximagen,
                xrutaimagen: response.data.vehicles[i].images[j].xrutaimagen
              });
            }
            this.vehicleList.push({
              cgrid: i,
              create: false,
              cvehiculopropietario: response.data.vehicles[i].cvehiculopropietario,
              cmarca: response.data.vehicles[i].cmarca,
              xmarca: response.data.vehicles[i].xmarca,
              cmodelo: response.data.vehicles[i].cmodelo,
              xmodelo: response.data.vehicles[i].xmodelo,
              cversion: response.data.vehicles[i].cversion,
              xversion: response.data.vehicles[i].xversion,
              xplaca: response.data.vehicles[i].xplaca,
              fano: response.data.vehicles[i].fano,
              xcolor: response.data.vehicles[i].xcolor,
              cmoneda: response.data.vehicles[i].cmoneda,
              xmoneda: response.data.vehicles[i].xmoneda,
              xuso: response.data.vehicles[i].xuso,
              xtipo: response.data.vehicles[i].xtipo,
              nkilometraje: response.data.vehicles[i].nkilometraje,
              bimportado: response.data.vehicles[i].bimportado,
              xcertificadoorigen: response.data.vehicles[i].xcertificadoorigen,
              mpreciovehiculo: response.data.vehicles[i].mpreciovehiculo,
              ncapacidadcarga: response.data.vehicles[i].ncapacidadcarga,
              ncapacidadpasajeros: response.data.vehicles[i].ncapacidadpasajeros,
              xserialcarroceria: response.data.vehicles[i].xserialcarroceria,
              xserialmotor: response.data.vehicles[i].xserialmotor,
              images: images
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
      else if(code == 404){ message = "HTTP.ERROR.OWNERS.OWNERNOTFOUND"; }
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

  editOwner(){
    this.detail_form.get('xnombre').enable();
    this.detail_form.get('xapellido').enable();
    this.detail_form.get('cestadocivil').enable();
    this.detail_form.get('fnacimiento').enable();
    this.detail_form.get('xprofesion').enable();
    this.detail_form.get('xocupacion').enable();
    this.detail_form.get('ctipodocidentidad').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('xdireccion').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('xtelefonocasa').enable();
    this.detail_form.get('xtelefonocelular').enable();
    this.detail_form.get('xfax').enable();
    this.detail_form.get('cparentesco').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getOwnerData();
    }else{
      this.router.navigate([`/thirdparties/owner-index`]);
    }
  }

  addDocument(){
    let document = { type: 3 };
    const modalRef = this.modalService.open(OwnerDocumentComponent);
    modalRef.componentInstance.document = document;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.documentList.push({
            cgrid: this.documentList.length,
            create: true,
            cdocumento: result.cdocumento,
            xdocumento: result.xdocumento,
            xrutaarchivo: result.xrutaarchivo
          });
          this.documentGridApi.setRowData(this.documentList);
        }
      }
    });
  }

  addVehicle(){
    let vehicle = { type: 3 };
    const modalRef = this.modalService.open(OwnerVehicleComponent, { size: 'xl' });
    modalRef.componentInstance.vehicle = vehicle;
    modalRef.result.then((result: any) => { 
      console.log(result);
      if(result){
        console.log(result);
        if(result.type == 3){
          console.log(result);
          this.vehicleList.push({
            cgrid: this.vehicleList.length,
            create: true,
            cmarca: result.cmarca,
            xmarca: result.xmarca,
            cmodelo: result.cmodelo,
            xmodelo: result.xmodelo,
            cversion: result.cversion,
            xversion: result.xversion,
            xplaca: result.xplaca,
            fano: result.fano,
            xcolor: result.xcolor,
            cmoneda: result.cmoneda,
            xmoneda: result.xmoneda,
            xuso: result.xuso,
            xtipo: result.xtipo,
            nkilometraje: result.nkilometraje,
            bimportado: result.bimportado,
            xcertificadoorigen: result.xcertificadoorigen,
            mpreciovehiculo: result.mpreciovehiculo,
            ncapacidadcarga: result.ncapacidadcarga,
            ncapacidadpasajeros: result.ncapacidadpasajeros,
            xserialcarroceria: result.xserialcarroceria,
            xserialmotor: result.xserialmotor,
            images: result.images
          });
          this.vehicleGridApi.setRowData(this.vehicleList);
        }
      }
    });
  }

  documentRowClicked(event: any){
    let document = {};
    if(this.editStatus){ 
      document = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cdocumentopropietario: event.data.cdocumentopropietario,
        cdocumento: event.data.cdocumento,
        xrutaarchivo: event.data.xrutaarchivo,
        delete: false
      };
    }else{ 
      document = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdocumentopropietario: event.data.cdocumentopropietario,
        cdocumento: event.data.cdocumento,
        xrutaarchivo: event.data.xrutaarchivo,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(OwnerDocumentComponent);
    modalRef.componentInstance.document = document;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.documentList.length; i++){
            if(this.documentList[i].cgrid == result.cgrid){
              this.documentList[i].cdocumento = result.cdocumento;
              this.documentList[i].xdocumento = result.xdocumento;
              this.documentList[i].xrutaarchivo = result.xrutaarchivo;
              this.documentGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.documentDeletedRowList.push({ cdocumentopropietario: result.cdocumentopropietario });
          }
          this.documentList = this.documentList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.documentList.length; i++){
            this.documentList[i].cgrid = i;
          }
          this.documentGridApi.setRowData(this.documentList);
        }
      }
    });
  }

  vehicleRowClicked(event: any){
    let vehicle = {};
    if(this.editStatus){ 
      vehicle = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cvehiculopropietario: event.data.cvehiculopropietario,
        cmarca: event.data.cmarca,
        cmodelo: event.data.cmodelo,
        cversion: event.data.cversion,
        xplaca: event.data.xplaca,
        fano: event.data.fano,
        xcolor: event.data.xcolor,
        nkilometraje: event.data.nkilometraje,
        bimportado: event.data.bimportado,
        xcertificadoorigen: event.data.xcertificadoorigen,
        mpreciovehiculo: event.data.mpreciovehiculo,
        ncapacidadcarga: event.data.ncapacidadcarga,
        ncapacidadpasajeros: event.data.ncapacidadpasajeros,
        xserialcarroceria: event.data.xserialcarroceria,
        xserialmotor: event.data.xserialmotor,
        xuso: event.data.xuso,
        xtipo: event.data.xtipo,
        cmoneda: event.data.cmoneda,
        images: event.data.images,
        delete: false
      };
    }else{ 
      vehicle = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cvehiculopropietario: event.data.cvehiculopropietario,
        cmarca: event.data.cmarca,
        cmodelo: event.data.cmodelo,
        cversion: event.data.cversion,
        xplaca: event.data.xplaca,
        fano: event.data.fano,
        xcolor: event.data.xcolor,
        nkilometraje: event.data.nkilometraje,
        bimportado: event.data.bimportado,
        xcertificadoorigen: event.data.xcertificadoorigen,
        mpreciovehiculo: event.data.mpreciovehiculo,
        ncapacidadcarga: event.data.ncapacidadcarga,
        ncapacidadpasajeros: event.data.ncapacidadpasajeros,
        xserialcarroceria: event.data.xserialcarroceria,
        xserialmotor: event.data.xserialmotor,
        xuso: event.data.xuso,
        xtipo: event.data.xtipo,
        cmoneda: event.data.cmoneda,
        images: event.data.images,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(OwnerVehicleComponent, { size: 'xl' });
    modalRef.componentInstance.vehicle = vehicle;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.vehicleList.length; i++){
            if(this.vehicleList[i].cgrid == result.cgrid){
              this.vehicleList[i].cmarca = result.cmarca;
              this.vehicleList[i].xmarca = result.xmarca;
              this.vehicleList[i].cmodelo = result.cmodelo;
              this.vehicleList[i].xmodelo = result.xmodelo;
              this.vehicleList[i].cversion = result.cversion;
              this.vehicleList[i].xversion = result.xversion;
              this.vehicleList[i].xplaca = result.xplaca;
              this.vehicleList[i].fano = result.fano;
              this.vehicleList[i].xcolor = result.xcolor;
              this.vehicleList[i].nkilometraje = result.nkilometraje,
              this.vehicleList[i].bimportado = result.bimportado,
              this.vehicleList[i].xcertificadoorigen = result.xcertificadoorigen,
              this.vehicleList[i].mpreciovehiculo = result.mpreciovehiculo,
              this.vehicleList[i].ncapacidadcarga = result.ncapacidadcarga,
              this.vehicleList[i].ncapacidadpasajeros = result.ncapacidadpasajeros,
              this.vehicleList[i].xserialcarroceria = result.xserialcarroceria;
              this.vehicleList[i].xserialmotor = result.xserialmotor;
              this.vehicleList[i].images = result.images;
              this.vehicleList[i].cmoneda = result.cmoneda;
              this.vehicleList[i].xmoneda = result.xmoneda;
              this.vehicleList[i].xuso = result.xuso;
              this.vehicleList[i].xtipo = result.xtipo;
              this.vehicleList[i].imagesResult = result.imagesResult;
              this.vehicleGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.vehicleDeletedRowList.push({ cvehiculopropietario: result.cvehiculopropietario });
          }
          this.vehicleList = this.vehicleList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.vehicleList.length; i++){
            this.vehicleList[i].cgrid = i;
          }
          this.vehicleGridApi.setRowData(this.vehicleList);
        }
      }
    });
  }

  onDocumentsGridReady(event){
    this.documentGridApi = event.api;
  }

  onVehiclesGridReady(event){
    this.vehicleGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    if(this.code){
      let updateDocumentList = this.documentList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateDocumentList.length; i++){
        delete updateDocumentList[i].cgrid;
        delete updateDocumentList[i].create;
        delete updateDocumentList[i].xdocumento;
      }
      let createDocumentList = this.documentList.filter((row) => { return row.create; });
      for(let i = 0; i < createDocumentList.length; i++){
        delete createDocumentList[i].cgrid;
        delete createDocumentList[i].create;
        delete createDocumentList[i].xdocumento;
      }
      let updateVehicleList = this.vehicleList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateVehicleList.length; i++){
        delete updateVehicleList[i].cgrid;
        delete updateVehicleList[i].create;
        delete updateVehicleList[i].xmarca;
        delete updateVehicleList[i].xmodelo;
        delete updateVehicleList[i].xversion;
        delete updateVehicleList[i].xmoneda;
        updateVehicleList[i].images = updateVehicleList[i].imagesResult;
        delete updateVehicleList[i].imagesResult;
        if(updateVehicleList[i].images && updateVehicleList[i].images.create){
          for(let j = 0; j < updateVehicleList[i].images.create.length; j++){
            delete updateVehicleList[i].images.create[j].cgrid;
            delete updateVehicleList[i].images.create[j].create;
            delete updateVehicleList[i].images.create[j].ximagen;
          }
        }
        if(updateVehicleList[i].images && updateVehicleList[i].images.update){
          for(let j = 0; j < updateVehicleList[i].images.update.length; j++){
            delete updateVehicleList[i].images.update[j].cgrid;
            delete updateVehicleList[i].images.update[j].create;
            delete updateVehicleList[i].images.update[j].ximagen;
          }
        }
      }
      let createVehicleList = this.vehicleList.filter((row) => { return row.create; });
      for(let i = 0; i < createVehicleList.length; i++){
        delete createVehicleList[i].cgrid;
        delete createVehicleList[i].create;
        delete createVehicleList[i].xmarca;
        delete createVehicleList[i].xmodelo;
        delete createVehicleList[i].xversion;
        delete createVehicleList[i].xmoneda;
        if(createVehicleList[i].images){
          for(let j = 0; j < createVehicleList[i].images.length; j++){
            delete createVehicleList[i].images[j].cgrid;
            delete createVehicleList[i].images[j].create;
            delete createVehicleList[i].images[j].ximagen;
          }
        }
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 69
        },
        cpropietario: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        cestadocivil: form.cestadocivil,
        fnacimiento: new Date(form.fnacimiento).toUTCString(),
        xprofesion: form.xprofesion ? form.xprofesion : undefined,
        xocupacion: form.xocupacion ? form.xocupacion : undefined,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xtelefonocasa: form.xtelefonocasa ? form.xtelefonocasa : undefined,
        xfax: form.xfax ? form.xfax : undefined,
        xtelefonocelular: form.xtelefonocelular,
        xemail: form.xemail,
        cparentesco: form.cparentesco,
        bactivo: form.bactivo,
        documents: {
          create: createDocumentList,
          update: updateDocumentList,
          delete: this.documentDeletedRowList
        },
        vehicles: {
          create: createVehicleList,
          update: updateVehicleList,
          delete: this.vehicleDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/owner/production/update`;
    }else{
      let createDocumentList = this.documentList;
      for(let i = 0; i < createDocumentList.length; i++){
        delete createDocumentList[i].cgrid;
        delete createDocumentList[i].create;
        delete createDocumentList[i].xdocumento;
      }
      let createVehicleList = this.vehicleList;
      for(let i = 0; i < createVehicleList.length; i++){
        delete createVehicleList[i].cgrid;
        delete createVehicleList[i].create;
        delete createVehicleList[i].xmarca;
        delete createVehicleList[i].xmodelo;
        delete createVehicleList[i].xversion;
        delete createVehicleList[i].xmoneda;
        if(createVehicleList[i].images){
          for(let j = 0; j < createVehicleList[i].images.length; j++){
            delete createVehicleList[i].images[j].cgrid;
            delete createVehicleList[i].images[j].create;
            delete createVehicleList[i].images[j].ximagen;
          }
        }
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 69
        },
        cusuariocreacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        cestadocivil: form.cestadocivil,
        fnacimiento: new Date(form.fnacimiento).toUTCString(),
        xprofesion: form.xprofesion ? form.xprofesion : undefined,
        xocupacion: form.xocupacion ? form.xocupacion : undefined,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xtelefonocasa: form.xtelefonocasa ? form.xtelefonocasa : undefined,
        xfax: form.xfax ? form.xfax : undefined,
        xtelefonocelular: form.xtelefonocelular,
        xemail: form.xemail,
        cparentesco: form.cparentesco,
        bactivo: form.bactivo,
        documents: createDocumentList,
        vehicles: createVehicleList
      };
      url = `${environment.apiUrl}/api/v2/owner/production/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/thirdparties/owner-detail/${response.data.cpropietario}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "identification-document-already-exist"){
          this.alert.message = "THIRDPARTIES.OWNERS.IDENTIFICATIONDOCUMENTALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "email-already-exist"){
          this.alert.message = "THIRDPARTIES.OWNERS.EMAILALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "vehicle-plate-already-exist"){
          this.alert.message = "THIRDPARTIES.OWNERS.VEHICLEPLATEALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.OWNERS.OWNERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
