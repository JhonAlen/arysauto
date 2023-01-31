import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-replacement-type-index',
  templateUrl: './replacement-type-index.component.html',
  styleUrls: ['./replacement-type-index.component.css']
})
export class ReplacementTypeIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  replacementTypeList: any[] = [];


  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      xtiporepuesto: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 40
      }
      // this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
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
        cmodulo: 40
      },
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      xtiporepuesto: form.xtiporepuesto ? form.xtiporepuesto : undefined
    }
    //  this.http.post(`${environment.apiUrl}/api/replacement-type/search`, params, options).subscribe((response: any) => {
    let request = await this.webService.searchReplacemntType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      this.replacementTypeList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.replacementTypeList.push({
          ctiporepuesto: request.data.list[i].ctiporepuesto,
          xtiporepuesto: request.data.list[i].xtiporepuesto,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail() {
    this.router.navigate([`tables/replacement-type-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`tables/replacement-type-detail/${event.data.ctiporepuesto}`]);
  }

}
