import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandDialogComponent } from './land-dialog.component';

describe('LandDialogComponent', () => {
  let component: LandDialogComponent;
  let fixture: ComponentFixture<LandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
