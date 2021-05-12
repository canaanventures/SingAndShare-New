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
  public userprofile:any;
  tk:any = {};

  @Input() email = {id:''};
  @Input() saveprofile = {profile_first_name:'', profile_last_name:'', profile_email_id:'', profile_contact_number:'',profile_address:'',profile_pincode:'',profile_city:'',profile_state:'',profile_role:'',user_id:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(){
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.email.id = this.tk.user_id;
    this.restApi.postMethod('getProfile',this.email).subscribe((data:{}) => {
        this.userprofile = data;
      })
  }

  updateProfile() {
    this.saveprofile.profile_first_name = (<HTMLInputElement>document.getElementById('profile_first_name')).value;
    this.saveprofile.profile_last_name = (<HTMLInputElement>document.getElementById('profile_last_name')).value;
    this.saveprofile.profile_email_id = (<HTMLInputElement>document.getElementById('profile_email_id')).value;
    this.saveprofile.profile_contact_number = (<HTMLInputElement>document.getElementById('profile_contact_number')).value;
    this.saveprofile.profile_address = (<HTMLInputElement>document.getElementById('profile_address')).value;
    this.saveprofile.profile_pincode = (<HTMLInputElement>document.getElementById('profile_pincode')).value;
    this.saveprofile.profile_city = (<HTMLInputElement>document.getElementById('profile_city')).value;
    this.saveprofile.profile_state = (<HTMLInputElement>document.getElementById('profile_state')).value;

    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.saveprofile.user_id = this.tk.user_id;
    /*this.saveprofile.profile_role = (<HTMLInputElement>document.getElementById('profile_role')).value;*/

    this.restApi.postMethod('updateProfile',this.saveprofile).subscribe((data:{}) => {     
      alert('Your Profile has been sent successfully.');   
    })
  }
}
