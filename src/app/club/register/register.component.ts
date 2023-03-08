import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
 
  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  stateList: any[] = [];
  cityList: any[] = [];
  sexList: any[] = [];


  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      cestado: ['', Validators.required],
      xestado: [''],
      cciudad: [''],
      xciudad: ['', Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      fnacimiento: ['', Validators.required],
      xcontrasena: ['', Validators.required],
      xtelefonocelular: ['', Validators.required],
      xemail: ['', Validators.required],
      csexo: ['', Validators.required],
      xsexo: [''],
      xdocidentidad: ['', Validators.required],
      xdireccion: ['', Validators.required]

//Holis prueba de guardado


    });
/*    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 11
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if(request.error){
        request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        return;
      }
        if(request.data.status){
          if(!request.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
            this.initializeDropdownDataRequest();
          }
          return;
        }
      
    }*/
    this.initializeDropdownDataRequest();
  }

  async initializeDropdownDataRequest(){
    this.getSexData();
    let params = {
      cpais: 58
    };

    let request = await this.webService.mostrarListaEstados(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.status){
        for(let i = 0; i < request.data.list.length; i++){
          this.stateList.push({ id: request.data.list[i].cestado, value: request.data.list[i].xestado });
        }
      }
  }

  async getCityData(){
    let params = {
      cestado: this.search_form.get('cestado').value
    };
    let request = await this.webService.searchCity(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.list){
      this.cityList = [];
      for(let i = 0; i < request.data.list.length; i++){
         this.cityList.push({ cciudad: request.data.list[i].cciudad, xciudad: request.data.list[i].xciudad });
      }
    }
  }

  async getSexData(){
    let params = {
      cpais: 58
    };
    let request = await this.webService.searchSex(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.list){
      this.sexList = [];
      for(let i = 0; i < request.data.list.length; i++){
         this.sexList.push({ csexo: request.data.list[i].csexo, xsexo: request.data.list[i].xsexo });
      }
    }
  }

  async onSubmit(form){
    console.log('hola')
    this.submitted = true;
    this.loading = true;
    console.log('como estas')
    let params;
    let request;
      params = {
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        csexo: this.search_form.get('csexo').value,
        fnacimiento: form.fnacimiento,
        xemail: form.xemail,
        xcontrasena: form.xcontrasena,
        cciudad: this.search_form.get('cciudad').value,
        cestado: this.search_form.get('cestado').value,
        xdireccion: form.xdireccion,
        xdocidentidad: form.xdocidentidad,
        xtelefonocelular: form.xtelefonocelular
      };
      console.log(params)
     // url = `${environment.apiUrl}/api/color/create`;
     request = await this.webService.createUserClub(params);
    
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.status){
        location.reload();
      }else{
        let condition = request.data.condition;
        if(condition == "color-name-already-exist"){
          this.alert.message = "TABLES.COLORS.NAMEALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
      return;
  }


}
