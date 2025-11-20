import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { CheckinPortalComponent } from './components/checkin-portal/checkin-portal.component';
import { AttendanceService } from './services/attendance.service';

@NgModule({
  declarations: [
    AppComponent,
    CheckinPortalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [AttendanceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
