// Component
import { AppComponent } from './app.component';
import { ForumComponent } from './forum/forum.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';
import { ProfileComponent } from './profile/profile.component';
import { MapComponent } from './map/map.component';
import { AiComponent } from './ai/ai.component';
import { PostComponent } from './post/post.component';
import { ViewComponent } from './view/view.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

// Module
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule} from "@angular/material/radio";
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { GoogleMapsModule } from '@angular/google-maps';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { MyPostComponent } from './my-post/my-post.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { MarkdownModule } from 'ngx-markdown';

// Service
import { WebSocketService } from './services/websocket.service';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [
    AppComponent,
    ForumComponent,
    LandingComponent,
    LoginComponent,
    ViewComponent,
    RegComponent,
    ProfileComponent,
    MapComponent,
    AiComponent,
    PostComponent,
    SidebarComponent,
    ErrorDialogComponent,
    MyPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    GoogleMapsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    WebSocketService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
