import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FeesRegisterVehicleTypeIntervalComponent } from '@app/pop-up/fees-register-vehicle-type-interval/fees-register-vehicle-type-interval.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-fees-register-vehicle-type',
  templateUrl: './fees-register-vehicle-type.component.html',
  styleUrls: ['./fees-register-vehicle-type.component.css']
})
export class FeesRegisterVehicleTypeComponent implements OnInit {

  @Input() public vehicleType;
  private intervalGridApi;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  intervalList: any[] = [];
  vehicleTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }
  intervalDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctipovehiculo: ['', Validators.required],
      miniciointervalo: ['', Validators.required],
      mfinalintervalo: ['', Validators.required],
      ptasa: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/vehicle-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.vehicleTypeList.push({ id: response.data.list[i].ctipovehiculo, value: response.data.list[i].xtipovehiculo });
          }
          this.vehicleTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.VEHICLETYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.vehicleType){
        if(this.vehicleType.type == 3){
          this.canSave = true;
        }else if(this.vehicleType.type == 2){
          this.popup_form.get('ctipovehiculo').setValue(this.vehicleType.ctipovehiculo);
          this.popup_form.get('ctipovehiculo').disable();
          this.popup_form.get('miniciointervalo').setValue(this.vehicleType.miniciointervalo);
          this.popup_form.get('miniciointervalo').disable();
          this.popup_form.get('mfinalintervalo').setValue(this.vehicleType.mfinalintervalo);
          this.popup_form.get('mfinalintervalo').disable();
          this.popup_form.get('ptasa').setValue(this.vehicleType.ptasa);
          this.popup_form.get('ptasa').disable();
          this.intervalList = this.vehicleType.intervals
          this.canSave = false;
        }else if(this.vehicleType.type == 1){
          this.popup_form.get('ctipovehiculo').setValue(this.vehicleType.ctipovehiculo);
          this.popup_form.get('miniciointervalo').setValue(this.vehicleType.miniciointervalo);
          this.popup_form.get('mfinalintervalo').setValue(this.vehicleType.mfinalintervalo);
          this.popup_form.get('ptasa').setValue(this.vehicleType.ptasa);
          for(let i =0; i < this.vehicleType.intervals.length; i++){
            this.intervalList.push({
              cgrid: i,
              create: this.vehicleType.intervals[i].create,
              crangoanotipovehiculo: this.vehicleType.intervals[i].crangoanotipovehiculo,
              fanoinicio: this.vehicleType.intervals[i].fanoinicio,
              fanofinal: this.vehicleType.intervals[i].fanofinal,
              ptasainterna: this.vehicleType.intervals[i].ptasainterna
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  addInterval(){
    let interval = { type: 3 };
    const modalRef = this.modalService.open(FeesRegisterVehicleTypeIntervalComponent);
    modalRef.componentInstance.interval = interval;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.intervalList.push({
            cgrid:  this.intervalList.length,
            create: true,
            fanoinicio: result.fanoinicio,
            fanofinal: result.fanofinal,
            ptasainterna: result.ptasainterna
          });
          this.intervalGridApi.setRowData(this.intervalList);
        }
      }
    });
  }

  intervalRowClicked(event: any){
    let interval = {};
    if(this.isEdit){ 
      interval = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        crangoanotipovehiculo: event.data.crangoanotipovehiculo,
        fanoinicio: event.data.fanoinicio,
        fanofinal: event.data.fanofinal,
        ptasainterna: event.data.ptasainterna,
        delete: false
      };
    }else{ 
      interval = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        crangoanotipovehiculo: event.data.crangoanotipovehiculo,
        fanoinicio: event.data.fanoinicio,
        fanofinal: event.data.fanofinal,
        ptasainterna: event.data.ptasainterna,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(FeesRegisterVehicleTypeIntervalComponent);
    modalRef.componentInstance.interval = interval;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i <  this.intervalList.length; i++){
            if( this.intervalList[i].cgrid == result.cgrid){
              this.intervalList[i].fanoinicio = result.fanoinicio;
              this.intervalList[i].fanofinal = result.fanofinal;
              this.intervalList[i].ptasainterna = result.ptasainterna;
              this.intervalGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.intervalDeletedRowList.push({ crangoanotipovehiculo: result.crangoanotipovehiculo });
          }
          this.intervalList = this.intervalList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.intervalList.length; i++){
            this.intervalList[i].cgrid = i;
          }
          this.intervalGridApi.setRowData(this.intervalList);
        }
      }
    });
  }

  onIntervalsGridReady(event){
    this.intervalGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let vehicleTypeFilter = this.vehicleTypeList.filter((option) => { return option.id == form.ctipovehiculo; });
    this.vehicleType.ctipovehiculo = form.ctipovehiculo;
    this.vehicleType.xtipovehiculo = vehicleTypeFilter[0].value;
    this.vehicleType.miniciointervalo = form.miniciointervalo;
    this.vehicleType.mfinalintervalo = form.mfinalintervalo;
    this.vehicleType.ptasa = form.ptasa;
    this.vehicleType.intervals = this.intervalList;
    if(this.vehicleType.ctipovehiculoregistrotasa){
      let updateIntervalList = this.intervalList.filter((row) => { return !row.create; });
      let createIntervalList = this.intervalList.filter((row) => { return row.create; });
      this.vehicleType.intervalsResult = {
        create: createIntervalList,
        update: updateIntervalList,
        delete: this.intervalDeletedRowList
      };
    }
    this.activeModal.close(this.vehicleType);
  }

  deleteVehicleType(){
    this.vehicleType.type = 4;
    if(!this.vehicleType.create){
      this.vehicleType.delete = true;
    }
    this.activeModal.close(this.vehicleType);
  }

}
