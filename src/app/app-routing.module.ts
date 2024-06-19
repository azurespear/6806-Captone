import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent} from "./forum/forum.component";
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'forum',
    component: ForumComponent
  },
  {
    path: 'landing',
    component: LandingComponent,
    pathMatch: 'full'
  },
  {
    path: 'view',
    component: ViewComponent
  },
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
