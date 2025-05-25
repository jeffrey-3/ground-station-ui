import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDisplayComponent } from './flight-display.component';

describe('FlightDisplayComponent', () => {
  let component: FlightDisplayComponent;
  let fixture: ComponentFixture<FlightDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
