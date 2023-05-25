import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
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
  activateSave: boolean = false;
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
      xobservacion: [''],
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

    const requiredHeaders: any[] = [
      "No", "POLIZA", "CERTIFICADO", "Rif_Cliente", "PROPIETARIO", "letra", "CEDULA", "FNAC", "CPLAN", "SERIAL CARROCERIA", 
      "SERIAL MOTOR", "PLACA", "CMARCA", "CMODELO", "CVERSION", "XMARCA", "XMODELO", "XVERSION", "AÑO", "COLOR", 
      "Tipo Vehiculo", "CLASE", "PTOS", "XTELEFONO1", "XTELEFONO2", "XDIRECCION", "EMAIL", "FEMISION", "FPOLIZA_DES", "FPOLIZA_HAS", 
      "CASEGURADORA", "SUMA ASEGURADA", "SUMA ASEGURADA OTROS", "MONTO DEDUCIBLE", "XTIPO_DEDUCIBLE", "FCREACION", "CUSUARIOCREACION"
    ]

    return new Promise <any[]>((resolve, reject) => {
      let papa = new Papa();
      papa.parse(file, {
        delimiter: ";",
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          let error = "";
          let csvHeaders = Object.keys(results.data[0]);
          let lastRow = results.data[results.data.length - 1];
          let isEmpty = true;
          for (let key in lastRow) {
            if (lastRow[key]) {
              isEmpty = false;
              break;
            }
          }
          if (isEmpty) {
            results.data.pop();
          }
          if (JSON.stringify(csvHeaders) !== JSON.stringify(requiredHeaders)) {
            let missingAttributes = []
            missingAttributes  = requiredHeaders.filter(requiredHeader => !csvHeaders.some(csvHeader => csvHeader === requiredHeader));
            if (missingAttributes.length > 0) {
              error = `Error: El archivo suministrado no incluye todos los atributos necesarios. Se necesita incluir la/s columna/s: ${missingAttributes}`;
            }
            else {
              let additionalAttributes = [];
              additionalAttributes = csvHeaders.filter(csvHeader => !requiredHeaders.some(requiredHeader => requiredHeader === csvHeader));
              error = `Error: El archivo suministrado incluye atributos adicionales, elimine la/s siguiente/s columna/s: ${additionalAttributes}`;
            }
          }
          if (error) {
            results.data = [];
            alert(error);
          }
          resolve(results.data);
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
    let parsedCSV = await this.parseCSV(file);
    if (parsedCSV.length > 0) {
      this.parsedData = parsedCSV;
      for (let i = 0; i < (this.parsedData.length); i++){
        fixedData.push({
          ncedula: this.parsedData[i].CEDULA,
          xmarca: this.parsedData[i].XMARCA,
          xmodelo: this.parsedData[i].XMODELO,
          xplaca: this.parsedData[i].PLACA,
          xversion: this.parsedData[i].XVERSION,
          xpropietario: this.parsedData[i].PROPIETARIO
        })
      }
      this.fleetContractList = fixedData;
      if (this.popup_form.get('xobservacion').value) {
        this.activateSave = true;
      }
    }
    else {
      event.target.value = null;
      this.activateSave = false;
    }
  }

  onObservationsChange() {
    if (this.popup_form.get('xobservacion').value && this.parsedData.length > 0) {
      this.activateSave = true;
    } 
    else {
      this.activateSave = false;
    }
  }

  onContractsGridReady(event) {

  }

}
