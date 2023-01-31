import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurerDetailComponent } from './insurer-detail.component';

describe('InsurerDetailComponent', () => {
  let component: InsurerDetailComponent;
  let fixture: ComponentFixture<InsurerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
