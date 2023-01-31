import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-provider-index',
  templateUrl: './provider-index.component.html',
  styleUrls: ['./provider-index.component.css']
})
export class ProviderIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  documentTypeList: any[] = [];
  providerList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private webService: WebServiceConnectionService,
    private router: Router,
    private translate: TranslateService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      xproveedor: [''],
      xrazonsocial: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 57
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
        this.initializeDropdownDataRequest();
      }
      return;

    }
  }

  async initializeDropdownDataRequest(): Promise<void> {
    let params = { cpais: this.currentUser.data.cpais };
    // this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
    let request = await this.webService.valrepDocumentType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.documentTypeList.push({ id: request.data.list[i].ctipodocidentidad, value: request.data.list[i].xtipodocidentidad });
      }
      this.documentTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    return;
  }

  async onSubmit(form): Promise<void> {
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 57
      },
      ccompania: this.currentUser.data.ccompania,
      xnombre: form.xproveedor ? form.xproveedor : undefined,
      xdocidentidad: form.xdocidentidad ? form.xdocidentidad : undefined
    }
    // this.http.post(`${environment.apiUrl}/api/v2/provider/production/search`, params, options).subscribe((response : any) => {
    let request = await this.webService.searchProvider(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      if (request.error) {
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
        return;
      }
      this.providerList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.providerList.push({
          cproveedor: request.data.list[i].cproveedor,
          xnombre: request.data.list[i].xnombre,
          xdocidentidad: request.data.list[i].xdocidentidad,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
        });
      }
    }
    this.loading = false;
    return;
  }


  goToDetail() {
    this.router.navigate([`providers/provider-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`providers/provider-detail/${event.data.cproveedor}`]);
  }

}
