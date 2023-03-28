import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ColDef} from 'ag-grid-community'
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  fcarga;
  xcliente: string;
  xdocidentidadcliente: number;
  xemailcliente: string;
  xpropietario: string;
  xdocidentidadpropietario: number;
  xemailpropietario: string;
  xcertificado: number;
  xpoliza: number;
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
  ncapacidadpasajeros: number;
  msuma_a_casco: number;
  msuma_otros: number;
  ptasaa_aseguradora: number;
  mprima_casco: number;
  mprima_otros: number;
  mprima_catastrofico: number;
  mgastos_recuperacion: number;
  mbasica_rcv: number;
  mexceso_limite: number;
  mdefensa_penal: number;
  mmuerte: number;
  minvalidez: number;
  mgastos_medicos: number;
  mgastos_funerarios: number;
  mtotal_prima_aseg: number;
  mdeducible: number;
  xtipo_deducible: string;
  ptasa_fondo_anual: number;
  mfondo_arys: number;
  mmembresia: number;
  mtotal: number;
  fdesde_pol;
  fhasta_pol;
  bAgregarPropi = false;
  ccliente;
  fhasta_poliza;
  planList: any[] = [];

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
              private router: Router,
              private toast: MatSnackBar) { }

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
      this.bAgregarPropi = true;
    } else {
      this.search_form.get('clote').disable();
    }
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

  openInclusionContract(){
    if(this.search_form.get('ccarga').value){
      let params = {
        ccarga: this.search_form.get('ccarga').value
      }
      this.http.post(`${environment.apiUrl}/api/corporative-issuance-management/search-receipt`, params).subscribe((response : any) => {
        if(response.data.status){
          this.ccliente = response.data.ccliente;
          this.fhasta_poliza = response.data.fhasta_pol;
          if(response.data.plan){
            for(let i = 0; i < response.data.plan.length; i++){
              this.planList.push({
                  cplan: response.data.plan[i].cplan
              })
          }
          let data = {
            ccliente: this.ccliente,
            ccarga: this.search_form.get('ccarga').value,
            fhasta_pol: this.fhasta_poliza,
            cplan: this.planList,
          }
          this.router.navigate([`subscription/inclusion-contract/`], {state: data});
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        console.log(code)
        this.toast.open(`${code}`, '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-toast']
        });
      });
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

  async downloadReceipt(e) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      id: e.data.id
    }
    this.http.post(`${environment.apiUrl}/api/corporative-issuance-management/detail`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.id = response.data.id;
        this.xpoliza = response.data.xpoliza;
        this.xcertificado = response.data.xcertificado;
        this.fcarga = response.data.fcarga;
        this.xcliente = response.data.xcliente;
        this.xdocidentidadcliente = response.data.xdocidentidadcliente;
        this.xemailcliente = response.data.xemailcliente;
        this.xpropietario = response.data.xpropietario;
        this.xdocidentidadpropietario = response.data.xdocidentidadpropietario;
        this.xemailpropietario = response.data.xemailpropietario;
        this.xmarca = response.data.xmarca;
        this.xmodelo = response.data.xmodelo;
        this.xversion = response.data.xversion;
        this.cano = response.data.cano;
        this.xtipo = response.data.xtipo;
        this.xclase = response.data.xclase;
        this.xserialcarroceria = response.data.xserialcarroceria;
        this.xserialmotor = response.data.xserialmotor;
        this.xcolor = response.data.xcolor;
        this.ncapacidadpasajeros = response.data.ncapacidadpasajeros;
        this.xplaca = response.data.xplaca;
        this.msuma_a_casco = response.data.msuma_a_casco;
        this.msuma_otros = response.data.msuma_otros;
        this.ptasaa_aseguradora = response.data.ptasaa_aseguradora;
        this.mprima_casco = response.data.mprima_casco;
        this.mprima_otros = response.data.mprima_otros;
        this.mprima_catastrofico = response.data.mprima_catastrofico;
        this.mgastos_recuperacion = response.data.mgastos_recuperacion;
        this.mbasica_rcv = response.data.mbasica_rcv;
        this.mexceso_limite = response.data.mexceso_limite;
        this.mdefensa_penal = response.data.mdefensa_penal;
        this.mmuerte = response.data.mmuerte;
        this.minvalidez = response.data.minvalidez;
        this.mgastos_medicos = response.data.mgastos_medicos;
        this.mgastos_funerarios = response.data.mgastos_funerarios;
        this.mtotal_prima_aseg = response.data.mtotal_prima_aseg;
        this.mdeducible = response.data.mdeducible;
        this.xtipo_deducible = response.data.xtipo_deducible;
        this.ptasa_fondo_anual = response.data.ptasa_fondo_anual;
        this.mfondo_arys = response.data.mfondo_arys;
        this.mmembresia = response.data.mmembresia;
        this.mtotal = response.data.mtotal;
        this.fdesde_pol = response.data.fdesde_pol;
        this.fhasta_pol = response.data.fhasta_pol;
      }
      this.generatePDF();
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

  generatePDF() {
    const pdfDefinition: any = {
      info: {
        title: `Certificado N° ${this.xcertificado} - ${this.xpropietario}`,
        subject: `Certificado N° ${this.xcertificado} - ${this.xpropietario}`
      },
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAAAyCAIAAABd6OdIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQCSURBVHhe7ZprkqMwDIRzrhwo58lpchkOk/ULsK2WLINTNbXS92snyHK3GrIMw+PrmMHDNoSHbQgP2xAetiE8bEN42IbwsA3hYRvCwzaEh20ID9sQHrYh2LC3rfzDDv+9ZRz29n4+Wp5vaRLb5/V89kt6QsXr/WnbfF7lYCQUxJpPOVbY3rF3oFQFgJht+8Q6fFDDtOWmPgl8d8qDu/R5qUlkd43tIf1EMsFwmkwpioSf4oRZ2TBsajyAt8zABRxB0CEHLKRhk5ImhpRyOZC4lPYKy6QcZJpr7oVNHBPoVZVAYTPRSdbn1J+BXBvZGWe4dspnNZJSzLzlO2EzuzG0Jy92jKAnPQibDU64ZGbD3pvdCpufmaAUcsEy3ZzWcsonp3VOZHbM3f+JNGyhIW99VkUkCSEL14yMV4q4YvlG2JJwRGk8932wU8dNwhaVsNbJqroy3Dyh7x7GONmDKUHew90AI1DikuU7V3aLplNAVClxxt2HPWrZfi8ckGWkDjSONTCyei0SlArASkbcgFWWaUS6GFVVaE6hsLkR427cjnZd2L2D/jcHzjpxTsu44YhxoyA06yZYZplGtC5sZBb1kiubsElhqEKflfKKcdiCJTZRJLzqjNbNxv1Ly0A/kidM5oBaFYyyxXXY2KTKuuw8jI9+v9RtUGzP8W9VdEwBmAzHzywnqD4Y0biTstEOaVj0V2GTjqWhxjpKS6ZTq2tALcJ14iRqllqmuyozGnfS6Kngys+wOeMqzZNhI63jFnBSQF0Al/astUz3VHSJkE5kPMpGO1zDI2zSr9qR5tDvNU7q5IWe5EXkJrw9OorBMAqLLdMtdRnRKnotjOVUsMV72PKgKZ2eieXUyQnfRvAG05Z2Kay2TLdcFzZwGHohi6hy71fCnjXeC+Kdg82l4JBWYL4BPbIZLAnctKzxRbe4GjaeS3wcej5Fyn/4K0dqjnY57HnjnSI+bNQcmDlQnxzBW/4jX6lqkU6oxHrLgeoJXpg8UHY57GuCE+eeKeyLfSrlpEOtV51fRFmMz/Qd6WzK/MCyAqhLGfbAMkfdK4Z9/5wZJAQOs3EMWp3wqsdRL7B8afbQCdCCHV+Q3TYKYdMO6unuhcOE9IZAJRMenjZ50wWxwHIAHBVhfOhnE5n4ezbp8lBfSZIq0KRzpnYECtkrtatl3s8gLLGcQE8GMfXrOR3q0excf1OFbsXuhC6lXDwO+wvuV2CIM2GX6vjmlS7mzBLLJ3H26WWzcvwgfpalidqmw86EbePtab3rvl2pIOS78a2QfhhSivXT/YsUD3/H8u93KGE7JvCwDeFhG8LDNoSHbQgP2xAetiE8bEN42IbwsA3hYRvCwzaEh20ID9sM3+8/pLIUAd5A5JoAAAAASUVORK5CYII=', width: 160, height: 50, border:[true, true, false, false]},
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
              [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.fcarga, alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: 'USD', border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotal), border: [false, false, true, true]} ]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [44, '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xcliente, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [44, 296, '*', '*'],
            body: [
              [{text: 'Email:', bold: true, border: [true, false, false, false]}, {text: this.xemailcliente, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadcliente, border: [false, false, true, false]}]
            ]
          }
        },
        /*{
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
        },*/
        {
          style: 'data',
          table: {
            widths: [44, "*"],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: this.xpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [44, 296, '*', '*'],
            body: [
              [{text: 'Email:', bold: true, border: [true, false, false, false]}, {text: this.xemailpropietario, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        /*{
          style: 'data',
          table: {
            widths: [24, 130, 40, 24, 30, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: this.xzona_postal_propietario, border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocliente, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
            ]
          }
        },*/
        /*{
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
        },*/
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
            widths: [20, 45, 80, 75, 70, 70, 50, '*'],
            body: [
              [{text: 'Año:', bold: true, border: [true, false, false, true]}, {text: this.cano, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'Color:', bold: true, border: [false, false, false, true]}, {text: this.xcolor, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 90, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, false]}, {text: this.ncapacidadpasajeros, border: [false, false, false, false]}, {text: 'CLASE:', bold: true, border: [false, false, false, false]}, {text: this.xclase, border: [false, false, false, false]}, {text: 'TIPO:', bold: true, border: [false, false, false, false]}, {text: this.xtipo, border: [false, false, false, false]}, {text: 'PLACA:', bold: true, border: [false, false, false, false]}, {text: this.xplaca, border: [false, false, true, false]}]
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
            widths: [150, 100, 60, '*'],
            body: [
              [{text: 'COBERTURAS', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'TASAS', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, '*'],
            body: [
              [{text: 'Casco', border: [true, false, true, false]}, {text: `${this.msuma_a_casco} USD`, alignment: 'right', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mprima_casco} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Gastos Catastróficos', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mprima_catastrofico} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Gastos Recuperación', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mgastos_recuperacion} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Básica RCV', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `0.9 bs`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Exceso de Límite', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mexceso_limite} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Defensa Penal', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mdefensa_penal} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Muerte', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mmuerte} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Invalidez Permanente', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.minvalidez} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Gastos Médicos', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mgastos_medicos} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Gastos Funerarios', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mgastos_funerarios} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Fondo Arys', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: ' ', border: [true, false, true, false]}, {text: `${this.mfondo_arys} USD`, alignment: 'right', border: [true, false, true, false]}],
              [{text: 'Membresía Arys', border: [true, false, true, true]}, {text: ' ', border: [true, false, true, true]}, {text: ' ', border: [true, false, true, true]}, {text: `${this.mmembresia} USD`, alignment: 'right', border: [true, false, true, true]}],
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [150, 100, 60, '*'],
            body: [
              [{text: 'Prima Total', colSpan: 3, alignment: 'right', bold: true, border: [true, false, true, true]}, {}, {}, {text: `USD ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotal)}`, alignment: 'right', bold: true, border: [false, false, true, true]}],
            ]
          }
        }
      ],
      styles: {
        title: {
          fontSize: 9.5,
          bold: true,
          alignment: 'center'
        },
        header: {
          fontSize: 7.5,
          color: 'gray'
        },
        data: {
          fontSize: 7
        },
        prueba: {
          alignment: 'justify',
          fontSize: 7
        }
      }
    }
    let pdf = pdfMake.createPdf(pdfDefinition);
    let nombreArchivo = `Certificado N° ${this.xcertificado} - ${this.xpropietario}`
    pdf.download(nombreArchivo.replace(/\./g, " "));
    pdf.open();
  }

}
