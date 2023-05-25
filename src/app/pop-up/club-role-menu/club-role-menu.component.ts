import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-club-role-menu',
  templateUrl: './club-role-menu.component.html',
  styleUrls: ['./club-role-menu.component.css']
})
export class ClubRoleMenuComponent implements OnInit {

  @Input() public menu;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  menuList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cmenuclub: ['']
    });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {};
    this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/club-menu`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.menuList.push({ id: response.data.list[i].cmenuclub, value: response.data.list[i].xmenuclub, xcomponente: response.data.list[i].xcomponente, xpais: response.data.list[i].xpais, xcompania: response.data.list[i].xcompania  });
        }
        this.menuList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLUBMENUNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    if(this.menu){
      if(this.menu.type == 3){
        this.canSave = true;
      }else if(this.menu.type == 2){
        this.popup_form.get('cmenuclub').setValue(this.menu.cmenuclub);
        this.popup_form.get('cmenuclub').disable();
        this.canSave = false;
      }else if(this.menu.type == 1){
        this.popup_form.get('cmenuclub').setValue(this.menu.cmenuclub);
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let menuFilter = this.menuList.filter((option) => { return option.id == form.cmenuclub; });
    this.menu.cmenuclub = form.cmenuclub;
    this.menu.xmenuclub = menuFilter[0].value.split("-")[0].replace(" ", "");
    this.menu.xcomponente = menuFilter[0].xcomponente;
    this.menu.xpais = menuFilter[0].xpais;
    this.menu.xcompania = menuFilter[0].xcompania;
    this.activeModal.close(this.menu);
  }

  deleteMenu(){
    this.menu.type = 4;
    if(!this.menu.create){
      this.menu.delete = true;
    }
    this.activeModal.close(this.menu);
  }

}
