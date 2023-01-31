import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGrouperComponent } from './client-grouper.component';

describe('ClientGrouperComponent', () => {
  let component: ClientGrouperComponent;
  let fixture: ComponentFixture<ClientGrouperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientGrouperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientGrouperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
