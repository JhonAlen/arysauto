import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityConnectionService } from '@services/web-service/global/security-connection.service';
import { ProviderReportConnectionService } from '@services/web-service/reports/provider/provider-report-connection.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-provider-report-index',
  templateUrl: './provider-report-index.component.html',
  styleUrls: ['./provider-report-index.component.css']
})
export class ProviderReportIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  providerReportsList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private securityConnection: SecurityConnectionService,
    private moduleConnection: ProviderReportConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      xreporte: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 93
      }
      let request = await this.securityConnection.securityVerifyModulePermission(params);
      if(request.error){
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

  async onSubmit(form) {
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    // let params = {
    //   permissionData: {
    //     cusuario: this.currentUser.data.cusuario,
    //     cmodulo: 93
    //   },
    //   ccompania: this.currentUser.data.ccompania,
    //   cpais: this.currentUser.data.cpais,
    //   xreporte: form.xreporte ? form.xreporte : undefined
    // }
    // let request = await this.moduleConnection.searchProviderReport(params);
    // if (request.error) {
    //   this.alert.message = request.message;
    //   this.alert.type = 'danger';
    //   this.alert.show = true;
    //   this.loading = false;
    //   return;
    // }
    // if (request.data.status) {
    //   this.providerReportsList = [];
    //   for (let i = 0; i < request.data.list.length; i++) {
    //     this.providerReportsList.push({
    //       creporte: request.data.list[i].creporte,
    //       xreporte: request.data.list[i].xreporte,
    //       bactivo: request.data.list[i].bactivo,
    //       xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
    //     });
    //   }
    // }
    this.loading = false;
    return;
  }

  rowClicked(event: any) {
    // this.router.navigate([`tables/associate-type-detail/${event.data.ctipoasociado}`]);
  }

}
