import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators,FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  DataUser : FormGroup
  submitted = false;
  message : any;
  currentUser;
  DataClient : any = [];


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private router : Router
  ) { }

  ngOnInit() {

  this.currentUser = this.authenticationService.currentUserValue;
  let plandata = {
    cpais: this.currentUser.data.cpais,
    cpropietario: this.currentUser.data.cpropietario
  } 
  this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan', plandata).subscribe((response : any) => {
      
      let DataTypeServiceI = response.data.listTypeService
      let DataServiceI = response.data.listService


      const DataTypeServiceP = DataTypeServiceI.filter
      ((data, index, j) => index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xtiposervicio === data.xtiposervicio)))

      const container = document.getElementById("accordionFlushExample");

      const html = DataTypeServiceP.map(item => `
      <div class="accordion-item">
        <h2 class="accordion accordion-flush" id="${item.ctiposervicio}">
          <button class="accordion-button collapsed" 
          type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" 
          aria-expanded="false" aria-controls="flush-collapseOne"> ${item.xtiposervicio}
          </button>
        </h2>

      `).join('');
    container.innerHTML = html;
      // const containerF = document.querySelector(".accordion-flush");

      // const htmlF = DataServiceI.map(service => `
      //   <div id="${service.ctiposervicio}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
      //     <div class="accordion-body">${service.xservicio}</div>
      //   </div>
      // </div>
      // `).join('');
      // containerF.innerHTML = htmlF;

  },

  );
  }

  getdataservice(DataTypeServiceP){}
}


