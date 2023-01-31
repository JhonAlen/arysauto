import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-document-type-index',
  templateUrl: './document-type-index.component.html',
  styleUrls: ['./document-type-index.component.css']
})
export class DocumentTypeIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  documentTypeList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      xtipodocidentidad: [''],
      xdescripcion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 35
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
        cmodulo: 35
      },
      cpais: this.currentUser.data.cpais,
      xtipodocidentidad: form.xtipodocidentidad ? form.xtipodocidentidad : undefined,
      xdescripcion: form.xdescripcion ? form.xdescripcion : undefined
    }
    //this.http.post(`${environment.apiUrl}/api/document-type/search`, params, options).subscribe((response: any) => {
    let request = await this.webService.searchDocumentType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      this.documentTypeList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.documentTypeList.push({
          ctipodocidentidad: request.data.list[i].ctipodocidentidad,
          xtipodocidentidad: request.data.list[i].xtipodocidentidad,
          xdescripcion: request.data.list[i].xdescripcion,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail() {
    this.router.navigate([`tables/document-type-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`tables/document-type-detail/${event.data.ctipodocidentidad}`]);
  }

}
