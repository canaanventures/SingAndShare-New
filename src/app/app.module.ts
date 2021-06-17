import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './shared/app.service';
import { RouterModule,Router, NavigationEnd } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
//import interactionPlugin from '@fullcalendar/interaction'; // a plugin */
//import { NgxEditorModule } from 'ngx-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GoogleChartsModule } from 'angular-google-charts';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import {NgxPaginationModule} from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';
//import { SwiperModule } from "swiper/angular";
//import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { HomeComponent } from './user/home/home.component';
import { EventComponent } from './user/event/event.component';
import { ContactComponent } from './user/contact/contact.component';

import { SwiperModule } from 'swiper/angular';
import { EventRegisterComponent } from './user/event-register/event-register.component';
import { BelieveComponent } from './user/believe/believe.component';
import { MissionComponent } from './user/mission/mission.component';
import { FirststepComponent } from './user/firststep/firststep.component';
import { UsersComponent } from './admin/users/users.component';
import { EventsComponent } from './admin/events/events.component';
import { MenteeRegisterComponent } from './admin/mentee-register/mentee-register.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { AttendanceComponent } from './admin/attendance/attendance.component';
import { FellowshipComponent } from './admin/fellowship/fellowship.component';
import { BlogAllComponent } from './user/blog-all/blog-all.component';
import { SingleblogComponent } from './user/singleblog/singleblog.component';
import { VisitorsComponent } from './user/visitors/visitors.component';
import { AddblogComponent } from './admin/addblog/addblog.component';
import { SrsComponent } from './admin/srs/srs.component';
import { TrainingCategoryComponent } from './training/training-category/training-category.component';
import { TrainingCourseComponent } from './training/training-course/training-course.component';
import { TrainingDasboardComponent } from './training/training-dasboard/training-dasboard.component';
import { TrainingClassComponent } from './training/training-class/training-class.component';
import { TrainingLessonComponent } from './training/training-lesson/training-lesson.component';
import { PcsComponent } from './admin/pcs/pcs.component';
import { GalleryComponent } from './user/gallery/gallery.component';
import { SinglegalleryComponent } from './user/singlegallery/singlegallery.component';
import { MentorComponent } from './reports/mentor/mentor.component';
import { MenteeComponent } from './reports/mentee/mentee.component';
import { AttendancereportComponent } from './reports/attendancereport/attendancereport.component';
import { PcsreportComponent } from './reports/pcsreport/pcsreport.component';
import { NewMembersComponent } from './reports/new-members/new-members.component';
import { MeetingcountComponent } from './reports/meetingcount/meetingcount.component';
import { NewMentorsComponent } from './reports/new-mentors/new-mentors.component';
import { LmsreportComponent } from './reports/lmsreport/lmsreport.component';
import { ForgotpasswordComponent } from './user/forgotpassword/forgotpassword.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  //interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    EventComponent,
    ContactComponent,
    EventRegisterComponent,
    BelieveComponent,
    MissionComponent,
    FirststepComponent,
    UsersComponent,
    EventsComponent,
    MenteeRegisterComponent,
    ProfileComponent,
    AttendanceComponent,
    FellowshipComponent,
    BlogAllComponent,
    SingleblogComponent,
    VisitorsComponent,
    AddblogComponent,
    SrsComponent,
    TrainingCategoryComponent,
    TrainingCourseComponent,
    TrainingDasboardComponent,
    TrainingClassComponent,
    TrainingLessonComponent,
    PcsComponent,
    GalleryComponent,
    SinglegalleryComponent,
    MentorComponent,
    MenteeComponent,
    AttendancereportComponent,
    PcsreportComponent,
    NewMembersComponent,
    MeetingcountComponent,
    NewMentorsComponent,
    LmsreportComponent,
    ForgotpasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    //NgxSpinnerModule,
    RouterModule,
    ToastrModule.forRoot(),
    SwiperModule,
    FullCalendarModule,
    //NgxEditorModule
    AngularEditorModule,
    DragDropModule,
    GoogleChartsModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    NgxPaginationModule,
    CarouselModule,
    SwiperModule
    //NgxSpinnerModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
