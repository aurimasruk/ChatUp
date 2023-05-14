import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './controllers/HomePage/home.page.component';
import { AuthGuardService } from './services/Auth/authorize.guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },
  {    path: '',    component: HomePageComponent,    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
//   {
//     path: 'login',
//     loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
//   }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }