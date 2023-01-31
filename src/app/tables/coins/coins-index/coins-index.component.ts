import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-coins-index',
  templateUrl: './coins-index.component.html',
  styleUrls: ['./coins-index.component.css']
})
export class CoinsIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  coinsList: any[] = [];

    constructor(private formBuilder: UntypedFormBuilder, 
                private authenticationService : AuthenticationService,
                private router: Router,
                private translate: TranslateService,
                private webService: WebServiceConnectionService) { }

async ngOnInit(): Promise<void>{
  this.search_form = this.formBuilder.group({
     xmoneda: ['']
  });
  this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
     let params = {
      cusuario: this.currentUser.data.cusuario,
      cmodulo: 94
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
      }
    }
    if(request.data.status){
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
      cmodulo: 94
    },
    cmoneda: this.currentUser.data.cmoneda,
    xmoneda: form.xcolor ? form.xmoneda : undefined
  }
 // this.http.post(`${environment.apiUrl}/api/color/search`, params, options).subscribe((response: any) => {
  let request = await this.webService.searchCoins(params);
  if(request.error){
    this.alert.message = request.message;
    this.alert.type = 'danger';
    this.alert.show = true;
    this.loading = false;
    return;
  }
    if(request.data.status){
      this.coinsList = [];
      for(let i = 0; i < request.data.list.length; i++){
        this.coinsList.push({ 
          cmoneda: request.data.list[i].cmoneda,
          xmoneda: request.data.list[i].xmoneda
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail(){
    this.router.navigate([`tables/coins-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/coins-detail/${event.data.cmoneda}`]);
  }
}
