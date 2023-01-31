import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-model-index',
  templateUrl: './model-index.component.html',
  styleUrls: ['./model-index.component.css']
})
export class ModelIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  brandList: any[] = [];
  modelList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      cmarca: [''],
      xmodelo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 25
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
        if (!request.data.bindice) {
          this.router.navigate([`/permission-error`]);
        } else {
          this.initializeDropdownDataRequest();
        }
      }
      return;

    }
  }

  async initializeDropdownDataRequest() {
    let params = {
      cpais: this.currentUser.data.cpais,
      cmodulo: 25
    };
    // this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
    let request = await this.webService.modelmostrarIndex(params);
    if (request.error) {
      request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.brandList.push({ id: request.data.list[i].cmarca, value: request.data.list[i].xmarca });
      }
      this.brandList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    return;
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
        cmodulo: 25
      },
      cpais: this.currentUser.data.cpais,
      cmarca: form.cmarca ? form.cmarca : undefined,
      xmodelo: form.xmodelo ? form.xmodelo : undefined
    }
    // this.http.post(`${environment.apiUrl}/api/model/search`, params, options).subscribe((response : any) => {
    let request = await this.webService.searchModel(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      this.modelList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.modelList.push({
          cmodelo: request.data.list[i].cmodelo,
          xmodelo: request.data.list[i].xmodelo,
          xmarca: request.data.list[i].xmarca,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail() {
    this.router.navigate([`tables/model-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`tables/model-detail/${event.data.cmodelo}`]);
  }

}
