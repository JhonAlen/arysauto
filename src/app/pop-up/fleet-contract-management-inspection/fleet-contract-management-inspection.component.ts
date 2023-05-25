import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FleetContractManagementInspectionImageComponent } from '@app/pop-up/fleet-contract-management-inspection-image/fleet-contract-management-inspection-image.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-management-inspection',
  templateUrl: './fleet-contract-management-inspection.component.html',
  styleUrls: ['./fleet-contract-management-inspection.component.css']
})
export class FleetContractManagementInspectionComponent implements OnInit {

  @Input() public inspection;
  private imageGridApi;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  imageList: any[] = [];
  proficientList: any[] = [];
  inspectionTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }
  imageDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cperito: [''],
      ctipoinspeccion: [''],
      finspeccion: [''],
      xobservacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/proficient`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.proficientList.push({ id: response.data.list[i].cperito, value: response.data.list[i].xperito });
          }
          this.proficientList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PROFICIENTNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/inspection-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.inspectionTypeList.push({ id: response.data.list[i].ctipoinspeccion, value: response.data.list[i].xtipoinspeccion });
          }
          this.inspectionTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.INSPECTIONTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.inspection){
        if(this.inspection.type == 3){
          this.canSave = true;
        }else if(this.inspection.type == 2){
          this.popup_form.get('cperito').setValue(this.inspection.cperito);
          this.popup_form.get('cperito').disable();
          this.popup_form.get('ctipoinspeccion').setValue(this.inspection.ctipoinspeccion);
          this.popup_form.get('ctipoinspeccion').disable();
          this.popup_form.get('finspeccion').setValue(this.inspection.finspeccion);
          this.popup_form.get('finspeccion').disable();
          this.popup_form.get('xobservacion').setValue(this.inspection.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.imageList = this.inspection.images
          this.canSave = false;
        }else if(this.inspection.type == 1){
          this.popup_form.get('cperito').setValue(this.inspection.cperito);
          this.popup_form.get('ctipoinspeccion').setValue(this.inspection.ctipoinspeccion);
          this.popup_form.get('finspeccion').setValue(this.inspection.finspeccion);
          this.popup_form.get('xobservacion').setValue(this.inspection.xobservacion);
          for(let i =0; i < this.inspection.images.length; i++){
            this.imageList.push({
              cgrid: i,
              create: this.inspection.images[i].create,
              cimageninspeccion: this.inspection.images[i].cimageninspeccion,
              xrutaimagen: this.inspection.images[i].xrutaimagen
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  addImage(){
    let image = { type: 3 };
    const modalRef = this.modalService.open(FleetContractManagementInspectionImageComponent);
    modalRef.componentInstance.image = image;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.imageList.push({
            cgrid:  this.imageList.length,
            create: true,
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
        cimageninspeccion: event.data.cimageninspeccion,
        xrutaimagen: event.data.xrutaimagen,
        delete: false
      };
    }else{ 
      image = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cimageninspeccion: event.data.cimageninspeccion,
        xrutaimagen: event.data.xrutaimagen,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(FleetContractManagementInspectionImageComponent);
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
            this.imageDeletedRowList.push({ cimageninspeccion: result.cimageninspeccion });
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
    let proficientFilter = this.proficientList.filter((option) => { return option.id == form.cperito; });
    let inspectionTypeFilter = this.inspectionTypeList.filter((option) => { return option.id == form.ctipoinspeccion; });
    this.inspection.cperito = form.cperito;
    this.inspection.xperito = proficientFilter[0].value;
    this.inspection.ctipoinspeccion = form.ctipoinspeccion;
    this.inspection.xtipoinspeccion = inspectionTypeFilter[0].value;
    this.inspection.finspeccion = form.finspeccion;
    this.inspection.xobservacion = form.xobservacion;
    this.inspection.images = this.imageList;
    if(this.inspection.cinspeccioncontratoflota){
      let updateImageList = this.imageList.filter((row) => { return !row.create; });
      let createImageList = this.imageList.filter((row) => { return row.create; });
      this.inspection.intervalsResult = {
        create: createImageList,
        update: updateImageList,
        delete: this.imageDeletedRowList
      };
    }
    this.activeModal.close(this.inspection);
  }

  deleteInspection(){
    this.inspection.type = 4;
    if(!this.inspection.create){
      this.inspection.delete = true;
    }
    this.activeModal.close(this.inspection);
  }

}
