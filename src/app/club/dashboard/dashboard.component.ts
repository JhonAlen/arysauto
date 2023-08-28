import { Component, ChangeDetectorRef , OnInit, ViewChild, TemplateRef, ElementRef   } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid'; // fo
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, UntypedFormGroup, Validators,FormControl, FormGroup, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild("content") private contentRef: TemplateRef<Object>;
  @ViewChild("calendar") private content: TemplateRef<Object>;
  @ViewChild("documents") public contentDocument: TemplateRef<Object>;
  @ViewChild("mantenimiento") public contentMantenimiento: TemplateRef<Object>;
  @ViewChild('myTittleElem') input :ElementRef;
  @ViewChild('myFhastaElem') input2:ElementRef;
  @ViewChild('myHoraElem') input3:ElementRef;

 
  DataUserMantenimiento: FormGroup
  EventsCalendar : FormGroup
  DataUserDocuments : FormGroup
  DataUserClub: FormGroup
  counst = false
  count : any
  closeResult: string;
  name : string
  apellido: string
  date : any
  message :any ;
  xrutaarchivo : string
  submitted = false;
  datamessage : any

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
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
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

  currentUser;
  constructor(
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private changeDetector: ChangeDetectorRef,
    private modalService : NgbModal,
    private formBuilder: FormBuilder, ) 
   { }

   handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }
  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.date = selectInfo.startStr
    this.open(this.content)
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Seguro de que deseas elminar '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      let params = {
        cpropietario: this.currentUser.data.cpropietario,
        id: clickInfo.event.id
      }
      this.http
      .post(environment.apiUrl + '/api/club/deleteventagend' ,params)
      .subscribe((res: any) => {

      });
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  ngOnInit(){

    this.DataUserDocuments = this.formBuilder.group({
      cpropietario:  [''],
      xdocumento:  [''],
      xarchivo:  [''],
      itipodocumento:  [''],
      fvencimiento:  [''],
      fcreacion :  [''],
      cusuariocreacion:  [''],

    });

    this.DataUserMantenimiento = this.formBuilder.group({
      fdesde :  [''],
      xmantenimientoPrevent:  [''],
      hora:  [''],
      xmantenimientoCorrect:  [''],

    });

    this.DataUserClub = this.formBuilder.group({
      fdesde :  [''],
      fhasta:  [''],
      hora:  [''],
      titulo:  [''],
    });

    this.currentUser = this.authenticationService.currentUserValue;
    let params = {
      cpropietario: this.currentUser.data.cpropietario
    }
    this.http
    .post(environment.apiUrl + '/api/club/search/client-agenda' ,params)
    .subscribe((res: any) => {
      this.Events = []
      this.Events = res.data.list 
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        events: this.Events,
      };
      if(res.data.message){
        this.message = res.data.message
        this.name = res.data.name
        this.apellido = res.data.apellido
        this.open(this.contentRef);
      }
    });

    this.http.post<any>(environment.apiUrl + `/api/club/count/service`, params).subscribe(response => {
      this.count = response.data.count
      if(this.count > 0){
      this.counst = true
      }
        })
    
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    })
  }

  openDocument(contentDocument){
    this.modalService.open(contentDocument, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    },);
  }

  openMantenimiento(contentMantenimiento){
    this.modalService.open(contentMantenimiento, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    },);
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.DataUserDocuments.get('xarchivo').setValue(file);
    this.submitted=true

  }

  onSubmit(form){
    const formData = new FormData();
    formData.append('xdocumento',this.DataUserDocuments.get('xarchivo').value);
    formData.append('agentId', '007');
    this.http.post<any>(`${environment.apiUrl}/api/upload/document`, formData).subscribe(response => {
      if(response.data.status){
        this.xrutaarchivo = `${environment.apiUrl}/documents/${response.data.uploadedFile.filename}`;
        
        let params = {
          cpropietario: this.currentUser.data.cpropietario,
          xarchivo: this.xrutaarchivo,
          itipodocumento: form.itipodocumento,
          fvencimiento: form.fvencimiento,
          cusuariocreacion: this.currentUser.data.cusuario,
        }

        this.http.post<any>(environment.apiUrl + `/api/club/upload/client-agenda`, params).subscribe(response => {
          if(response.data.status){
            this.DataUserDocuments.reset()
            this.message = 'Documento guardado con éxito'
            this.ngOnInit()
          }
        })

        
      }
    })
    
  }

  onSubmitCalendar(form){
    this.currentUser = this.authenticationService.currentUserValue;
    if(form.titulo !== null){
      this.message = false
      let params = {
        title: form.titulo,
        start: this.date,
        hora: form.hora,
        end: form.fhasta ,
        cpropietario: this.currentUser.data.cpropietario
      }
      this.http
      .post(environment.apiUrl + '/api/club/client-agenda' ,params)
      .subscribe((res: any) => {
        this.Events = []
        this.Events = res.data.list
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          events: this.Events,
        };
      }
      );
      this.datamessage = 'Evento creado con éxito'
      
      location.reload();
    }else{
      this.message = true
      this.datamessage = 'Es requerida la descripción del evento'
    }
    
    
  }

  onSubmitMantenimiento(form){

    let data ={
      cpropietario : this.currentUser.data.cpropietario,
      fdesde : form.fdesde,
      xmantenimientoPrevent : form.xmantenimientoPrevent,
      hora : form.hora,
      xmantenimientoCorrect : form.xmantenimientoCorrect,
    } 

    this.http.post<any>(environment.apiUrl + `/api/club//upload/mantenimiento/client-agenda`, data).subscribe(response => {
      if(response.data.status){
        this.DataUserMantenimiento.reset()
        this.message = 'Mantenimiento con éxito'
        this.ngOnInit()
      }
    })
    
  }
}