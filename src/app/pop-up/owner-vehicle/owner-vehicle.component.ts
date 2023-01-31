import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OwnerVehicleImageComponent } from '@app/pop-up/owner-vehicle-image/owner-vehicle-image.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-owner-vehicle',
  templateUrl: './owner-vehicle.component.html',
  styleUrls: ['./owner-vehicle.component.css']
})
export class OwnerVehicleComponent implements OnInit {

  @Input() public vehicle;
  private imageGridApi;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  imageList: any[] = [];
  modelList: any[] = [];
  brandList: any[] = [];
  versionList: any[] = [];
  coinList: any[] = [];
  alert = { show : false, type : "", message : "" }
  imageDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cmarca: ['', Validators.required],
      cmodelo: ['', Validators.required],
      cversion: [''],
      xplaca: ['', Validators.required], 
      fano: ['', Validators.required], 
      xcolor: ['', Validators.required],
      nkilometraje: ['', Validators.required],
      bimportado: [false],
      xcertificadoorigen: [''], 
      mpreciovehiculo: [''],
      ncapacidadcarga: ['', Validators.required],
      ncapacidadpasajeros: ['', Validators.required],
      xserialcarroceria: ['', Validators.required],
      xuso: ['', Validators.required],
      xtipo: ['', Validators.required], 
      cmoneda: [''],
      xserialmotor: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
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
      this.http.post(`${environment.apiUrl}/api/valrep/coin`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.coinList.push({ id: response.data.list[i].cmoneda, value: response.data.list[i].xmoneda });
          }
          this.coinList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.COINNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.vehicle){
        if(this.vehicle.type == 3){
          this.canSave = true;
        }else if(this.vehicle.type == 2){
          this.popup_form.get('cmarca').setValue(this.vehicle.cmarca);
          this.popup_form.get('cmarca').disable();
          this.modelDropdownDataRequest();
          this.popup_form.get('cmodelo').setValue(this.vehicle.cmodelo);
          this.popup_form.get('cmodelo').disable();
          this.versionDropdownDataRequest();
          this.popup_form.get('cversion').setValue(this.vehicle.cversion);
          this.popup_form.get('cversion').disable();
          this.popup_form.get('xplaca').setValue(this.vehicle.xplaca);
          this.popup_form.get('xplaca').disable();
          this.popup_form.get('fano').setValue(this.vehicle.fano);
          this.popup_form.get('fano').disable();
          this.popup_form.get('xcolor').setValue(this.vehicle.xcolor);
          this.popup_form.get('xcolor').disable();
          this.popup_form.get('nkilometraje').setValue(this.vehicle.nkilometraje);
          this.popup_form.get('nkilometraje').disable();
          this.popup_form.get('bimportado').setValue(this.vehicle.bimportado);
          this.popup_form.get('bimportado').disable();
          this.popup_form.get('xcertificadoorigen').setValue(this.vehicle.xcertificadoorigen);
          this.popup_form.get('xcertificadoorigen').disable();
          this.popup_form.get('mpreciovehiculo').setValue(this.vehicle.mpreciovehiculo);
          this.popup_form.get('mpreciovehiculo').disable();
          this.popup_form.get('xserialcarroceria').setValue(this.vehicle.xserialcarroceria);
          this.popup_form.get('xserialcarroceria').disable();
          this.popup_form.get('xserialmotor').setValue(this.vehicle.xserialmotor);
          this.popup_form.get('xserialmotor').disable();
          this.popup_form.get('ncapacidadcarga').setValue(this.vehicle.ncapacidadcarga);
          this.popup_form.get('ncapacidadcarga').disable();
          this.popup_form.get('ncapacidadpasajeros').setValue(this.vehicle.ncapacidadpasajeros);
          this.popup_form.get('ncapacidadpasajeros').disable();
          this.popup_form.get('cmoneda').setValue(this.vehicle.cmoneda);
          this.popup_form.get('cmoneda').disable();
          this.popup_form.get('xuso').setValue(this.vehicle.xuso);
          this.popup_form.get('xuso').disable();
          this.popup_form.get('xtipo').setValue(this.vehicle.xtipo);
          this.popup_form.get('xtipo').disable();
          this.imageList = this.vehicle.images
          this.canSave = false;
        }else if(this.vehicle.type == 1){
          this.popup_form.get('cmarca').setValue(this.vehicle.cmarca);
          this.modelDropdownDataRequest();
          this.popup_form.get('cmodelo').setValue(this.vehicle.cmodelo);
          this.versionDropdownDataRequest();
          this.popup_form.get('cversion').setValue(this.vehicle.cversion);
          this.popup_form.get('xplaca').setValue(this.vehicle.xplaca);
          this.popup_form.get('fano').setValue(this.vehicle.fano);
          this.popup_form.get('xcolor').setValue(this.vehicle.xcolor);
          this.popup_form.get('nkilometraje').setValue(this.vehicle.nkilometraje);
          this.popup_form.get('bimportado').setValue(this.vehicle.bimportado);
          this.popup_form.get('xcertificadoorigen').setValue(this.vehicle.xcertificadoorigen);
          this.popup_form.get('mpreciovehiculo').setValue(this.vehicle.mpreciovehiculo);
          this.popup_form.get('ncapacidadcarga').setValue(this.vehicle.ncapacidadcarga);
          this.popup_form.get('ncapacidadpasajeros').setValue(this.vehicle.ncapacidadpasajeros);
          this.popup_form.get('xserialcarroceria').setValue(this.vehicle.xserialcarroceria);
          this.popup_form.get('xserialmotor').setValue(this.vehicle.xserialmotor);
          this.popup_form.get('cmoneda').setValue(this.vehicle.cmoneda);
          this.popup_form.get('xuso').setValue(this.vehicle.xuso);
          this.popup_form.get('xtipo').setValue(this.vehicle.xtipo);
          for(let i =0; i < this.vehicle.images.length; i++){
            this.imageList.push({
              cgrid: i,
              create: this.vehicle.images[i].create,
              cimagen: this.vehicle.images[i].cimagen,
              ximagen: this.vehicle.images[i].ximagen,
              xrutaimagen: this.vehicle.images[i].xrutaimagen
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
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

  addImage(){
    let image = { type: 3 };
    const modalRef = this.modalService.open(OwnerVehicleImageComponent);
    modalRef.componentInstance.image = image;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.imageList.push({
            cgrid:  this.imageList.length,
            create: true,
            cimagen: result.cimagen,
            ximagen: result.ximagen,
            xrutaimagen: result.xrutaimagen
          });
          this.imageGridApi.setRowData(this.imageList);
        }
      }
    });
  }

  imageRowClicked(event: any){
    let image = {};
    if(this.isEdit){ 
      image = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cimagen: event.data.cimagen,
        xrutaimagen: event.data.xrutaimagen,
        delete: false
      };
    }else{ 
      image = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cimagen: event.data.cimagen,
        xrutaimagen: event.data.xrutaimagen,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(OwnerVehicleImageComponent);
    modalRef.componentInstance.image = image;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i <  this.imageList.length; i++){
            if( this.imageList[i].cgrid == result.cgrid){
              this.imageList[i].xrutaimagen = result.xrutaimagen;
              this.imageGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.imageDeletedRowList.push({ cimagen: result.cimagen });
          }
          this.imageList = this.imageList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.imageList.length; i++){
            this.imageList[i].cgrid = i;
          }
          this.imageGridApi.setRowData(this.imageList);
        }
      }
    });
  }

  onImagesGridReady(event){
    this.imageGridApi = event.api;
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
    let coinFilter = this.coinList.filter((option) => { return option.id == form.cmoneda; });
    this.vehicle.cmarca = form.cmarca;
    this.vehicle.xmarca = brandFilter[0].value;
    this.vehicle.cmodelo = form.cmodelo;
    this.vehicle.xmodelo = modelFilter[0].value;
    /*if (form.cversion == undefined) {
      this.vehicle.cversion = null;
    } else {
      this.vehicle.cversion = form.cversion;
    }*/
    this.vehicle.xplaca = form.xplaca;
    this.vehicle.fano = form.fano;
    this.vehicle.xcolor = form.xcolor;
    this.vehicle.nkilometraje = form.nkilometraje;
    this.vehicle.bimportado = form.bimportado;
    if (form.xcertificadoorigen == undefined || form.xcertificadoorigen == '') {
      this.vehicle.xcertificadoorigen = null;
    } else {
      this.vehicle.xcertificadoorigen = form.xcertificadoorigen;
    }
    if (form.mpreciovehiculo == undefined || form.mpreciovehiculo == '') {
      this.vehicle.mpreciovehiculo = null
    } else {
      this.vehicle.mpreciovehiculo = form.mpreciovehiculo;
    }
    this.vehicle.xserialmotor = form.xserialmotor;
    this.vehicle.xserialcarroceria = form.xserialcarroceria;
    this.vehicle.images = this.imageList;
    this.vehicle.ncapacidadcarga = form.ncapacidadcarga;
    this.vehicle.ncapacidadpasajeros = form.ncapacidadpasajeros;
    this.vehicle.xuso = form.xuso;
    this.vehicle.xtipo = form.xtipo;
    this.vehicle.cmoneda = form.cmoneda;
    if (coinFilter.length > 0) {
      this.vehicle.xmoneda = coinFilter[0].value;
    }
    if(this.vehicle.cvehiculopropietario){
      let updateImageList = this.imageList.filter((row) => { return !row.create; });
      let createImageList = this.imageList.filter((row) => { return row.create; });
      this.vehicle.imagesResult = {
        create: createImageList,
        update: updateImageList,
        delete: this.imageDeletedRowList
      };
    }
    this.activeModal.close(this.vehicle);
  }

  deleteVehicle(){
    this.vehicle.type = 4;
    if(!this.vehicle.create){
      this.vehicle.delete = true;
    }
    this.activeModal.close(this.vehicle);
  }

}
