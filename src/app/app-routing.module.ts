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
import { AvgAttendanceComponent } from './reports/avg-attendance/avg-attendance.component';
import { MenteeComponent } from './reports/mentee/mentee.component';
import { MentorComponent } from './reports/mentor/mentor.component';
import { PcsreportComponent } from './reports/pcsreport/pcsreport.component';
import { NewMembersComponent } from './reports/new-members/new-members.component';
import { MeetingcountComponent } from './reports/meetingcount/meetingcount.component';
import { NewMentorsComponent } from './reports/new-mentors/new-mentors.component';
import { LmsreportComponent } from './reports/lmsreport/lmsreport.component';
import { TopicreportComponent } from './reports/topicreport/topicreport.component';
import { EventreportComponent } from './reports/eventreport/eventreport.component';
import { LessoncompletedComponent } from './reports/lessoncompleted/lessoncompleted.component';
import { MentorNonActiveReportComponent } from './reports/mentor-non-active-report/mentor-non-active-report.component';
import { MenteeNonActiveReportComponent } from './reports/mentee-non-active-report/mentee-non-active-report.component';
import { OrganizationalReportComponent } from './reports/organizational-report/organizational-report.component';
import { OrganizationalTreeComponent } from './reports/organizational-tree/organizational-tree.component';
import { LmsmentoractivityComponent } from './reports/lmsmentoractivity/lmsmentoractivity.component';
import { LmsmenteeactivityComponent } from './reports/lmsmenteeactivity/lmsmenteeactivity.component';
import { MentordashboardComponent } from './training/mentordashboard/mentordashboard.component';
import { LessonscompletedComponent } from './reports/lessonscompleted/lessonscompleted.component';

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
  { path: "training/mentor/dasboard", component: MentordashboardComponent},
  { path: "training/category", component: TrainingCategoryComponent},
  { path: "training/course", component: TrainingCourseComponent},
  { path: "training/lesson", component: TrainingLessonComponent},
  { path: "training/class", component: TrainingClassComponent},
  { path: "gallery", component: GalleryComponent},
  { path: "gallery/:event_id", component: SinglegalleryComponent },
  { path: "report/attendance", component: AttendancereportComponent },
  { path: "report/topic", component: TopicreportComponent },
  { path: "report/mentee", component: MenteeComponent },
  { path: "report/non-active-mentee", component: MenteeNonActiveReportComponent },
  { path: "report/mentor", component: MentorComponent },
  { path: "report/non-active-mentor", component: MentorNonActiveReportComponent },
  { path: "report/pcs", component: PcsreportComponent },
  { path: "report/new-mentees", component: NewMembersComponent },
  { path: "report/fellowship", component: MeetingcountComponent },
  { path: "report/new-mentors", component: NewMentorsComponent },
  { path: "report/lms", component: LmsreportComponent },
  { path: "report/events", component: EventreportComponent},
  { path: "report/attendance-avg", component: AvgAttendanceComponent },
  { path:"report/organization", component: OrganizationalTreeComponent },
  { path:"report/organization-tree", component: OrganizationalTreeComponent },
  { path:"report/lesson-status", component:LessoncompletedComponent },
  { path:"report/lms-mentor-activity", component: LmsmentoractivityComponent },
  { path:"report/lms-mentee-activity", component:LmsmenteeactivityComponent },
  { path:"report/lessons-completed", component:LessonscompletedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
