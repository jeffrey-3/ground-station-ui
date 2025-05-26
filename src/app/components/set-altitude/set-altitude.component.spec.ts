import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAltitudeComponent } from './set-altitude.component';

describe('SetAltitudeComponent', () => {
  let component: SetAltitudeComponent;
  let fixture: ComponentFixture<SetAltitudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetAltitudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetAltitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
