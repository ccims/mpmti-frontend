import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSheetComponent } from './detail-sheet.component';

describe('DetailSheetComponent', () => {
  let component: DetailSheetComponent;
  let fixture: ComponentFixture<DetailSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
