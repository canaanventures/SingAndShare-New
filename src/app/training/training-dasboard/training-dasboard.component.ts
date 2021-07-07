import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-training-dasboard',
  templateUrl: './training-dasboard.component.html',
  styleUrls: ['./training-dasboard.component.css']
})
export class TrainingDasboardComponent implements OnInit {
  tk:any = {}; courselist:any = []; imageToShow; pdfurl; ongoinglist:any=[]; lessonstatus:any=[];
  displayMenteeModal = false; displayTable = true;
  details:any=[]; lesson:any=[]; menteestatus='';

  constructor (public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.fetchUpcomingCourse();
  }

  fetchUpcomingCourse(){ 
    this.restApi.getMethod('getUpComingCourseForMentees/'+this.tk.user_id).subscribe((resp:any) => {
      this.courselist = resp.data;
      this.restApi.getMethod('getOnGoingCourseForMentees/'+this.tk.user_id).subscribe((resptwo:any) => {
        this.ongoinglist = resptwo.data;
      });
    });
  }

  openLink(id){
    window.open(id);
  }

  openCourseDtls(id){
    this.displayTable = false;
    this.displayMenteeModal = true;
    this.restApi.getMethod('getCourseDetailsForMentees/'+id+'/'+this.tk.user_id).subscribe((resp:any) => {
      this.details = resp.data;
      this.restApi.getMethod('getLessonsForMentees/'+id).subscribe((resptwo:any) => {
        this.lesson = resptwo.data;
      })
    });
  }

  closeMenteeDiv(){
    this.displayMenteeModal = false;
    this.displayTable = true;
  }

  downloadPDF(id,url){   
    let arr = url.split('/');
    let len = arr.length;
    this.pdfurl = arr[len-1];
    this.restApi.getImgMethod('downloadPDF/1').subscribe((data:any) => {
      this.downloadFile(data);
    });
  }

  downloadFile(blob){
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = this.pdfurl;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  }
  
  toggleClass(id){
    this.restApi.getMethod('getMenteeStatusForClass/'+id+'/'+this.tk.user_id).subscribe((resp:any) => {
      this.menteestatus = resp.data[0].mentee_status;
      this.restApi.getMethod('getLessonsActivityForMentees/'+id).subscribe((lessondata:any) => {
        let lessonstatus = lessondata.data;
        for(var i=0;i<lessonstatus.length;i++){
          document.getElementById('lesson_'+lessonstatus[i].lesson_id+'_'+id).style.display = 'block';
          document.getElementById('lesson_'+lessonstatus[i].lesson_id+'_'+id).classList.add('label-success');
        }
        var classlen = document.getElementsByClassName('class-div-hide');
        for(let i=0;i<classlen.length;i++){
          (document.getElementsByClassName("class-div-hide")[i] as HTMLElement).style.display = 'none'
        }
        document.getElementById('row_'+id).style.display = 'block';
      })
    })
  }
}
