import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakersDetailComponent } from './takers-detail.component';

describe('TakersDetailComponent', () => {
  let component: TakersDetailComponent;
  let fixture: ComponentFixture<TakersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakersDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
