import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-training-course',
  templateUrl: './training-course.component.html',
  styleUrls: ['./training-course.component.css']
})
export class TrainingCourseComponent implements OnInit {
  imageToShow:any;images='';catlist:any=[];courselist:any=[];
  tk:any = {}; edit = false;

  @Input() course = {category_id:'', course_name:'', course_description:'', row_id:'',course_image_url:'', created_by:'', course_status:'', modified_by:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.fetchCategory();
    this.fetchCourse();
  }

  fetchCategory(){
    this.restApi.getMethod('getLMSCategory/Y').subscribe((resp:any) => {
      this.catlist = resp.data;
    });
  }

  fetchCourse(){
    this.restApi.getMethod('getLMSCourse/all').subscribe((resp:any) => {
      this.courselist = resp.data;
    });
  }
 
  addCourse(event){
    event.preventDefault();
    this.course.created_by = this.tk.user_id;
    if(this.images != ''){
      const formData = new FormData();
      formData.append('image', this.images);
      let name = this.course.course_name.split(' ').join('_');

      this.restApi.postImgMethod('addTrainingCourseImg/'+name,formData).subscribe((data:any) => {
        this.course.course_image_url = data.filepath;
        this.addCourseData();
      })
    }else{
      this.course.course_image_url = '';
      this.addCourseData();
    }
  }

  addCourseData() {
    this.restApi.postMethod('addLMSCourse',this.course).subscribe((resp:any) => {
      this.fetchCourse();
      this.images = '';
      alert(resp.message);
      //this.resetForm();
      let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
      element.click();
    })
  }

  editCourse(id){
    this.edit = true;
    this.course.row_id = id;
    this.restApi.getMethod('getLMSCourse/'+id).subscribe((resp:any) => {
      this.course = resp.data[0];    
      this.restApi.getImgMethod('getLMSCourseImg/'+id).subscribe((data:any) => {
        this.createImageFromBlob(data);
      });
    });
  }

  updateCourse(event){
    event.preventDefault();
    if(this.images != ''){
      const formData = new FormData();
      formData.append('image', this.images);
      let name = this.course.course_name.split(' ').join('_');
      this.restApi.postImgMethod('addTrainingCourseImg/'+name,formData).subscribe((resp:any) => {
        this.updateCourseData(resp);
      })
    }else{
      this.updateCourseData('');
    }
  }

  updateCourseData(resp){
    if(resp == ''){
      this.course.course_image_url = resp; 
    }else{
      this.course.course_image_url = resp.filepath; 
    }    
    this.course.modified_by = this.tk.user_id;
    this.restApi.postMethod('updateLMSCourse',this.course).subscribe((data:any) => {     
      alert('Category Updated Successfully.');
      this.fetchCourse();
      //this.resetForm();
      let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
      element.click();
    })
  }

  changeStatus(event,id){
    this.course.modified_by = this.tk.user_id;
    this.course.row_id = id;
    (event.target.checked) ? this.course.course_status = "Y" : this.course.course_status = "N";
    this.restApi.postMethod('changeLMSCourseStatus',this.course).subscribe((data:any) => {
      this.fetchCourse();
      alert("The status has been changed successfully");
    })
  }

  selectImage(event){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      this.images = file;
      this.readURL(event.target.files);
    }
  }

  readURL(event: Event): void {
    if (event && event[0]) {
        const file = event[0];
        const reader = new FileReader();
        reader.onload = e => this.imageToShow = reader.result;
        reader.readAsDataURL(file);
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  /* resetForm(){
    this.course = {category_id:'', course_name:'',course_description:'',row_id:'',course_image_url:'',created_by:'',course_status:'',modified_by:''};
    this.imageToShow = '';
    (<HTMLInputElement>document.getElementById('blog-image')).value = '';
  } */

  resetForm(f:NgForm){
    f.resetForm(this.course = {category_id:'', course_name:'',course_description:'',row_id:'',course_image_url:'',created_by:'',course_status:'',modified_by:''})
    this.course = {category_id:'', course_name:'',course_description:'',row_id:'',course_image_url:'',created_by:'',course_status:'',modified_by:''};
    this.imageToShow = '';
    (<HTMLInputElement>document.getElementById('blog-image')).value = '';
  }
}
