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

    const csvHeaders: any[] = [
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
          console.log(results.data);
          for (let i = 0; i < results.data.length; i++) {
            let csvAttributesNames = Object.keys(results.data[i]);
            console.log('a: ', csvAttributesNames);
            console.log('e: ', csvHeaders);
            if (JSON.stringify(csvAttributesNames) !== JSON.stringify(csvHeaders)) {
              error = `Error en la línea ${i + 1}, no incluye todos los atributos necesarios`;
              let secondArray = []
              secondArray  = csvHeaders.filter(o=> !csvAttributesNames.some(i=> i === o));
              console.log(secondArray);
              break;
            }
          }
          if (error) {
            console.log(error);
            reject(error);
          }
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
  }

  addContract() {

  }

  onContractsGridReady(event) {

  }

}
