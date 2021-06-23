import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-srs',
  templateUrl: './srs.component.html',
  styleUrls: ['./srs.component.css']
})
export class SrsComponent implements OnInit {
  tk:any = {};
  srslist; caplist:any=[]; edit = false;
  display='none';

  @Input() srs = {srs_name:'',user_id:'',created_by:'',modified_by:'',srs_id:'',status:''}

  constructor(public restApi: ApiService, public router: Router) { }

  ngOnInit(): void {
    this.fetchSRSlist();
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.fetchCaptainList();
  }

  fetchSRSlist() {
    this.restApi.getMethod('getBranches/all')
      .subscribe((resp:any) => {
        this.srslist = resp.data;
      });
  }

  fetchCaptainList() {
    this.restApi.getMethod('getCaptain')
      .subscribe((resp:any) => {
        this.caplist = resp.data;
      });
  }

  submit(f){
    if(this.edit==false)
    this.addBranch(f);
    else
    this.updateBranch(f);
  }


  addBranch(f:NgForm) {
    f.resetForm()
    event.preventDefault();
    this.edit = false;
    this.srs.created_by = this.tk.user_id;
    this.restApi.postMethod('addBranch',this.srs)
      .subscribe((resp:any) => {
        this.closeModal(f);
        this.fetchSRSlist();
        alert('Branch Added Successfully');
      });
  }

  editModal(id){
    this.edit = true;
    this.srs.srs_id = id;
    this.restApi.getMethod('getBranches/'+id)
      .subscribe((resp:any) => {
        this.srs = resp.data[0];
        document.getElementsByTagName('body')[0].classList.add('modal-open');
        this.display='block';
      });    
  }

  updateBranch(f:NgForm) {
    event.preventDefault();
    this.edit = true;
    this.srs.modified_by = this.tk.user_id;   
    this.restApi.postMethod('editBranch',this.srs)
      .subscribe((resp:any) => {
        this.closeModal(f);
        this.fetchSRSlist();
        alert('Branch Updated Successfully');
      });
  }

  changeStatus(event,id){
    (event.target.checked) ? this.srs.status = "Enable" : this.srs.status = "Disable";
    this.srs.modified_by = this.tk.user_id;
    this.srs.srs_id = id;
    this.restApi.postMethod('changeBranchStatus',this.srs).subscribe((data:any) => {
      this.fetchSRSlist();
      alert("The status of the branch has been changed successfully");
    })
  }

  openModal(){
    this.srs.srs_name = '';
    this.srs.user_id = '';
    this.edit = false;
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
  }

  closeModal(f:NgForm) {
    f.resetForm()
    this.display='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }
}
