import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MapPageComponent } from './map-page/map-page.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'map', component: MapPageComponent },
  { path: '**', redirectTo: '' },
];
