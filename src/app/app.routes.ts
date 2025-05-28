import { Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { FlightDisplayComponent } from './flight-display/flight-display.component';
import { ConnectComponent } from './connect/connect.component';
import { ParametersComponent } from './parameters/parameters.component';
import { CalibrationComponent } from './calibration/calibration.component';
import { LogsComponent } from './logs/logs.component';
import { DownloadTilesComponent } from './download-tiles/download-tiles.component';
import { RawComponent } from './raw/raw.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'telemetry',
        pathMatch: 'full'
    },
    {
        path: 'config',
        component: ConfigComponent,
        children: [
            {
                path: 'connect',
                component: ConnectComponent
            },
            {
                path: 'parameters',
                component: ParametersComponent
            },
            {
                path: 'calibration',
                component: CalibrationComponent
            },
            {
                path: 'logs',
                component: LogsComponent
            },
            {
                path: 'download-tiles',
                component: DownloadTilesComponent
            }
        ]
    },
    {
        path: 'telemetry',
        component: FlightDisplayComponent
    },
    {
        path: 'raw',
        component: RawComponent
    }
];
