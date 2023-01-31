import { Component, OnInit, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CssGeneratorService } from '@app/_services/css-generator.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { InicioComponent } from '@app/club/pages-statics/inicio/inicio.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})

export class ToolbarComponent implements OnInit {
  isMobile = window.innerWidth <= 1023
  auth : boolean = false;
  responsive : boolean = false;
  currentUser;
  lang_form : UntypedFormGroup;
  groupList: any[] = [];
  css1;
  theme: string = 'light';
  brand: string = "Mundialauto";

  constructor(private el: ElementRef,
              public translate : TranslateService, 
              private formBuilder : UntypedFormBuilder, 
              private modalService : NgbModal, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private cssGenerator: CssGeneratorService) {
    
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.onCloseWhenClickingOnMobile()
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
       this.onCloseWhenClickingOnMobile()
      this.auth = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario
      }
      this.http.post(`${environment.apiUrl}/api/security/get-user-modules`, params, options).subscribe((response : any) => {
        if(response.data.status){
          let nameArray = [];
          for(let i = 0; i < response.data.list.length; i++){
            if(!nameArray.includes(response.data.list[i].xgrupo)){ nameArray.push(response.data.list[i].xgrupo); }
          }
          for(let i = 0; i < nameArray.length; i++){
            let testObjectFilter = response.data.list.filter(function(group) {
              return group.xgrupo == nameArray[i];
            });
            this.groupList.push({ xgrupo: nameArray[i], modules: testObjectFilter });
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.TOOLBAR.MODULESNOTFOUND"; }
        else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
     
     
      });
    }
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

  changeLanguage(lang){
    this.translate.use(lang.langselect);
    localStorage.setItem('lang', lang.langselect);
  }

  logOut(){ this.authenticationService.logout();}
 
 
  onCloseWhenClickingOnMobile() {
    // just on mobile devices.
    if (window.innerWidth <= 1023) {
      this.responsive = true
    }
  }

}


