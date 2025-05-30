import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-land-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './land-dialog.component.html',
  styleUrl: './land-dialog.component.scss'
})
export class LandDialogComponent {
  runwayHeading = new FormControl(<number | null>null);
  glideslopeAngle = new FormControl(<number | null>null);
  extendFinalLeg = new FormControl(<number | null>null);
  loiterAltitude = new FormControl({value: <number | null>null, disabled: true});
  loiterRadius = new FormControl(<number | null>null);
  loiterDirection = new FormControl<'left' | 'right'>('left');

  constructor(public dialogRef: MatDialogRef<LandDialogComponent>) {
    // Calculate loiter altitude when glideslope or extend final leg changes
    this.glideslopeAngle.valueChanges.subscribe(() => this.calculateLoiterAltitude());
    this.extendFinalLeg.valueChanges.subscribe(() => this.calculateLoiterAltitude());
  }

  private calculateLoiterAltitude() {
    const angle = this.glideslopeAngle.value;
    const distance = this.extendFinalLeg.value;
    
    if (angle && distance) {
      const angleRad = angle * (Math.PI / 180);
      const altitude = distance * Math.tan(angleRad);
      this.loiterAltitude.setValue(Math.round(altitude * 10) / 10, {emitEvent: false});
    } else {
      this.loiterAltitude.setValue(0, {emitEvent: false});
    }
  }

  onSubmit() {
    this.dialogRef.close({
      runwayHeading: this.runwayHeading.value,
      glideslopeAngle: this.glideslopeAngle.value,
      extendFinalLeg: this.extendFinalLeg.value,
      loiterAltitude: this.loiterAltitude.value,
      loiterRadius: this.loiterRadius.value,
      loiterDirection: this.loiterDirection.value
    });
  }
}