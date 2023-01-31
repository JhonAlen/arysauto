import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurerContactComponent } from './insurer-contact.component';

describe('InsurerContactComponent', () => {
  let component: InsurerContactComponent;
  let fixture: ComponentFixture<InsurerContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
