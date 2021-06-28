import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";  
  userlist :any = []; 
  tk:any = {}; totalRecords:Number = 1; p: Number = 1; pageIndexes:any =[];
  status; edit; srs_name = ''; role_nme; srslist:any = []; paginatecnt:Number;

  @Input() userdetails = {url:'',email:''}
  @Input() disableuser = {modified_by_user_id:'',userid:'',status:''}
  @Input() updateuser = {user_first_name:'',srs_id:'',user_last_name:'',user_email_id:'',mentee_email_id:'',role:'',role_id:0,mentor_email_id:'',user_id:'',modified_by:''}
  @Input() access = {user_id:'',blog_approve_access:false,blog_change_status_access:false,blog_access:false,calendar_add_access:false,calendar_access:false,attendance_access:false,event_access:false,user_access:false,sns_access:false,access_id:''}
  @Input() user = {user_id:''}

  constructor(public restApi: ApiService, public router: Router) { }

  ngOnInit(): void {
    this.fetchSRSlist();
    this.fetchRole();
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.role_nme = this.tk.role_name;
  }

  changeStatus(event,id){
    (event.target.checked) ? this.status = "Enable" : this.status = "Disable";
    this.disableuser.modified_by_user_id = this.tk.user_id;
    this.disableuser.userid = id;
    this.disableuser.status = this.status;

    this.restApi.postMethod('changeUserStatus',this.disableuser).subscribe((data:any) => {
      this.fetchUser(this.paginatecnt);
      alert("The status of the user has been changed successfully");
    })
  }

  submit(f: NgForm){
    if(this.edit==false){
      this.addUser(f);
      console.log('i am add submit')
    }else{
      this.updateUser(f);
      console.log('i am update submit')
    }
  
  }

  addUser(f:NgForm){
  //  event.preventDefault();
    var obj = {
      "first_name":(<HTMLInputElement>document.getElementById('mentee_first_name')).value,
      "last_name":(<HTMLInputElement>document.getElementById('mentee_last_name')).value,
      "email_id":(<HTMLInputElement>document.getElementById('mentee_email_id')).value,
      "mentor_email_id": this.tk.email,
      "srs_id": this.tk.srs_id,
      "role_id": (<HTMLInputElement>document.getElementById('mentee_user_type')).value,
      "parent_id":this.tk.user_id
    }

    if(this.role_nme == 'Admin'){
      obj.srs_id = this.updateuser.srs_id;
    }else{
      obj.srs_id = this.tk.srs_id;
    }
    
    this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(obj), 'secret key 123').toString());

    this.userdetails.url = this.encryptInfo;
    this.userdetails.email = (<HTMLInputElement>document.getElementById('mentee_email_id')).value;
    this.restApi.postMethod('sendUserLink',this.userdetails).subscribe((data:any) => {
      //this.router.navigate(['register/' + this.encryptInfo]);
      this.display = 'none';
     // console.log(f.value)
      alert('Mail has been sent to the Mentee');
      this.closeModal(f);
    });
  }

  fetchRole() {
    this.restApi.getMethod('getRole').subscribe((resp:any) => {
      this.userrole = resp.data;//resp.data;
      this.fetchUser('load');
    });
  }

  fetchSRSlist() {
    this.restApi.getMethod('getBranches/adduser')
      .subscribe((resp:any) => {
        this.srslist = resp.data;
      });
  }

  nextClick(){
    let num = Number(this.paginatecnt);
    if(num < this.pageIndexes.length){
      this.fetchUser(num+1);
    }
  }

  previousClick(){
    let num = Number(this.paginatecnt);
    if(num > 1){
      this.fetchUser(num-1);
    }
  }

  fetchUser(event) {
    let cnt;
    if(event == 'load'){cnt = 1;}else{cnt=event}
    let apiurl;
    if(this.tk.role_name == 'Captain'){
      apiurl = "getPaginatedSpecificUsers/C/"+this.tk.srs_id+"/"+cnt;
    }else if(this.tk.role_name == 'Mentor'){
      apiurl = "getPaginatedSpecificUsers/M/"+this.tk.user_id+"/"+cnt;
    }else{
      apiurl = "getPaginatedUsers/"+cnt;
    }
   
    this.restApi.getMethod(apiurl).subscribe((resp:any) => {
      this.userlist = resp.data.data;
      this.tk = jwt_decode(sessionStorage.getItem('user_token'));
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

  openModal(){
    this.edit = false;
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    (<HTMLInputElement>document.getElementById('mentee_user_type')).value = '10';
    (<HTMLInputElement>document.getElementById('mentee_user_type')).setAttribute("disabled", 'disabled');
  }

  closeModal(f:NgForm) {
    f.resetForm()
    this.display='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  editUser(id:any){
    console.log("hello i am edit")
    this.edit = true;
    this.restApi.getMethod('getUsers/'+id)
      .subscribe((resp:any) => {
        // (<HTMLInputElement>document.getElementById('mentee_first_name')).value = resp.data[0].user_first_name;
        // (<HTMLInputElement>document.getElementById('mentee_last_name')).value = resp.data[0].user_last_name;
        // (<HTMLInputElement>document.getElementById('mentee_email_id')).value = resp.data[0].user_email_id;
        // (<HTMLInputElement>document.getElementById('mentee_user_type')).value = resp.data[0].role_id;
        // (<HTMLInputElement>document.getElementById('mentor_email_id')).value = resp.data[0].mentor_email_id;
        this.updateuser = resp.data[0]
      console.log(this.updateuser);
       
        if(this.role_nme == 'Admin'){
          (resp.data[0].srs_id) ? this.updateuser.srs_id = resp.data[0].srs_id : this.updateuser.srs_id = '';
          (<HTMLInputElement>document.getElementById('mentee_user_type')).removeAttribute("disabled");
        }
        (<HTMLInputElement>document.getElementById('hidden_id')).value = id;
        this.display='block';
        document.getElementsByTagName('body')[0].classList.add('modal-open');
        this.updateuser = resp.data[0];
      });
  }

  updateUser(f:NgForm){
    this.edit = true;
    console.log('hello i am update')
    //event.preventDefault();
    this.updateuser.user_first_name = (<HTMLInputElement>document.getElementById('mentee_first_name')).value;
    this.updateuser.user_last_name = (<HTMLInputElement>document.getElementById('mentee_last_name')).value;
    this.updateuser.user_email_id = (<HTMLInputElement>document.getElementById('mentee_email_id')).value;
    this.updateuser.role = (<HTMLInputElement>document.getElementById('mentee_user_type')).value;
    this.updateuser.mentor_email_id = (<HTMLInputElement>document.getElementById('mentor_email_id')).value;
    this.updateuser.srs_id = (<HTMLInputElement>document.getElementById('srs_id')).value;
    this.updateuser.user_id = (<HTMLInputElement>document.getElementById('hidden_id')).value;

    this.updateuser.modified_by = this.tk.user_id;
    
    if(this.role_nme == 'Admin'){
      this.updateuser.srs_id = this.updateuser.srs_id;
    }else{
      this.updateuser.srs_id = this.tk.role_id;
    }
    console.log(this.updateuser)

    this.restApi.postMethod('updateUser',this.updateuser).subscribe((data:{}) => {
    this.fetchUser(this.paginatecnt);
     alert('User updated Successfully');
     this.closeModal(f);
    });
  }

  toggleAccess(id:any){
    this.user.user_id = id;
    this.restApi.postMethod('getAccessList',this.user).subscribe((resp:any) => {
      //this.access = resp.data[0];
      var classlen = document.getElementsByClassName('table-hidden-row');
      for(let i=0;i<classlen.length;i++){
        (document.getElementsByClassName("table-hidden-row")[i] as HTMLElement).style.display = 'none'
      }
      document.getElementById('row'+id).style.display = 'contents';
      let res = resp.data[0];
      for (var key in res) {
        if(key == 'access_id'){
          this.access.access_id = res[key];
        }else{
          if (res[key] == 1) {
            this.access[key] = true;
          }else{
            this.access[key] = false;
          }
        }
      }
    })   
  }

  assignAccess(userid,id){
    var checkboxes = document.getElementsByClassName(' chk_'+userid);
    for (var i=0; i<checkboxes.length; i++) {
      if ((checkboxes[i] as HTMLInputElement).checked) {
        this.access[checkboxes[i].getAttribute('id')] = 1;
      }else{
        this.access[checkboxes[i].getAttribute('id')] = 0;
      }
    }
    this.access.access_id = id;
    this.access.user_id = id;
    this.restApi.postMethod('updateAccess',this.access)
      .subscribe((resp:any) => {
        alert('Access assigned successfully');
      });
  }
}

