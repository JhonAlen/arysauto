import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-claim-cause-index',
  templateUrl: './claim-cause-index.component.html',
  styleUrls: ['./claim-cause-index.component.css']
})
export class ClaimCauseIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  claimCauseList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      xcausasiniestro: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 73
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
        cmodulo: 73
      },
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      xcausasiniestro: form.xcausasiniestro ? form.xcausasiniestro : undefined
    }
    //this.http.post(`${environment.apiUrl}/api/claim-cause/search`, params, options).subscribe((response: any) => {
      let request = await this.webService.searchClaimCause(params); 
      if(request.error){
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
        return;
      }
      if(request.data.status){
        this.claimCauseList = [];
        for(let i = 0; i < request.data.list.length; i++){
          this.claimCauseList.push({ 
            ccausasiniestro: request.data.list[i].ccausasiniestro,
            xcausasiniestro: request.data.list[i].xcausasiniestro,
            xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
          });
        }
      }
      this.loading = false;
      return;
  }

  goToDetail(){
    this.router.navigate([`tables/claim-cause-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/claim-cause-detail/${event.data.ccausasiniestro}`]);
  }

}
