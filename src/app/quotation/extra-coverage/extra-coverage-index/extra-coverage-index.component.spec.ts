import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraCoverageIndexComponent } from './extra-coverage-index.component';

describe('ExtraCoverageIndexComponent', () => {
  let component: ExtraCoverageIndexComponent;
  let fixture: ComponentFixture<ExtraCoverageIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraCoverageIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraCoverageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
