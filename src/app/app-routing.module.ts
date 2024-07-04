import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent} from "./forum/forum.component";
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ViewComponent } from './view/view.component';
import { RegComponent } from './reg/reg.component';
import { ProfileComponent } from './profile/profile.component';
import { MapComponent } from './map/map.component';
import { AiComponent } from './ai/ai.component';
import { MyPostComponent } from './my-post/my-post.component';
import { PostComponent } from './post/post.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
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
    path: 'reg',
    component: RegComponent,
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: MapComponent,
    pathMatch: 'full'
  },
  {
    path: 'forum',
    component: ForumComponent
  },
  {
    path: 'ai',
    component: AiComponent
  },
  {
    path: 'Mypost',
    component: MyPostComponent
  },
  {
    path: 'post',
    component: PostComponent
  },
  {
    path: 'post/:id',
    component: PostComponent
  },
  {
    path: 'my-post',
    component: MyPostComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
