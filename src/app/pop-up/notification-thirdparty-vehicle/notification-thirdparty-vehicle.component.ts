import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationSearchReplacementComponent } from '@app/pop-up/notification-search-replacement/notification-search-replacement.component';
import { NotificationThirdpartyVehicleReplacementComponent } from '@app/pop-up/notification-thirdparty-vehicle-replacement/notification-thirdparty-vehicle-replacement.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-thirdparty-vehicle',
  templateUrl: './notification-thirdparty-vehicle.component.html',
  styleUrls: ['./notification-thirdparty-vehicle.component.css']
})
export class NotificationThirdpartyVehicleComponent implements OnInit {

  @Input() public thirdpartyVehicle;
  private replacementGridApi;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementList: any[] = [];
  documentTypeList: any[] = [];
  brandList: any[] = [];
  modelList: any[] = [];
  versionList: any[] = [];
  colorList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  alert = { show : false, type : "", message : "" }
  replacementDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctipodocidentidadconductor: [''],
      xdocidentidadconductor: [''],
      xnombreconductor: [''],
      xapellidoconductor: [''],
      xtelefonocelularconductor: [''],
      xtelefonocasaconductor: [''],
      xemailconductor: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xobservacionconductor: [''],
      xplaca: [''],
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
      fano: [''],
      ccolor: [''],
      xobservacionvehiculo: [''],
      ctipodocidentidadpropietario: [''],
      xdocidentidadpropietario: [''],
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      cestado: [''],
      cciudad: [''],
      xdireccion: [''],
      xtelefonocelularpropietario: [''],
      xtelefonocasapropietario: [''],
      xemailpropietario: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xobservacionpropietario: ['']
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
      this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.brandList.push({ id: response.data.list[i].cmarca, value: response.data.list[i].xmarca });
          }
          this.brandList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BRANDNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/color`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.colorList.push({ id: response.data.list[i].ccolor, value: response.data.list[i].xcolor });
          }
          this.colorList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.COLORNOTFOUND"; }
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
      if(this.thirdpartyVehicle){
        if(this.thirdpartyVehicle.type == 3){
          this.canSave = true;
        }else if(this.thirdpartyVehicle.type == 2){
          this.popup_form.get('ctipodocidentidadconductor').setValue(this.thirdpartyVehicle.ctipodocidentidadconductor);
          this.popup_form.get('ctipodocidentidadconductor').disable();
          this.popup_form.get('xdocidentidadconductor').setValue(this.thirdpartyVehicle.xdocidentidadconductor);
          this.popup_form.get('xdocidentidadconductor').disable();
          this.popup_form.get('xnombreconductor').setValue(this.thirdpartyVehicle.xnombreconductor);
          this.popup_form.get('xnombreconductor').disable();
          this.popup_form.get('xapellidoconductor').setValue(this.thirdpartyVehicle.xapellidoconductor);
          this.popup_form.get('xapellidoconductor').disable();
          this.popup_form.get('xtelefonocelularconductor').setValue(this.thirdpartyVehicle.xtelefonocelularconductor);
          this.popup_form.get('xtelefonocelularconductor').disable();
          this.popup_form.get('xtelefonocasaconductor').setValue(this.thirdpartyVehicle.xtelefonocasaconductor);
          this.popup_form.get('xtelefonocasaconductor').disable();
          this.popup_form.get('xemailconductor').setValue(this.thirdpartyVehicle.xemailconductor);
          this.popup_form.get('xemailconductor').disable();
          this.popup_form.get('xobservacionconductor').setValue(this.thirdpartyVehicle.xobservacionconductor);
          this.popup_form.get('xobservacionconductor').disable();
          this.popup_form.get('xplaca').setValue(this.thirdpartyVehicle.xplaca);
          this.popup_form.get('xplaca').disable();
          this.popup_form.get('cmarca').setValue(this.thirdpartyVehicle.cmarca);
          this.popup_form.get('cmarca').disable();
          this.modelDropdownDataRequest();
          this.popup_form.get('cmodelo').setValue(this.thirdpartyVehicle.cmodelo);
          this.popup_form.get('cmodelo').disable();
          this.versionDropdownDataRequest();
          this.popup_form.get('cversion').setValue(this.thirdpartyVehicle.cversion);
          this.popup_form.get('cversion').disable();
          this.popup_form.get('fano').setValue(this.thirdpartyVehicle.fano);
          this.popup_form.get('fano').disable();
          this.popup_form.get('ccolor').setValue(this.thirdpartyVehicle.ccolor);
          this.popup_form.get('ccolor').disable();
          this.popup_form.get('xobservacionvehiculo').setValue(this.thirdpartyVehicle.xobservacionvehiculo);
          this.popup_form.get('xobservacionvehiculo').disable();
          this.popup_form.get('ctipodocidentidadpropietario').setValue(this.thirdpartyVehicle.ctipodocidentidadpropietario);
          this.popup_form.get('ctipodocidentidadpropietario').disable();
          this.popup_form.get('xdocidentidadpropietario').setValue(this.thirdpartyVehicle.xdocidentidadpropietario);
          this.popup_form.get('xdocidentidadpropietario').disable();
          this.popup_form.get('xnombrepropietario').setValue(this.thirdpartyVehicle.xnombrepropietario);
          this.popup_form.get('xnombrepropietario').disable();
          this.popup_form.get('xapellidopropietario').setValue(this.thirdpartyVehicle.xapellidopropietario);
          this.popup_form.get('xapellidopropietario').disable();
          this.popup_form.get('cestado').setValue(this.thirdpartyVehicle.cestado);
          this.popup_form.get('cestado').disable();
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.thirdpartyVehicle.cciudad);
          this.popup_form.get('cciudad').disable();
          this.popup_form.get('xdireccion').setValue(this.thirdpartyVehicle.xdireccion);
          this.popup_form.get('xdireccion').disable();
          this.popup_form.get('xtelefonocelularpropietario').setValue(this.thirdpartyVehicle.xtelefonocelularpropietario);
          this.popup_form.get('xtelefonocelularpropietario').disable();
          this.popup_form.get('xtelefonocasapropietario').setValue(this.thirdpartyVehicle.xtelefonocasapropietario);
          this.popup_form.get('xtelefonocasapropietario').disable();
          this.popup_form.get('xemailpropietario').setValue(this.thirdpartyVehicle.xemailpropietario);
          this.popup_form.get('xemailpropietario').disable();
          this.popup_form.get('xobservacionpropietario').setValue(this.thirdpartyVehicle.xobservacionpropietario);
          this.popup_form.get('xobservacionpropietario').disable();
          this.replacementList = this.thirdpartyVehicle.replacements
          this.canSave = false;
        }else if(this.thirdpartyVehicle.type == 1){
          this.popup_form.get('ctipodocidentidadconductor').setValue(this.thirdpartyVehicle.ctipodocidentidadconductor);
          this.popup_form.get('xdocidentidadconductor').setValue(this.thirdpartyVehicle.xdocidentidadconductor);
          this.popup_form.get('xnombreconductor').setValue(this.thirdpartyVehicle.xnombreconductor);
          this.popup_form.get('xapellidoconductor').setValue(this.thirdpartyVehicle.xapellidoconductor);
          this.popup_form.get('xtelefonocelularconductor').setValue(this.thirdpartyVehicle.xtelefonocelularconductor);
          this.popup_form.get('xtelefonocasaconductor').setValue(this.thirdpartyVehicle.xtelefonocasaconductor);
          this.popup_form.get('xemailconductor').setValue(this.thirdpartyVehicle.xemailconductor);
          this.popup_form.get('xobservacionconductor').setValue(this.thirdpartyVehicle.xobservacionconductor);
          this.popup_form.get('xplaca').setValue(this.thirdpartyVehicle.xplaca);
          this.popup_form.get('cmarca').setValue(this.thirdpartyVehicle.cmarca);
          this.modelDropdownDataRequest();
          this.popup_form.get('cmodelo').setValue(this.thirdpartyVehicle.cmodelo);
          this.versionDropdownDataRequest();
          this.popup_form.get('cversion').setValue(this.thirdpartyVehicle.cversion);
          this.popup_form.get('fano').setValue(this.thirdpartyVehicle.fano);
          this.popup_form.get('ccolor').setValue(this.thirdpartyVehicle.ccolor);
          this.popup_form.get('xobservacionvehiculo').setValue(this.thirdpartyVehicle.xobservacionvehiculo);
          this.popup_form.get('ctipodocidentidadpropietario').setValue(this.thirdpartyVehicle.ctipodocidentidadpropietario);
          this.popup_form.get('xdocidentidadpropietario').setValue(this.thirdpartyVehicle.xdocidentidadpropietario);
          this.popup_form.get('xnombrepropietario').setValue(this.thirdpartyVehicle.xnombrepropietario);
          this.popup_form.get('xapellidopropietario').setValue(this.thirdpartyVehicle.xapellidopropietario);
          this.popup_form.get('cestado').setValue(this.thirdpartyVehicle.cestado);
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.thirdpartyVehicle.cciudad);
          this.popup_form.get('xdireccion').setValue(this.thirdpartyVehicle.xdireccion);
          this.popup_form.get('xtelefonocelularpropietario').setValue(this.thirdpartyVehicle.xtelefonocelularpropietario);
          this.popup_form.get('xtelefonocasapropietario').setValue(this.thirdpartyVehicle.xtelefonocasapropietario);
          this.popup_form.get('xemailpropietario').setValue(this.thirdpartyVehicle.xemailpropietario);
          this.popup_form.get('xobservacionpropietario').setValue(this.thirdpartyVehicle.xobservacionpropietario);
          for(let i =0; i < this.thirdpartyVehicle.replacements.length; i++){
            this.replacementList.push({
              cgrid: i,
              create: this.thirdpartyVehicle.replacements[i].create,
              crepuesto: this.thirdpartyVehicle.replacements[i].crepuesto,
              xrepuesto: this.thirdpartyVehicle.replacements[i].xrepuesto,
              ctiporepuesto: this.thirdpartyVehicle.replacements[i].ctiporepuesto,
              ncantidad: this.thirdpartyVehicle.replacements[i].ncantidad,
              cniveldano: this.thirdpartyVehicle.replacements[i].cniveldano
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  cityDropdownDataRequest(){
    if(this.popup_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.popup_form.get('cestado').value
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

  modelDropdownDataRequest(){
    if(this.popup_form.get('cmarca').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.popup_form.get('cmarca').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.modelList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.modelList.push({ id: response.data.list[i].cmodelo, value: response.data.list[i].xmodelo });
          }
          this.modelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MODELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  versionDropdownDataRequest(){
    if(this.popup_form.get('cmarca').value && this.popup_form.get('cmodelo').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.popup_form.get('cmarca').value,
        cmodelo: this.popup_form.get('cmodelo').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/version`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.versionList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.versionList.push({ id: response.data.list[i].cversion, value: response.data.list[i].xversion });
          }
          this.versionList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.VERSIONNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  addReplacement(){
    let replacement = { from: 2 }
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

  replacementRowClicked(event: any){
    let replacement = {};
    if(this.isEdit){ 
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
    const modalRef = this.modalService.open(NotificationThirdpartyVehicleReplacementComponent);
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

  onReplacementsGridReady(event){
    this.replacementGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let brandFilter = this.brandList.filter((option) => { return option.id == form.cmarca; });
    let modelFilter = this.modelList.filter((option) => { return option.id == form.cmodelo; });
    let versionFilter = this.versionList.filter((option) => { return option.id == form.cversion; });
    this.thirdpartyVehicle.ctipodocidentidadconductor = form.ctipodocidentidadconductor;
    this.thirdpartyVehicle.xdocidentidadconductor = form.xdocidentidadconductor;
    this.thirdpartyVehicle.xnombreconductor = form.xnombreconductor;
    this.thirdpartyVehicle.xapellidoconductor = form.xapellidoconductor;
    this.thirdpartyVehicle.xtelefonocelularconductor = form.xtelefonocelularconductor;
    this.thirdpartyVehicle.xtelefonocasaconductor = form.xtelefonocasaconductor;
    this.thirdpartyVehicle.xemailconductor = form.xemailconductor;
    this.thirdpartyVehicle.xobservacionconductor = form.xobservacionconductor;
    this.thirdpartyVehicle.xplaca = form.xplaca;
    this.thirdpartyVehicle.cmarca = form.cmarca;
    this.thirdpartyVehicle.xmarca = brandFilter[0].value;
    this.thirdpartyVehicle.cmodelo = form.cmodelo;
    this.thirdpartyVehicle.xmodelo = modelFilter[0].value;
    this.thirdpartyVehicle.cversion = form.cversion;
    this.thirdpartyVehicle.xversion = versionFilter[0].value;
    this.thirdpartyVehicle.fano = form.fano;
    this.thirdpartyVehicle.ccolor = form.ccolor;
    this.thirdpartyVehicle.xobservacionvehiculo = form.xobservacionvehiculo;
    this.thirdpartyVehicle.ctipodocidentidadpropietario = form.ctipodocidentidadpropietario;
    this.thirdpartyVehicle.xdocidentidadpropietario = form.xdocidentidadpropietario;
    this.thirdpartyVehicle.xnombrepropietario = form.xnombrepropietario;
    this.thirdpartyVehicle.xapellidopropietario = form.xapellidopropietario;
    this.thirdpartyVehicle.cestado = form.cestado;
    this.thirdpartyVehicle.cciudad = form.cciudad;
    this.thirdpartyVehicle.xdireccion = form.xdireccion;
    this.thirdpartyVehicle.xtelefonocelularpropietario = form.xtelefonocelularpropietario;
    this.thirdpartyVehicle.xtelefonocasapropietario = form.xtelefonocasapropietario;
    this.thirdpartyVehicle.xemailpropietario = form.xemailpropietario;
    this.thirdpartyVehicle.xobservacionpropietario = form.xobservacionpropietario;
    this.thirdpartyVehicle.replacements = this.replacementList;
    if(this.thirdpartyVehicle.cvehiculoterceronotificacion){
      let updateReplacementList = this.replacementList.filter((row) => { return !row.create; });
      let createReplacementList = this.replacementList.filter((row) => { return row.create; });
      this.thirdpartyVehicle.replacementsResult = {
        create: createReplacementList,
        update: updateReplacementList,
        delete: this.replacementDeletedRowList
      };
    }
    this.activeModal.close(this.thirdpartyVehicle);
  }

  deleteThirdpartyVehicle(){
    this.thirdpartyVehicle.type = 4;
    if(!this.thirdpartyVehicle.create){
      this.thirdpartyVehicle.delete = true;
    }
    this.activeModal.close(this.thirdpartyVehicle);
  }

}
