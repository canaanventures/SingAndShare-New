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

  totalRecords:Number = 1; p: Number = 1; pageIndexes:any =[]; paginatecnt:Number;

  @Input() category = {category_name:'',category_description:'',row_id:'',category_image_url:'',created_by:'',category_status:'',modified_by:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.changePagination('load');
  }

  submit(f:NgForm){
    if(this.edit==false)
    this.addCategory(f);
    else
    this.updateCategory(f);

  }

  addCategory(f:NgForm){
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
      this.changePagination(this.paginatecnt);
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

  updateCategory(f:NgForm){
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
      this.changePagination(this.paginatecnt);
      let element: HTMLElement = document.getElementById('cancel_category') as HTMLElement;
      element.click();
    })
  }

  changeStatus(event,id){
    this.category.modified_by = this.tk.user_id;
    this.category.row_id = id;
    (event.target.checked) ? this.category.category_status = "Y" : this.category.category_status = "N";
    this.restApi.postMethod('changeLMSCatStatus',this.category).subscribe((data:any) => {
      this.changePagination(this.paginatecnt);
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
    this.edit = false;
  }

  changePagination(event){
    let cnt;
    if(event == 'load'){cnt = 1;}else{cnt=event}
    this.restApi.getMethod('getPaginatedCategory/'+cnt).subscribe((resp:any) => {
      this.catlist = resp.data.data;
      if(event == 'load'){
        let total = resp.data.total[0].total, num = total/10, arr = [];
        for(var i=0;i<num;i++){
          arr.push(i+1);
        }
        this.pageIndexes = arr; this.paginatecnt = 1;
      }else{
        this.paginatecnt = event;
      }
      setTimeout(function(){
        let elem = document.getElementsByClassName('page-link');
        for(var i=0;i<elem.length;i++){
          elem[i].classList.remove('active-pagination');
        }
        document.getElementById('pagination_'+cnt).classList.add('active-pagination');
      },10)
    });
  }

  nextClick(){
    let num = Number(this.paginatecnt);
    if(num < this.pageIndexes.length){
      this.changePagination(num+1);
    }
  }

  previousClick(){
    let num = Number(this.paginatecnt);
    if(num > 1){
      this.changePagination(num-1);
    }
  }
}
