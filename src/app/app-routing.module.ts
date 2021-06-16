import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { BelieveComponent } from './user/believe/believe.component';
import { MissionComponent } from './user/mission/mission.component';
import { FirststepComponent } from './user/firststep/firststep.component';
import { UsersComponent } from './admin/users/users.component';
import { EventsComponent } from './admin/events/events.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { AttendanceComponent } from './admin/attendance/attendance.component';
import { MenteeRegisterComponent } from './admin/mentee-register/mentee-register.component';
import { ForgotpasswordComponent } from './user/forgotpassword/forgotpassword.component';
import { FellowshipComponent } from './admin/fellowship/fellowship.component';
import { BlogAllComponent } from './user/blog-all/blog-all.component';
import { SingleblogComponent } from './user/singleblog/singleblog.component';
import { AddblogComponent } from './admin/addblog/addblog.component';
import { SrsComponent } from './admin/srs/srs.component';
import { PcsComponent } from './admin/pcs/pcs.component';
import { TrainingCategoryComponent } from './training/training-category/training-category.component';
import { TrainingDasboardComponent } from './training/training-dasboard/training-dasboard.component';
import { TrainingCourseComponent } from './training/training-course/training-course.component';
import { TrainingLessonComponent } from './training/training-lesson/training-lesson.component';
import { TrainingClassComponent } from './training/training-class/training-class.component';
import { GalleryComponent } from './user/gallery/gallery.component';
import { SinglegalleryComponent } from './user/singlegallery/singlegallery.component';
import { AttendancereportComponent } from './reports/attendancereport/attendancereport.component';
import { MenteeComponent } from './reports/mentee/mentee.component';
import { MentorComponent } from './reports/mentor/mentor.component';
import { PcsreportComponent } from './reports/pcsreport/pcsreport.component';
import { NewMembersComponent } from './reports/new-members/new-members.component';
import { MeetingcountComponent } from './reports/meetingcount/meetingcount.component';
import { NewMentorsComponent } from './reports/new-mentors/new-mentors.component';
import { LmsreportComponent } from './reports/lmsreport/lmsreport.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full"  },
  { path: "home", component: HomeComponent },
  { path: "believe", component: BelieveComponent },
  { path: "firststep", component: FirststepComponent },
  { path: "mission", component: MissionComponent },
  { path: "user", component: UsersComponent },
  { path: "events", component: EventsComponent },
  { path: "profile", component: ProfileComponent },
  { path: "attendance", component: AttendanceComponent },
  { path: "calendar", component: FellowshipComponent },
  { path: "blog-all", component: BlogAllComponent },
  { path: "singleblog/:blog_id", component: SingleblogComponent },
  { path: "addblog", component: AddblogComponent },
  { path: "sns", component: SrsComponent },
  { path: "pcs", component: PcsComponent },
  { path: "register/:encodedurl", component: MenteeRegisterComponent },
  { path: "forgot-password/:encodedurl", component: ForgotpasswordComponent },
  { path: "training/dasboard", component: TrainingDasboardComponent},
  { path: "training/category", component: TrainingCategoryComponent},
  { path: "training/course", component: TrainingCourseComponent},
  { path: "training/lesson", component: TrainingLessonComponent},
  { path: "training/class", component: TrainingClassComponent},
  { path: "gallery", component: GalleryComponent},
  { path: "gallery/:event_id", component: SinglegalleryComponent },
  { path: "report/attendance", component: AttendancereportComponent },
  { path: "report/mentee", component: MenteeComponent },
  { path: "report/mentor", component: MentorComponent },
  { path: "report/pcs", component: PcsreportComponent },
  { path: "report/new-mentees", component: NewMembersComponent },
  { path: "report/fellowship", component: MeetingcountComponent },
  { path: "report/new-mentors", component: NewMentorsComponent },
  { path: "report/lms", component: LmsreportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
