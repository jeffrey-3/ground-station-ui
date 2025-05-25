import { Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { FlightDisplayComponent } from './flight-display/flight-display.component';
import { ConnectComponent } from './connect/connect.component';

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
            }
        ]
    },
    {
        path: 'telemetry',
        component: FlightDisplayComponent
    }
];
