import { Component, OnInit, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService } from 'src/app/shared/app.service';
import * as CryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.css']
})
export class AddblogComponent implements OnInit {
  tk:any = {};
  htmlContent:any = String;
  bloglist:any = []; blogCatlist:any = [];
  public displayBlog='none';categorydisplay='none';
  edit_id = '';
  blogtype = 'add';
  public form : any;
  public formelem : any;
  resp :any; images; access; encryptInfo; 
  edit = false; commentdisplay = 'none'; viewBlogModal = 'none';
  commentlist:any = []; imageToShow: any; viewblog:any=[];
  totalRecords:Number = 1; p: Number = 1; pageIndexes:any =[]; paginatecnt:Number;

  @Input() blog = {title:'',category:'',description:'',created_by_user_id:'',imgurl:'',approval_status:''};
  @Input() editblog = {imgurl:'',title:'',category:'',description:'',modified_by_user_id:'',blog_id:'',approval_status:''};
  @Input() disableblog = {modified_by_user_id:'',blog_id:'',status:''};
  @Input() addcat = {category_name:'',created_by:''}
  @Input() updatecomm = {approval_status:'',approved_by:'',comment_id:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.encryptInfo = sessionStorage.getItem('access_token');
    if(this.encryptInfo){
      var deData= CryptoJS.AES.decrypt(decodeURIComponent(this.encryptInfo), 'secret key 123'); 
      this.access = JSON.parse(deData.toString(CryptoJS.enc.Utf8));
    }
    this.changePagination('load');
    this.getBlogCat();
  }
  
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '200px',
      minHeight: '200px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: "no",
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: "p",
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo','redo','bold', 'italic'],
      ['fontSize','customClasses','insertVideo']
    ]
  };

  selectImage(event){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      this.images = file;
    }
  }

  addBlog(event){
    event.preventDefault();
    if(this.images != ''){
      const formData = new FormData();
      formData.append('image', this.images);
      let title = (<HTMLInputElement>document.getElementById('title')).value.split(' ').join("-");
      let cat = (<HTMLInputElement>document.getElementById('category')).value;
      this.restApi.postImgMethod('addBlogImg/'+title+'/'+cat,formData).subscribe((data) => { 
        this.resp = data;
        this.blog.imgurl = this.resp.filepath;
        this.addBlogData();
      })
    }else{
      this.blog.imgurl = '';
      this.addBlogData();
    }
  }

  addBlogData(){
    this.blog.title = (<HTMLInputElement>document.getElementById('title')).value;
    this.blog.category = (<HTMLInputElement>document.getElementById('category')).value;
    if(document.getElementById('approval_status')){
      this.blog.approval_status = (<HTMLInputElement>document.getElementById('approval_status')).value;
    }else{
      this.blog.approval_status = "N";
    }     
    this.blog.description = this.htmlContent.replace(/"/gi, "");
    this.blog.description = this.htmlContent.replace(/'/gi, "");
    this.blog.created_by_user_id = this.tk.user_id;
    this.restApi.postMethod('addBlog',this.blog).subscribe((data:any) => {
      this.changePagination(this.paginatecnt);
      this.images = '';
      this.displayBlog='none';
      alert(data.message);
    })
  }
  
  disableBlog(event,id:any){
    this.disableblog.modified_by_user_id = this.tk.user_id;
    this.disableblog.blog_id = id;
    (event.target.checked) ? this.disableblog.status = "Enable" : this.disableblog.status = "Disable";
    this.restApi.postMethod('disableBlog',this.disableblog).subscribe((data:any) => {
      this.changePagination(this.paginatecnt);
      alert("The blog has been disabled successfully");
    })
  }

  viewModal(id){
    this.viewBlogModal = 'block';
    this.restApi.getMethod('getBlogs/single/'+id).subscribe((resp:any) => {
      this.viewblog = resp.data[0];
      this.restApi.getImgMethod('getBlogImg/'+id).subscribe((resp:any) => {
        (resp.status == 201) ? this.imageToShow = '' : this.createImageFromBlob(resp);
      });
    });
  }

  closeViewModal(){
    this.viewBlogModal = 'none';
  }

  openBlogModal(){
    this.displayBlog='block';
    this.edit = false;
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    this.blogtype = 'add';
    this.htmlContent = '';
    (<HTMLInputElement>document.getElementById('title')).value = '';
  }

  closeBlogModal() {
    this.displayBlog='none';
    this.categorydisplay='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    this.edit_id = '';
  }

  closeCommentModal(){
    this.commentdisplay='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  editBlog(id){
    this.blogtype = 'update';
    this.edit = true;
    this.edit_id = id;
    this.restApi.getMethod('getBlogs/single/'+id).subscribe((resp:any) => {
      (<HTMLInputElement>document.getElementById('title')).value = resp.data[0].title;
      (<HTMLInputElement>document.getElementById('category')).value = resp.data[0].category;
      if(document.getElementById('approval_status')){
        (<HTMLInputElement>document.getElementById('approval_status')).value = resp.data[0].approval_status;
      }
      this.htmlContent = resp.data[0].description;
      this.restApi.getImgMethod('getBlogImg/'+id).subscribe((resp:any) => {
        if(resp.status == 201){
          this.imageToShow = '';
        }else{
          this.createImageFromBlob(resp);
          this.displayBlog='block';
          document.getElementsByTagName('body')[0].classList.add('edit-modal-open');
        }
      });
    });
  }

  updateBlog(event){
    event.preventDefault();
    if(this.images != ''){
      const formData = new FormData();
      formData.append('image', this.images);
      let title = (<HTMLInputElement>document.getElementById('title')).value.split(' ').join("-");
      let cat = (<HTMLInputElement>document.getElementById('category')).value;
      this.restApi.postImgMethod('addBlogImg/'+title+'/'+cat,formData).subscribe((resp:any) => {
        this.addEditedData(resp);
      })
    }else{
      this.addEditedData('');
    }
  }

  addEditedData(resp){
    this.editblog.title = (<HTMLInputElement>document.getElementById('title')).value;
    this.editblog.category = (<HTMLInputElement>document.getElementById('category')).value;
    if(document.getElementById('approval_status')){
      this.editblog.approval_status = (<HTMLInputElement>document.getElementById('approval_status')).value;
    }
    if(resp == ''){
      this.editblog.imgurl = resp; 
    }else{
      this.editblog.imgurl = resp.filepath; 
    }    
    this.editblog.description = this.htmlContent.replace("'", "");
    this.editblog.modified_by_user_id = this.tk.user_id;
    this.editblog.blog_id = this.edit_id;
    this.restApi.postMethod('updateBlog',this.editblog).subscribe((data:any) => {     
      alert(data.message);
      this.closeBlogModal();
      this.changePagination(this.paginatecnt);
      document.getElementsByTagName('body')[0].classList.remove('edit-modal-open');
      this.images = '';
    })
  }

  openCatModal(){
    this.categorydisplay='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
  }

  getBlogCat(){
    this.restApi.getMethod('getBlogCategory')
      .subscribe((resp:any) => {
        this.blogCatlist = resp.data;
      });
  }

  addBlogCat(event){
    event.preventDefault(); 
    this.addcat.created_by = this.tk.user_id;
    this.restApi.postMethod('addBlogCategory',this.addcat).subscribe((resp:any) => {
      this.getBlogCat();
      this.closeBlogModal();
      alert(resp.data[0].message);
    })
  }

  commentModal(id,type){
    this.restApi.getMethod('getComments/disapprove/'+id).subscribe((resp:any) => {
      this.commentlist = resp.data;
      if(!type){
        this.commentdisplay = 'block';
        document.getElementsByTagName('body')[0].classList.add('modal-open');
      }
    });
  }

  approveComment(id,type){
    this.updatecomm.approved_by = this.tk.user_id;
    this.updatecomm.approval_status = type;
    this.updatecomm.comment_id = id;
    this.restApi.postMethod('commentStatusChange',this.updatecomm).subscribe((resp:any) => {
      this.commentModal(id,'update');
    })
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

  changePagination(event){
    let cnt;
    if(event == 'load'){cnt = 1;}else{cnt=event}
    this.restApi.getMethod('getPaginatedBlogs/'+cnt).subscribe((resp:any) => {
      this.bloglist = resp.data.data;
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
