import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadsTableComponent } from './leads-table/leads-table.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }
