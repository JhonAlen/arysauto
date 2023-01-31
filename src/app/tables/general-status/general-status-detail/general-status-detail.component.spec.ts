import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatusDetailComponent } from './general-status-detail.component';

describe('GeneralStatusDetailComponent', () => {
  let component: GeneralStatusDetailComponent;
  let fixture: ComponentFixture<GeneralStatusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralStatusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
