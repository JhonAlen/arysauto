import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationNoteComponent } from './notification-note.component';

describe('NotificationNoteComponent', () => {
  let component: NotificationNoteComponent;
  let fixture: ComponentFixture<NotificationNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
