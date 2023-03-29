import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators,FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid'; // fo

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [ interactionPlugin, dayGridPlugin ],
    initialView: 'dayGridMonth',
    weekends: true,
    selectable: true,
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'addEventButton'
    },
    dateClick: function(info) {
      var action = prompt('¿Qué actividad desea realizar?');
      const DateSelect = info.dateStr
      var date = new Date(DateSelect + 'T00:00:00');

      let data ={
        title : action,
        start : date
      }
      console.log(data);
      this.http
      .post(environment.apiUrl + '/api/club/client-agenda' , data)
      .subscribe((res: any) => {

        

      });

      // if (!isNaN(date.valueOf())) { // valid?
      //   calendar.addEvent({
      //     title: action,
      //     start: date,
      //     allDay: true
      //   });
      //   alert('Great. Now, update your database...');
      // } else {
      //   alert('Invalid date.');
      // }


    },

  };

  User : FormGroup
  submitted = false;
  message : any;
  currentUser;
  DataTypeService : any[] = [];
  DataService : any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private router : Router
  ) { }

  ngOnInit() {


  }

}