import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTilesComponent } from './download-tiles.component';

describe('DownloadTilesComponent', () => {
  let component: DownloadTilesComponent;
  let fixture: ComponentFixture<DownloadTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadTilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
