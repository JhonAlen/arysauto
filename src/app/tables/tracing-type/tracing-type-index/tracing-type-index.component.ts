import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-tracing-type-index',
  templateUrl: './tracing-type-index.component.html',
  styleUrls: ['./tracing-type-index.component.css']
})
export class TracingTypeIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  tracingTypeList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      xtiposeguimiento: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 77
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

  async onSubmit(form) {
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 77
      },
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      xtiposeguimiento: form.xtiposeguimiento ? form.xtiposeguimiento : undefined
    }
    //  this.http.post(`${environment.apiUrl}/api/tracing-type/search`, params, options).subscribe((response: any) => {
    let request = await this.webService.searchTracingType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      console.log(request.data.list);
      this.tracingTypeList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.tracingTypeList.push({
          ctiposeguimiento: request.data.list[i].ctiposeguimiento,
          xtiposeguimiento: request.data.list[i].xtiposeguimiento,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail() {
    this.router.navigate([`tables/tracing-type-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`tables/tracing-type-detail/${event.data.ctiposeguimiento}`]);
  }

}
