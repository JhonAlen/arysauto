import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-contract-service-arys-detail',
  templateUrl: './contract-service-arys-detail.component.html',
  styleUrls: ['./contract-service-arys-detail.component.css']
})
export class ContractServiceArysDetailComponent implements OnInit {

  private serviceGridApi;
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
  bactivarservicios: boolean = false;
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
  fnacimientopropietario: string
  fnacimientopropietario2: string;
  ctasa_cambio: number;
  mtasa_cambio: number;
  fingreso_tasa: Date;
  cestatusgeneral: number;
  valueplan : any;
  serviceList: any[] = [];
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
  keyword = 'value';

  // Validation place 
  xdocidentidad : string;
  fdesde_pol_place : Date ;
  fhasta_pol_place : Date ;
  xpoliza_place : string;
  activaClave: boolean = false;

  
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
    this.getColor();
    this.getCountry();

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



  async getPlanData(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ctipoplan: 1
   
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/plan-contract`, params).subscribe((response: any) => {
      if(response.data.status){
        this.planList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.planList.push({ 
            id: response.data.list[i].cplan,
            value: response.data.list[i].xplan,
            control: response.data.list[i].control,
            binternacional: response.data.list[i].binternacional,
            mcosto: response.data.list[i].mcosto,
            xmoneda: response.data.list[i].xmoneda,
          });
          this.valueplan = response.data.list[i].mcosto 
        }
        this.planList.sort((a, b) => a.id > b.id ? 1 : -1)
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

  searchVersion(event){
    this.search_form.get('cversion').setValue(event.control)
    let version = this.versionList.find(element => element.control === parseInt(this.search_form.get('cversion').value));
    this.search_form.get('cano').setValue(version.cano);
    this.search_form.get('ncapacidad_p').setValue(version.npasajero);
  }

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
        if(this.search_form.get('email').value){
          this.activaClave = true;
        }
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

  searchService(){
    let plan = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
    let params =  {
      cplan: plan.id,
    };
    this.http.post(`${environment.apiUrl}/api/contract-arys/service-type-plan`, params).subscribe((response: any) => {
      if(response.data.list){
        this.serviceList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({
            ctiposervicio: response.data.list[i].ctiposervicio,
            xtiposervicio: response.data.list[i].xtiposervicio
          })
        }
        if(this.serviceList){
          this.bactivarservicios = true;
        }else{
          this.bactivarservicios = false;
        }

        // let mascara = plan.mcosto + ' ' + plan.xmoneda
        this.search_form.get('ncobro').setValue(plan.mcosto)
        this.search_form.get('ncobro').disable()
        this.search_form.get('xmoneda').setValue(plan.xmoneda)
        this.search_form.get('xmoneda').disable()
      } 
    },);
  }

  onServicesGridReady(event){
    this.serviceGridApi = event.api;
  }

  activePassword(){
    if(this.search_form.get('email').value){
      this.activaClave = true;
    }
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
    let plan = this.planList.find(element => element.control === parseInt(this.search_form.get('cplan').value));
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
        cplan: plan.id,
        ncapacidad_p: form.ncapacidad_p,
        xcolor:this.search_form.get('xcolor').value,    
        xserialcarroceria: form.xserialcarroceria,
        xserialmotor: form.xserialmotor,  
        xcedula: form.xrif_cliente,
        femision: form.femision,
        xzona_postal: form.xzona_postal,
        cusuario: this.currentUser.data.cusuario,
      };
      this.http.post( `${environment.apiUrl}/api/contract-arys/create`,params).subscribe((response : any) => {
        if (response.data.status) {
          // if(this.currentUser.data.crol == 18||this.currentUser.data.crol == 17||this.currentUser.data.crol == 3  || this.bpagomanual || this.search_form.get('xcobertura').value != 'RCV'){
          //   // this.getFleetContractDetail(this.ccontratoflota);
          // }
          window.alert(`Se ha generado un contrato Arys, por el beneficiario ${form.xnombre + ' ' + form.xapellido}`)
          location.reload()
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
}
