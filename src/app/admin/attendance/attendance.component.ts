import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/app.service';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";
import { DndDropEvent } from 'ngx-drag-drop';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  tk:any = {}; encryptInfo : any;
  userlist:any = [];
  members:any = []; mentor:any=[];
  attendees:any; total:any;srslist; userModaldisplay='none';

  @Input() attendancedetails = {topic_name:'',speaker_name:'',srs_id:'',meeting_date:'',attendees:'',new_attendees:0,created_by:'',total_members:0,presentees:0,absentees:0}
  @Input() attendeesdtls = {vals:[],row:''}
  @Input() user = {mentee_first_name:'', mentee_last_name:'', mentee_email_id:'', mentor_email:'', srs_id:'', parent_id:''}
  @Input() userdetails = {url:'',email:''}
  
  constructor(public restApi: ApiService, public router: Router) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.fetchSRSlist();
    this.fetchUser();
    this.getMentorEmail();
  }

  

  fetchSRSlist() {
    this.restApi.getMethod('getBranches/all').subscribe((resp:any) => {
      this.srslist = resp.data;
      this.attendancedetails.srs_id = this.tk.srs_id;
    });
  }

  addAttendance(f:NgForm) {
   // event.preventDefault();
    this.attendancedetails.created_by = this.tk.user_id;
    this.restApi.postMethod('addAttendance',this.attendancedetails).subscribe((resp:any) => {
      let arr = [...this.done,...this.todo];
      let a=[], b=[];
      for(var i=0;i<arr.length;i++){
        let newArray = [];
        for(var key in arr[i]){
          newArray.push(arr[i][key]);
        }
        newArray.push(resp.rowid);
        b.push(newArray);
      }
      this.attendeesdtls.vals = b;
      this.restApi.postMethod('addAttendees',this.attendeesdtls).subscribe((resp:any) => {
        alert('Attendance added successfully');
        setTimeout(function(){
          location.reload();
        },1000)
      });
    });
  }

  todo = [];
  todo_new =[];
  done = [];

  move(item){
    //debugger;
    console.log('Moving items between lists',item);
     if (this.todo.indexOf(item.user_id) === -1) {
      this.todo.splice(this.todo.indexOf(item), 1);
      this.todo_new.push(item);
      console.log(this.todo_new)
    } else {
      this.todo_new.splice(this.todo_new.indexOf(item), 1);
      this.todo.push(item);
    }
    
  }

  moveanother(item){
    //debugger;
    console.log('Moving items between lists',item);
     if (this.todo_new.indexOf(item.user_id) === -1) {
      this.todo_new.splice(this.todo.indexOf(item), 1);
      this.todo.unshift(item);
      console.log(this.todo)
    } else {
      this.todo_new.splice(this.todo_new.indexOf(item), 1);
      this.todo.push(item);
    }
    
  }

  drop(event: CdkDragDrop<string[]>,type:any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.todo = this.todo.map(v => ({...v, attendance_status: "A"}))
    this.total = this.todo.length;
    this.done = this.done.map(v => ({...v, attendance_status: "P"}))
    this.attendees = this.done.length;
    this.attendancedetails.presentees = this.done.length;
    this.attendancedetails.absentees = this.todo.length;
  }

  fetchUser() {
    this.restApi.getMethod('attendanceUsers/'+this.tk.srs_id).subscribe((resp:any) => {
      this.todo = resp.data;
      this.total = resp.data.length;
      this.attendees = 0;
      this.attendancedetails.total_members = resp.data.length;
      this.attendancedetails.presentees = this.done.length;
      this.attendancedetails.absentees = this.todo.length;
    });
  }

  openModal(){
    this.userModaldisplay='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    document.getElementsByTagName('html')[0].classList.add('modal-open');
  }

  closeModal(g:NgForm) {
    g.resetForm()
    this.userModaldisplay='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.getElementsByTagName('html')[0].classList.remove('modal-open');
  }

  mentorEmailDropdown(event){
    this.user.mentor_email = event.target.options[event.target.options.selectedIndex].text;
  }

  getMentorEmail(){
    this.restApi.getMethod('getMentors/'+this.tk.srs_id).subscribe((resp:any) => {
      this.mentor = resp.data;
    });
  }

  addUser(g:NgForm){
    //event.preventDefault();
    var obj = {
      "first_name": this.user.mentee_first_name,
      "last_name": this.user.mentee_last_name,
      "email_id": this.user.mentee_email_id,
      "mentor_email_id":  this.user.mentor_email,
      "srs_id":  this.tk.srs_id,
      "role_id": 10,
      "parent_id": this.user.parent_id
    }
    this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(obj), 'secret key 123').toString());
    this.userdetails.url = this.encryptInfo;
    this.userdetails.email = this.user.mentee_email_id;

    this.restApi.postMethod('sendUserLink',this.userdetails).subscribe((data:any) => {
      alert(data.message);
      if(data.status == 200){
        this.userModaldisplay = 'none';
      }
    });
  }
}
