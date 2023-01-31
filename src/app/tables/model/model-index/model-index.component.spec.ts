import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelIndexComponent } from './model-index.component';

describe('ModelIndexComponent', () => {
  let component: ModelIndexComponent;
  let fixture: ComponentFixture<ModelIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
