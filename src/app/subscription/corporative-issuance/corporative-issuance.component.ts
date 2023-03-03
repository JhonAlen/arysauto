import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ColDef} from 'ag-grid-community'
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-corporative-issuance',
  templateUrl: './corporative-issuance.component.html',
  styleUrls: ['./corporative-issuance.component.css']
})
export class CorporativeIssuanceComponent implements OnInit {

  currentUser;
  keyword = 'value';
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  chargeList: any[] = [];
  batchList: any[] = [];
  fleetContractList: any[] = [];
  id: number;
  xcertificado: number;
  xpoliza: number;
  xpropietario: string;
  xplaca: string;
  xmarca: string;
  xmodelo: string;
  xversion: string;
  cano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  xtipo: string;
  xclase: string;
  xcolor: string;
  ncapacidadpasajerosvehiculo: number;
  msuma_a_casco: number;
  ptasaa_aseguradora: number;
  mprima_casco: number;
  mprima_catastrofico: number;
  mgastos_recuperacion: number;
  mexceso_limite: number;
  mdefensa_penal: number;
  mmuerte: number;
  minvalidez: number;
  mgastos_medicos: number;
  mgastos_funerarios: number;
  mdeducible: number;
  ptasa_fondo_anual: number;
  mfondo_arys: number;
  mtotal: number;
  fdesde_pol;
  fhasta_pol;

  

  columnDefs: ColDef[] = [
    { headerName: 'Id', field: 'id', width: 65, resizable: true },
    { headerName: 'N° Certificado', field: 'xcertificado', width: 125, resizable: true },
    { headerName: 'N° Póliza', field: 'xpoliza', width: 120, resizable: true },
    { headerName: 'Propietario', field: 'xpropietario', width: 140, resizable: true},
    { headerName: 'N° Placa', field: 'xplaca', width: 100, resizable: true},
    { headerName: 'Marca', field: 'xmarca', width: 100, resizable: true},
    { headerName: 'Modelo', field: 'xmodelo', width: 110, resizable: true},
    { headerName: 'Versión', field: 'xversion', width: 110, resizable: true},
    { headerName: 'Descargar', field: 'xdescargar', width: 180, resizable: true, cellStyle: {color: 'white', 'background-color': 'green', 'border-radius': '5px'}, onCellClicked: (e) => {this.downloadReceipt(e)}}
  ];

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      clote: [''],
      ccarga: ['']
    });
    this.search_form.get('clote').disable();
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 121
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
            this.initializeDropdownDataRequest();
          }
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

  initializeDropdownDataRequest(){
    this.chargeList = [];
    this.keyword;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/corporative-charge`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.chargeList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.chargeList.push({ id: response.data.list[i].ccarga, value: `${response.data.list[i].xcliente} - Póliza Nro. ${response.data.list[i].xpoliza}` });
        }
        this.chargeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  batchDropdownDataRequest(event){
    this.searchStatus = false;
    this.keyword;
    this.batchList = [];
    this.search_form.get('ccarga').setValue(event.id)
    this.search_form.get('clote').setValue(undefined);
    if(this.search_form.get('ccarga').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        ccarga: this.search_form.get('ccarga').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/batch`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.batchList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.batchList.push({ id: response.data.list[i].clote, value: `Lote Nro. ${response.data.list[i].clote} - ${response.data.list[i].xobservacion} - ${response.data.list[i].fcreacion}` });
          }
          this.batchList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.search_form.get('clote').enable();
    } else {
      this.search_form.get('clote').disable();
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccarga: form.ccarga,
      clote: form.clote,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/corporative-issuance-management/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.fleetContractList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.fleetContractList.push({ 
            id: response.data.list[i].id,
            xpoliza: response.data.list[i].xpoliza,
            xcertificado: response.data.list[i].xcertificado,
            xpropietario: response.data.list[i].xnombre,
            xplaca: response.data.list[i].xplaca,
            xmarca: response.data.list[i].xmarca,
            xmodelo: response.data.list[i].xmodelo,
            xversion: response.data.list[i].xversion,
            xdescargar: "Descargar Certificado"
          });
        }
      }
      this.loading = false;
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

  onSelectedBatch(event) {
    this.searchStatus = false;
    this.keyword;
    this.search_form.get('clote').setValue(event.id)
    if(this.search_form.get('clote').value){
      this.searchStatus = true;
    } else {
      this.searchStatus = false;
    }
  }

  async downloadReceipt(e) {
    alert('La generación del certificado se encuentra bajo desarrollo.')
    /*let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      id: e.data.id
    }
    this.http.post(`${environment.apiUrl}/api/corporative-issuance-management/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.id = response.data.id;
        this.xcertificado = response.data.xcertificado;
        this.xpoliza = response.data.xpoliza;
        this.xpropietario = response.data.xpropietario;
        this.xplaca = response.data.xplaca;
        this.xmarca = response.data.xmarca;
        this.xmodelo = response.data.xmodelo;
        this.xversion = response.data.xversion;
        this.cano = response.data.cano;
        this.xserialcarroceria = response.data.xserialcarroceria;
        this.xserialmotor = response.data.xserialmotor;
        this.xtipo = response.data.xtipo;
        this.xclase = response.data.xclase;
        this.xcolor = response.data.xcolor;
        this.ncapacidadpasajerosvehiculo = response.data.ncapacidadpasajerosvehiculo;
        this.msuma_a_casco = response.data.msuma_a_casco;
        this.ptasaa_aseguradora = response.data.ptasaa_aseguradora;
        this.mprima_casco = response.data.mprima_casco;
        this.mprima_catastrofico = response.data.mprima_catastrofico;
        this.mgastos_recuperacion = response.data.mgastos_recuperacion;
        this.mexceso_limite = response.data.mexceso_limite;
        this.mdefensa_penal = response.data.mdefensa_penal;
        this.mmuerte = response.data.mmuerte;
        this.minvalidez = response.data.minvalidez;
        this.mgastos_medicos = response.data.mgastos_medicos;
        this.mgastos_funerarios = response.data.mgastos_funerarios;
        this.mdeducible = response.data.mdeducible;
        this.ptasa_fondo_anual = response.data.ptasa_fondo_anual;
        this.mfondo_arys = response.data.mfondo_arys;
        this.mtotal = response.data.mtotal;
        this.fdesde_pol = response.data.fdesde_pol;
        this.fhasta_pol = response.data.fhasta_pol;
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
    });*/
  }
/*
  generatePDF() {
    const pdfDefinition: any = {
      info: {
        title: `Certificado N° `,
        subject: `Recibo N° `
      },
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAABLCAYAAAAlOdEdAAAACXBIWXMAAAsTAAALEwEAmpwYAABDLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMTEgNzkuMTU4MzI1LCAyMDE1LzA5LzEwLTAxOjEwOjIwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIzLTAxLTExVDE1OjMzOjMyLTA0OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjdiZDRiZjQxLTE4MTAtZTM0Yy04M2I0LTk5ZTVkNmEyZDRlNjwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMzYzc4Y2M5LTkxZTctMTFlZC1hYzIyLWNlNDc5NDRmMDkwOTwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmUwY2Q5YWFlLTg4MmUtZTY0OS05OTk3LTAzN2JhZWJjNDEwMzwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6MzM6MzItMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NWU4Y2JhNTctZTNkMy1hZTQxLTk4MjAtYjJhOTk0NmYzMmFhPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIzLTAxLTExVDE1OjM1OjI4LTA0OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5kZXJpdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3YmQ0YmY0MS0xODEwLWUzNGMtODNiNC05OWU1ZDZhMmQ0ZTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJOYW1lPmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllck5hbWU+Si0wMDA4NDY0NC04PC9waG90b3Nob3A6TGF5ZXJOYW1lPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyVGV4dD5KLTAwMDg0NjQ0LTg8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMDE8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NzU8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA'
              + 'gICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg'
              + 'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmE3qp0AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANA1JREFUeNrsnXeYFFX297+3quN0Tw5MIA05gwIiUUVBUMyYQRQFA4uJ9SfqqqvrvsY1rVkMCChiZDGACQURFEQlhxnSMEzO3dPdVTe8f9St6ZqhhySGwTrPU09VV7gV76e+59xTt4kQ4iTYZptttrUQU+xLYJttttnQss0222yzoWWbbbbZZkPLNttss6Flm2222WZDyzbbbLMNAOA4Fk9KCAFBKUQkAhGqBy0r8vH6Gi8RugMORRC3W1MT0+rUxHQKpxvE6QZRVPtpsM02G1q/L6h4fQj1+Tviar7+uk9ky8bOvLwwm1QV5jiculuNV7qqfgLFp0DxKiAu8oviT6hW09rsVVNy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'
              + 'erOSEvAmaP6QQj4Pvj4x3HNuaaHYqtWb29VVFyddd4Z/QEAEy4cisyMRLz/0eozd+4uVf6U0BJCQOcCH5Xw3HcKxWm1EcxopKysbpFMa2gEMKm+NApwQuDNduDntT5sW10PPcINhWVpGWSx0iFYFF7M0lpIuamwgBA3FJYQBrAEByAMMBIOcBeB0lPBjoyhuKvNs1jp74NDemyEob6YZrQ46iEBLSSwveNgI4VDnrdmwpVGXVpNqjCNAhFKUB1B6wdXiBsmvcunl9RytGR3kVKGF1778spLLxgyxON1QdMpThraHX17tUX+rtKM9xat7n2o56fpVA0EI62Sk3zVVndLVRXccfNZL7dKTyjVKYv/12Mf/l+FJQWCc477H/1gWuuc1OJJlw5fat3WcA/jaqXSQn1Id/0R14kQguzMZCx45cb7rp5w0rsbtxTmjBr/0OxvVmxO579RWoyqKujZLQeEEJRX1qUfyC09WN1/9c1l544Y0q1PTlYKNJ2iR9ccnDqiJyqqAumvzvtmLGP8zwUtIQSCTOD1Pez4r0rFCWENf2tQVmbsxjLWdGL81uRyzaiwGgUiOhDWAV0QxHUk2LTRj3VfRhAOaAeMX+kWpWUNyGtSzUWkwtKooazAAcIFwIXhIjLzW0OjZ1N0U1CT3gH/ynwO/0scBY0chtcgYViW1h5b+pzaAGpNQpvqjd1EXQc0ShCmBEEKBHQBFhIJH67ho859kT22roD7WiK4hBD44psNOdt2FLV76KlFe3sM/r+CHoP/r6D/yH8U5O8sKWWMkxde++KqiKYfUnmhsOYOhTSkJPn2q10Dj+tYe+WlI+YBCO4qKE9+4vlPz6KUQQiB/y1Zm/vV8k2Dbp8+7r+ZGUmNtjPcQ28tAATrIwjUhz0HvbcC5DCuwWGpjKREH55+8IrX7r9j/JOVVQHvuVc88eLrb33TRz9AA8OvMYfDAUIAp1Nl7iP88mFrXpFzydJ1p7236Id9PYYY97jn0NsLvl6xuVhVlbpZc7++orom+Ls+e46DPZj7wgJv7+NDdwbQjlFMpVI5cDOpsyHBkzQKjjcoMLl+hJpxJ6MSRzhAOgkUbPYi8L8Qup3C4UrwNG4R5I1VFbfM12X8KyzVFeWAIntxABfGx9YSYJwLEAkyymCkLHRUwHkCnmcPoFB9CZdXv4VEXn+o3ML6oeeiPKVdQ3IrbwJVU3Hp3IBqPQU0KoCIgBoR4BGR8MN2MeDsJ9hLL1zhuH10X3WvqrSclAhdZ3hl7tfjb5s27rlbrh/7pTU2UlZRi/FXPf3492t3dF2+cmvWaSf1KjpYukdVVdAHgpjQIoTguitPXfjRkp/O2ri1sNOsOUsnXjBu4NK2bdICDzz24S2jTu694vSRfbbHUhtJCb4a41kGKioCiQCKm4ntCMo4KGOH/AaLRKhTdSiHRRyvx4Xbbxz3RVarxNJb7573z+kz37h/z96KF26/6azFLufR+6SKc46tefvAuUDXTlkbMzISj6iM2fOXn3HW6ccvefKBCbOcTtXyktFxzU0v3/L+x2tOe+v9lSfccPWoH5TfKaXngG+KLQHhfmUPH72zDu0oxdSGLHS98VijpMFFbKS8THVFjXlhCkR0gnpqVGIQgOQCVUEXflrAUVsQBKWiUYDdGsvSG1oIjda6sIxfUW48lEIYYDK+LYT8eFEYXdEwIzOfMOO3IICSq4KkubHQdy0eSb4N+xyHljRdlt0Zvww6d78APKNR1aVLJRiiQIACEU0AYQElzMEjAjzCQcIchUUi59LH9Kdf/JQODGn8TwMlyhjefO+7bjW1sUGet7PY/f3a/EFXXDLsS6/XBY8nOrTOTsWE8UMXAMALr315yaHEUyqqAgmEECQn+YOxW8XSMOOGM54mBMHS8rqMh5/+6KqX31h66vrNe9vfdes5L8ZKdCSEID01vqLhvpXXJjbnvrVrk1ZUFwgjb0dxzqFVaIFfNu7p2blD5o7DV0AqJl9+8rrZz1w7IyM9IfDvJxZOu3HmG1c1d62PxKpr6vHZ0vXwup01UyaeskA9gkTOqpog5r+/8sKpV4x8Nz7e2+geJyf5MHXSyAWKQsTs+csvP1L386hCq54KLCrmJ5aGcKcugaXp0RYx3QIsM76lWV3GhjiOMT9CCUK64SKFqYCgAlQXUAAo7RWEVAc2vANUbqoD1VmjtAfaKKXBiF+F5UC5kUlPYgCLcABMzmcAqAQWFVCZ7KamvQPIdGKN6wzck/AgtjjbHrCJJuLxYfGl/0BlQmZDThZr4sbqlCBCCeoZEKQCesSAlRLmYGEBHuYgEQFEABERqKnhKbc+p919x0vaRZW1fzy4dJ3i1bnfHL+noDwrLm7/2LVOGWbN/fqsc88YsLBVelJMCFxw1sBVbXJSapYsXX/S+k0FB+37pryyLokQIDnZF2gOLOPPOWHdiMFdfwGAhZ/+eMG/H19492UXDF40oF9udXPlpqXGV5nTpeW1zb6VLjpn0HsAArPmfj3hUODx/Y95yVu2FfY8Z2z/ZUd6nc8e23/nvBenTe/Tvc3OWXO/Hj95+ku3VVYF4n/9/WN47c1l2LilMDjtmtGzTxrSvfBI3P93Fv4woGfXnI29u7eOeX2HnNC58MT+HTetXber41fLN3b7Nce8d18FDhV8zUIrSIHqCBIaIKRZWgl1o2JqOokG2TUZv9KjQ1iOIzpBSDfUla4LcB1guoCqC3Bq9HXlbKdAc6vY/hFB6Xd1oBrdT2WZwIpIYDEZX3IwQGGiIXFVMCN+ZQwCjBqgMoGlyHUoM24OyVaBbCcK1H64x/c4vnX2B4sR2tAdTnx+/gzkdzqhwR3eT13pBGEGA1iaAA0LqGEOHhKgIaMbHBIWQBhScRnTkSBPeGaBfsUV94TuKChmRy1ATxmHplMXADDGwbk4oIYPBMP4z7OfnDJ7/vJL/jZl9NJYWdw7d5c6lny1fsyUK05ZZHUZGrVepSfisguGvB2sjyTNmrP0AkrZAY9z89bCDgSAU1Wapbbf58E9t53/lMftrIloFH6fu/T26eNeby7/RwgBVY2mJezcU9q2ubInX37SN2NP67P8h7U7ul35txdnbNm+z8k5jwn0z5euz7puxqv/74qLh83r3y+3KtZ+hRBgjCsH+v6UEILBAzpVvf3K9FtGDu+xZuHitSeXlO3/D1PReNvBY2iaRjFrzlI8+szHpbdcN+a1e2477/2mWfEAwDhXG441RnNUWUUd5r3z3fgpk06ZH2t7835MvvzkNwmAWXO+vrS2LnTYcT8hBIpLqvHyG0vHHuoz36wTneIC2rpRVFyHuZRiArW4QZSR/RI8G+VqMUNhmS5SmAIhCnAJEMIMYFEGqLqAQgWYEEA7BTyiYO8yjlBJLVJH+cCIGxqXLZJcxsR4tBdSBzdiWCbAjAC8MU9IiBEZhBdMQOUAk93TQLqK4ARKmgOcATW72uAx9/3YS17EeO1juGBUNs3pwcpRV2H10IugMaVR66beANZoo0BY9tOlagI0IgDNGIgmAA1gmgB0OV+X86jwf/INHXbmruCLi571Xdsu59elFUUiOr7+dlPnrduL2gFAXSCEB/7z4dWnDO+xUlUaw0EIgfLKuuQlX60fuX5TQfc5z193s9+3f9y6PhTB0y8uuUjTqKtLx8z6A7VenTqi5w+PPfsJFi356fQLlq5fPPa0vo3+yUgIgYimY8X32zI//vzncTpleOjpRVf8341nzWnfNo06HY0eT0EIwclDuxdfcPbARW+9u3L01Ekjn+vaOTso86WEdQgEQlj90860F17/ahiAXwDg21Xbkn/ZsIv17N4m7FBVaw0haakJZNaTU+596oXFo1+c/dWlw8+8/9nj+rTPH9S/00+pyb4azgXJ21HSfs0vOwYxJsidt5z95LlnDNjaNA4lhEBFZR2Wrdw6eFteUbdf1u+O79e7fZ3DoTQLro65rdg7r95477W3vnLTwsVrT4u1XlFJNfYWVyUzxlFdHdxvn3V1Iaz6MR+vzP36vXBE87z+zNS3Th3Ra2+sLHfOOX5ev7sTAOzaW962tKzWmZLk161Keu6C5UN/3rCr6+ABnXce6OuAU0f0/NnpcrBVa/L6zn9/5fHXTDx5rflNIeccu/aUZwJASWlNztp1u5LTU+PrGsDJOMnfVZL54JOLpj/4j4seSU9LOLTW2AP9hVh1RGDeDnbCt0UYyCku1GXFjMIrGnDXZDKlxqKuoQmsCAO4jFWpTADUgJdTKi3OBKAb7huPCCBfBymmiG9NkTIuDiGvz/g0RwLLfDRVCSfOjaRXIj/9UZgBLsYAxQosBlDzt4x1QTdaFw11JoAyCrFTg8rqMYK9h5u0l4C4OCy+cCZ+OuEc6NzR0ChguoNMnmuEG3/eoUXQACgW4YAGEI0b7qBUmohIWElggcppKgAdwWmXOec98Y+4N51H0DfX3sIKPPHi4vFUZ2pdMBwfDuuHlZ90XO/2G269Yew3VgXDucB3P2xL+WzpukG7Csrbci6U3Hbpe9pkpxadd+aAtdYHbtHite327qvM2JZflFtSVpsOAPF+T7B71+xt11x+ynd+vwHDFd9vTXn7w1WnBes1fyikuQ0wIRzv91S0bZ22e8YNY5e53S4d8ukwh01bC8WcBd8mT7t61L7W2SmyuaUBWPhq+Ub1g4/WuOtDERIK6wTyLwJAAH+cW8TFufnIYT0iZ4/tbwbRzYtMGOOkrLxW+WblZt+6jQVJ+4qq4nWduf3xHqVDu3RtUP9Odcf1bq/F+z0uQogLgAuAKgey7LstaT/+srNLdU0wQQgQv88dSkyIC549pv+arMykA173YDCMZ2Z9dsroU/qsPq5P+4DhNlVi0ZK1A7flF+WWlBrXMiXZV9WlY+YOr8elaRp11NSF4p0OlbbOTikZeFyH7a2zU5nb7Yj5KVJZeS3efO+7Ies27ekRChnPRUZaQlm/3m03X3zuievzd5V6Fn7647C8HSW5EZ26Wmel7Mttl7531Em91nbqkNkgl5ev3Jq2ceve9rsLynJ2761oDQF4Pc5I187Z2y87f/A3G7bszdmWV9Rmw5a93QLBiI8QcK/XFVZVRVjVY0SjzuN6t9t4/eTTvjvUhoiD/u9hhAks3Mk7v71djIvo5Bxm/VyFNk6mjFhykoxmfkCXbhinhqKCVFwO3ZjHqVFRiVRyRDcqu9ipQZRQeFP0mg4T48t2qb40nSOJC6OVUOFGt8nC0jrIpNISEkKGipKpDtwIxBtdLMt+4qnxm7Oo6hJUAFUU2BMBIhRD/B+j07T+2JzT18jJolFgmeCOmMCiAtRUUxFDYRFdGPErTQJLKq0GlUUt8JLgBgVGnuj45r2XfPcmJRx+ANXsWvrI84r2/7MOU7rHKrfp+s3sX8BI0+OEEOOKC0GFgAklHUAExtWJgEAnALWoKFjGf6QRy1iV3ooDgLPJ2Jy2Dg4ZkiGWcmJeZ/N6Hsq9NC/9oXyQf6DyzM1/xT0+aDm/9vgPmvIAAG6V4MKOyvZEp1jwygbBKyM4r6GV0OIeNgTeGYFG0QAsTg2AOKQ7qFBjmsn5hrqQqkhWXsEAkemER9Caay+on3fbtNQFT6/FOU9/j8kKQyJENOAuGoAloWMCq5H7J8DM1kQTWLpUaSawZNwLHECcCpLtQlulpvC/r513bXy71PD9y8TV60vQjzJ0jzYMWNxBKgyXL2IMrIk7KDSjJwnDHUQUVNSEVxRYoAJd2pO8OA85Qugc/X6zolnqh7QuJwRSx0IDEAYQkmNzHiOEMEJgVUotwawA5fJ8moObOTgk4FwA3AA8ALxy2mVZrjStuEfhXpLDLe8Q7/FRKeeITuhw/mH6x2Ie/9QacVleBS7VWOMgtMaMFsJIg+IygEWYAJHuoKob05QZ3RorVAJKB4hUXEJW6LQElD17k+vO80Y4tztUAsYFXlotBv7rK/H3inq0ElJRQRgxKoVHgWVMS4iZ60nFBR1QmKH2GtQYtbiHFFA4AqMGKN8/P9P179wcJweAkgDHw9+K8Z9sx5majly9QV3J1lAJK6FxCA2AxkE0GC6i7Mq5kTuoW1WWBJbcf/cOSv5Hc/xTOrR3cLQcYxJG9QBqAAQlqHS5zO7mODbUTNfS2USlqVKVKbHgY5nX3HW1lmnCUWlO4bWoC3c40AKAnVVceWSVuPy7PRiiU3Q3g+6mO6hZgKUyI7WBU8MdFEyAUQFBDWDxhkhFVHEJKtC3Pdn8zM3uu4b1cezXv8+izbzd7Z+Ke/JKRUezr3cTQpB/DWaASwbiTYBRmf4gASV4dJ6wAMMB1F19lmPBv65zz0lPbuyaBTWBZ7/nJ72wmkyp09C6ngloOiSwOEREQOgGvJTm3EHdorSoaKSuVIHAyMGO1S886vtXbluF/479b4kj3IZJ9RQAUCXHERzih722/abuq9WFdQNIBJACIF6C7K8DLQCoDgk8+C0/b+FmnB3UkWsqLBNYggkoprtFBRQzfiXhQSSwGlyyhgqM4LhB6rLHprn+06WN2mym8U+Fwn/rQnb7snxxnMLg5zLwbsLLjHc1pD9QYxmopdXQ6g5KcPhcqL5nsvOJ6Re7vvF6YseSKBd44yfR596vxcyiWpGNiJE0KjRjgGYAi5u/rcoqGmi3njNABVwKaidf7HrnX7fHzUlLVX4rMHFLQFuzxJBMNcRjQIw04xpRy/a/i5KaMHHSCAC95s6Z/Zxl3qFuPgLA6ZbfGwB8KNXgH2Zz58z+PXfnApAOIAtAXEtVXUf03UCSl+CfJysftPKJ0qdW4YZ6HTlGbMtQLKp0B4kJLGaoLUWXgW9qxJQaAYsheOO5jtn/mORakJZ04Ep7XA4JvHm5evetH7Bp767lY8AQbwbgFRb9X0Mhq6fCLAF3HlV0YFFg5aSi+LEb3fdeOMq59UCf0zgUgiuPx7qcBNx284fi/u3VoiO3xK+ICawm6QyNoEXRoCxBBeJcqH7gdu+j1050r4iLU44moMzgdsgyhCVoaAuLJQFAMoDCI9jOBNarAPIB5AC4RA6v/YVUmAZgn3Th20vV1eLAdcQ1xOskmD6IrHhkNO5PcqOYytZBRTegpOgGpBg1AtCqmdJg/kWXpVL7HKh6ZKrz4UducB8UWKZlJRK8cpn67IyTlVleBdWQ8TNuxqsksFQJKDPgHlU5DcAK9ulANr/zoOf6i0YfGFgNF40QjO5ECt+fqNwwOAerEBFBEhYgYYBFZHwrbAbl0ZCj1eAaatE4VkYyKZ33jO+WG6/xHA1gCQmqWgB7AWwDsAnAdgB7AJQBqJMga4lxphzphh6udQSQJ4EFCb5lADpJl+mvZEJew90SXn8N99BqXAj8WCgSJrwlntpRwtMERbwqY1pMuofmb9HQpB+ttJlJKHnuZvfMs4Y5dh7JB8OUCcxewfrNXEDvqqxDuhnbAgXUhoC7VFhS6TUoLIbgqAHKD6/c7bmvdYZy2H24CyFQEwKmvKjdtHAlP02PiPhGgNIs52u2ELIGpRXs3VXZ++oTvr/37+uoOwrxKy5VVAWAUvlAtujY0oSJk06XKgkAlphqae6c2fkTJk7qCOBcCZ2QXL66maIuBZAtVVXlIbiPhQAWWlTdQLnMK+cVymu9BMAN0tVcZimnF4Dn5HiEPL5Ocv2QpawQgCVz58xeLc93oDwnyOOcP3fO7MLfqu4DaA2gTUuLcf3qV7tCCAbkkNovpyhXndQeax1U1DJdgOocxPxURwOEDExbAtLBvu3Jxk8f8U4+Z/iRAQsAHCrB5OHqzx9Md17bPhkFkK6n0WIpGuJqjVvvBFxA7ZSz1HcWPe49ImABRrNvUhzBvOmup2aerT7nhahBhBv7igijJ0KdN0kkFSBUBM861bns0zfjrz2KwApIdbVHTrd0YI2QsHgOwH8s8No3YeKkHACTJaTuksA49wCqaZlcNqNJXMsKrBHSfbxLwuQSuayXLHuZZdkJFqClNHFZky2KLkWqw3wAD8h51rKWATh3wsRJKRMmTvLKZUvmzpl9l4TWJb+x4iqH0cor/lLQMitv6ySCd69y3HvVieQdRYg6RTdcRC5jVw3uoCagcATGDlS+XfIf77S+ndTgr620hBAM66pWfn6na9LgDmSNwhEQlnhVgzsoVU6SFxUP3uB8+LmZ3tfdLuVX/0uOy0Fw76XOT1+e7roj3YeyBkhpVrWFhoD73650v/HWi76Hc7LUo/EPPUJWpGKpsChauMkKfDqAZXPnzC6cO2d2JYD1ACrnzpkdAjAawA9z58w21c1qixsYywol/AolnP5tgaBXTi+xwGa1BE6KXJZnUVKfyXGVBJJXxomsLmyoSQxumZzXq0lZqy1g9FqOp+EYJKB/KwvLUEKLesEd1f9ET/IRPH6RY06XVOy4bwGdURtCCkxgyWx3j4qaqeMc8/51jXtBfNzRjQF2yFD4wttdf5/xqn7t/KV0nE4R38gdpEDbdBQ+c5v7zjOGOXcfzf6rVJXg0pGOTR1beadMvCv0dN5O3taa4Q4qkJqA8rume5+4capnhaoetX3r8q1cIeNUx4KZ8MlvMn+fBFonCbcTDqNME1wdJRBPl/O8cjjX4po1jaO9ZfkdspTXC9EGDhM4OdK1NLfd0GRZrLIwd87sygkTJ/0AYMSEiZN6SWDf9TvEtwLyRae2lIfjqLete10EN57uWPHqdc7bchKwT8igM9EEUuJQ/tj1rgceuu7oA8u09EQFz13nevGeSxxPJbhRaSothSHQvzNZ9/ET3qvHDT+6wGq4mArBoF5q9cf/jZs8bqj6qc8hqqELOISoO66buvG1x/0zbrr2qAJLyNhVFQxNd6xYiqzIVrcrToLCdAFflZXaOsSKaVlVlQnC1yQwcizl3RVjSG4KFxkba8417GiJR5nL8y3bNS0rx7r+3DmzF0oXNSTdxoG/w7WmLe1l5/gtClUVgvMHOfI7pJMp876gp2/eybvmpJKiK8c4Fg7srlY51N+2ldXvJZh5seuLsQMc3y9eSQcFgsLXu4OyddQgx5amCaNHPbpJCLq0U+n8x/0Pb9pOE3bv5RlJ8STQt4ejOC31qP9hK5MxiSCOQZswcZJ37pzZoQkTJ6VIVbO+iaox7RwJgOeaUVhNXaxQjGmvZXqGVEgbYuxrIKItmDlNXMOOcn8hCSyvBWDhAyjKqgkTJ/0bwFtz58zeAOC5CRMnzbCA7re0lpb28ttAy7R+HdRg3ynK+9YK/budmErQv4ta17+L+sUfcWF9cQQD+zprB/bFb9mlI0P0U5ljyaytdssklAAgX0KsUqqnDXJ8QhO3y2obpCs4whJLusqyzDQzrnWVhM1qCZxKeRzmvsxWQNPM/ntOl8exwaKsKpu4k+Zx5yPaIrls7pzZhfKcBgLYICHtxZGldxy2xkALy9X61SkPtv2hVg+jtbDkGFRZ1hSEDQA6zp0z+wG5LMeirg6W7mAC6fQmUDxQSoN1mZmImmJRbW+ZxwQjncJrgZUZeB8RI4ZlPW7AaClcZjmnSyzu6oa5c2a/9Ttc6kwAuTCy5W1o2fabW1BCq/SvegEO4zOeo2E5MPKyHsBR+vznd/6MJ5an1V6C668biLftd79/9j387WwEgH8gGtMaACNlIXSMnJ8fQEJLApZJWttarplf8Ks4dtId/ky2AUYDwD8srt/8Y+TcnADSYLTKtiiz3cOWbRxGVvMetPwWRLN/KQXRPqbMl6omB7vLm6P3ssuW7q67pR28rbRafkX3SYkfagGV2oSS2Tmd2ce6s5lBRfQj8CCMRMgQor1UWP/Mwgpygcbd7NgdEDau89lycLfUE7CtZUPLA6PFqR7GJxniT3Z8DumC+OXgsYDK2txODuLKeOV5mv1+xer7S1iWmd09UzT5Y4wmZYgYZVjHvMn4117fP+r+qPLllgUjabbF1n0bWseG1E+UFZNLRfJHKS5TSXkkoBJh9Nnktjxr5AjLNct2/ApIWKHWFFrCcmzWeVYI8ibAtJZPDrB/0mQcC7BWoD'
              + 'YHVXGAc7Puw+pmW++FT74AWnSXy+Ro/SmobbbZZputtGz7az+cnc4ZD+BKAA/RvIXfHmB5AMAzAMx1MgHMhJG9/jOirX8A0Nw25nzE2MYs80m57CE5bxiASdLlehfA6022GQPgb3L+u7HKonkLH2rm3GfK8gHgdZq38F37iTDMzvGxraUCbZgFMn4JB7/8bQILAPpZ1mtum06W+eY245vs8kpL+dbtsyzQG9ZkmwuaOfymZcWCsbWsKx2dzuln33UbWra1bOsrx/+QSsYvK3qmRWGNA1AEYOhBtjGB8DqAm+V0J8u+hsUA0hi5/TMW5dW3CZiyYhx3rLKamrnvmy3qrZN9y2330LaWbVnSxftZjk23K9Pi4gHGx8nDJGCa26Y4Rvl1TVzKny1wMyESALBY/h7XxP0bE2Ob5so60L5NC9i33FZatrVss7pXxc3MP9Ay6/zFEiRXwog1FQF4zwKZTKmoYtkDAD5CtDtlU2UVW4CGQyzLtPdgfC70pCzrZ5q3cLF9y22lZVtLelAbB6aPdlDa3wRoWRYldbqET6CZ7UzF1M8EjDzOh2KsG7OsGOf2rUUxAkArR6dzMmnewmL7SbChZdufC0yZAGYB+JTmLXy2GVUUy13KPIAblXkI24yRkHpIQucJGK2CJsDGIxqYHwYj0G/azfL4ZjVx+WY2UV4xy5LAamrm+pfI43oARlD/WfspsaFl25/IaN7CYkencwIAOstZnSzLHmoCuGkSEv0s6xVbANdPqpaO0t0LyHGsbWL9IUb8QQ43D9FY2a8976bn9vIRHI8NLdts+4PsZ6lAPpK/i2jewrwY6/0CYCyisaSAdKsCEij9YMSarO7kgbYZ20QdfSuHcRb3br6c95AFeg80OfbXEW3xM1XZ6/IY3m1aVjN5WiukGpvfBJK2wQ7E2/bns9ctFTQPwMPNqJNvLXAwE0VN9+8hSxk/W9ZrbhvrfHObgwXL8+R+AjHK/rXK63VEk14B4F07uTRq9mc8ttlmm620bLPNNttsaNlmm2222dCyzTbbbGjZZptttv2G9v8HAFqcTtSyHgmwAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\nCERTIFICADO Afilicación de Automóvil Arys AutoClub`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n  \n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Certificado', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia del Certificado:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.fdesde_pol}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.fhasta_pol}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 80, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', bold: true, border: [true, false, true, true]}, {text: this.fdesde_pol, alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, true]}, {text: `Sucursal Caracas`, border: [false, false, false, true]}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal Caracas`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 50, 80, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: ' ', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]} ]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [40, 170, 70, 70, '*', '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xtomador, border: [false, false, false, false]}, {text: 'Índole o Profesión:', bold: true, border: [false, false, false, false]}, {text: this.xprofesion, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xrif, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [40, 310, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdomicilio, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestado, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 130, 40, 24, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudad, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: this.xzona_postal, border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefono, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xcorreo, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [80, 280, 24, '*'],
            body: [
              [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 130, 50, 24, 50, 24, '*', '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [44, 296, '*', '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.xnombrepropietario} ${this.xapellidopropietario}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [40, 310, 24, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadopropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 130, 40, 24, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: this.xzona_postal_propietario, border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocliente, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, '*', 40, 30, 45, 30],
            body: [
              [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecorredor, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.ccorredor, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL VEHÍCULO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [30, 100, 30, 100, 35, '*'],
            body: [
              [{text: 'MARCA:', bold: true, border: [true, false, false, true]}, {text: this.xmarca, border: [false, false, false, true]}, {text: 'MODELO:', bold: true, border: [false, false, false, true]}, {text: this.xmodelo, border: [false, false, false, true]}, {text: 'VERSIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xversion, border: [false, false, true, true]} ]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 50, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, true]}, {'text': this.ncapacidadpasajerosvehiculo, border: [false, false, false, true]}, {text: 'CLASE:', bold: true, border: [false, false, false, true]}, {text: this.xclase, border: [false, false, false, true]}, {text: 'PLACA:', bold: true, border: [false, false, false, true]}, {text: this.xplaca, border: [false, false, false, true]}, {text: 'TRANSMISIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xtransmision, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 80, 75, 70, 70, 50, '*'],
            body: [
              [{text: 'USO:', bold: true, border: [true, false, false, true]}, {text: this.xuso, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'KILOMETRAJE:', bold: true, border: [false, false, false, true]}, {text: this.nkilometraje, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 30, 50, 50, 140, '*'],
            body: [
              [{text: 'TIPO:', bold: true, border: [true, false, false, false]}, {text: this.xtipovehiculo, border: [false, false, false, false]}, {text: 'AÑO:', bold: true, border: [false, false, false, false]}, {text: this.fano, border: [false, false, false, false]}, {text: 'COLOR:', bold: true, border: [false, false, false, false]}, {text: this.xcolor, border: [false, false, false, false]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DESCRIPCIÓN DE LAS COBERTURAS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'COBERTURAS', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'TASAS', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: '% DESC.', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: ' '
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'Prima Total', colSpan: 4, alignment: 'right', bold: true, border: [true, false, true, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'right', bold: true, border: [false, false, true, false]}],
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL RECIBO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [50, 50, 160, 100, '*'],
            body: [
              [{text: 'Recibo N°.:', bold: true, border: [true, false, true, true]}, {text: ' ', alignment: 'center', border: [false, false, true, true]}, {text: `Vigencia del Recibo:  Desde:    Hasta:  `, colSpan: 2, border: [false, false, true, true]}, {}, {text: 'Tipo e Movimiento: EMISIÓN', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, 50, '*'],
            body: [
              [{text: 'Total a Cobrar:', colSpan: 4, alignment: 'right', bold: true, border: [true, false, false, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'center', bold: true, border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DECLARACIÓN', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'prueba',
          table: {
            widths: ['*'],
            body: [
              [{text: 'En mi carácter de tomador de la póliza contratada con La Mundial de Seguros, C.A bajo fe de juramento certifico que el dinero utilizado para el pago de la prima, ' +
                      'proviene de una fuente lícita y por lo tanto, no tiene relación alguna con el dinero, capitales, bienes, haberes, valores o títulos producto de las actividades ' +
                      'o acciones derivadas de operaciones ilícitas previstas en las normas sobre administración de riesgos de legitimación de capitales, financiamiento al terrorismo y ' +
                      'financiamiento de la proliferación de armas de destrucción masiva en la actividad aseguradora. El tomador y/o asegurado declara(n) recibir en este acto las ' +
                      'condiciones generales y particulares de la póliza, así como las cláusulas  y anexos arriba mencionados, copia de la solicitud de seguro y demás documentos que ' +
                      'formen parte del contrato. El Tomador, Asegurado o Beneficiario de la Póliza, que sienta vulneración de sus derechos, y requieran presentar cualquier denuncia, ' +
                      'queja, reclamo o solicitud de asesoría; surgida con ocasión de este contrato de seguros; puede acudir a la Oficina de la Defensoría del Asegurado de la' +
                      'Superintendencia de la Actividad Aseguradora, o comunicarlo a través de la página web: http://www.sudeaseg.gob.ve/.', alignment: 'justify', border: [true, false, true, true]}],
            ]
          }
        }
      ]
    }
    let pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download(`Certificado N°`);
    pdf.open();
  }
*/
}
