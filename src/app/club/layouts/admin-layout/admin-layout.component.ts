import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent { @ViewChild(MatSidenav)
sidenav!: MatSidenav;
groupList: any[] = [];
auth : boolean = false;
currentUser;
lang_form : UntypedFormGroup;

constructor(public translate : TranslateService, 
  private formBuilder : UntypedFormBuilder,
  private observer: BreakpointObserver,
   private router: Router,
   private http: HttpClient,
   private authenticationService : AuthenticationService,) {}

   ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      this.auth = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario
      }
    //   this.http.post(`${environment.apiUrl}/api/security/get-user-modules`, params, options).subscribe((response : any) => {
    //     if(response.data.status){
    //       let nameArray = [];
    //       for(let i = 0; i < response.data.list.length; i++){
    //         if(!nameArray.includes(response.data.list[i].xgrupo)){ nameArray.push(response.data.list[i].xgrupo); }
    //       }
    //       for(let i = 0; i < nameArray.length; i++){
    //         let testObjectFilter = response.data.list.filter(function(group) {
    //           return group.xgrupo == nameArray[i];
    //         });
    //         this.groupList.push({ xgrupo: nameArray[i], modules: testObjectFilter });
    //       }
    //     }
    //   },
    //   (err) => {
    //     let code = err.error.data.code;
    //     let message;
    //     if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
    //     else if(code == 404){ message = "HTTP.ERROR.TOOLBAR.MODULESNOTFOUND"; }
    //     else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
    //   });
 
    this.lang_form = this.formBuilder.group({
      langselect: ['']
    });
    if(localStorage.getItem('lang') != null){
      this.translate.use(localStorage.getItem('lang'));
      this.lang_form.get('langselect').setValue(localStorage.getItem('lang'));
    }else{
      this.translate.use('es');
      localStorage.setItem('lang', 'es');
      this.lang_form.get('langselect').setValue('es');
    }
  }
}
  
  changeLanguage(lang){
    this.translate.use(lang.langselect);
    localStorage.setItem('lang', lang.langselect);
  }

logOut(){ this.authenticationService.logout();}
}