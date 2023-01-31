import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

  @Input() public batch;
  private fleetContractGridApi;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  canReadFile: boolean = false;
  isEdit: boolean = false;
  fleetContractList: any[] = [];
  parsedData: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xobservacion: ['', Validators.required],
    });
    if(this.batch){
      if(this.batch.type == 3){
        this.canSave = true;
        this.canReadFile = true;
      }else if(this.batch.type == 2){
        this.popup_form.get('xobservacion').setValue(this.batch.xobservacion);
        this.popup_form.get('xobservacion').disable();
        this.fleetContractList = this.batch.contratos
      }else if(this.batch.type == 1){
        this.popup_form.get('xobservacion').setValue(this.batch.xobservacion);
        this.fleetContractList = this.batch.contratos
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onSubmit(form) {
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    this.batch.xobservacion = form.xobservacion;
    this.batch.contratos = this.fleetContractList;
    this.batch.contratosCSV = this.parsedData;
    console.log(this.batch.contratosCSV);
    this.batch.fcreacion = new Date().toISOString();
    this.activeModal.close(this.batch);
  }

  parseCSV(file) {

    return new Promise <any[]>((resolve, reject) => {
      let papa = new Papa();
      papa.parse(file, {
        delimiter: ";",
        header: true,
        complete: function(results) {
          return resolve(results.data);
        }
      });
      
    });
  }

  async onFileSelect(event){
    //La lista fixedData representa los campos de los contratos que serán cargados solo en la tabla html fleetContractList
    //parsedData son todos los campos de cada contrato del CSV, los cuales serán insertados en la BD
    let fixedData: any[] = [];
    let file = event.target.files[0];
    this.fleetContractList = [];
    this.parsedData = [];
    this.parsedData = await this.parseCSV(file);
    for (let i = 0; i < (this.parsedData.length -1); i++){
      let nombrePropietario = '';
      if (this.parsedData[i].APELLIDO) {
        nombrePropietario = this.parsedData[i].NOMBRE + ' ' + this.parsedData[i].APELLIDO
      } else {
        nombrePropietario = this.parsedData[i].NOMBRE
      }
      fixedData.push({
        ccontratoflota: parseInt(this.parsedData[i].ID),
        xmarca: this.parsedData[i].MARCA,
        xmodelo: this.parsedData[i].MODELO,
        xplaca: this.parsedData[i].PLACA,
        xversion: this.parsedData[i].VERSION,
        xpropietario: nombrePropietario
      })
    }
    this.fleetContractList = fixedData;
  }

  addContract() {

  }

  onContractsGridReady(event) {

  }

}
