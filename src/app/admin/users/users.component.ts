import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/app.service';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public encryptInfo : any;
  public userrole:any;
  display='none';
  userlist :any = [];
  tk:any = {};
  status; edit; srs_name; srslist:any = [];

  @Input() userdetails = {url:'',email:''}
  @Input() disableuser = {modified_by_user_id:'',userid:'',status:''}
  @Input() updateuser = {first_name:'',srs_id:null,last_name:'',email_id:'',role:'',mentor_email_id:'',user_id:'',modified_by:''}
  @Input() access = {user_id:'',blog_approve_access:'',blog_change_status_access:'',blog_access:'',calendar_add_access:'',calendar_access:'',attendance_access:'',event_access:'',user_access:'',sns_access:''}
  @Input() user = {user_id:''}

  constructor(public restApi: ApiService, public router: Router) { }

  ngOnInit(): void {
    this.fetchSRSlist();
    this.fetchRole();
  }

  changeStatus(event,id){
    (event.target.checked) ? this.status = "Enable" : this.status = "Disable";
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.disableuser.modified_by_user_id = this.tk.user_id;
    this.disableuser.userid = id;
    this.disableuser.status = this.status;

    this.restApi.postMethod('changeUserStatus',this.disableuser).subscribe((data:any) => {
      this.fetchUser();
      alert("The status of the user has been changed successfully");
    })
  }

  addUser(){
    var obj = {
      "first_name":(<HTMLInputElement>document.getElementById('mentee_first_name')).value,
      "last_name":(<HTMLInputElement>document.getElementById('mentee_last_name')).value,
      "email_id":(<HTMLInputElement>document.getElementById('mentee_email_id')).value,
      "mentor_email_id": this.tk.email,
      "role_id":(<HTMLInputElement>document.getElementById('mentee_user_type')).value
    }
    
    this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(obj), 'secret key 123').toString());

    this.userdetails.url = this.encryptInfo;
    this.userdetails.email = (<HTMLInputElement>document.getElementById('mentee_email_id')).value;

    this.restApi.postMethod('sendUserLink',this.userdetails)
      .subscribe((data:{}) => {
        //this.router.navigate(['register/' + this.encryptInfo]);
        alert('Mail has been sent to the Mentee');
      });
  }

  fetchRole() {
    this.restApi.getMethod('getRole')
      .subscribe((resp) => {
        this.userrole = resp;//resp.data;
        this.fetchUser();
      });
  }

  fetchSRSlist() {
    this.restApi.getMethod('getBranches/all')
      .subscribe((resp:any) => {
        this.srslist = resp.data;
      });
  }

  fetchUser() {
    this.restApi.getMethod('getUsers/all')
      .subscribe((resp) => {
        this.userlist = resp;//resp.data;
        this.tk = jwt_decode(sessionStorage.getItem('user_token'));
        console.log(this.tk.email);
      });
  }

  openModal(){
    this.edit = false;
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
  }

  closeModal() {
    this.display='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  editUser(id:any){
    this.edit = true;
    this.restApi.getMethod('getUsers/'+id)
      .subscribe((resp:any) => {
        (<HTMLInputElement>document.getElementById('mentee_first_name')).value = resp.data[0].user_first_name;
        (<HTMLInputElement>document.getElementById('mentee_last_name')).value = resp.data[0].user_last_name;
        (<HTMLInputElement>document.getElementById('mentee_email_id')).value = resp.data[0].user_email_id;
        (<HTMLInputElement>document.getElementById('mentee_user_type')).value = resp.data[0].role_id;
        (<HTMLInputElement>document.getElementById('mentor_email_id')).value = resp.data[0].mentor_email_id;
        (resp.data[0].srs_id) ? this.srs_name = resp.data[0].srs_id : this.srs_name = '';
        (<HTMLInputElement>document.getElementById('hidden_id')).value = id;
        this.display='block';
        document.getElementsByTagName('body')[0].classList.add('modal-open');
      });
  }

  updateUser(){
    this.updateuser.first_name = (<HTMLInputElement>document.getElementById('mentee_first_name')).value;
    this.updateuser.last_name = (<HTMLInputElement>document.getElementById('mentee_last_name')).value;
    this.updateuser.email_id = (<HTMLInputElement>document.getElementById('mentee_email_id')).value;
    this.updateuser.role = (<HTMLInputElement>document.getElementById('mentee_user_type')).value;
    this.updateuser.mentor_email_id = (<HTMLInputElement>document.getElementById('mentor_email_id')).value;
    this.updateuser.user_id = (<HTMLInputElement>document.getElementById('hidden_id')).value;
    this.updateuser.modified_by = this.tk.user_id;
    this.updateuser.srs_id = this.srs_name;

    this.restApi.postMethod('updateUser',this.updateuser)
      .subscribe((data:{}) => {
        this.closeModal();
        this.fetchUser();
        alert('User updated Successfully');
      });
  }

  toggleAccess(id:any){
    this.user.user_id = id;
    this.restApi.postMethod('getAccessList',this.user).subscribe((resp:any) => {
      this.access = resp.data[0];
      var classlen = document.getElementsByClassName('table-hidden-row');
      for(let i=0;i<classlen.length;i++){
        (document.getElementsByClassName("table-hidden-row")[i] as HTMLElement).style.display = 'none'
      }
      document.getElementById('row'+id).style.display = 'contents';
    })   
  }

  assignAccess(id){
    var checkboxes = document.getElementsByClassName(' chk_'+id);
    for (var i=0; i<checkboxes.length; i++) {
      if ((checkboxes[i] as HTMLInputElement).checked) {
        this.access[checkboxes[i].getAttribute('id')] = 1;
      }else{
        this.access[checkboxes[i].getAttribute('id')] = 0;
      }
    }
    this.access.user_id = id;
    this.restApi.postMethod('updateAccess',this.access)
      .subscribe((resp:any) => {
        alert('Access assigned successfully');
      });
  }
}

