import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-inclusion-contract',
  templateUrl: './inclusion-contract.component.html',
  styleUrls: ['./inclusion-contract.component.css']
})
export class InclusionContractComponent implements OnInit {

  private serviceGridApi;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  currentUser;
  inclusion_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  brandList: any[] = [];
  modelList: any[] = [];
  versionList: any[] = [];
  planList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList:  any[] = [];
  colorList:any[] = [];
  metodologiaList:any[] = [];
  serviceList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  keyword = 'value';
  fdesde_pol;
  fhasta_pol;
  ccliente;
  xcliente;
  ccarga;
  clote;
  xplan;
  xrif_cliente;
  xdocidentidad : string;
  fdesde_pol_place : Date ;
  fhasta_pol_place : Date ;
  xpoliza_place : string;
  activaClave: boolean = false;
  bactivarservicios: boolean = false;
  vehicleTypeList: any[] = []; 
  classList: any[] = []; 

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute){ 
                if(this.router.getCurrentNavigation().extras.state){
                  this.ccarga = this.router.getCurrentNavigation().extras.state.ccarga;
                  this.ccliente = this.router.getCurrentNavigation().extras.state.ccliente;
                  this.xcliente = this.router.getCurrentNavigation().extras.state.xcliente;
                  this.fdesde_pol = this.router.getCurrentNavigation().extras.state.fdesde_pol;
                  this.fhasta_pol = this.router.getCurrentNavigation().extras.state.fhasta_pol;
                  this.clote = this.router.getCurrentNavigation().extras.state.lote;
                  this.xrif_cliente = this.router.getCurrentNavigation().extras.state.xrif_cliente;
                }else{
                  this.router.navigate([`subscription/corporative-issuance`]);
                }
              }

  ngOnInit(): void {
    this.inclusion_form = this.formBuilder.group({
      xnombre: [''],
      cano: [''],
      xcolor: [''],
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
      xrif_cliente:[''],
      email: [''],
      xtelefono_prop:[''],
      xdireccionfiscal: [''],
      xserialmotor: [''],
      xserialcarroceria: [''],
      xplaca: [''],
      cplan: [''],
      icedula:[''],
      femision:[''],
      ivigencia:[''],
      xcedula: [''],
      cuso: [''],
      xclase: [''],
      ctipovehiculo: [''],
      xzona_postal:[''],
      nkilometraje: [''],
      xmoneda: [''],
      fdesde_pol: [''],
      fhasta_pol: [''],
      ncobro:[''],
      msuma_a_casco: [''], 
      mdeducible: [''], 
      xpoliza: [''], 
      xcertificado: [''], 
      ncapacidad_p: [''],
      xtipo: [''],
      xtelefono_emp: [''],
      xcliente: ['']
    });


    if(this.fdesde_pol){
      let dateFormat = new Date(this.fdesde_pol);
      let dd = String(dateFormat.getDate()).padStart(2, '0');
      let mm = String(dateFormat.getMonth() + 1).padStart(2, '0');
      let yyyy = dateFormat.getFullYear();
      let fdesde_pol = yyyy + '-' + mm + '-' + dd;
      this.inclusion_form.get('fdesde_pol').setValue(fdesde_pol);
      this.inclusion_form.get('fdesde_pol').disable();
    }

    if(this.fhasta_pol){
      let dateFormat = new Date(this.fhasta_pol);
      let dd = String(dateFormat.getDate()).padStart(2, '0');
      let mm = String(dateFormat.getMonth() + 1).padStart(2, '0');
      let yyyy = dateFormat.getFullYear();
      this.fhasta_pol = yyyy + '-' + mm + '-' + dd;
      this.inclusion_form.get('fhasta_pol').setValue(this.fhasta_pol);
      this.inclusion_form.get('fhasta_pol').disable();
    }

    this.inclusion_form.get('xrif_cliente').setValue(this.xrif_cliente);
    this.inclusion_form.get('xrif_cliente').disable();
    this.inclusion_form.get('xcliente').setValue(this.xcliente);
    this.inclusion_form.get('xcliente').disable();
   
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
    this.getPlanData();
    this.getColor();
    this.vehicleTypeData();
    this.classData();
    // this.getCountry();

    let params = {
      cpais: this.currentUser.data.cpais,
    }
    this.http.post(`${environment.apiUrl}/api/valrep/brand`, params).subscribe((response : any) => {
      if(response.data.status){
        this.brandList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.brandList.push({ 
            id: response.data.list[i].cmarca, 
            value: response.data.list[i].xmarca,
            control: response.data.list[i].control });
        }
        this.brandList.sort((a,b) => a.value > b.value ? 1 : -1);
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

  getPlanData(){

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
        }
        this.planList.sort((a, b) => a.id > b.id ? 1 : -1)
      }
      },);
  }

  getColor(){
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

  // getCountry(){
  //   let params =  {
  //     cusuario: this.currentUser.data.cusuario
  //   };
  //    this.http.post(`${environment.apiUrl}/api/valrep/country`, params).subscribe((response: any) => {
  //     if(response.data.status){
  //       this.countryList = [];
  //       for(let i = 0; i < response.data.list.length; i++){
  //         this.countryList.push({ 
  //           id: response.data.list[i].cpais,
  //           value: response.data.list[i].xpais,
  //         });
  //       }
  //       this.countryList.sort((a, b) => a.value > b.value ? 1 : -1)
  //     }
  //     },);
  // }

  // getState(){
  //   let params =  {
  //     cpais: this.inclusion_form.get('cpais').value 
  //   };
  //   this.http.post(`${environment.apiUrl}/api/valrep/state`, params).subscribe((response: any) => {
  //     if(response.data.status){
  //       this.stateList = [];
  //       for(let i = 0; i < response.data.list.length; i++){
  //         this.stateList.push({ 
  //           id: response.data.list[i].cestado,
  //           value: response.data.list[i].xestado,
  //         });
  //       }
  //       this.stateList.sort((a, b) => a.value > b.value ? 1 : -1)
  //     }
  //     },);
  // } 

  // getCity(){
  //   let params =  {
  //     cpais: this.inclusion_form.get('cpais').value,  
  //     cestado: this.inclusion_form.get('cestado').value
  //   };
  //   this.http.post(`${environment.apiUrl}/api/valrep/city`, params).subscribe((response: any) => {
  //     if(response.data.status){
  //       this.cityList = [];
  //       for(let i = 0; i < response.data.list.length; i++){
  //         this.cityList.push({ 
  //           id: response.data.list[i].cciudad,
  //           value: response.data.list[i].xciudad,
  //         });
  //         this.cityList.sort((a, b) => a.value > b.value ? 1 : -1)
  //       }
  //     }
  //     },);
  // } 

  getModeloData(event){
    this.keyword;
    this.inclusion_form.get('cmarca').setValue(event.control)
    let marca = this.brandList.find(element => element.control === parseInt(this.inclusion_form.get('cmarca').value));   
    let params = {
      cpais: this.currentUser.data.cpais,
      cmarca: marca.id
    };
    this.http.post(`${environment.apiUrl}/api/valrep/model`, params).subscribe((response: any) => {
      if(response.data.status){
        this.modelList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.modelList.push({ 
            id: response.data.list[i].cmodelo,
            value: response.data.list[i].xmodelo,
            control: response.data.list[i].control
          });
          this.modelList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
      }
      },);
  }
  
  getVersionData(event){
    this.keyword;
    this.inclusion_form.get('cmodelo').setValue(event.control)
    let marca = this.brandList.find(element => element.control === parseInt(this.inclusion_form.get('cmarca').value));
    let modelo = this.modelList.find(element => element.control === parseInt(this.inclusion_form.get('cmodelo').value));
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
    this.inclusion_form.get('cversion').setValue(event.control)
    let version = this.versionList.find(element => element.control === parseInt(this.inclusion_form.get('cversion').value));
    this.inclusion_form.get('cano').setValue(version.cano);
    this.inclusion_form.get('ncapacidad_p').setValue(version.npasajero);
  }

  OperatioValidationPlate(){
    const now = new Date().toLocaleDateString();
    let params =  {
      xplaca: this.inclusion_form.get('xplaca').value,  
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/validate-plate`, params).subscribe((response: any) => {
      if(response.data.status){
        if(now >response.data.fhasta_pol) {
        this.xdocidentidad = response.data.xdocidentidad;
        this.fdesde_pol_place = response.data.fdesde_pol;
        this.fhasta_pol_place = response.data.fhasta_pol;
        this.xpoliza_place = response.data.xpoliza;
        window.alert(`La placa ingresada ya se encuentra activa con el número de póliza N° ${this.xpoliza_place} del cliente poseedor de la C.I ${this.xdocidentidad} con vigencia desde ${this.fdesde_pol_place} hasta ${this.fhasta_pol_place}`);
        this.inclusion_form.get('xplaca').setValue('');
        }
      }
    },);
  }

  Validation(){
    let params =  {
      xdocidentidad: this.inclusion_form.get('xrif_cliente').value,
      
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/validationexistingcustomer`, params).subscribe((response: any) => {
      if(response.data.status){
        this.inclusion_form.get('xnombre').setValue(response.data.xnombre + ' ' + response.data.xapellido);
        this.inclusion_form.get('xtelefono_emp').setValue(response.data.xtelefonocasa);
        this.inclusion_form.get('xtelefono_prop').setValue(response.data.xtelefonocelular);
        this.inclusion_form.get('email').setValue(response.data.xemail);
        if(this.inclusion_form.get('email').value){
          this.activaClave = true;
        }
        this.inclusion_form.get('xdireccionfiscal').setValue(response.data.xdireccion);
      } 
    },);
  }

  searchService(){
    let plan = this.planList.find(element => element.control === parseInt(this.inclusion_form.get('cplan').value));
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
        this.inclusion_form.get('ncobro').setValue(plan.mcosto)
        this.inclusion_form.get('ncobro').disable()
        this.inclusion_form.get('xmoneda').setValue(plan.xmoneda)
        this.inclusion_form.get('xmoneda').disable()
      } 
    },);
  }

  onServicesGridReady(event){
    this.serviceGridApi = event.api;
  }

  activePassword(){
    if(this.inclusion_form.get('email').value){
      this.activaClave = true;
    }
  }

  async vehicleTypeData(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/vehicle/data`, params).subscribe((response: any) => {
      if(response.data.status){
        this.vehicleTypeList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.vehicleTypeList.push({ 
            id: response.data.list[i].ctipovehiculo,
            value: response.data.list[i].xtipovehiculo,
          });
        }
      }
      },);
  }

  async classData(){
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
  
    this.http.post(`${environment.apiUrl}/api/valrep/clase/data`, params).subscribe((response: any) => {
      if(response.data.status){
        this.classList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.classList.push({ 
            id: response.data.list[i].cclase,
            value: response.data.list[i].xclase,
          });
        }
      }
      },);
  }

  onSubmit(form){
    this.submitted = true;
  
    this.submitted = true;
    this.loading = true;
    this.inclusion_form.disable();
    let marca = this.brandList.find(element => element.control === parseInt(this.inclusion_form.get('cmarca').value));
    let modelo = this.modelList.find(element => element.control === parseInt(this.inclusion_form.get('cmodelo').value));
    let version = this.versionList.find(element => element.control === parseInt(this.inclusion_form.get('cversion').value));
    let plan = this.planList.find(element => element.control === parseInt(this.inclusion_form.get('cplan').value));
    let params = {
        icedula: this.inclusion_form.get('icedula').value,
        xrif_cliente: this.xrif_cliente,
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        xtelefono_emp: form.xtelefono_emp,
        xtelefono_prop: form.xtelefono_prop,
        email: form.email,
        xdireccionfiscal: form.xdireccionfiscal,
        xplaca: form.xplaca,
        cmarca: marca.id,
        cmodelo: modelo.id,
        cversion: version.id,
        cano:form.cano,
        cplan: plan.id,
        ncapacidad_p: form.ncapacidad_p,
        xcolor: this.inclusion_form.get('xcolor').value,    
        xserialcarroceria: form.xserialcarroceria,
        xserialmotor: form.xserialmotor,  
        xcedula: form.xcedula,
        femision: form.femision,
        msuma_a_casco: form.msuma_a_casco,
        mdeducible: form.mdeducible,
        xpoliza: form.xpoliza,
        xcertificado: form.xcertificado,
        fdesde_pol: this.fdesde_pol,
        fhasta_pol: this.fhasta_pol,
        ccarga: this.ccarga,
        clote: this.clote,
        xtipo: form.xtipo,
        xclase: form.xclase,
        cusuario: this.currentUser.data.cusuario,
      };
      this.http.post( `${environment.apiUrl}/api/corporative-issuance-management/create-inclusion-contract`,params).subscribe((response : any) => {
        if (response.data.status) {
          window.alert(`Se ha incluido el beneficiario ${form.xnombre} con la Póliza ${form.xpoliza} al cliente ${this.xcliente}`)
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
