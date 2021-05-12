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
import { FellowshipComponent } from './admin/fellowship/fellowship.component';
import { BlogAllComponent } from './user/blog-all/blog-all.component';
import { SingleblogComponent } from './user/singleblog/singleblog.component';
import { AddblogComponent } from './admin/addblog/addblog.component';
import { SrsComponent } from './admin/srs/srs.component';
import { ReportComponent } from './admin/report/report.component';

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
  { path: "report", component: ReportComponent},
  { path: "register/:encodedurl", component: MenteeRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
