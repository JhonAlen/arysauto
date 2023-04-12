import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { GridApi } from 'ag-grid-community';
import { NgbPaginationModule, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-contract-service-arys-administration',
  templateUrl: './contract-service-arys-administration.component.html',
  styleUrls: ['./contract-service-arys-administration.component.css']
})
export class ContractServiceArysAdministrationComponent implements OnInit {

  currentUser;
  keyword = 'value';
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  contractList: any[] = [];
  batchList: any[] = [];
  fleetContractList: any[] = [];
  id: number;
  xcliente: string;
  xdocidentidadcliente: number;
  xemailcliente: string;
  xpropietario: string;
  xdocidentidadpropietario: number;
  xemailpropietario: string;
  xplaca: string;
  xmarca: string;
  xmodelo: string;
  xversion: string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  xcolor: string;
  ncapacidadpasajeros: number;
  mtotal: number;
  fdesde;
  fhasta;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  filteredData;
  public page = 1;
  public pageSize = 7;
  ccontratoflota: number;
  ccarga: number;
  mprimatotal: number;
  mprimaprorratatotal: number;
  xpoliza: string;
  xrecibo: string;
  fdesde_rec: Date;
  fhasta_rec: Date;
  femision: Date;
  fsuscripcion: Date;
  fnacimientopropietario2: string;
  xnombrecliente: string;
  xdireccionfiscalcliente: string;
  xtelefonocliente: string;
  xrepresentantecliente: string;
  xciudadcliente: string;
  xestadocliente: string;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  accesoryDeletedRowList: any[] = [];
  inspectionDeletedRowList: any[] = [];
  planCoberturas: string;
  planServicios: string;
  xtituloreporte: string;
  xobservaciones: string;
  xnombrerepresentantelegal: string;
  xdocidentidadrepresentantelegal: string;
  xanexo: string;
  cstatuspoliza: number;
  rowClick: boolean = false;
  cuadro: boolean = false;
  coverage = {};
  xtomador : string;
  xprofesion : string;
  xrif;
  xdomicilio : string;
  xzona_postal : string;
  
  xtelefono : string;
  xcorreo : string;
  xestado : string;
  xciudad : string;



  ccontratoflora: number;
  xsucursalsuscriptora: string;
  xsucursalemision: string;
  ccorredor: number;
  xcorredor: string;
  xnombrepropietario: string;
  xapellidopropietario: string;
  xtipodocidentidadpropietario: string;
  xtelefonocelularpropietario: string;
  xdireccionpropietario: string;
  xestadopropietario: string;
  xciudadpropietario: string;
  xestadocivilpropietario: string;
  xocupacionpropietario: string;
  fnacimientopropietario: string
  cmetodologiapago: number;
  xtelefonopropietario: string;
  cvehiculopropietario: number;
  ctipoplan: number;
  cplan: number;
  ctiporecibo: number;
  mpreciovehiculo: number;
  ctipovehiculo: number;
  xtipomodelovehiculo: string;
  ncapacidadcargavehiculo: number;
  ncapacidadpasajerosvehiculo: number;
  xplancoberturas: string;
  xplanservicios: string;
  xnombrecorredor: string;
  modalidad: boolean = true;
  montorcv: boolean = true;
  cobertura: boolean = false;
  grua: boolean = false;
  xuso: any;
  xtipovehiculo: any;
  xclase: any;
  xtransmision: any;
  xzona_postal_propietario: any;
  nkilometraje: any;
  xmoneda;
  mmonto_plan;


  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      cano: ['', Validators.required],
      xcolor: ['', Validators.required],
      cmarca: ['', Validators.required],
      cmodelo: ['', Validators.required],
      cversion: ['', Validators.required],
      xrif_cliente:['', Validators.required],
      email: ['', Validators.required],
      xtelefono_prop:[''],
      xdireccionfiscal: ['', Validators.required],
      xserialmotor: ['', Validators.required],
      xserialcarroceria: ['', Validators.required],
      xplaca: ['', Validators.required],
      xtelefono_emp: ['', Validators.required],
      cplan: ['', Validators.required],
      ncapacidad_p: ['', Validators.required],
      cestado:['', Validators.required],
      cciudad:['', Validators.required],
      icedula:['', Validators.required],
      femision:['', Validators.required],
      ivigencia:[''],
      cpais:['', Validators.required],
      xreferencia:[''],
      fcobro:[''],
      cbanco: [''],
      xcedula: [''],
      binternacional: [''],
      ctomador: [''],
      cuso: [''],
      cclase: [''],
      ctipovehiculo: [''],
      xzona_postal:[''],
      nkilometraje: [''],
      xmoneda: [''],
    });
    
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 120
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDropdownDataRequest();
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
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    this.http.post(`${environment.apiUrl}/api/contract-arys/search-contract-arys`, params, options).subscribe((response : any) => {
      this.contractList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.contractList.push({
            ccodigo_serv: response.data.list[i].ccodigo_serv,
            xnombres: response.data.list[i].xnombres,
            xvehiculo: response.data.list[i].xvehiculo,
            fano: response.data.list[i].fano,
            identificacion: response.data.list[i].identificacion,
          })
        }
        this.filteredData = this.contractList;
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

  filterData(value: string) {
    this.filteredData = this.contractList.filter((item) => {
      const searchValue = value.toLowerCase();
      return item.xnombres.toString().toLowerCase().includes(searchValue) || item.xvehiculo.toString().toLowerCase().includes(searchValue) || item.identificacion.toString().toLowerCase().includes(searchValue);
    });
  }

  changeDateFormat(date) {
    if (date) {
      let dateArray = date.substring(0,10).split("-");
      return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
    }
    else {
      return ' ';
    }
  }

  getContractArysFromCertificate(ccodigo_serv){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccodigo_serv: ccodigo_serv
    };
    this.http.post(`${environment.apiUrl}/api/contract-arys/detail-contract-arys`, params, options).subscribe((response : any) => {
      this.contractList = [];
      if(response.data.status){
        this.ccarga = response.data.ccarga;
        this.xpoliza = response.data.xpoliza;
        this.xtituloreporte = response.data.xtituloreporte;
        this.xanexo = response.data.xanexo;
        this.xobservaciones = response.data.xobservaciones;
        this.xnombrerepresentantelegal = response.data.xnombrerepresentantelegal;
        this.xdocidentidadrepresentantelegal = response.data.xdocidentidadrepresentantelegal;
        this.xnombrecliente = response.data.xnombrecliente;
        this.xdocidentidadcliente = response.data.xdocidentidadcliente;
        this.xdireccionfiscalcliente = response.data.xdireccionfiscalcliente;
        this.xciudadcliente = response.data.xciudadcliente;
        this.xestadocliente = response.data.xestadocliente;
        if (response.data.xtelefonocliente) {
          this.xtelefonocliente = response.data.xtelefonocliente;
        } else {
          this.xtelefonocliente = ' ';
        }
        if (response.data.xemailcliente) {
          this.xemailcliente = response.data.xemailcliente;
        } else {
          this.xemailcliente = ' ';
        }
        if (response.data.xrepresentantecliente) {
          this.xrepresentantecliente = response.data.xrepresentantecliente;
        } else {
          this.xrepresentantecliente = ' ';
        }
        this.xsucursalemision = response.data.xsucursalemision;
        this.xsucursalsuscriptora = response.data.xsucursalsuscriptora;
        this.ccorredor = response.data.ccorredor;
        this.xnombrecorredor = response.data.xcorredor;
        this.xnombrepropietario = response.data.xnombrepropietario;
        this.xapellidopropietario = response.data.xapellidopropietario;
        this.xtipodocidentidadpropietario = response.data.xtipodocidentidadpropietario ;
        this.xdocidentidadpropietario = response.data.xdocidentidadpropietario ;
        this.xdireccionpropietario = response.data.xdireccionpropietario ;
        this.xtelefonocelularpropietario = response.data.xtelefonocelularpropietario;
        this.xestadopropietario = response.data.xestadopropietario;
        this.xciudadpropietario = response.data.xciudadpropietario;
        this.xocupacionpropietario = response.data.xocupacionpropietario;
        this.xestadocivilpropietario = response.data.xestadocivilpropietario;
        this.xemailpropietario = response.data.xemailpropietario;
        this.xtelefonopropietario = response.data.xtelefonopropietario;
        this.cvehiculopropietario = response.data.cvehiculopropietario;
        this.ctipoplan = response.data.ctipoplan;
        this.cplan = response.data.cplan;
        this.cmetodologiapago = response.data.cmetodologiapago;
        this.ctiporecibo = response.data.ctiporecibo;
        this.xmarca = response.data.xmarca;
        this.xmoneda = response.data.xmoneda;
        this.xmodelo = response.data.xmodelo;
        this.xversion = response.data.xversion;
        console.log(this.xmarca)
        console.log(this.xmodelo)
        console.log(this.xversion)
        this.xplaca = response.data.xplaca;
        this.xuso = response.data.xuso;
        this.xtipovehiculo = response.data.xtipovehiculo;
        this.nkilometraje = response.data.nkilometraje;
        this.xclase = response.data.xclase;
        this.xtransmision = response.data.xtransmision;
        this.fano = response.data.fano;
        this.xserialcarroceria = response.data.xserialcarroceria;
        this.xserialmotor = response.data.xserialmotor;
        this.xcolor = response.data.xcolor;
        this.mpreciovehiculo = response.data.mpreciovehiculo;
        this.ctipovehiculo = response.data.ctipovehiculo;
        this.xtipomodelovehiculo = response.data.xtipomodelovehiculo;
        this.ncapacidadcargavehiculo = response.data.ncapacidadcargavehiculo;
        this.ncapacidadpasajerosvehiculo = response.data.ncapacidadpasajerosvehiculo;
        this.xplancoberturas = response.data.xplancoberturas;
        this.xplanservicios = response.data.xplanservicios;
        this.mprimatotal = response.data.mprimatotal;
        this.mprimaprorratatotal = response.data.mprimaprorratatotal;
        this.xzona_postal_propietario = response.data.xzona_postal_propietario;
        this.mmonto_plan = response.data.mtotal_plan
        this.femision = response.data.femision;
        let fechaInicio = this.femision;
        this.fdesde = response.data.femision;
        const fecha = new Date(fechaInicio); // Convertimos la cadena a objeto Date
        fecha.setFullYear(fecha.getFullYear() + 1); // Sumamos 1 al año
        this.fhasta = fecha.toISOString().slice(0, 10); // Convertimos la fecha resultante a cadena en formato ISO y extraemos solo la parte de la fecha
        if(response.data.xtomador){
          this.xtomador = response.data.xtomador;
        }else{
          this.xtomador = this.xnombrecliente;
        }
        
        if(response.data.xprofesion){
          this.xprofesion = response.data.xprofesion;
        }else{
          this.xprofesion = ' ';
        }

        if(response.data.xrif){
          this.xrif = response.data.xrif;
        }else{
          this.xrif = this.xdocidentidadcliente;
        }

        if(response.data.xdomicilio){
          this.xdomicilio = response.data.xdomicilio;
        }else{
          this.xdomicilio = this.xdireccionfiscalcliente;
        }

        if(response.data.xzona_postal){
          this.xzona_postal = response.data.xzona_postal;
        }else{
          this.xzona_postal = ' ';
        }

        if(response.data.xtelefono){
          this.xtelefono = response.data.xtelefono;
        }else{
          this.xtelefono = this.xtelefonocliente;
        }

        if(response.data.xcorreo){
          this.xcorreo = response.data.xcorreo;
        }else{
          this.xcorreo = this.xemailcliente;
        }

        if(response.data.xestado){
          this.xestado = response.data.xestado;
        }else{
          this.xestado = this.xestadocliente;
        }
        
        if(response.data.xciudad){
          this.xciudad = response.data.xciudad;
        }else{
          this.xciudad = this.xciudadcliente;
        }
        this.createPDF();
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

  createPDF(){
    try{
    const pdfDefinition: any = {
      footer: function(currentPage, pageCount) { 
        return {
          table: {
            widths: ['*'],
            body: [
              [{text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', border: [false, false, false, false]}]
            ]
          }
        }
      },
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
              '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
              '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
              'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
              'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
              'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
              'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
              'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
              'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
              'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
              'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
              'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Contrato', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia del Contrato:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 80, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, false, true]}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Monto Total del Plan', bold: true, border: [false, false, false, true]}, {text: this.mmonto_plan, border: [false, false, true, true]} ]
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
            widths: [40, 310, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: '', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 90, 40, 50, 30, 50, 24, '*'],
            body: [
              [{text: 'Estado:', bold: true, border: [true, false, false, false]}, {text: this.xestadopropietario, border: [false, false, false, false]}, {text: 'Ciudad:', bold: true, border: [false, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocelularpropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
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
            widths: [20, 45, 80, 75, 70, 70, 50, '*'],
            body: [
              [{text: 'Año:', bold: true, border: [true, false, false, true]}, {text: this.fano, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'Color:', bold: true, border: [false, false, false, true]}, {text: this.xcolor, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 90, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, false]}, {text: this.ncapacidadpasajeros, border: [false, false, false, false]}, {text: 'CLASE:', bold: true, border: [false, false, false, false]}, {text: this.xclase, border: [false, false, false, false]}, {text: 'TIPO:', bold: true, border: [false, false, false, false]}, {text: this.xtipovehiculo, border: [false, false, false, false]}, {text: 'PLACA:', bold: true, border: [false, false, false, false]}, {text: this.xplaca, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DESCRIPCIÓN DE LOS SERVICIOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        // /*{
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'BENEFICIARIO PREFERENCIAL', alignment: 'center', fillColor: '#ababab', bold: true}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*', 20, '*'],
        //     body: [
        //       [{text: this.xnombrecliente, alignment: 'center', bold: true, border: [true, false, false, false]}, {text: 'C.I.', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadcliente, alignment: 'center', border: [false, false, true, false]}]
        //     ]
        //   }
        // },*/
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'DATOS DEL RECIBO', alignment: 'center', fillColor: '#ababab', bold: true}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [50, 50, 160, 100, '*'],
        //     body: [
        //       [{text: 'Recibo N°.:', bold: true, border: [true, false, true, true]}, {text: this.xrecibo, alignment: 'center', border: [false, false, true, true]}, {text: `Vigencia del Recibo:  Desde:  ${this.changeDateFormat(this.fdesde_rec)}  Hasta:  ${this.changeDateFormat(this.fhasta_rec)}`, colSpan: 2, border: [false, false, true, true]}, {}, {text: 'Tipo e Movimiento: EMISIÓN', bold: true, border: [false, false, true, true]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [150, 100, 60, 50, '*'],
        //     body: [
        //       [{text: 'Total a Cobrar:', colSpan: 4, alignment: 'right', bold: true, border: [true, false, false, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'center', bold: true, border: [true, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'DECLARACIÓN', alignment: 'center', fillColor: '#ababab', bold: true}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'En mi carácter de tomador de la póliza contratada con La Mundial de Seguros, C.A bajo fe de juramento certifico que el dinero utilizado para el pago de la prima, \n' +
        //               'proviene de una fuente lícita y por lo tanto, no tiene relación alguna con el dinero, capitales, bienes, haberes, valores o títulos producto de las actividades \n' +
        //               'o acciones derivadas de operaciones ilícitas previstas en las normas sobre administración de riesgos de legitimación de capitales, financiamiento al terrorismo y \n' +
        //               'financiamiento de la proliferación de armas de destrucción masiva en la actividad aseguradora. El tomador y/o asegurado declara(n) recibir en este acto las \n' +
        //               'condiciones generales y particulares de la póliza, así como las cláusulas  y anexos arriba mencionados, copia de la solicitud de seguro y demás documentos que \n' +
        //               'formen parte del contrato. El Tomador, Asegurado o Beneficiario de la Póliza, que sienta vulneración de sus derechos, y requieran presentar cualquier denuncia, \n' +
        //               'queja, reclamo o solicitud de asesoría; surgida con ocasión de este contrato de seguros; puede acudir a la Oficina de la Defensoría del Asegurado de la\n' +
        //               'Superintendencia de la Actividad Aseguradora, o comunicarlo a través de la página web: http://www.sudeaseg.gob.ve/.\n', border: [true, false, true, true]}],
        //     ]
        //   }
        // },
        // {
        //   pageBreak: 'before',
        //   style: 'data',
        //   table: {
        //     widths: [165, 216, 50, '*'],
        //     body: [
        //       [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
        //       '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
        //       '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
        //       'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
        //       'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
        //       'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
        //       'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
        //       'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
        //       'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
        //       'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
        //       'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
        //       'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=', width: 160, height: 50, border:[true, true, false, false]},
        //       {text: `\n\n${this.xtituloreporte}`, fontSize: 9.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [130, 80, 30, 55, 30, 55, '*'],
        //     body: [
        //       [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [70, 51, 80, 80, 80, '*'],
        //     body: [
        //       [{text: 'Fecha de Suscripción:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, false, true]}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [130, 80, 50, 80, '*'],
        //     body: [
        //       [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: '', border: [false, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [70, 51, 80, 50, 80, '*'],
        //     body: [
        //       [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: '', border: [false, false, true, true]} ]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [40, 300, '*', '*'],
        //     body: [
        //       [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xtomador, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:'/*, rowSpan: 2*/, bold: true, border: [false, false, false, true]}, {text: this.xrif/*, rowSpan: 2*/, border: [false, false, true, true]}]/*,
        //       [{text: 'Índole o Profesión:', bold: true, border: [true, false, false, true]}, {text: this.xprofesion, border: [false, false, false, true]}, {}, {}]*/
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [40, 310, 24, '*'],
        //     body: [
        //       [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [24, 130, 40, 24, 30, 50, 24, '*'],
        //     body: [
        //       [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xemailcliente, border: [false, false, true, true]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [80, 280, 24, '*'],
        //     body: [
        //       [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [24, 134, 50, 24, 50, 24, '*', '*'],
        //     body: [
        //       [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: '', border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: '', border: [false, false, true, true]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [44, 296, '*', '*'],
        //     body: [
        //       [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: '', border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: '', border: [false, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [40, 310, 24, '*'],
        //     body: [
        //       [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: '', border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: '', border: [false, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [24, 130, 40, 24, 30, 50, 24, '*'],
        //     body: [
        //       [ {text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: '', border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: '', border: [false, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [180, '*', 180],
        //     body: [
        //       [{text: 'Para constancia se firma:\nLugar y fecha', colSpan: 3, border: [true, false, true, false]}, {}, {}],
        //       [{text: ' ', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {image: 'data:image/jpeg;base64,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', width: 136, height: 77, border: [false, false, true, false]}],
        //       [{text: '_________________________________', bold: true, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: '_________________________________', bold: true, alignment: 'center', border: [false, false, true, false]}],
        //       [{text: 'FIRMA DEL TOMADOR', alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Por La Mundial Seguros, C.A', alignment: 'center', border: [false, false, true, false]}],
        //       [{text: `Nombre y Apellido: ${this.xnombrecliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `Nombre y Apellido: ${this.xnombrerepresentantelegal}`, alignment: 'center', border: [false, false, true, false]}],
        //       [{text: `C.I: ${this.xdocidentidadcliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `C.I: ${this.xdocidentidadrepresentantelegal}`, alignment: 'center', border: [false, false, true, false]},]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'Aprobado por la Superintendencia de la Actividad Aseguradora mediante Providencia Nº FSAA-1-1-0361-2022 de fecha 5/8/2022', alignment: 'center', border: [true, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: '\nLa Mundial  de Seguros, C.A, inscrita en la Superintendencia de la Actividad Aseguradora bajo el No. 73' + 
        //               '\nDIRECCIÓN: AV. FRANCISCO DE MIRANDA, EDIFICIO CAVENDES, PISO 11, OFICINA 1101- CARACAS', alignment: 'center', border: [true, false, true, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: ' ', border: [true, false, true, true]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'En caso de SINIESTRO o SOLICITUD DE SERVICIO dar aviso a la brevedad posible al número telefónico: 0500-2797288 / 0414-4128237 Atención 24/7', alignment: 'center', bold: true, border: [true, false, true, true]}]
        //     ]
        //   }
        // },
        // {
        //   pageBreak: 'before',
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'AFILIACIÓN AL CLUB DE MIEMBROS DE ARYSAUTOS\n', alignment: 'center', bold: true, border: [false, false, false, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: ' ', border: [false, false, false, false]}],
        //       [{text: ' ', border: [false, false, false, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [100, '*'],
        //     body: [
        //       [{text: 'Datos del afiliado', bold: true, border: [true, true, false, true]}, {text: ' ', border: [false, true, true, true]}],
        //       [{text: 'Nombres y Apellidos', border: [true, false, true, true]}, {text: this.xnombrecliente, border: [false, false, true, true]}],
        //       [{text: 'Tipo y número de documento de identidad', border: [true, false, true, true]}, {text: this.xdocidentidadcliente, border: [false, false, true, true]}],
        //       [{text: 'Dirección', border: [true, false, true, true]}, [{text: this.xdireccionfiscalcliente, border: [false, false, true, true]}]],
        //       [{text: 'Número de Teléfono', border: [true, false, true, true]}, [{text: this.xtelefonocliente, border: [false, false, true, true]}]],
        //       [{text: 'Datos del vehículo', bold: true, border: [true, false, false, true]}, {text: ' ', border: [false, false, true, true]}],
        //       [{text: 'Placa', border: [true, false, true, true]}, [{text: this.xplaca, border: [false, false, true, true]}]],
        //       [{text: 'Marca - Modelo - Versión', border: [true, false, true, true]}, {text: `${this.xmarca} - ${this.xmodelo} - ${this.xversion}`}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: ' ', border: [false, false, false, false]}],
        //       [{text: ' ', border: [false, false, false, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: 'Con la compra de la póliza RCV, adquiere una membresía por el vehículo asegurado suscrita por ARYSAUTOS, C.A. sociedad mercantil domiciliada en Valencia,\n' + 
        //               'Estado Carabobo e inscrita en el Registro Mercantil Segundo de la circunscripción judicial del Estado Carabobo bajo el número 73 tomo 7-A, por lo que está\n' +
        //               'AFILIADO al club de miembros de en el cual tendrá acceso a los siguientes SERVICIOS con disponibilidad a nivel nacional las 24/7, los 365 días del año de\n' +
        //               'manera rápida y segura para responder a todas tus requerimientos e inquietudes.', border:[false, false, false, false]
        //       }]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: '\nLOS SERVICIOS\n', bold: true, border: [false, false, false, false]}],
        //       [{text: 'Los costos de los servicios serán asumidos o no por el afiliado de acuerdo al plan contratado', border: [false, false, false, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: ' ', border: [false, false, false, false]}],
        //       [{text: ' ', border: [false, false, false, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: [100, '*', 100],
        //     body: [
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Servicios del Club', fillColor: '#D4D3D3', bold: true}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica Ligera', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Taller', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Grúa sin cobertura', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia legal telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento correctivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento preventivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Casa de repuesto', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica general', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Centro de atención 24/7', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Red de proveedores certificados', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Acompañamiento', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia en siniestros', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia vial telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //       [{text: ' ', border: [false, false, false, false]}, {text: 'Búsqueda y ubicación de repuestos', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   table: {
        //     widths: ['*'],
        //     body: [
        //       [{text: ' ', border: [false, false, false, false]}],
        //       [{text: ' ', border: [false, false, false, false]}]
        //     ]
        //   }
        // },
        // {
        //   style: 'data',
        //   ul: [
        //     'Debe llamar Venezuela al: 0500-2797288 / 0414-4128237 / 0241-8200184. Si se encuentra en Colombia al celular 3188339485\n',
        //     'Dar aviso a la brevedad posible, plazo máximo de acuerdo a las condiciones de la Póliza.',
        //     'Una vez contactado con la central del Call Center se le tomarán los detalles del siniestro (es importante que el mismo conductor realice la llamada) y de acuerdo\n' +
        //     'al tipo de siniestro o daño se le indicaran los pasos a seguir.',
        //     'Permanezca en el lugar del accidente y comuníquese inmediatamente con las autoridades de tránsito.',
        //     'Si intervino una autoridad competente (Tránsito Terrestre, Guardia Nacional Bolivariana, Policía Nacional Bolivariana),es necesario que solicite las experticias y\n' + 
        //     'a su vez las Actuaciones de Tránsito con el respectivo croquis, verifíquelas antes de firmarlas, ya que se requiere disponer de todos los detalles del accidente,\n' + 
        //     'los datos de los vehículos y personas involucradas. Sin estos datos, no se podrá culminar la Notificación',
        //     'No suministre información que puede afectarlo.'
        //   ]
        // }
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
        }
      }
    }
    let pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download(`Póliza - ${this.xnombrecliente}`);
    pdf.open();
    this.search_form.disable()
  }
    catch(err){console.log(err.message)}
  }
}
