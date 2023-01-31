import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-city-index',
  templateUrl: './city-index.component.html',
  styleUrls: ['./city-index.component.css']
})
export class CityIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  stateList: any[] = [];
  cityList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      cestado: [''],
      xciudad: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
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
      
    }
  }

  async initializeDropdownDataRequest(){
    let params = {
      cpais: this.currentUser.data.cpais,
    };
  //  this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
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
        this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
 

  }

  async onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }

    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 11
      },
      cpais: this.currentUser.data.cpais,
      cestado: form.cestado ? form.cestado : undefined,
      xciudad: form.xciudad ? form.xciudad : undefined
    }
   // this.http.post(`${environment.apiUrl}/api/city/search`, params, options).subscribe((response : any) => {
    let request = await this.webService.searchCity(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.status){
        this.cityList = [];
        for(let i = 0; i < request.data.list.length; i++){
          this.cityList.push({ 
            cciudad: request.data.list[i].cciudad,
            xciudad: request.data.list[i].xciudad,
            xestado: request.data.list[i].xestado,
            xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading = false;
      return;
  
  }

  goToDetail(){
    this.router.navigate([`tables/city-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/city-detail/${event.data.cciudad}`]);
  }

}
