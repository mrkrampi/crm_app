import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodyComponent } from './body/body.component';

const routes: Routes = [
  {
    path: '', component: BodyComponent, children: [
      {
        path: 'status',
        loadChildren: () => import('../statuses/statuses.module').then(mod => mod.StatusesModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(mod => mod.UsersModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(mod => mod.ProfileModule)
      },
      {
        path: '',
        loadChildren: () => import('./lead/lead.module').then(mod => mod.LeadModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
