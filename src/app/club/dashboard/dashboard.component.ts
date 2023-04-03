import { Component, ChangeDetectorRef , OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid'; // fo
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEventId } from './event-utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  Events: any[] = [];
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  message : any;
  currentUser;
  constructor(
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private changeDetector: ChangeDetectorRef
  ) { }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }
  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('¿Qué actividad planea realizar?');
    const calendarApi = selectInfo.view.calendar;
    this.currentUser = this.authenticationService.currentUserValue;
    let params = {
      id:createEventId(),
      title: title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      cpropietario: this.currentUser.data.cpropietario
    }
    this.http
    .post(environment.apiUrl + '/api/club/client-agenda' ,params)
    .subscribe((res: any) => {
      console.log(res.data.list)
      this.Events = res.data.list
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Events,
      };
    });
  }
  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Seguro de que deseas elminar '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  }
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
  ngOnInit(){
    this.currentUser = this.authenticationService.currentUserValue;
    let params = {
      cpropietario: this.currentUser.data.cpropietario
    }
    this.http
    .post(environment.apiUrl + '/api/club/search/client-agenda' ,params)
    .subscribe((res: any) => {
      console.log(res.data.list)
      this.Events = res.data.list
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Events,
      };
    });    
  }

}