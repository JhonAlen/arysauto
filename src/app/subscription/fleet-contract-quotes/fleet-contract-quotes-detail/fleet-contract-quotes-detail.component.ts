import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FleetContractIndividualAccessorysComponent } from '@app/pop-up/fleet-contract-individual-accessorys/fleet-contract-individual-accessorys.component';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';
// import { initUbii } from '@ubiipagos/boton-ubii-dc';
//import { initUbii } from '@ubiipagos/boton-ubii';

@Component({
  selector: 'app-fleet-contract-quotes-detail',
  templateUrl: './fleet-contract-quotes-detail.component.html',
  styleUrls: ['./fleet-contract-quotes-detail.component.css']
})
export class FleetContractQuotesDetailComponent implements OnInit {

  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  clear: boolean = true;
  alert = { show: false, type: "", message: "" };
  marcaList: any[] = [];
  modeloList: any[] = [];
  TypeVehicleList: any[] = [];
  TypeVehicle: any[] = [];
  UtilityVehicle: any[] = [];
  ListClase: any[] = [];
  coberturaList: any[] = [];
  versionList: any[] = [];
  corredorList: any[] = [];
  planList: any[] = [];
  CountryList: any[] = [];
  StateList: any[] = [];
  CityList:  any[] = [];
  colorList:any[] = [];
  metodologiaList:any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  status: boolean = true;
  cuotas: boolean = false;
  grua: boolean = false;
  accessoryList: any[] = [];
  descuento: boolean = false;
  cobertura: boolean = false;
  ccontratoflota: number;
  ctipopago : number;
  xreferencia: string;
  mprima_pagada: number;
  fcobro: Date;
  ccarga: number;
  xanexo: string;
  xobservaciones: string;
  xtituloreporte: string;
  xnombrerepresentantelegal: string;
  xdocidentidadrepresentantelegal: string;
  xnombrecliente: string;
  xdocidentidadcliente: string;
  xdireccionfiscalcliente: string;
  xciudadcliente: string;
  xestadocliente: string;
  xtelefonocliente: string;
  xemailcliente: string;
  xrepresentantecliente: string;
  mprimatotal: number;
  mprimaprorratatotal: number;
  xpoliza: string;
  xrecibo: string;
  xsucursalsuscriptora: string;
  xsucursalemision: string;
  fsuscripcion: Date;
  fdesde_pol: Date;
  fhasta_pol: Date;
  fdesde_rec: Date;
  fhasta_rec: Date;
  femision: Date;
  plan: boolean = false
  ano;
  bpago: boolean = false;
  pagos: boolean = false;
  bpagarubii: boolean = false;
  bemitir: boolean = false;
  bpagomanual: boolean = false;
  paymentList: {};
  fnacimientopropietario: string
  fnacimientopropietario2: string;
  ctasa_cambio: number;
  mtasa_cambio: number;
  fingreso_tasa: Date;
  cestatusgeneral: number;

  serviceList: any[] = [];
  coverageList: any[] = [];
  realCoverageList: any[] = [];
  annexList: any[] = [];
  accesoriesList: any[] = [];
  ccorredor: number;
  xcorredor: string;
  xnombrepropietario: string;
  xapellidopropietario: string;
  xtipodocidentidadpropietario: string;
  xdocidentidadpropietario: string;
  xtelefonocelularpropietario: string;
  xdireccionpropietario: string;
  xestadopropietario: string;
  xciudadpropietario: string;
  xestadocivilpropietario: string;
  xemailpropietario: string;
  xocupacionpropietario: string;
  cmetodologiapago: number;
  xtelefonopropietario: string;
  cvehiculopropietario: number;
  ctipoplan: number;
  cplan: number;
  ctiporecibo: number;
  xmarca: string;
  xmoneda: string;
  xmodelo: string;
  xversion: string;
  xplaca: string;
  xuso: string;
  xtipovehiculo: string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  mpreciovehiculo: number;
  ctipovehiculo: number;
  xtipomodelovehiculo: string;
  ncapacidadcargavehiculo: number;
  ncapacidadpasajerosvehiculo: number;
  xplancoberturas: string;
  xplanservicios: string;
  detail_form: number;
  xnombrecorredor: any;
  xcolor: string;
  modalidad: boolean = true;
  montorcv: boolean = true;
  keyword = 'value';

  // Validation place 
  xdocidentidad : string;
  fdesde_pol_place : Date ;
  fhasta_pol_place : Date ;
  xpoliza_place : string;
  takersList: any[] = [];
  xtomador : string;
  xprofesion : string;
  xrif : string;
  xdomicilio : string;
  xzona_postal : string;

  xtelefono : string;
  xcorreo : string;
  xestado : string;
  xciudad : string;
  xtransmision: any;
  nkilometraje: any;
  xzona_postal_propietario: any;
  xclase: any;

  constructor(private formBuilder: UntypedFormBuilder, 
              private _formBuilder: FormBuilder,
              private authenticationService : AuthenticationService,
              private router: Router,
              private http: HttpClient,
              private modalService : NgbModal,
              private webService: WebServiceConnectionService) { }

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
      ccorredor:['', Validators.required],
      xcobertura: ['', Validators.required],
      ctarifa_exceso: ['', Validators.required],
      ncapacidad_p: ['', Validators.required],
      cmetodologiapago: ['', Validators.required],
      msuma_aseg:[''],
      pcasco:[''],
      mprima_casco:[''],
      mcatastrofico:[''],
      msuma_blindaje:[''],
      mprima_blindaje:[''],
      pdescuento:[''],
      mgrua:[''],
      bgrua:[false],
      ncuotas:[''],
      mprima_bruta:[''],
      pcatastrofico:[''],
      pmotin:[''],
      mmotin:[''],
      pblindaje:[''],
      tarifas:[''],
      cestado:['', Validators.required],
      cciudad:['', Validators.required],
      icedula:['', Validators.required],
      femision:['', Validators.required],
      ivigencia:[''],
      cpais:['', Validators.required],
      xpago: [''],
      ncobro:[''],
      ccodigo_ubii:[''],
      ctipopago:[''],
      xreferencia:[''],
      fcobro:[''],
      mprima_pagada:[''],
      cbanco: [''],
      xcedula: [''],
      binternacional: [''],
      ctomador: [''],
      cuso: [''],
      cclase: [''],
      ctipovehiculo: [''],
      xzona_postal:[''],
      nkilometraje: [''],
    });
  
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 119
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
  
      if(this.currentUser.data.crol == 18){
        this.bemitir = true;
      }
      else if(this.currentUser.data.crol == 17){
        this.bemitir = true;
      }else if(this.currentUser.data.crol == 3){
        this.bemitir = true;
      }else{
        this.bemitir = false;
      }
    }
  }

  async initializeDropdownDataRequest(){
    this.getPlanData();
    this.getCorredorData();
    this.getColor();
    this.getCobertura();
    this.getCountry();
    this.getLastExchangeRate();
    this.getTypeVehicle();
    this.getTakersData();
    this.VehicleData();
    this.ClaseData();
    this.getUtilityVehicle()

    let params = {
      cpais: this.currentUser.data.cpais,
    };
    this.keyword;
    let request = await this.webService.searchBrand(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.list){
        for(let i = 0; i < request.data.list.length; i++){
          this.marcaList.push({ 
            id: request.data.list[i].cmarca, 
            value: request.data.list[i].xmarca,
            control: request.data.list[i].control });
        }
        this.marcaList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
  }
  async getLastExchangeRate() {
    let params = {};
    this.http.post(`${environment.apiUrl}/api/administration/last-exchange-rate`, params).subscribe((response: any) => {
      if(response.data.status) {
        this.ctasa_cambio = response.data.tasaCambio.ctasa_cambio;
        this.mtasa_cambio = response.data.tasaCambio.mtasa_cambio;
        this.fingreso_tasa = response.data.tasaCambio.fingreso;
      }
    },);
  }
  async getCountry(){
    let params =  {
      cusuario: this.currentUser.data.cusuario
     };
    this.http.post(`${environment.apiUrl}/api/valrep/country`, params).subscribe((response: any) => {
      if(response.data.status){
        this.CountryList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.CountryList.push({ 
            id: response.data.list[i].cpais,
            value: response.data.list[i].xpais,
          });
        }
        this.CountryList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  } 
async getState(){
    let params =  {
      cpais: this.search_form.get('cpais').value 
    };
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params).subscribe((response: any) => {
      if(response.data.status){
        this.StateList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.StateList.push({ 
            id: response.data.list[i].cestado,
            value: response.data.list[i].xestado,
          });
        }
        this.StateList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  } 
async getCity(){
    let params =  {
      cpais: this.search_form.get('cpais').value,  
      cestado: this.search_form.get('cestado').value
    };
    this.http.post(`${environment.apiUrl}/api/valrep/city`, params).subscribe((response: any) => {
      if(response.data.status){
        this.CityList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.CityList.push({ 
            id: response.data.list[i].cciudad,
            value: response.data.list[i].xciudad,
          });
          this.CityList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
      }
      },);
  } 
async getModeloData(event){
  this.keyword;
  this.search_form.get('cmarca').setValue(event.control)
  let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
    let params = {
      cpais: this.currentUser.data.cpais,
      cmarca: marca.id
    };
    let request = await this.webService.searchModel(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      this.modeloList = [];
      for(let i = 0; i < request.data.list.length; i++){
         this.modeloList.push({ 
           id: request.data.list[i].cmodelo, 
           value: request.data.list[i].xmodelo,
           control: request.data.list[i].control  });
      }
      this.modeloList.sort((a, b) => a.value > b.value ? 1 : -1)
    }
  }

// async getModeloData(){
//   let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
//     let params = {
//       cpais: this.currentUser.data.cpais,
//       cmarca: marca.id
//     };
//     let request = await this.webService.searchModel(params);
//     if(request.error){
//       this.alert.message = request.message;
//       this.alert.type = 'danger';
//       this.alert.show = true;
//       this.loading = false;
//       return;
//     }
//     if(request.data.status){
//       this.modeloList = [];
//       for(let i = 0; i < request.data.list.length; i++){
//          this.modeloList.push({ 
//            id: request.data.list[i].cmodelo, 
//            value: request.data.list[i].xmodelo,
//            control: request.data.list[i].control  });
//       }
//       this.modeloList.sort((a, b) => a.value > b.value ? 1 : -1)
//     }
//   }

// async getVersionData(){
//     let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
//     let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
//     let params = {
//       cpais: 58,
//       cmarca: marca.id,
//       cmodelo: modelo.id,
//     };

//     this.http.post(`${environment.apiUrl}/api/valrep/version`, params).subscribe((response : any) => {
//       if(response.data.status){
//         this.versionList = [];
//         for(let i = 0; i < response.data.list.length; i++){
//           this.versionList.push({ 
//             id: response.data.list[i].cversion,
//             value: response.data.list[i].xversion,
//             cano: response.data.list[i].cano, 
//             control: response.data.list[i].control,
//             npasajero: response.data.list[i].npasajero
//           });
//         }
//         this.versionList.sort((a, b) => a.value > b.value ? 1 : -1)
//       }
//       },);
//   }

async getVersionData(event){
      this.keyword;
      this.search_form.get('cmodelo').setValue(event.control)
      let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
      let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
      let params = {
        cpais: 58,
        cmarca: marca.id,
        cmodelo: modelo.id,
      };
  
      this.http.post(`${environment.apiUrl}/api/valrep/version`, params).subscribe((response : any) => {
        if(response.data.status){
          this.versionList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.versionList.push({ 
              id: response.data.list[i].cversion,
              value: response.data.list[i].xversion,
              cano: response.data.list[i].cano, 
              control: response.data.list[i].control,
              npasajero: response.data.list[i].npasajero
            });
          }
          this.versionList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
        },);
    }

async getCorredorData() {
   let params={
    cpais: this.currentUser.data.cpais,
    ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/valrep/broker`, params).subscribe((response : any) => {
      if(response.data.status){
        this.corredorList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.corredorList.push({ 
            id: response.data.list[i].ccorredor,
            value: response.data.list[i].xcorredor,
          });
        }
        this.corredorList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
    }, );
  
  }
async getPlanData(){
  let params =  {
    cpais: this.currentUser.data.cpais,
    ccompania: this.currentUser.data.ccompania,
    ctipoplan: 1
 
  };

  this.http.post(`${environment.apiUrl}/api/valrep/plan`, params).subscribe((response: any) => {
    if(response.data.status){
      this.planList = [];
      for(let i = 0; i < response.data.list.length; i++){
        this.planList.push({ 
          id: response.data.list[i].cplan,
          value: response.data.list[i].xplan,
          control: response.data.list[i].control,
          binternacional: response.data.list[i].binternacional
        });
      }
      this.planList.sort((a, b) => a.id > b.id ? 1 : -1)
    }
    },);
  }
  async getTypeVehicle(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/over-limit/type-vehicle`, params).subscribe((response: any) => {
      if(response.data.status){
        this.TypeVehicleList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.TypeVehicleList.push({ 
            id: response.data.list[i].ctarifa_exceso,
            value: response.data.list[i].xgrupo,
          });
        }
      }
      },);
  }
 async getUtilityVehicle(){
  let params =  {
    cpais: this.currentUser.data.cpais,
  };

  this.http.post(`${environment.apiUrl}/api/valrep/utility`, params).subscribe((response: any) => {
    if(response.data.status){
      this.UtilityVehicle = [];
      for(let i = 0; i < response.data.list.length; i++){
        this.UtilityVehicle.push({ 
          id: response.data.list[i].cuso,
          value: response.data.list[i].xuso,
        });
      }
    }
    },);
   
 }
  async VehicleData(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/vehicle/data`, params).subscribe((response: any) => {
      if(response.data.status){
        this.TypeVehicle = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.TypeVehicle.push({ 
            id: response.data.list[i].ctipovehiculo,
            value: response.data.list[i].xtipovehiculo,
          });
        }
      }
      },);
  }
  async ClaseData(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/clase/data`, params).subscribe((response: any) => {
      if(response.data.status){
        this.ListClase = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.ListClase.push({ 
            id: response.data.list[i].cclase,
            value: response.data.list[i].xclase,
          });
        }
      }
      },);
  }
async getColor(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
  
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/color`, params).subscribe((response: any) => {
      if(response.data.status){
        this.colorList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.colorList.push({ 
            id: response.data.list[i].ccolor,
            value: response.data.list[i].xcolor,
          });
        }
        this.colorList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }
async getCobertura(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
      ccompania: this.currentUser.data.ccompania,

    };
    this.http.post(`${environment.apiUrl}/api/valrep/coverage`, params).subscribe((response: any) => {
      if(response.data.status){
        this.coberturaList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.coberturaList.push({ 
            id: response.data.list[i].ccobertura,
            value: response.data.list[i].xcobertura,
          });
        }
        this.coberturaList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }
async getmetodologia(){


    let params =  {
      cpais: this.currentUser.data.cpais,  
      ccompania: this.currentUser.data.ccompania,
      
    };
   
      this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago`, params).subscribe((response: any) => {
        if(response.data.status){
          this.metodologiaList = [];
          
          for(let i = 0; i < response.data.list.length; i++){
            this.metodologiaList.push( { 
              id: response.data.list[i].cmetodologiapago,
              value: response.data.list[i].xmetodologiapago,
            });
          }

          this.metodologiaList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
        },);

  }  
  addAccessory(){
    let accessory;
    const modalRef = this.modalService.open(FleetContractIndividualAccessorysComponent, {size: 'xl'});
    modalRef.componentInstance.accessory = accessory;
    modalRef.result.then((result: any) => { 

      if(result){
        this.accessoryList = result;
      }
    });
  }
  generateTarifa(){
    let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
    let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
    let params =  {
      ctipovehiculo: this.search_form.get('ctipovehiculo').value,  
      xmarca: marca.value,
      xmodelo: modelo.value,
      cano: this.search_form.get('cano').value,
      xcobertura: this.search_form.get('xcobertura').value,
      
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/tarifa-casco`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('pcasco').setValue(response.data.ptasa_casco);
        this.search_form.get('pcasco').disable();
        this.search_form.get('pmotin').setValue(response.data.ptarifa);
        this.search_form.get('pmotin').disable();
        for(let i = 0; i < response.data.ptarifa.length; i++){
          this.search_form.get('pcatastrofico').setValue(response.data.ptarifa[1].ptarifa)
          this.search_form.get('pcatastrofico').disable();
          this.search_form.get('pmotin').setValue(response.data.ptarifa[0].ptarifa)
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "Los parametros no coinciden con la busqueda"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  calculation(){
    let calculo = this.search_form.get('msuma_aseg').value * this.search_form.get('pcasco').value / 100;
    this.search_form.get('mprima_casco').setValue(calculo);
    this.search_form.get('mprima_bruta').setValue(calculo);

    let catastrofico = this.search_form.get('msuma_aseg').value * this.search_form.get('pcatastrofico').value / 100;
    this.search_form.get('mcatastrofico').setValue(catastrofico);

    let motin = this.search_form.get('msuma_aseg').value * this.search_form.get('pmotin').value / 100;
    this.search_form.get('mmotin').setValue(motin);

    
  }
  data(){
    let division = this.search_form.get('pdescuento').value / 100
    let multiplicacion = this.search_form.get('mprima_casco').value * division
    let calculo_descuento = this.search_form.get('mprima_casco').value - multiplicacion
    this.search_form.get('mprima_casco').setValue(calculo_descuento);
  }
  searchVersion(event){
    this.search_form.get('cversion').setValue(event.control)
    let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
    this.search_form.get('cano').setValue(version.cano);
    this.search_form.get('ncapacidad_p').setValue(version.npasajero);
  }
  OperatioValueGrua(){
    //let plan = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
    let params = {
      ctarifa_exceso: this.search_form.get('ctarifa_exceso').value,
   }
      this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-grua`, params).subscribe((response: any) => {
       if(response.data.status){
         if(this.search_form.get('bgrua').value == true){
          this.grua = true
          this.search_form.get('mgrua').setValue(response.data.mgrua);
         }else{
           this.grua = false;
         }
       }
       else
       {
         window.alert('No hay grua para este plan')
         this.grua = false
       }
  });
}

//   OperatioValuePlan(){
//     let params = {
//      cplan: this.search_form.get('cplan').value,
//      cmetodologiapago: this.search_form.get('cmetodologiapago').value,
//      ctarifa_exceso: this.search_form.get('ctarifa_exceso').value,
 
//    }
//       this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-plan`, params).subscribe((response: any) => {
//        if(response.data.status){
//          this.search_form.get('ncobro').setValue(response.data.mprima);
//        }
//   });
// }
OperatioValidationPlate(){
  const now = new Date().toLocaleDateString();
  let params =  {
    xplaca: this.search_form.get('xplaca').value,  
  };
  this.http.post(`${environment.apiUrl}/api/fleet-contract-management/validate-plate`, params).subscribe((response: any) => {
    if(response.data.status){
      if(now >response.data.fhasta_pol) {
      this.xdocidentidad = response.data.xdocidentidad;
      this.fdesde_pol_place = response.data.fdesde_pol;
      this.fhasta_pol_place = response.data.fhasta_pol;
      this.xpoliza_place = response.data.xpoliza;
      window.alert(`La placa ingresada ya se encuentra activa con el número de póliza N° ${this.xpoliza_place} del cliente poseedor de la C.I ${this.xdocidentidad} con vigencia desde ${this.fdesde_pol_place} hasta ${this.fhasta_pol_place}`);
      this.search_form.get('xplaca').setValue('');
      }
    }
  },);
}
//  functio(){
//   let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
//   this.search_form.get('binternacional').setValue(metodologiaPago.binternacional);
//   this.search_form.get('ncobro').setValue('');
//   this.search_form.get('mgrua').setValue('')

//     if (this.search_form.get('binternacional').value == 1){
//       this.plan = true;
//       let params =  {
//         cpais: this.currentUser.data.cpais,  
//         ccompania: this.currentUser.data.ccompania,
//         binternacional: this.search_form.get('binternacional').value
//       };
//         this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago-contract`, params).subscribe((response: any) =>{
//           if(response.data.status){
//             this.metodologiaList = [];
//               for(let i = 0; i < response.data.list.length; i++){
//                 this.metodologiaList.push( { 
//                   id: response.data.list[i].cmetodologiapago,
//                   value: response.data.list[i].xmetodologiapago,
//                 });
//               }
//           }
//         })
//     }  
//     else{
//       this.plan = false;
//       let params =  {
//         cpais: this.currentUser.data.cpais,  
//         ccompania: this.currentUser.data.ccompania,
//         binternacional: this.search_form.get('binternacional').value
//       };
//         this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago-contract`, params).subscribe((response: any) =>{
//           if(response.data.status){
//             this.metodologiaList = [];
//               for(let i = 0; i < response.data.list.length; i++){
//                 this.metodologiaList.push( { 
//                   id: response.data.list[i].cmetodologiapago,
//                   value: response.data.list[i].xmetodologiapago,
//                 });
//               }
//           }
//         })
    
//     }
//  }
  validatecoverages(){
    if(this.search_form.get('xcobertura').value == 'RCV'){
      this.cobertura = false;
      this.modalidad = true;
      this.montorcv = true;
      this.bemitir = false;
      if(this.currentUser.data.crol == 3,17,18){
        this.bemitir = true;
      }
    }else{
      // let params =  {
      //   cano: this.search_form.get('cano').value,  
      //   xtipo: this.search_form.get('xtipo').value,  
      //   xcobertura: this.search_form.get('xcobertura').value,
      // };
      //   this.http.post(`${environment.apiUrl}/api/fleet-contract-management/tarifa-casco/validation`, params).subscribe((response: any) =>{
      //     if(response.data.status){
      //       console.log(response.data ,this.search_form.get('cano').value )
      //        if(this.search_form.get('cano').value >= response.data.cano){
      //         this.cobertura = true
      //        } 
      //        else{
      //          this.cobertura = false
      //        }
      //     }
      //   });
        this.cobertura = true;
      this.modalidad = false;
      this.montorcv = false;
      this.bemitir = true;
    }
  }

  // resultTypePayment(){
  //   if(this.search_form.get('xpago').value == 'PASARELA'){
  //     this.bpagarubii = true;
  //   }else if(this.search_form.get('xpago').value == 'MANUAL'){
  //     this.bpagomanual = true;
  //   }
  // }
  
  addPayment(){
    let payment = {mprima: this.search_form.get('ncobro').value };
    const modalRef = this.modalService.open(AdministrationPaymentComponent);
    modalRef.componentInstance.payment = payment;
    modalRef.result.then((result: any) => { 
      if(result){

        this.paymentList = {
          edit: true,
          ctipopago: result.ctipopago,
          xreferencia: result.xreferencia,
          fcobro: result.fcobro,
          cbanco: result.cbanco,
          mprima_pagada: result.mprima_pagada,
          mprima_bs: result.mprima_bs,
          xnota: result.xnota,
          mtasa_cambio: result.mtasa_cambio,
          ftasa_cambio: result.ftasa_cambio,
          cbanco_destino: result.cbanco_destino,
          cestatusgeneral: 14
        }

        // if(this.paymentList){
        //   this.bemitir = true
        // }

        this.onSubmit(this.search_form.value)
      }
    });
  }


  operationAmount(){
    let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
    let params = {
     cplan: metodologiaPago.id,
     cmetodologiapago: this.search_form.get('cmetodologiapago').value,
     ctarifa_exceso: this.search_form.get('ctarifa_exceso').value,
     igrua: this.search_form.get('bgrua').value, 
     ncapacidad_p: this.search_form.get('ncapacidad_p').value
    }  
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-plan`, params).subscribe((response: any) => {
      if(response.data.status){
        this.search_form.get('ncobro').setValue(response.data.mprima);
      }
    });
  }

  // OperationUbii(){
  //   if (this.search_form.get('xcobertura').value == 'RCV'){
  //     if (!this.validateForm(this.search_form)) {
  //        this.bpagarubii = false
  //        this.search_form.get('cmetodologiapago').setValue('');
  //        window.alert (`Debe completar los campos de la emisión antes de realizar el pago`)
  //     } else {
  //       if (this.bpagomanual == false) {
  //         this.bpagarubii = true
  //       }
       
  //     let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
  //     let params = {
  //      cplan: metodologiaPago.id,
  //      cmetodologiapago: this.search_form.get('cmetodologiapago').value,
  //      ctarifa_exceso: this.search_form.get('ctarifa_exceso').value,
  //      igrua: this.search_form.get('bgrua').value, 
  //      ncapacidad_p: this.search_form.get('ncapacidad_p').value
  //     }  
  //       this.http.post(`${environment.apiUrl}/api/fleet-contract-management/value-plan`, params).subscribe((response: any) => {
  //       if(response.data.status){
  //         this.search_form.get('ncobro').setValue(response.data.mprima);
        
  //         // this.search_form.get('ccodigo_ubii').setValue(response.data.ccubii);
  //       }
  //       // let prima = this.search_form.get('ncobro').value.split(" ");

  //       // let prima_ds: String = String(parseFloat(prima[0]).toFixed(2));

  //       // let prima_bs: String = String( (Math.round( ( (parseFloat(prima[0]) * (this.mtasa_cambio) ) + Number.EPSILON ) * 100 ) /100).toFixed(2) );

  //       // let orden : string = "UB_" + response.data.ccubii;
       
  //       // initUbii(
  //       //   'ubiiboton',
  //       //   {
  //       //     amount_ds: prima_ds,
  //       //     amount_bs:  prima_bs,
  //       //     concept: "COMPRA",
  //       //     principal: "ds",
  //       //     clientId:"f2514eda-610b-11ed-8e56-000c29b62ba1",
  //       //     orderId: orden
  //       //   },
  //       //   this.callbackFn.bind(this),
  //       //   {
  //       //     text: 'Pagar con Ubii '
  //       //   },
        
  //       // );
  //     },);
  //   }
  //   }
  // }

  async onSubmitUbii() {
    this.search_form.disable();
      let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
      let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
      let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
      let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
      const response = await fetch(`${environment.apiUrl}/api/fleet-contract-management/create/individualContract`, {
        "method": "POST",
        "headers": {
          "CONTENT-TYPE": "Application/json",
          "X-CLIENT-CHANNEL": "BTN-API",
          "Authorization": `Bearer ${this.currentUser.data.csession}`
        },
        "body": JSON.stringify({
          icedula: this.search_form.get('icedula').value,
          xrif_cliente: this.search_form.get('xrif_cliente').value,
          xnombre: this.search_form.get('xnombre').value,
          xapellido: this.search_form.get('xapellido').value,
          xtelefono_emp: this.search_form.get('xtelefono_emp').value,
          xtelefono_prop: this.search_form.get('xtelefono_prop').value,
          email: this.search_form.get('email').value,
          cpais:this.search_form.get('cpais').value,
          cestado: this.search_form.get('cestado').value,
          cciudad: this.search_form.get('cciudad').value,
          xdireccionfiscal: this.search_form.get('xdireccionfiscal').value,
          xplaca: this.search_form.get('xplaca').value,
          cmarca: marca.id,
          cmodelo: modelo.id,
          cversion: version.id,
          cano: this.search_form.get('cano').value,
          ncapacidad_p: this.search_form.get('ncapacidad_p').value,
          xcolor:this.search_form.get('xcolor').value,    
          xserialcarroceria: this.search_form.get('xserialcarroceria').value,
          xserialmotor: this.search_form.get('xserialmotor').value,  
          xcobertura: this.search_form.get('xcobertura').value,
          msuma_aseg: this.search_form.get('msuma_aseg').value,
          pcasco: this.search_form.get('pcasco').value,
          mprima_casco: this.search_form.get('mprima_casco').value,
          mcatastrofico: this.search_form.get('mcatastrofico').value,
          msuma_blindaje: this.search_form.get('msuma_blindaje').value,
          mprima_blindaje: this.search_form.get('mprima_blindaje').value,
          mprima_bruta: this.search_form.get('mprima_bruta').value,
          pcatastrofico: this.search_form.get('pcatastrofico').value,
          pmotin: this.search_form.get('pmotin').value,
          mmotin: this.search_form.get('mmotin').value,
          pblindaje: this.search_form.get('pblindaje').value,
          cplan: metodologiaPago.id,
          cmetodologiapago: this.search_form.get('cmetodologiapago').value,
          femision: this.search_form.get('femision').value,
          ncobro: this.search_form.get('ncobro').value,
          mgrua: this.search_form.get('mgrua').value,
          ccodigo_ubii: this.search_form.get('ccodigo_ubii').value,
          ccorredor:  this.search_form.get('ccorredor').value,
          xcedula: this.search_form.get('xrif_cliente').value,
          ctipopago: this.ctipopago,
          xreferencia: this.xreferencia,
          fcobro: this.fcobro,
          mprima_pagada: this.mprima_pagada,
          xpago: this.search_form.get('xpago').value,
          ctarifa_exceso: this.search_form.get('ctarifa_exceso').value,
          ctomador: this.search_form.get('ctomador').value,
          xzona_postal: this.search_form.get('xzona_postal').value,
          cuso: this.search_form.get('cuso').value,
          ctipovehiculo: this.search_form.get('ctipovehiculo').value,
          nkilometraje: this.search_form.get('nkilometraje').value,
          cclase: this.search_form.get('cclase').value,
          cusuario: this.currentUser.data.cusuario,
          payment: this.paymentList,
          accessory: this.accessoryList
        }) 
      });
      let res = await response.json();
      if (res.data.status) {
        this.ccontratoflota = res.data.ccontratoflota;
        this.fdesde_pol = res.data.fdesde_pol;
        this.fhasta_pol = res.data.fhasta_pol;
        this.fdesde_rec = res.data.fdesde_rec;
        this.fhasta_rec = res.data.fhasta_rec;
        this.xrecibo = res.data.xrecibo;
        this.fsuscripcion = res.data.fsuscripcion;
        this.femision = res.data.femision;
      }
  }

  async callbackFn(answer) {

    if(answer.data.R == 0){
      await this.onSubmitUbii();
      let ctipopago;
      if(answer.data.method == "ZELLE"){
        ctipopago = 4;
      }
      if(answer.data.method == "P2C") {
        ctipopago = 3;
      }
      let datetimeformat = answer.data.date.split(' ');
      let dateformat = datetimeformat[0].split('/');
      let fcobro = dateformat[2] + '-' + dateformat[1] + '-' + dateformat[0] + ' ' + datetimeformat[1];
      const response = await fetch(`${environment.apiUrl}/api/fleet-contract-management/ubii/update`, {
        "method": "POST",
        "headers": {
          "CONTENT-TYPE": "Application/json",
          "Authorization": `Bearer ${this.currentUser.data.csession}`
        },
        "body": JSON.stringify({
          paymentData: {
            ccontratoflota: this.ccontratoflota,
            orderId: answer.data.orderID,
            ctipopago: ctipopago,
            xreferencia: answer.data.ref,
            fcobro: fcobro,
            mprima_pagada: answer.data.m
          }
        }) });
        // this.getFleetContractDetail(this.ccontratoflota);
    }
    if (answer.data.R == 1) {
      window.alert(`No se pudo procesar el pago. Motivo: ${answer.data.M}, intente nuevamente`);
    }
  }

  validateForm(form) {
    if (form.invalid){
      return false;
    }
    return true;
  }

  years(){
  const now = new Date();
  const currentYear = now.getFullYear();
    
  if(this.search_form.get('cano').value < 2007){
    // this.search_form.get('cano').setValue(2007);
   }
   if(this.search_form.get('cano').value > currentYear + 1){
     this.search_form.get('cano').setValue(currentYear);
   }

 }

 Validation(){
  let params =  {
    xdocidentidad: this.search_form.get('xrif_cliente').value,
    
  };
  this.http.post(`${environment.apiUrl}/api/fleet-contract-management/validationexistingcustomer`, params).subscribe((response: any) => {
    if(response.data.status){
      this.search_form.get('xnombre').setValue(response.data.xnombre);
      this.search_form.get('xapellido').setValue(response.data.xapellido);
      this.search_form.get('xtelefono_emp').setValue(response.data.xtelefonocasa);
      this.search_form.get('xtelefono_prop').setValue(response.data.xtelefonocelular);
      this.search_form.get('email').setValue(response.data.xemail);
      this.search_form.get('ccorredor').setValue(response.data.ccorredor);
      this.search_form.get('xdireccionfiscal').setValue(response.data.xdireccion);
      this.CountryList.push({ id: response.data.cpais, value: response.data.xpais});
      this.StateList.push({ id: response.data.cestado, value: response.data.xestado});
      this.CityList.push({ id: response.data.cciudad, value: response.data.xciudad});
      this.search_form.get('cpais').setValue(response.data.cpais);
      this.search_form.get('cestado').setValue(response.data.cestado);
      this.search_form.get('cciudad').setValue(response.data.cciudad);

    } 
  },);
}

getPaymentMethodology(cmetodologiapago) {
  let xmetodologiapago = this.metodologiaList.find(element => element.id === parseInt(cmetodologiapago));
  return xmetodologiapago.value
}

getTakersData(){
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  let options = { headers: headers };
  let params;
  this.keyword;
  this.http.post(`${environment.apiUrl}/api/valrep/takers`, params, options).subscribe((response: any) => {
    if(response.data.list){
      this.takersList = [];
      for(let i = 0; i < response.data.list.length; i++){
        this.takersList.push({ 
          id: response.data.list[i].ctomador,
          value: response.data.list[i].xtomador,
        });
        this.takersList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
    }
  },
  (err) => {
    let code = err.error.data.code;
    let message;
    if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
    else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
    else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
    this.alert.message = message;
    this.alert.type = 'danger';
    this.alert.show = true;
  });
}

selectedTaker(event){
  this.search_form.get('ctomador').setValue(event.id)
}

onSubmit(form){
  this.clear = false;
  this.submitted = true;

  this.submitted = true;
  this.loading = true;
  this.search_form.disable();
  let marca = this.marcaList.find(element => element.control === parseInt(this.search_form.get('cmarca').value));
  let modelo = this.modeloList.find(element => element.control === parseInt(this.search_form.get('cmodelo').value));
  let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
  let metodologiaPago = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
  let params = {
      icedula: this.search_form.get('icedula').value,
      xrif_cliente: form.xrif_cliente,
      xnombre: form.xnombre,
      xapellido: form.xapellido,
      xtelefono_emp: form.xtelefono_emp,
      xtelefono_prop: form.xtelefono_prop,
      email: form.email,
      cpais:this.search_form.get('cpais').value,
      cestado: this.search_form.get('cestado').value,
      cciudad: this.search_form.get('cciudad').value,
      xdireccionfiscal: form.xdireccionfiscal,
      xplaca: form.xplaca,
      cmarca: marca.id,
      cmodelo: modelo.id,
      cversion: version.id,
      cano:form.cano,
      ncapacidad_p: form.ncapacidad_p,
      xcolor:this.search_form.get('xcolor').value,    
      xserialcarroceria: form.xserialcarroceria,
      xserialmotor: form.xserialmotor,  
      xcobertura: this.search_form.get('xcobertura').value,
      msuma_aseg: form.msuma_aseg,
      pcasco: this.search_form.get('pcasco').value,
      mprima_casco: form.mprima_casco,
      mcatastrofico: form.mcatastrofico,
      msuma_blindaje: form.msuma_blindaje,
      mprima_blindaje: form.mprima_blindaje,
      mprima_bruta: form.mprima_bruta,
      pcatastrofico: form.pcatastrofico,
      pmotin: form.pmotin,
      mmotin: form.mmotin,
      pblindaje: form.pblindaje,
      cplan: metodologiaPago.id,
      cmetodologiapago: this.search_form.get('cmetodologiapago').value,
      femision: form.femision,
      ncobro: form.ncobro,
      mgrua: form.mgrua,
      cuso: form.cuso,
      cclase: form.cclase,
      ctipovehiculo: form.ctipovehiculo,
      xzona_postal: form.xzona_postal,
      nkilometraje: form.nkilometraje,
      ccodigo_ubii:form.ccodigo_ubii,
      ccorredor:  this.search_form.get('ccorredor').value,
      xcedula: form.xrif_cliente,
      ctipopago: this.ctipopago,
      xreferencia: this.xreferencia,
      fcobro: this.fcobro,
      mprima_pagada: this.mprima_pagada,
      xpago: this.search_form.get('xpago').value,
      ctarifa_exceso: this.search_form.get('ctarifa_exceso').value,
      ctomador: this.search_form.get('ctomador').value,
      cusuario: this.currentUser.data.cusuario,
      accessory: this.accessoryList
    };
    this.http.post( `${environment.apiUrl}/api/fleet-contract-management/create/quote`,params).subscribe((response : any) => {
      if (response.data.status) {
        // if(this.currentUser.data.crol == 18||this.currentUser.data.crol == 17||this.currentUser.data.crol == 3  || this.bpagomanual || this.search_form.get('xcobertura').value != 'RCV'){
        //   // this.getFleetContractDetail(this.ccontratoflota);
        // }
        window.alert(`Se ha generado una cotización por el beneficiario ${response.data.xnombre + ' ' + response.data.xapellido}`)
        this.router.navigate([`/fleet-contract-management/fleet-contract-management-index`]);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    })
  this.loading = false;
}

// async getFleetContractDetail(ccontratoflota) {
//   let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//   let options = { headers: headers };
//   let params =  {
//     cpais: this.currentUser.data.cpais,  
//     ccompania: this.currentUser.data.ccompania,
//     ccontratoflota: ccontratoflota
//   };
//   await this.http.post(`${environment.apiUrl}/api/fleet-contract-management/detail`, params, options).subscribe( async (response: any) => {
//     if(response.data.status){
//       console.log(response.data.xclase)
//       this.ccarga = response.data.ccarga;
//       this.xpoliza = response.data.xpoliza;
//       this.xtituloreporte = response.data.xtituloreporte;
//       this.xanexo = response.data.xanexo;
//       this.xobservaciones = response.data.xobservaciones;
//       this.xnombrerepresentantelegal = response.data.xnombrerepresentantelegal;
//       this.xdocidentidadrepresentantelegal = response.data.xdocidentidadrepresentantelegal;
//       this.xnombrecliente = response.data.xnombrecliente;
//       this.xdocidentidadcliente = response.data.xdocidentidadcliente;
//       this.xdireccionfiscalcliente = response.data.xdireccionfiscalcliente;
//       this.xciudadcliente = response.data.xciudadcliente;
//       this.xestadocliente = response.data.xestadocliente;
//       if (response.data.xtelefonocliente) {
//         this.xtelefonocliente = response.data.xtelefonocliente;
//       } else {
//         this.xtelefonocliente = ' ';
//       }
//       if (response.data.xemailcliente) {
//         this.xemailcliente = response.data.xemailcliente;
//       } else {
//         this.xemailcliente = ' ';
//       }
//       if (response.data.xrepresentantecliente) {
//         this.xrepresentantecliente = response.data.xrepresentantecliente;
//       } else {
//         this.xrepresentantecliente = ' ';
//       }
//       this.xsucursalemision = response.data.xsucursalemision;
//       this.xsucursalsuscriptora = response.data.xsucursalsuscriptora;
//       this.ccorredor = response.data.ccorredor;
//       this.xnombrecorredor = response.data.xcorredor;
//       this.xnombrepropietario = response.data.xnombrepropietario;
//       this.xapellidopropietario = response.data.xapellidopropietario;
//       this.xtipodocidentidadpropietario = response.data.xtipodocidentidadpropietario ;
//       this.xdocidentidadpropietario = response.data.xdocidentidadpropietario ;
//       this.xdireccionpropietario = response.data.xdireccionpropietario ;
//       this.xtelefonocelularpropietario = response.data.xtelefonocelularpropietario;
//       this.xestadopropietario = response.data.xestadopropietario;
//       this.xciudadpropietario = response.data.xciudadpropietario;
//       this.xocupacionpropietario = response.data.xocupacionpropietario;
//       this.xestadocivilpropietario = response.data.xestadocivilpropietario;
//       this.xemailpropietario = response.data.xemailpropietario;
//       this.xtelefonopropietario = response.data.xtelefonopropietario;
//       this.cvehiculopropietario = response.data.cvehiculopropietario;
//       this.ctipoplan = response.data.ctipoplan;
//       this.cplan = response.data.cplan;
//       this.cmetodologiapago = response.data.cmetodologiapago;
//       this.ctiporecibo = response.data.ctiporecibo;
//       this.xmarca = response.data.xmarca;
//       this.xmoneda = response.data.xmoneda;
//       this.xmodelo = response.data.xmodelo;
//       this.xversion = response.data.xversion;
//       this.xplaca = response.data.xplaca;
//       this.xuso = response.data.xuso;
//       this.xtipovehiculo = response.data.xtipovehiculo;
//       this.nkilometraje = response.data.nkilometraje;
//       this.xclase = response.data.xclase;
//       this.xtransmision = response.data.xtransmision;
//       this.fano = response.data.fano;
//       this.xserialcarroceria = response.data.xserialcarroceria;
//       this.xserialmotor = response.data.xserialmotor;
//       this.xcolor = response.data.xcolor;
//       this.mpreciovehiculo = response.data.mpreciovehiculo;
//       this.ctipovehiculo = response.data.ctipovehiculo;
//       this.xtipomodelovehiculo = response.data.xtipomodelovehiculo;
//       this.ncapacidadcargavehiculo = response.data.ncapacidadcargavehiculo;
//       this.ncapacidadpasajerosvehiculo = response.data.ncapacidadpasajerosvehiculo;
//       this.xplancoberturas = response.data.xplancoberturas;
//       this.xplanservicios = response.data.xplanservicios;
//       this.mprimatotal = response.data.mprimatotal;
//       this.mprimaprorratatotal = response.data.mprimaprorratatotal;
//       this.xzona_postal_propietario = response.data.xzona_postal_propietario;
//       this.cestatusgeneral = response.data.cestatusgeneral;
//       if(response.data.xtomador){
//         this.xtomador = response.data.xtomador;
//       }else{
//         this.xtomador = this.xnombrecliente;
//       }
      
//       if(response.data.xprofesion){
//         this.xprofesion = response.data.xprofesion;
//       }else{
//         this.xprofesion = ' ';
//       }

//       if(response.data.xrif){
//         this.xrif = response.data.xrif;
//       }else{
//         this.xrif = this.xdocidentidadcliente;
//       }

//       if(response.data.xdomicilio){
//         this.xdomicilio = response.data.xdomicilio;
//       }else{
//         this.xdomicilio = this.xdireccionfiscalcliente;
//       }

//       if(response.data.xzona_postal){
//         this.xzona_postal = response.data.xzona_postal;
//       }else{
//         this.xzona_postal = ' ';
//       }

//       if(response.data.xtelefono){
//         this.xtelefono = response.data.xtelefono;
//       }else{
//         this.xtelefono = this.xtelefonocliente;
//       }

//       if(response.data.xcorreo){
//         this.xcorreo = response.data.xcorreo;
//       }else{
//         this.xcorreo = this.xemailcliente;
//       }

//       if(response.data.xestado){
//         this.xestado = response.data.xestado;
//       }else{
//         this.xestado = this.xestadocliente;
//       }
      
//       if(response.data.xciudad){
//         this.xciudad = response.data.xciudad;
//       }else{
//         this.xciudad = this.xciudadcliente;
//       }
      
//       if(response.data.fnacimientopropietario){
//         let dateFormat = new Date(response.data.fnacimientopropietario);
//         let dd = dateFormat.getDay();
//         let mm = dateFormat.getMonth();
//         let yyyy = dateFormat.getFullYear();
//         this.fnacimientopropietario = dd + '-' + mm + '-' + yyyy;
//       } else {
//         this.fnacimientopropietario = ''
//       }
//       this.serviceList = response.data.services;
//       this.coverageList = response.data.realCoverages;
//       await window.alert(`Se ha generado exitósamente la póliza n° ${this.xpoliza} del cliente ${this.xnombrecliente} para el vehículo de placa ${this.xplaca}`);
//       try {this.createPDF()}
//       catch(err) {console.log(err.message)};
//     }
//   },
//   (err) => {
//     let code = err.error.data.code;
//     let message;
//     if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
//     else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.FLEETCONTRACTNOTFOUND"; }
//     else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
//     this.alert.message = message;
//     this.alert.type = 'danger';
//     this.alert.show = true;
//   });
// }

// onClearForm() {
//   this.search_form.reset();
//   this.search_form.enable();
//   this.clear = true;
//   if (this.ccontratoflota) {
//     location.reload()
//   }
// }

// changeDateFormat(date) {
//   if (date) {
//     let dateArray = date.substring(0,10).split("-");
//     return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
//   }
//   else {
//     return ' ';
//   }
// }

// buildAccesoriesBody() {
//   let body = [];
//   if (this.accesoriesList.length > 0){
//     this.accesoriesList.forEach(function(row) {
//       let dataRow = [];
//       dataRow.push({text: row.xaccesorio, alignment: 'center', border: [true, false, true, false]});
//       dataRow.push({text: row.msuma_accesorio, alignment: 'center', border: [false, false, true, false]})
//       dataRow.push({text: row.mprima_accesorio, alignment: 'center', border: [false, false, true, false]})
//       body.push(dataRow);
//     })
//   } else {
//     let dataRow = [];
//     dataRow.push({text: ' ', border: [true, false, true, false]}, {text: ' ', border: [false, false, true, false]}, {text: ' ', border: [false, false, true, false]});
//     body.push(dataRow);
//   }
//   return body;
// }

// buildAnnexesBody() {
//   let body = []
//   if (this.annexList.length > 0) {
//     this.annexList.forEach(function(row) {
//       let dataRow = [];
//       dataRow.push({text: row.xanexo, border: [true, false, true, false]});
//       body.push(dataRow);
//     })
//   } else {
//     let dataRow = []
//       dataRow.push({text: ' ', border: [true, false, true, false]});
//       body.push(dataRow);
//   }
//   return body;
// }

// buildCoverageBody2() {
//   let body = [];
//   if (this.coverageList.length > 0){
//     this.coverageList.forEach(function(row) {
//       if (row.ititulo == 'C') {
//         let dataRow = [];
//         dataRow.push({text: row.xcobertura, margin: [10, 0, 0, 0], border: [true, false, false, true]});
//         //Se utiliza el formato DE (alemania) ya que es el que coloca '.' para representar miles, y ',' para los decimales fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
//         dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.msumaasegurada)}`, alignment: 'right', border:[true, false, false, true]});
//         if (row.mtasa) {
//           dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mtasa)}`, alignment: 'right', border:[true, false, false, true]});
//         } else {
//           dataRow.push({text: ` `, alignment: 'right', border: [true, false, true, true]});
//         }
//         if (row.pdescuento) {
//           dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pdescuento)} %`, alignment: 'right', border:[true, false, false, true]});
//         } else {
//           dataRow.push({text: ` `, alignment: 'right', border: [true, false, true, true]});
//         }
//         if(row.mprima){
//           dataRow.push({text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprima)}`, fillColor: '#f2f2f2', alignment: 'right', border:[true, false, true, true]});
//         } else {
//           dataRow.push({text: ` `,fillColor: '#f2f2f2', alignment: 'right', border: [true, false, true, true]});
//         }
//         body.push(dataRow);
//       }
//       if (row.ititulo == 'T') {
//         let dataRow = [];
//         dataRow.push({text: row.xcobertura, decoration: 'underline', margin: [2, 0, 0, 0], border: [true, false, false, true]});
//         dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
//         dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
//         dataRow.push({text: ` `, fillColor: '#d9d9d9', border:[true, false, false, true]});
//         dataRow.push({text: ` `, fillColor: '#f2f2f2', border:[true, false, true, true]});
//         body.push(dataRow);
//       }
//     });
//   }
//   return body;
// }

// selectWatermark() {
//   let watermarkBody = {}
//   if (this.cestatusgeneral == 13) {
//     watermarkBody = {text: 'PENDIENTE DE PAGO', color: 'red', opacity: 0.3, bold: true, italics: false, fontSize: 50, angle: 70}
//     return watermarkBody;
//   }
//   if (this.cestatusgeneral == 7) {
//     watermarkBody = {text: 'COBRADO', color: 'green', opacity: 0.3, bold: true, italics: false, fontSize: 50, angle: 70}
//     return watermarkBody;
//   }
//   if (this.cestatusgeneral == 3) {
//     watermarkBody = {text: 'PÓLIZA ANULADA', color: 'red', opacity: 0.3, bold: true, italics: false, fontSize: 50, angle: 70}
//     return watermarkBody;
//   }

// }

// createPDF(){
//   try{
//   const pdfDefinition: any = {
//     watermark: this.selectWatermark(),
//     info: {
//       title: `Póliza - ${this.xnombrecliente}`,
//       subject: `Póliza - ${this.xnombrecliente}`
//     },
//     footer: function(currentPage, pageCount) { 
//       return {
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', border: [false, false, false, false]}]
//           ]
//         }
//       }
//     },
//     content: [
//       {
//         style: 'data',
//         table: {
//           widths: [165, 216, 35, '*'],
//           body: [
//             [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAABLCAYAAAAlOdEdAAAACXBIWXMAAAsTAAALEwEAmpwYAABDLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMTEgNzkuMTU4MzI1LCAyMDE1LzA5LzEwLTAxOjEwOjIwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIzLTAxLTExVDE1OjMzOjMyLTA0OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjdiZDRiZjQxLTE4MTAtZTM0Yy04M2I0LTk5ZTVkNmEyZDRlNjwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMzYzc4Y2M5LTkxZTctMTFlZC1hYzIyLWNlNDc5NDRmMDkwOTwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmUwY2Q5YWFlLTg4MmUtZTY0OS05OTk3LTAzN2JhZWJjNDEwMzwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6MzM6MzItMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NWU4Y2JhNTctZTNkMy1hZTQxLTk4MjAtYjJhOTk0NmYzMmFhPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIzLTAxLTExVDE1OjM1OjI4LTA0OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5kZXJpdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3YmQ0YmY0MS0xODEwLWUzNGMtODNiNC05OWU1ZDZhMmQ0ZTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJOYW1lPmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllck5hbWU+Si0wMDA4NDY0NC04PC9waG90b3Nob3A6TGF5ZXJOYW1lPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyVGV4dD5KLTAwMDg0NjQ0LTg8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMDE8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NzU8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA'
//             + 'gICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg'
//             + 'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmE3qp0AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANA1JREFUeNrsnXeYFFX297+3quN0Tw5MIA05gwIiUUVBUMyYQRQFA4uJ9SfqqqvrvsY1rVkMCChiZDGACQURFEQlhxnSMEzO3dPdVTe8f9St6ZqhhySGwTrPU09VV7gV76e+59xTt4kQ4iTYZptttrUQU+xLYJttttnQss0222yzoWWbbbbZZkPLNttss6Flm2222WZDyzbbbLMNAOA4Fk9KCAFBKUQkAhGqBy0r8vH6Gi8RugMORRC3W1MT0+rUxHQKpxvE6QZRVPtpsM02G1q/L6h4fQj1+Tviar7+uk9ky8bOvLwwm1QV5jiculuNV7qqfgLFp0DxKiAu8oviT6hW09rsVVNy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'
//             + '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'
//             + 'YHVXGAc7Puw+pmW++FT74AWnSXy+Ro/SmobbbZZputtGz7az+cnc4ZD+BKAA/RvIXfHmB5AMAzAMx1MgHMhJG9/jOirX8A0Nw25nzE2MYs80m57CE5bxiASdLlehfA6022GQPgb3L+u7HKonkLH2rm3GfK8gHgdZq38F37iTDMzvGxraUCbZgFMn4JB7/8bQILAPpZ1mtum06W+eY245vs8kpL+dbtsyzQG9ZkmwuaOfymZcWCsbWsKx2dzuln33UbWra1bOsrx/+QSsYvK3qmRWGNA1AEYOhBtjGB8DqAm+V0J8u+hsUA0hi5/TMW5dW3CZiyYhx3rLKamrnvmy3qrZN9y2330LaWbVnSxftZjk23K9Pi4gHGx8nDJGCa26Y4Rvl1TVzKny1wMyESALBY/h7XxP0bE2Ob5so60L5NC9i33FZatrVss7pXxc3MP9Ay6/zFEiRXwog1FQF4zwKZTKmoYtkDAD5CtDtlU2UVW4CGQyzLtPdgfC70pCzrZ5q3cLF9y22lZVtLelAbB6aPdlDa3wRoWRYldbqET6CZ7UzF1M8EjDzOh2KsG7OsGOf2rUUxAkArR6dzMmnewmL7SbChZdufC0yZAGYB+JTmLXy2GVUUy13KPIAblXkI24yRkHpIQucJGK2CJsDGIxqYHwYj0G/azfL4ZjVx+WY2UV4xy5LAamrm+pfI43oARlD/WfspsaFl25/IaN7CYkencwIAOstZnSzLHmoCuGkSEv0s6xVbANdPqpaO0t0LyHGsbWL9IUb8QQ43D9FY2a8976bn9vIRHI8NLdts+4PsZ6lAPpK/i2jewrwY6/0CYCyisaSAdKsCEij9YMSarO7kgbYZ20QdfSuHcRb3br6c95AFeg80OfbXEW3xM1XZ6/IY3m1aVjN5WiukGpvfBJK2wQ7E2/bns9ctFTQPwMPNqJNvLXAwE0VN9+8hSxk/W9ZrbhvrfHObgwXL8+R+AjHK/rXK63VEk14B4F07uTRq9mc8ttlmm620bLPNNttsaNlmm2222dCyzTbbbGjZZptttv2G9v8HAFqcTtSyHgmwAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
//             {text: `\n\n${this.xtituloreporte}`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [130, 80, 30, 55, 30, 55, '*'],
//           body: [
//             [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [70, 51, 80, 80, 80, '*'],
//           body: [
//             [{text: 'Fecha de Suscripción:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, false, true]}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [130, 80, 50, 80, '*'],
//           body: [
//             [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.getPaymentMethodology(this.cmetodologiapago), border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [70, 51, 80, 50, 80, '*'],
//           body: [
//             [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]} ]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [40, 140, 70, 70, '*', '*'],
//           body: [
//             [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xtomador, border: [false, false, false, false]}, {text: 'Índole o Profesión:', bold: true, border: [false, false, false, false]}, {text: this.xprofesion, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xrif, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [40, 310, 24, '*'],
//           body: [
//             [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdomicilio, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestado, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [24, 130, 40, 24, 30, 50, 24, '*'],
//           body: [
//             [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudad, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: this.xzona_postal, border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefono, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xcorreo, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [80, 280, 24, '*'],
//           body: [
//             [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [24, 130, 50, 24, 50, 24, '*', '*'],
//           body: [
//             [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [44, 296, '*', '*'],
//           body: [
//             [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.xnombrepropietario} ${this.xapellidopropietario}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [40, 310, 24, '*'],
//           body: [
//             [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadopropietario, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [24, 130, 40, 24, 30, 50, 24, '*'],
//           body: [
//             [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocelularpropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [60, '*', 40, 30, 45, 30],
//           body: [
//             [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecorredor, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.ccorredor, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'DATOS DEL VEHÍCULO', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [30, 100, 30, 100, 35, '*'],
//           body: [
//             [{text: 'MARCA:', bold: true, border: [true, false, false, true]}, {text: this.xmarca, border: [false, false, false, true]}, {text: 'MODELO:', bold: true, border: [false, false, false, true]}, {text: this.xmodelo, border: [false, false, false, true]}, {text: 'VERSIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xversion, border: [false, false, true, true]} ]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [60, 30, 30, 50, 30, 50, 60, '*'],
//           body: [
//             [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, true]}, {'text': this.ncapacidadpasajerosvehiculo, border: [false, false, false, true]}, {text: 'CLASE:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: this.xclase, border: [false, false, false, true]},{text: 'PLACA:', bold: true, border: [false, false, false, true]}, {text: this.xplaca, border: [false, false, false, true]}, {text: 'TRANSMISIÓN:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [20, 45, 80, 75, 70, 70, 50, '*'],
//           body: [
//             [{text: 'USO:', bold: true, border: [true, false, false, true]}, {text: this.xuso, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'KILOMETRAJE:', bold: true, border: [false, false, false, true]},  {text: this.nkilometraje, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [20, 45, 30, 50, 50, 140, '*'],
//           body: [
//             [{text: 'TIPO:', bold: true, border: [true, false, false, false]}, {text: this.xtipovehiculo, border: [false, false, false, false]}, {text: 'AÑO:', bold: true, border: [false, false, false, false]}, {text: this.fano, border: [false, false, false, false]}, {text: 'COLOR:', bold: true, border: [false, false, false, false]}, {text: this.xcolor, border: [false, false, false, false]}, {text: ' ', border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'DESCRIPCIÓN DE LAS COBERTURAS', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [150, 100, 60, 50, '*'],
//           body: [
//             [{text: 'COBERTURAS', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'TASAS', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: '% DESC.', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [150, 100, 60, 50, '*'],
//           body: this.buildCoverageBody2()
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [150, 100, 60, 50, '*'],
//           body: [
//             [{text: 'Prima total', colSpan: 4, alignment: 'right', bold: true, border: [true, false, true, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'right', bold: true, border: [false, false, true, false]}]/*,
//             [{text: 'Prima a Prorrata:', colSpan: 4, alignment: 'right', bold: true, border: [true, true, true, false]}, {}, {}, {}, {text: ' '`${this.detail_form.get('xmoneda').value} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimaprorrata)}`, alignment: 'right', bold: true, border: [false, true, true, false]}],*/
//           ]
//         }
//       },
//       /*{
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'BENEFICIARIO PREFERENCIAL', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*', 20, '*'],
//           body: [
//             [{text: this.xnombrecliente, alignment: 'center', bold: true, border: [true, false, false, false]}, {text: 'C.I.', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadcliente, alignment: 'center', border: [false, false, true, false]}]
//           ]
//         }
//       },*/
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'DATOS DEL RECIBO', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [50, 50, 160, 100, '*'],
//           body: [
//             [{text: 'Recibo N°.:', bold: true, border: [true, false, true, true]}, {text: this.xrecibo, alignment: 'center', border: [false, false, true, true]}, {text: `Vigencia del Recibo:  Desde:  ${this.changeDateFormat(this.fdesde_rec)}  Hasta:  ${this.changeDateFormat(this.fhasta_rec)}`, colSpan: 2, border: [false, false, true, true]}, {}, {text: 'Tipo e Movimiento: EMISIÓN', bold: true, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [150, 100, 60, 50, '*'],
//           body: [
//             [{text: 'Total a Cobrar:', colSpan: 4, alignment: 'right', bold: true, border: [true, false, false, false]}, {}, {}, {}, {text: `${this.xmoneda} ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal)}`, alignment: 'center', bold: true, border: [true, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'DECLARACIÓN', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'En mi carácter de tomador de la póliza contratada con La Mundial de Seguros, C.A bajo fe de juramento certifico que el dinero utilizado para el pago de la prima, \n' +
//                     'proviene de una fuente lícita y por lo tanto, no tiene relación alguna con el dinero, capitales, bienes, haberes, valores o títulos producto de las actividades \n' +
//                     'o acciones derivadas de operaciones ilícitas previstas en las normas sobre administración de riesgos de legitimación de capitales, financiamiento al terrorismo y \n' +
//                     'financiamiento de la proliferación de armas de destrucción masiva en la actividad aseguradora. El tomador y/o asegurado declara(n) recibir en este acto las \n' +
//                     'condiciones generales y particulares de la póliza, así como las cláusulas  y anexos arriba mencionados, copia de la solicitud de seguro y demás documentos que \n' +
//                     'formen parte del contrato. El Tomador, Asegurado o Beneficiario de la Póliza, que sienta vulneración de sus derechos, y requieran presentar cualquier denuncia, \n' +
//                     'queja, reclamo o solicitud de asesoría; surgida con ocasión de este contrato de seguros; puede acudir a la Oficina de la Defensoría del Asegurado de la\n' +
//                     'Superintendencia de la Actividad Aseguradora, o comunicarlo a través de la página web: http://www.sudeaseg.gob.ve/.\n', border: [true, false, true, true]}],
//           ]
//         }
//       },
//       {
//         pageBreak: 'before',
//         style: 'data',
//         table: {
//           widths: [165, 216, 50, '*'],
//           body: [
//             [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAABLCAYAAAAlOdEdAAAACXBIWXMAAAsTAAALEwEAmpwYAABDLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMTEgNzkuMTU4MzI1LCAyMDE1LzA5LzEwLTAxOjEwOjIwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIzLTAxLTExVDE1OjMzOjMyLTA0OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjdiZDRiZjQxLTE4MTAtZTM0Yy04M2I0LTk5ZTVkNmEyZDRlNjwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMzYzc4Y2M5LTkxZTctMTFlZC1hYzIyLWNlNDc5NDRmMDkwOTwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmUwY2Q5YWFlLTg4MmUtZTY0OS05OTk3LTAzN2JhZWJjNDEwMzwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6MzM6MzItMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NWU4Y2JhNTctZTNkMy1hZTQxLTk4MjAtYjJhOTk0NmYzMmFhPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIzLTAxLTExVDE1OjM1OjI4LTA0OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5kZXJpdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3YmQ0YmY0MS0xODEwLWUzNGMtODNiNC05OWU1ZDZhMmQ0ZTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJOYW1lPmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllck5hbWU+Si0wMDA4NDY0NC04PC9waG90b3Nob3A6TGF5ZXJOYW1lPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyVGV4dD5KLTAwMDg0NjQ0LTg8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMDE8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NzU8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA'
//             + 'gICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg'
//             + 'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmE3qp0AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANA1JREFUeNrsnXeYFFX297+3quN0Tw5MIA05gwIiUUVBUMyYQRQFA4uJ9SfqqqvrvsY1rVkMCChiZDGACQURFEQlhxnSMEzO3dPdVTe8f9St6ZqhhySGwTrPU09VV7gV76e+59xTt4kQ4iTYZptttrUQU+xLYJttttnQss0222yzoWWbbbbZZkPLNttss6Flm2222WZDyzbbbLMNAOA4Fk9KCAFBKUQkAhGqBy0r8vH6Gi8RugMORRC3W1MT0+rUxHQKpxvE6QZRVPtpsM02G1q/L6h4fQj1+Tviar7+uk9ky8bOvLwwm1QV5jiculuNV7qqfgLFp0DxKiAu8oviT6hW09rsVVNy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'
//             + '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'
//             + 'YHVXGAc7Puw+pmW++FT74AWnSXy+Ro/SmobbbZZputtGz7az+cnc4ZD+BKAA/RvIXfHmB5AMAzAMx1MgHMhJG9/jOirX8A0Nw25nzE2MYs80m57CE5bxiASdLlehfA6022GQPgb3L+u7HKonkLH2rm3GfK8gHgdZq38F37iTDMzvGxraUCbZgFMn4JB7/8bQILAPpZ1mtum06W+eY245vs8kpL+dbtsyzQG9ZkmwuaOfymZcWCsbWsKx2dzuln33UbWra1bOsrx/+QSsYvK3qmRWGNA1AEYOhBtjGB8DqAm+V0J8u+hsUA0hi5/TMW5dW3CZiyYhx3rLKamrnvmy3qrZN9y2330LaWbVnSxftZjk23K9Pi4gHGx8nDJGCa26Y4Rvl1TVzKny1wMyESALBY/h7XxP0bE2Ob5so60L5NC9i33FZatrVss7pXxc3MP9Ay6/zFEiRXwog1FQF4zwKZTKmoYtkDAD5CtDtlU2UVW4CGQyzLtPdgfC70pCzrZ5q3cLF9y22lZVtLelAbB6aPdlDa3wRoWRYldbqET6CZ7UzF1M8EjDzOh2KsG7OsGOf2rUUxAkArR6dzMmnewmL7SbChZdufC0yZAGYB+JTmLXy2GVUUy13KPIAblXkI24yRkHpIQucJGK2CJsDGIxqYHwYj0G/azfL4ZjVx+WY2UV4xy5LAamrm+pfI43oARlD/WfspsaFl25/IaN7CYkencwIAOstZnSzLHmoCuGkSEv0s6xVbANdPqpaO0t0LyHGsbWL9IUb8QQ43D9FY2a8976bn9vIRHI8NLdts+4PsZ6lAPpK/i2jewrwY6/0CYCyisaSAdKsCEij9YMSarO7kgbYZ20QdfSuHcRb3br6c95AFeg80OfbXEW3xM1XZ6/IY3m1aVjN5WiukGpvfBJK2wQ7E2/bns9ctFTQPwMPNqJNvLXAwE0VN9+8hSxk/W9ZrbhvrfHObgwXL8+R+AjHK/rXK63VEk14B4F07uTRq9mc8ttlmm620bLPNNttsaNlmm2222dCyzTbbbGjZZptttv2G9v8HAFqcTtSyHgmwAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
//             {text: `\n\n${this.xtituloreporte}`, fontSize: 9.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [130, 80, 30, 55, 30, 55, '*'],
//           body: [
//             [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde_pol)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta_pol)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [70, 51, 80, 80, 80, '*'],
//           body: [
//             [{text: 'Fecha de Suscripción:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsuscripcion), alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, false, true]}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [130, 80, 50, 80, '*'],
//           body: [
//             [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.getPaymentMethodology(this.cmetodologiapago), border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [70, 51, 80, 50, 80, '*'],
//           body: [
//             [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimatotal), border: [false, false, true, true]} ]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [40, 300, '*', '*'],
//           body: [
//             [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xtomador, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:'/*, rowSpan: 2*/, bold: true, border: [false, false, false, true]}, {text: this.xrif/*, rowSpan: 2*/, border: [false, false, true, true]}]/*,
//             [{text: 'Índole o Profesión:', bold: true, border: [true, false, false, true]}, {text: this.xprofesion, border: [false, false, false, true]}, {}, {}]*/
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [40, 310, 24, '*'],
//           body: [
//             [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [24, 130, 40, 24, 30, 50, 24, '*'],
//           body: [
//             [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xemailcliente, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [80, 280, 24, '*'],
//           body: [
//             [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscalcliente, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadocliente, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [24, 134, 50, 24, 50, 24, '*', '*'],
//           body: [
//             [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadcliente, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonocliente, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [44, 296, '*', '*'],
//           body: [
//             [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.xnombrepropietario} ${this.xapellidopropietario}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [40, 310, 24, '*'],
//           body: [
//             [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadopropietario, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [24, 130, 40, 24, 30, 50, 24, '*'],
//           body: [
//             [ {text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocelularpropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [60, '*', 40, 30, 45, 30],
//           body: [
//             [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.xnombrecorredor, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.ccorredor, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'CONDICIONADOS Y ANEXOS', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: this.buildAnnexesBody()
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'ANEXOS', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: this.xanexo, border: [true, false, true, false]}]
//           ]
//         }
//       },
//       // {
//       //   style: 'data',
//       //   table: {
//       //     widths: ['*'],
//       //     body: [
//       //       [{text: 'OBSERVACIONES', alignment: 'center', fillColor: '#ababab', bold: true}]
//       //     ]
//       //   }
//       // },
//       // {
//       //   style: 'data',
//       //   table: {
//       //     widths: ['*'],
//       //     body: [
//       //       [{text: this.xobservaciones, border: [true, false, true, false]}]
//       //     ]
//       //   }
//       // },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'ACCESORIOS', alignment: 'center', fillColor: '#ababab', bold: true}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*', '*', '*'],
//           body: [
//             [{text: 'ACCESORIO', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [true, false, true, true]}, {text: 'SUMA ASEGURADA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}, {text: 'PRIMA', alignment: 'center', fillColor: '#d9d9d9', bold: true, border: [false, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*', '*', '*'],
//           body: this.buildAccesoriesBody()
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'EL TOMADOR Y/O ASEGURADO DECLARA(N) RECIBIR EN ESTE ACTO LAS CONDICIONES GENERALES Y PARTICULARES DE LA PÓLIZA, ASÍ COMO LOS ANEXOS', bold: true, alignment: 'center'}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [180, '*', 180],
//           body: [
//             [{text: 'Para constancia se firma:\nLugar y fecha', colSpan: 3, border: [true, false, true, false]}, {}, {}],
//             [{text: ' ', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABNAIgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD97t386UjcKXGKD0rnNDM8WeHI/GHhbU9HnaSOHVLSWzd0O1kEiFMg9iM5B7Guc/Z1n1BvgN4LGq3zanqSaLaR3l2ybGuZkiVHcjnDFlJI9c12bDa+6uX+Fy/YbHVtNZlM2lazexsB91FllN3Eo9hDcxDHbFV0A6mWVYYmdm2qoJJPYVxeieNNaHxFk0vWLHTbWw1SCS90VreZ3uPJiEAkW5BAVZN82QEyoUAZY5I7Ryr/ACnoe3rXl/xl8aaV4F+Mvge/1a9hsLcWWrR75MlpSwtMRooBaR2bbhFBY44BwaI66AeoI24dK4fxN8W5r7W7jw/4OtIte8QwsY7qWVmj0vRD1LXUyg/OOiwRBpWYqGESF5o6cdh4o+MUT/bPt3gnwxM2FtIZzFrmoxdCZZIz/oSvjhYmafYVJeCQtHH23hrw1p/hDQrXTNIsbPTNNs12QWtrEsUMS9eFXgUaLcCv4F0HUPDPhe0stU1q68RahGHa41C4higedmdm4SNVVVXcEUYJCqu5mbLHYzzQaQHNSAvejOce9NU4P16UFgR9KAHYpCMnPNLmigCNl2mgrgU5zgU1vlH0oAO/86KCf8+tFIBydKcTg01OBSnqKYDDz9fSua8Nxrp3xE8V28YIW5NnqTsR1d4Tbnn/AHbRPzrV8XeL9J8A6DNqmuajZ6Xp1uVElzdSiOMFiFVcnqzMQAoyWJAAJOK8k8TxeIvjV4p1aGGPUvCvh3UvD8qRoAYdX1xEdgvGN1nG3mDHP2gq/IgYcXGNwNv4iftN6P4d8VTeFtFuNP1DxNA1sly11M0Gm6Obi4FtCbq4APzvMyxpBGGleR0DCNC0yUdJ+HnkftO6LqOranda94g03w9fTm5mTy7ezSee2jEdrACUhH7l8tzI+cM7AKF4rX/AXh/S9V8F6XY6fa2fh++8PaTZ2Wm6db+XD5yavaXA2hFwoGGc56qkjHhWNe0+B/AV7ovirVtY1TVP7Vv9Qt7axjZYfJSKCDzCpK5P7x3ldnK4U4QADHNyiorQrY6TTNRh1BrgQyrIbaUwSgZ+SRQCV/DI6etWDweB9aUMT/npS5rEkbj/AAp3UUgP60tADQMn8aTnBp/Wo8YfqfegB3VfpThQKDzQA3GT/PNNK5/rQcg/0pAKAFooxkUVOgDgPTuea5H4nfGC1+Hr2+m2dnc+IfFWpJnTtDsmX7TcjODLIzfLBbrg7ppCFGNq75GSNs3xn8SdY8S+IJPDPgWG3m1SElNS1y7iMmmaDjHyEAg3F02flhQhUALSunyJLtfDT4TaX8Mba8ktjPf6xq8guNW1i9Ikv9Xm/wCekzgAYHRI0CxRJhI0RFVRpa24HO+C/gbd6l4wtfGHj68tfEXimyydMtoEK6V4aDAhvskbctMVJVrqT96wJC+UjGOt/wASXjWfxc8Lr0S5stRi3erj7NIo/JXP4V1L1xfxRkaHxn8O5x8sa+IZYZn6ALJpd+qqfrL5I+uKE7sZpeC/hlpvgXUNQubH7R5mpeWmJXBW2gj3+VbxKAAsSGWUqOSPMIyVCgdEibRTYuRnmnn7tS33EKDxXmn7T3xg1T4SeDtH/sSCzk1jxNrcGg2Ut037m1mmSV0kdcEuuYgpA5Actzt2n0uvm3/gotDNf3PwEt4N8kjfF3RpXiSQRtJEkN2zjnAIHHBIBzjvg1HcDj/ip4z/AGpvgt4auPEHibx1+zPofh+xEUU97qrX9lCsjEICXMZALMRtXk5OMmvIIf8Agp98Urf4zW/gD/hZH7MuteJnk2+TpEPiG9icCNpn/wBIgsJLddkKs7kyYRUYtgA4+Bf+CnP7efxE/bK/aSvtD8R6ZqnhjSPCerNp+meEDEVuNOnyq7pwDmS8c8ArwquFjyGLv83eHtY8TfDn4kWi6P8A29ovizR9UENqtoJLfULO+WTyljRVw6zB/l2j5snbis5VknaxSp3V2fvg3iH9t2WzhurDTf2Y9WtZ41lilg1nVCs6lQVZSbdQVbPBz/SqVh8Vf207y2mksfB/7OOtm2leCcWviK8HkyofmjY4++ARlTjHevjX/gjd/wAFedc+H3xG074P/FG81DVtC16/ay0PUZbd5r3RdQllI+yyqo3tbvKXAypMDEA4iBMf6H6H4E+JHhj4c+OvDek6JbaFqPirxFrF5aa9banbltMi1DURsu1iwC80NtLLMykjMkCIGfzC6aQakrk2seczfHL9tC31RbL/AIVP8Fbi68kz+TF4mdZWQHG4I0oON3y56Z7+sMP7R37Z01r51v8AAn4aalHgrm38XQgM4faygm4x8pDA88MpHNdLN4Z8eeN/i/4FvLW40+z+IngPwzZab4ljOpxSF4dRleG7DbSWLBbYX8RwC7WQjynmuRgfs/eEPEt58CtF0DwmusXOn6bpml6Y95pHjKJ4NNutOvpri6jleG6XdLeW8kQWSNW80zL55RRxfISRx/tPftmW3E37Mfhm7YBSWg8a2Eat0yBuuSe55I7e/FqH9qn9r0L837KOlMVODt+IOmAN2yP3p47888963pfhn8ZbN9Pjvh441ae20yWCHUtM8RwW5luhZr9luby2e5SFZElZo5EiWaGV4BKUxKUTaudJ+N2k2Vn5f9sXLR6nqqatGJ7F2vYLiO5itJrVmlBjSCZLWYKdjCKVxsZxsC5Q8v8AM4E/8FFvjD8NPGPhG0+Kn7Ok3gLQ/FniKy8OQ6qPGNrqB+0XcqxxokUCvucZeQh3RfLhkw+/y0cqP9vu81DUfhd+zDa6xaapZ6q3xe8LW9yuo+W1xJMm9ZHYxsy8ncd2eeo4IJKmMVswPsq3iWFdqKqLkthRgZJJJ+pJJPqTTxxSZJbj86UHJH0qShGG76VxPx+dofAdnPHtU2viHQ5ix/gQaraeYf8Av2XH0Nds52iuM/aCsJNT+Bni2KHmb+y55YyByropdWHuCoP1FOO4Lc7KMY4z90kUp5Peo7O6jvYhNEwaOYCRGH8StyD+RqTOWpAOFeL/ALZXw3vviBB8MptOktY7jw38QdG1iVZnVTLbR3CrOqE87hG5k4/hibNe0Csfx14C0n4keHbjStZsxeWdwrKwEjwyR7lKlo5EKyRvtYjejKwycGqjZPUDybXP2cvgV4z/AGmNN+L19p3gu++I2j2/2O21Y38bMCuFSRo9/lvPGuUSVlMiKxVSBxSr+xl8FdS/aph+Na6D4dm+Isdt9nTUkuVKGTGwXJiDeW115f7sTkGTy/lzjFcvf/8ABIj4CapFIs/hbxQyyYDBfHviFNwGcdL4ep+vHoKop/wRr/Z7iVtvhXxV5jujtK3j3XnkITGFy14fl2gLj0A9AQaBr3O+8G/8E/8A4U+C/wBqvW/jZpHhe1h8ea/D5c92kha3ilIKzXUMP3IriZNqySLgttJ4aSVpPY2jaD5mVgsfzE7ScAc18n61/wAETvgDrKTKujeMbXzRLtMfjHU3MJkQqSnmTN0J3KDkAgcY4rnLz/gg/wDBlgwtNY+Jmmq3QQa7FIUGCMBpYHbjJwSSeevAwf1/WganKfATT/h3ZfE7WPH0ei/tILdeHbjVdblGvaLamNbyWO5i2RBIwxuGWWZ4ix83dcKrODI6N418b7b4f2OuDR9Mt/jA0Ph3VWj1GHVvC27TLqyW9nuriKyt4p4WhW5uJYkeMBGUru2wvbM0H0xD/wAER/AEEQW3+JXxttmVAitFrtkGQDv/AMefJ7c5q1p3/BGnwzpFr5dr8Zf2gIQiGOPd4hsZFjHP8LWeOvPqeeeTVc39f0g2/r/gHz9pN98Dba2mjm8V/HbUZmuVggbUPDaEw20ISAWaRpEgWNlsrNo2cfu3FrI5/d3AX7m/YivtFb4NX2l6BqWua7aeHvEer2E+qanb+W+o3BvZbiWSNtzGWENOUSVmZ3EeWZ2yzeUQ/wDBKA2V55lr+0J+0RbqxzIo8QW4MnGOWW3Bzy3PuB2qJv8Aglhr1s7Na/tLftAR/Mx2P4jlEeGLE5WJ4/m5zuGCSMnPORtNB/X9aD/+Cps27x1+y/bKyr53xk0V+VyWCMW2g9umf+A0Ungf/glVNpPxW8J+JPFXxm+JXj618H6tFrVlp2uahcXsf2mE7onBuJ5RGQ4Ulo1Viu9N212BKIySJkfXKjPsKUHcaTG0fjR/FjtWZQY4qh4i0j/hIfDmoaeG2m+tZbYN/dLoy/1rQI4/SmRnaVbrzmgDn/g9qS6z8KfDN0v3ZtKtiM/9clH9K6Lv0+70rL8FeF08EeENM0aOVp49NtktlkK7S4UYBxWpjcxpvcBQeKXPzUCkxg5pAB+7RtBOf1pR0oHFADVHXmk8v/Cn0E8igBoXDZp3SjPNGaAEzhaQvQ/AprjZ09KAAcjG3n+dFC/NRQB//9k=', width: 136, height: 77, border: [false, false, true, false]}],
//             [{text: '_________________________________', bold: true, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: '_________________________________', bold: true, alignment: 'center', border: [false, false, true, false]}],
//             [{text: 'FIRMA DEL TOMADOR', alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Por La Mundial Seguros, C.A', alignment: 'center', border: [false, false, true, false]}],
//             [{text: `Nombre y Apellido: ${this.xnombrecliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `Nombre y Apellido: ${this.xnombrerepresentantelegal}`, alignment: 'center', border: [false, false, true, false]}],
//             [{text: `C.I: ${this.xdocidentidadcliente}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `C.I: ${this.xdocidentidadrepresentantelegal}`, alignment: 'center', border: [false, false, true, false]},]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'Aprobado por la Superintendencia de la Actividad Aseguradora mediante Providencia Nº FSAA-1-1-0361-2022 de fecha 5/8/2022', alignment: 'center', border: [true, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: '\nLa Mundial  de Seguros, C.A, inscrita en la Superintendencia de la Actividad Aseguradora bajo el No. 73' + 
//                     '\nDIRECCIÓN: AV. FRANCISCO DE MIRANDA, EDIFICIO CAVENDES, PISO 11, OFICINA 1101- CARACAS', alignment: 'center', border: [true, false, true, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: ' ', border: [true, false, true, true]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'En caso de SINIESTRO o SOLICITUD DE SERVICIO dar aviso a la brevedad posible al número telefónico: 0500-2797288 / 0414-4128237 Atención 24/7', alignment: 'center', bold: true, border: [true, false, true, true]}]
//           ]
//         }
//       },
//       {
//         pageBreak: 'before',
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'AFILIACIÓN AL CLUB DE MIEMBROS DE ARYSAUTOS\n', alignment: 'center', bold: true, border: [false, false, false, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: ' ', border: [false, false, false, false]}],
//             [{text: ' ', border: [false, false, false, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [100, '*'],
//           body: [
//             [{text: 'Datos del afiliado', bold: true, border: [true, true, false, true]}, {text: ' ', border: [false, true, true, true]}],
//             [{text: 'Nombres y Apellidos', border: [true, false, true, true]}, {text: this.xnombrecliente, border: [false, false, true, true]}],
//             [{text: 'Tipo y número de documento de identidad', border: [true, false, true, true]}, {text: this.xdocidentidadcliente, border: [false, false, true, true]}],
//             [{text: 'Dirección', border: [true, false, true, true]}, [{text: this.xdireccionfiscalcliente, border: [false, false, true, true]}]],
//             [{text: 'Número de Teléfono', border: [true, false, true, true]}, [{text: this.xtelefonocliente, border: [false, false, true, true]}]],
//             [{text: 'Datos del vehículo', bold: true, border: [true, false, false, true]}, {text: ' ', border: [false, false, true, true]}],
//             [{text: 'Placa', border: [true, false, true, true]}, [{text: this.xplaca, border: [false, false, true, true]}]],
//             [{text: 'Marca - Modelo - Versión', border: [true, false, true, true]}, {text: `${this.xmarca} - ${this.xmodelo} - ${this.xversion}`}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: ' ', border: [false, false, false, false]}],
//             [{text: ' ', border: [false, false, false, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: 'Con la compra de la póliza RCV, adquiere una membresía por el vehículo asegurado suscrita por ARYSAUTOS, C.A. sociedad mercantil domiciliada en Valencia,\n' + 
//                     'Estado Carabobo e inscrita en el Registro Mercantil Segundo de la circunscripción judicial del Estado Carabobo bajo el número 73 tomo 7-A, por lo que está\n' +
//                     'AFILIADO al club de miembros de en el cual tendrá acceso a los siguientes SERVICIOS con disponibilidad a nivel nacional las 24/7, los 365 días del año de\n' +
//                     'manera rápida y segura para responder a todas tus requerimientos e inquietudes.', border:[false, false, false, false]
//             }]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: '\nLOS SERVICIOS\n', bold: true, border: [false, false, false, false]}],
//             [{text: 'Los costos de los servicios serán asumidos o no por el afiliado de acuerdo al plan contratado', border: [false, false, false, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: ' ', border: [false, false, false, false]}],
//             [{text: ' ', border: [false, false, false, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: [100, '*', 100],
//           body: [
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Servicios del Club', fillColor: '#D4D3D3', bold: true}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica Ligera', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Taller', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Grúa sin cobertura', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia legal telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento correctivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Mantenimiento preventivo', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Casa de repuesto', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Mecánica general', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Centro de atención 24/7', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Red de proveedores certificados', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Acompañamiento', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia en siniestros', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Asistencia vial telefónica', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//             [{text: ' ', border: [false, false, false, false]}, {text: 'Búsqueda y ubicación de repuestos', border: [true, false, true, true]}, {text: ' ', border: [false, false, false, false]},],
//           ]
//         }
//       },
//       {
//         style: 'data',
//         table: {
//           widths: ['*'],
//           body: [
//             [{text: ' ', border: [false, false, false, false]}],
//             [{text: ' ', border: [false, false, false, false]}]
//           ]
//         }
//       },
//       {
//         style: 'data',
//         ul: [
//           'Debe llamar Venezuela al: 0500-2797288 / 0414-4128237 / 0241-8200184. Si se encuentra en Colombia al celular 3188339485\n',
//           'Dar aviso a la brevedad posible, plazo máximo de acuerdo a las condiciones de la Póliza.',
//           'Una vez contactado con la central del Call Center se le tomarán los detalles del siniestro (es importante que el mismo conductor realice la llamada) y de acuerdo\n' +
//           'al tipo de siniestro o daño se le indicaran los pasos a seguir.',
//           'Permanezca en el lugar del accidente y comuníquese inmediatamente con las autoridades de tránsito.',
//           'Si intervino una autoridad competente (Tránsito Terrestre, Guardia Nacional Bolivariana, Policía Nacional Bolivariana),es necesario que solicite las experticias y\n' + 
//           'a su vez las Actuaciones de Tránsito con el respectivo croquis, verifíquelas antes de firmarlas, ya que se requiere disponer de todos los detalles del accidente,\n' + 
//           'los datos de los vehículos y personas involucradas. Sin estos datos, no se podrá culminar la Notificación',
//           'No suministre información que puede afectarlo.'
//         ]
//       }
//     ], 
//     styles: {
//       title: {
//         fontSize: 9.5,
//         bold: true,
//         alignment: 'center'
//       },
//       header: {
//         fontSize: 7.5,
//         color: 'gray'
//       },
//       data: {
//         fontSize: 7
//       }
//     }
//   }
//   let pdf = pdfMake.createPdf(pdfDefinition);
//   pdf.download(`Póliza - ${this.xnombrecliente}`);
//   pdf.open();
//   this.search_form.disable()
// }
//   catch(err){console.log(err.message)}
// }

}
