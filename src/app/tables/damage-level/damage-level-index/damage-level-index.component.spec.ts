import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageLevelIndexComponent } from './damage-level-index.component';

describe('DamageLevelIndexComponent', () => {
  let component: DamageLevelIndexComponent;
  let fixture: ComponentFixture<DamageLevelIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageLevelIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageLevelIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
