import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationProcessIndexComponent } from './configuration-process-index.component';

describe('ConfigurationProcessIndexComponent', () => {
  let component: ConfigurationProcessIndexComponent;
  let fixture: ComponentFixture<ConfigurationProcessIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationProcessIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationProcessIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
