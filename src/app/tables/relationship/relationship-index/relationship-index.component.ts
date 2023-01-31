import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-relationship-index',
  templateUrl: './relationship-index.component.html',
  styleUrls: ['./relationship-index.component.css']
})
export class RelationshipIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  relationshipList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      xparentesco: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 27
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
        cmodulo: 27
      },
      cpais: this.currentUser.data.cpais,
      xparentesco: form.xparentesco ? form.xparentesco : undefined
    }
    //  this.http.post(`${environment.apiUrl}/api/relationship/search`, params, options).subscribe((response: any) => {
    let request = await this.webService.searchRelationShip(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      this.relationshipList = [];
      for (let i = 0; i < request.data.list.length; i++) {
        this.relationshipList.push({
          cparentesco: request.data.list[i].cparentesco,
          xparentesco: request.data.list[i].xparentesco,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
        });
      }
    }
    this.loading = false;
    return;

  }

  goToDetail() {
    this.router.navigate([`tables/relationship-detail`]);
  }

  rowClicked(event: any) {
    this.router.navigate([`tables/relationship-detail/${event.data.cparentesco}`]);
  }

}
