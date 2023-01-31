import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadManagementConfigurationDetailComponent } from './road-management-configuration-detail.component';

describe('RoadManagementConfigurationDetailComponent', () => {
  let component: RoadManagementConfigurationDetailComponent;
  let fixture: ComponentFixture<RoadManagementConfigurationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadManagementConfigurationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadManagementConfigurationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
