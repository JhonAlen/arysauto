import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-replacement-index',
  templateUrl: './replacement-index.component.html',
  styleUrls: ['./replacement-index.component.css']
})
export class ReplacementIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  replacementTypeList: any[] = [];
  replacementList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      ctiporepuesto: [''],
      xrepuesto: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 30
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
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 30
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    // this.http.post(`${environment.apiUrl}/api/valrep/replacement-type`, params, options).subscribe((response : any) => {
    let request = await this.webService.MostrarReplacementIndex(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.replacementTypeList.push({ id: request.data.list[i].ctiporepuesto, value: request.data.list[i].xtiporepuesto });
      }
      this.replacementTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
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
        cmodulo: 30
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ctiporepuesto: form.ctiporepuesto ? form.ctiporepuesto : undefined,
      xrepuesto: form.xrepuesto ? form.xrepuesto : undefined
    }
    //  this.http.post(`${environment.apiUrl}/api/replacement/search`, params, options).subscribe((response : any) => {
    let request = await this.webService.searchReplacement(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      this.replacementList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.replacementList.push({
          crepuesto: request.data.list[i].crepuesto,
          xrepuesto: request.data.list[i].xrepuesto,
          xtiporepuesto: request.data.list[i].xtiporepuesto,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail() {
    this.router.navigate([`tables/replacement-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`tables/replacement-detail/${event.data.crepuesto}`]);
  }

}
