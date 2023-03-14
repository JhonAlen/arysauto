import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-client-index',
  templateUrl: './client-index.component.html',
  styleUrls: ['./client-index.component.css']
})
export class ClientIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  documentTypeList: any[] = [];
  clientList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private webService: WebServiceConnectionService,
              private router: Router,
              private translate: TranslateService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      xcliente: [''],
      xcontrato: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 59
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
        this.initializeDropdownDataRequest();
      }
      return;
    }
  }

  async initializeDropdownDataRequest(): Promise<void>{
    let params = { cpais: this.currentUser.data.cpais };
    let request = await this.webService.valrepDocumentType(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      for(let i = 0; i < request.data.list.length; i++){
        this.documentTypeList.push({ id: request.data.list[i].ctipodocidentidad, value: request.data.list[i].xtipodocidentidad });
      }
      this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    return;
  }

  async onSubmit(form): Promise<void>{
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 59
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ctipodocidentidad: form.ctipodocidentidad ? form.ctipodocidentidad : undefined,
      xcliente: form.xcliente ? form.xcliente : undefined,
      xcontrato: form.xcontrato ? form.xcontrato : undefined,
      xdocidentidad: form.xdocidentidad ? form.xdocidentidad : undefined
    }
    let request = await this.webService.searchClient(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      this.clientList = [];
      for(let i = 0; i < request.data.list.length; i++){
        this.clientList.push({ 
          ccliente: request.data.list[i].ccliente,
          xcliente: request.data.list[i].xcliente,
          xcontrato: request.data.list[i].xcontrato,
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
        });
      }
    }
    this.loading = false;
    return;
  }

  goToDetail(){
    this.router.navigate([`clients/client-detail-v2`]);
  }

  rowClicked(event: any){
    this.router.navigate([`clients/client-detail-v2/${event.data.ccliente}`]);
  }

}
