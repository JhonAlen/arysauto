import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-bank-account-type-index',
  templateUrl: './bank-account-type-index.component.html',
  styleUrls: ['./bank-account-type-index.component.css']
})
export class BankAccountTypeIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  bankAccountTypeList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise <void> {
    this.search_form = this.formBuilder.group({
      xtipocuentabancaria: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 34
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
        cmodulo: 34
      },
      cpais: this.currentUser.data.cpais,
      xtipocuentabancaria: form.xtipocuentabancaria ? form.xtipocuentabancaria : undefined
    }
    let request = await this.webService.searchBankAccountType(params);
      if(request.error){
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
        return;
      }  
    if(request.data.status){
        this.bankAccountTypeList = [];
        for(let i = 0; i < request.data.list.length; i++){
          this.bankAccountTypeList.push({ 
            ctipocuentabancaria: request.data.list[i].ctipocuentabancaria,
            xtipocuentabancaria: request.data.list[i].xtipocuentabancaria,
            xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
          });
        }
      }
      this.loading = false;
      return;
  }

  goToDetail(){
    this.router.navigate([`tables/bank-account-type-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/bank-account-type-detail/${event.data.ctipocuentabancaria}`]);
  }

}
