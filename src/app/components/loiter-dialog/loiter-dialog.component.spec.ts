import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoiterDialogComponent } from './loiter-dialog.component';

describe('LoiterDialogComponent', () => {
  let component: LoiterDialogComponent;
  let fixture: ComponentFixture<LoiterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoiterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoiterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
