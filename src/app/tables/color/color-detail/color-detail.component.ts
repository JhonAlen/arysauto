import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-color-detail',
  templateUrl: './color-detail.component.html',
  styleUrls: ['./color-detail.component.css']
})
export class ColorDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void>{
    this.detail_form = this.formBuilder.group({
      xcolor: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 13
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
          this.canCreate = request.data.bcrear;
          this.canDetail = request.data.bdetalle;
          this.canEdit = request.data.beditar;
          this.canDelete = request.data.beliminar;
          this.initializeDetailModule();
        }
        return;
    }
  }

  initializeDetailModule(){
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getColorData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
      }
    });
  }

  async getColorData(): Promise<void>{
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 13
      },
      ccolor: this.code,
      cpais: this.currentUser.data.cpais
    };
   // this.http.post(`${environment.apiUrl}/api/color/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailColor(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
      if(request.data.status){
        this.detail_form.get('xcolor').setValue(request.data.xcolor);
        this.detail_form.get('xcolor').disable();
        this.detail_form.get('bactivo').setValue(request.data.bactivo);
        this.detail_form.get('bactivo').disable();
      }
      this.loading_cancel = false;
      return;
  }

  editColor(){
    this.detail_form.get('xcolor').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getColorData();
    }else{
      this.router.navigate([`/tables/color-index`]);
    }
  }

  async onSubmit(form): Promise<void>{
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let params;
    let request;
    if(this.code){
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 13
        },
        ccolor: this.code,
        xcolor: form.xcolor,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais
      };
     // url = `${environment.apiUrl}/api/color/update`;
     request = await this.webService.updateColor(params);
    }else{
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 43
        },
        xcolor: form.xcolor,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais
      };
     // url = `${environment.apiUrl}/api/color/create`;
     request = await this.webService.createColor(params);
    }
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/tables/color-detail/${request.data.ccolor}`]);
        }
      }else{
        let condition = request.data.condition;
        if(condition == "color-name-already-exist"){
          this.alert.message = "TABLES.COLORS.NAMEALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
      return;
  }

}
