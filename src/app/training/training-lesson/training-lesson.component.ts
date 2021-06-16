import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";
import { newArray } from '@angular/compiler/src/util';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-training-lesson',
  templateUrl: './training-lesson.component.html',
  styleUrls: ['./training-lesson.component.css']
})
export class TrainingLessonComponent implements OnInit {
  imageToShow:any; images:any=[]; catlist:any=[]; courselist:any=[]; lessonlist:any=[];
  tk:any={}; edit=false; docurl:any=[]; files:any; cnt = 0;

  @Input() lesson = {docdata:[], course_id:'', category_id:'', lesson_name:'', lesson_description:'', row_id:'',lesson_image_url:'', created_by:'', lesson_status:'', modified_by:''}
  @Input() lessondocs = {vals:[],row:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.fetchCategory();
    //this.fetchCourse();
    this.fetchLesson();
  }

  fetchCategory(){
    this.restApi.getMethod('getLMSCategory/Y').subscribe((resp:any) => {
      this.catlist = resp.data;
    });
  }

  fetchCourse(){
    this.restApi.getMethod('getLMSCourseOnCat/'+this.lesson.category_id).subscribe((resp:any) => {
      this.courselist = resp.data;
    });
  }

  fetchLesson(){
    this.lessonlist = [];
    this.restApi.getMethod('getLMSLesson/all').subscribe((resp:any) => {
      this.lessonlist = resp.data;
      if(this.edit){

      }
    });
  }
  
  handleFileSelect(e){
    if(e.target.files.length > 0){
      this.files = e.target.files;
      for (var i = 0; i < e.target.files.length; i++) { 
        this.images.push(e.target.files[i]);
      }
    }
  }

  addLesson(event){
    event.preventDefault();
    this.lesson.created_by = this.tk.user_id;
    let arr = this.docurl;
    this.lesson.docdata = this.docurl;
    this.restApi.postMethod('addLMSLesson',this.lesson).subscribe((resp:any) => {
      const formData = new FormData();
      for (var i = 0; i < this.images.length; i++) { 
        formData.append("image", this.images[i]);
      }
      this.restApi.postImgMethod('addLessonDoc/'+resp.data,formData).subscribe((resp:any) => {
        this.fetchLesson();
        alert(resp.message);
        //this.resetForm();
        let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
        element.click();
      })
    })    
  }

  editLesson(id){
    this.edit = true;
    this.lesson.row_id = id;
    this.restApi.getMethod('getLMSLesson/'+id).subscribe((resp:any) => {
      this.lesson = resp.data.data[0];
      this.docurl = resp.data.list;
      this.lesson.category_id = resp.data.data[0].category_id;
      this.fetchCourse();
    });
  }

  updateLesson(event){
    event.preventDefault();
    this.lesson.modified_by = this.tk.user_id;
    let arr = this.docurl;
    this.lesson.docdata = this.docurl;
    this.restApi.postMethod('updateLMSLesson',this.lesson).subscribe((resp:any) => {
      if(this.images.length > 0){
        const formData = new FormData();
        for (var i = 0; i < this.images.length; i++) { 
          formData.append("image", this.images[i]);
        }
        this.restApi.postImgMethod('addLessonDoc/'+resp.data,formData).subscribe((data:any) => {
          this.fetchLesson();
          alert(data.message);
          //this.resetForm();
          let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
          element.click();
        })
      }else{
        this.fetchLesson();
        alert(resp.message);
        let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
        element.click();
        //this.resetForm();
      }
      this.edit = false;
    })
  }

  changeStatus(event,id){
    this.lesson.modified_by = this.tk.user_id;
    this.lesson.row_id = id;
    (event.target.checked) ? this.lesson.lesson_status = "Y" : this.lesson.lesson_status = "N";
    this.restApi.postMethod('changeLMSLessonStatus',this.lesson).subscribe((data:any) => {
      this.fetchLesson();
      alert("The status has been changed successfully");
    })
  }

  /* resetForm(){
    this.lesson = {docdata:[], course_id:'', category_id:'', lesson_name:'', lesson_description:'',row_id:'',lesson_image_url:'', created_by:'', lesson_status:'',modified_by:''};
    this.imageToShow = '';
    this.images = []; this.docurl =[];
    (<HTMLInputElement>document.getElementById('meeting_link')).value='';
    (<HTMLInputElement>document.getElementById('doc-upload')).value='';
  } */

  addFld(){
    this.cnt++
    this.docurl.push({
      lesson_id: '',
      row_id: 'add_'+this.cnt,
      pdf_path: this.files[0].name,
      meeting_url: (<HTMLInputElement>document.getElementsByClassName('meeting-link')[0]).value
    })
  }

  removeFld(row_id,lesson_id){
    if(typeof row_id == 'number'){
      this.restApi.getMethod('removeDoc/'+row_id+'/'+lesson_id).subscribe((data:any) => {     
        alert(data.message);
        this.editLesson(lesson_id);
      })
    }else{
      this.docurl = this.docurl.filter(item => item.row_id !== row_id);
    }
  }

  resetForm(f:NgForm){
    f.resetForm({course_id:'', category_id:'', lesson_name:'', lesson_description:'',row_id:'',lesson_image_url:'', created_by:'', lesson_status:'',modified_by:''})
    this.lesson = {docdata:[], course_id:'', category_id:'', lesson_name:'', lesson_description:'',row_id:'',lesson_image_url:'', created_by:'', lesson_status:'',modified_by:''};
    this.imageToShow = '';
    this.imageToShow = '';
    this.images = []; this.docurl =[];
    (<HTMLInputElement>document.getElementById('meeting_link')).value='';
    (<HTMLInputElement>document.getElementById('doc-upload')).value='';
  }
}
