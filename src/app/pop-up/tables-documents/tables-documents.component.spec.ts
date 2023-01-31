import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesDocumentsComponent } from './tables-documents.component';

describe('TablesDocumentsComponent', () => {
  let component: TablesDocumentsComponent;
  let fixture: ComponentFixture<TablesDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
