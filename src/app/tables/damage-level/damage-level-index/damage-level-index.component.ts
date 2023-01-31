import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-damage-level-index',
  templateUrl: './damage-level-index.component.html',
  styleUrls: ['./damage-level-index.component.css']
})
export class DamageLevelIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  damageLevelList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

 async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      xniveldano: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 74
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if (request.error) {
        request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        return;
      }
      if (request.data.status) {
        !request.data.bindice ? this.router.navigate([`/permission-error`]) : false;
      }
      return;
    }
  }

  async onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.search_form.invalid){
      this.loading = false;
      return;
    }
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 74
      },
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      xniveldano: form.xniveldano ? form.xniveldano : undefined
    }
   // this.http.post(`${environment.apiUrl}/api/damage-level/search`, params, options).subscribe((response: any) => {
    let request = await this.webService.searchDamageLevel(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.status){
        this.damageLevelList = [];
        for(let i = 0; i < request.data.list.length; i++){
          this.damageLevelList.push({ 
            cniveldano: request.data.list[i].cniveldano,
            xniveldano: request.data.list[i].xniveldano,
            xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
          });
        }
      }
      this.loading = false;
      return;
  }

  goToDetail(){
    this.router.navigate([`tables/damage-level-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/damage-level-detail/${event.data.cniveldano}`]);
  }

}
