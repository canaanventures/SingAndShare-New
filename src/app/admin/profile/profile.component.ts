import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  tk:any = {}; images =''; imageToShow;

  @Input() email = {id:''};
  @Input() userprofile = {image_url:'',user_first_name:'', user_last_name:'', user_email_id:'', user_contact_number:'',user_address:'',user_pincode:'',user_city:'',user_state:'',role_name:'',user_id:''}
  @Input() reset = {password:'',email_id:'',confirmpassword:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.userprofile.user_id = this.tk.user_id;
    this.fetchUserDetails();
  }

  fetchUserDetails(){
    this.email.id = this.tk.user_id;
    this.restApi.postMethod('getProfile',this.email).subscribe((resp:any) => {
      this.userprofile = resp.data[0];
      this.restApi.getImgMethod('getUserImg/'+this.tk.user_id).subscribe((resp:any) => {
        this.createImageFromBlob(resp);
      })
    })
  }

  selectImage(event){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      this.images = file;
      this.readURL(event.target.files);
    }
  }

  triggerClick(){
    document.getElementById('blog-image').click();
  }

  updateProfile(event:any) {     
    event.preventDefault();
    if(this.images){
      const formData = new FormData();
      formData.append('image', this.images);
      let user_id = this.tk.user_id;

      this.restApi.postImgMethod('addUserImg/'+user_id,formData).subscribe((resp:any) => {
        this.updateEditProfile(resp);
      })
    }else{
      this.updateEditProfile('');
    }
  }

  updateEditProfile(resp){
    (resp != '') ? this.userprofile.image_url = resp.filepath : this.userprofile.image_url = '';
    this.restApi.postMethod('updateProfile',this.userprofile).subscribe((data:{}) => {     
      alert('Your Profile has been sent successfully.');
      this.images = '';
      this.restApi.getImgMethod('getUserImg/'+this.tk.user_id).subscribe((resp:any) => {
        this.createImageFromBlob(resp);
      })
    })
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

  resetPassword(event:any){
    event.preventDefault();
    this.reset.email_id = this.tk.email;
    this.restApi.postMethod('resetPassword',this.reset).subscribe((resp:any) => {
      alert(resp.message);
      this.reset.password = '';this.reset.confirmpassword = '';
    })
  }
}
