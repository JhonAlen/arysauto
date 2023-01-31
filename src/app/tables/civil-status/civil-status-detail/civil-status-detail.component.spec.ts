import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilStatusDetailComponent } from './civil-status-detail.component';

describe('CivilStatusDetailComponent', () => {
  let component: CivilStatusDetailComponent;
  let fixture: ComponentFixture<CivilStatusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilStatusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
