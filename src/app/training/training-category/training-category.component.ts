import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-training-category',
  templateUrl: './training-category.component.html',
  styleUrls: ['./training-category.component.css']
})
export class TrainingCategoryComponent implements OnInit {
  imageToShow:any;images='';catlist:any=[];
  tk:any = {}; edit = false;

  @Input() category = {category_name:'',category_description:'',row_id:'',category_image_url:'',created_by:'',category_status:'',modified_by:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.fetchCategory();
  }

  fetchCategory(){
    this.restApi.getMethod('getLMSCategory/all').subscribe((resp:any) => {
      this.catlist = resp.data;
    });
  }

  addCategory(event:any){
    event.preventDefault();
    this.category.created_by = this.tk.user_id;
    if(this.images != ''){
      const formData = new FormData();
      formData.append('image', this.images);
      let name = this.category.category_name.split(' ').join('_');

      this.restApi.postImgMethod('addTrainingCatImg/'+name,formData).subscribe((data:any) => {
        this.category.category_image_url = data.filepath;
        this.addCategoryData();
      })
    }else{
      this.category.category_image_url = '';
      this.addCategoryData();
    }
  }

  addCategoryData(){
    this.restApi.postMethod('addLMSCategory',this.category).subscribe((resp:any) => {
      this.fetchCategory();
      this.images = '';
      alert(resp.message);
      //this.resetForm();
      let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
      element.click();
    })
  }

  editCategory(id){
    this.edit = true;
    this.category.row_id = id;
    this.restApi.getMethod('getLMSCategory/'+id).subscribe((resp:any) => {
      this.category = resp.data[0];    
      this.restApi.getImgMethod('getLMSCategoryImg/'+id).subscribe((data:any) => {
        (data.status == 201) ? this.imageToShow = '' : this.createImageFromBlob(data);
      });
    });
  }

  updateCategory(event:any){
    event.preventDefault();
    if(this.images != ''){
      const formData = new FormData();
      formData.append('image', this.images);
      let name = this.category.category_name.split(' ').join('_');
      this.restApi.postImgMethod('addTrainingCatImg/'+name,formData).subscribe((resp:any) => {
        this.updateCategoryData(resp);
      })
    }else{
      this.updateCategoryData('');
    }
  }

  updateCategoryData(resp){
    if(resp == ''){
      this.category.category_image_url = resp; 
    }else{
      this.category.category_image_url = resp.filepath; 
    }    
    this.category.modified_by = this.tk.user_id;
    this.restApi.postMethod('updateLMSCategory',this.category).subscribe((data:any) => {     
      alert('Category Updated Successfully.');
      this.fetchCategory();
      //this.resetForm();
      let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
      element.click();
    })
  }

  changeStatus(event,id){
    this.category.modified_by = this.tk.user_id;
    this.category.row_id = id;
    (event.target.checked) ? this.category.category_status = "Y" : this.category.category_status = "N";
    this.restApi.postMethod('changeLMSCatStatus',this.category).subscribe((data:any) => {
      this.fetchCategory();
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
    this.category = {category_name:'',category_description:'',row_id:'',category_image_url:'',created_by:'',category_status:'',modified_by:''};
    this.imageToShow = '';
    (<HTMLInputElement>document.getElementById('blog-image')).value = '';
  } */

  resetForm(f:NgForm){
    f.resetForm( {category_name:'',category_description:'',row_id:'',category_image_url:'',created_by:'',category_status:'',modified_by:''
    })
    this.category = {category_name:'',category_description:'',row_id:'',category_image_url:'',created_by:'',category_status:'',modified_by:''};
    this.imageToShow = '';
    (<HTMLInputElement>document.getElementById('blog-image')).value = '';
  }
}
