import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-fleet-loading',
  templateUrl: './fleet-loading.component.html',
  styleUrls: ['./fleet-loading.component.css']
})
export class FleetLoadingComponent implements OnInit {

  @ViewChild('Xdocumento', { static: false }) xdocumento: ElementRef;
  sub;
  currentUser;
  detail_form: FormGroup;
  saveRenovation: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  parentPolicyList: any[] = [];
  batchList: any[] = [];
  parsedData: any[] = [];
  npoliza: number;
  fleetContractList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ccarga: [''],
      clote: [''],
      npoliza: ['']
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 101
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
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

  initializeDetailModule() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/valrep/parent-policy`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.parentPolicyList.push({ id: response.data.list[i].ccarga, value: response.data.list[i].xdescripcion });
        }
        this.parentPolicyList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getBatch(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccarga: this.detail_form.get('ccarga').value
    };
    this.http.post(`${environment.apiUrl}/api/valrep/batch`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.batchList.push({ id: response.data.list[i].clote, value: response.data.list[i].xobservacion, days: response.data.list[i].ncantidaddias });
        }
        this.batchList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.RECEIPTTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.detail_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      policiesToRenovate: this.parsedData
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/renovate-contracts`, params, options).subscribe((response : any) => {
      if(response.data.status){
        window.alert('Las pólizas han sido renovadas exitosamente.');
        this.fleetContractList = [];
        this.saveRenovation = false;
        this.loading = false;
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
      }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  parseCSV(file) {

    const requiredHeaders: any[] = [
      "XPLACA", "MSUMA_CASCO", "MDEDUCIBLE", "CPLAN", "FDESDE_POL", "FHASTA_POL"
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
    this.parsedData = await this.parseCSV(file);
    for (let i = 0; i < (this.parsedData.length -1); i++){
      fixedData.push({
        cplan: this.parsedData[i].CPLAN,
        xplaca: this.parsedData[i].XPLACA,
        casco: this.parsedData[i].MSUMA_A_CASCO,
        mdeducible: this.parsedData[i].MDEDUCIBLE,
        fdesde_pol: this.parsedData[i].FDESDE_POL,
        fhasta_pol: this.parsedData[i].FHASTA_POL,
      })
    }
  }  

}
