import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-relationship',
  templateUrl: './client-relationship.component.html',
  styleUrls: ['./client-relationship.component.css']
})
export class ClientRelationshipComponent implements OnInit {

  @Input() public relationship;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  relationshipList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cparentesco: ['', Validators.required],
      xobservacion: ['', Validators.required],
      fefectiva: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/relationship`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.relationshipList.push({ id: response.data.list[i].cparentesco, value: response.data.list[i].xparentesco });
          }
          this.relationshipList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.RELATIONSHIPNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.relationship){
        if(this.relationship.type == 3){
          this.canSave = true;
        }else if(this.relationship.type == 2){
          this.popup_form.get('cparentesco').setValue(this.relationship.cparentesco);
          this.popup_form.get('cparentesco').disable();
          this.popup_form.get('xobservacion').setValue(this.relationship.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.popup_form.get('fefectiva').setValue(this.relationship.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.canSave = false;
        }else if(this.relationship.type == 1){
          this.popup_form.get('cparentesco').setValue(this.relationship.cparentesco);
          this.popup_form.get('xobservacion').setValue(this.relationship.xobservacion);
          this.popup_form.get('fefectiva').setValue(this.relationship.fefectiva);
          this.canSave = true;
          this.isEdit = true;
        }
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
    let relationshipFilter = this.relationshipList.filter((option) => { return option.id == form.cparentesco; });
    this.relationship.cparentesco = form.cparentesco;
    this.relationship.xparentesco = relationshipFilter[0].value;
    this.relationship.xobservacion = form.xobservacion;
    this.relationship.fefectiva = form.fefectiva;
    this.activeModal.close(this.relationship);
  }

  deleteRelationship(){
    this.relationship.type = 4;
    if(!this.relationship.create){
      this.relationship.delete = true;
    }
    this.activeModal.close(this.relationship);
  }

}
