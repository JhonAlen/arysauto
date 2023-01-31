import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationObjetivesComponent } from './configuration-objetives.component';

describe('ConfigurationObjetivesComponent', () => {
  let component: ConfigurationObjetivesComponent;
  let fixture: ComponentFixture<ConfigurationObjetivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationObjetivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationObjetivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
