import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import jwt_decode from "jwt-decode";
import { identifierModuleUrl } from '@angular/compiler';
import { fakeAsync } from '@angular/core/testing';
import { state } from 'src/app/shared/app.state';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pcs',
  templateUrl: './pcs.component.html',
  styleUrls: ['./pcs.component.css']
})
export class PcsComponent implements OnInit {
  tk:any = {}; checklist:any = []; viewdata:any; displayform ='block'; displayDtls = 'none'; edit=false;
  public option_str:any;

  totalRecords:Number = 1; p: Number = 1; pageIndexes:any =[]; paginatecnt:Number;

  @Input() pcs = {pcs_id:'',name_of_user:'',relation_with_user:'',city:'',state:'',current_status:'',user_id:'',status:'',pcs_description:''}

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    //this.getPCS('all','load');
    this.changePagination('load');
  }

  addPCS(f:NgForm){
    alert ('hi i am test from add pcs')
    event.preventDefault();
    this.pcs.user_id = this.tk.user_id;
    this.pcs.status = 'Y';
    this.restApi.postMethod('addPCS',this.pcs).subscribe((resp:any) => {
<<<<<<< HEAD
      this.getPCS('all','add');
      //f.resetForm();
     this.resetForm();
     alert(JSON.stringify(resp.message));
=======
      //this.getPCS('all','add');
      this.changePagination(this.paginatecnt);
      this.resetForm();
      alert(resp.message);
>>>>>>> 9524e35278c47ef79c81f3815ab6a06ad05b3359
    })
  }

  getPCS(type,mode){
    this.restApi.getMethod('getPCS/'+this.tk.user_id+'/'+type).subscribe((resp:any) => {
      if(type == 'all' && mode != 'view'){
        this.checklist = resp.data;
        this.print_state();
      }else if(mode == 'view'){
        this.displayform = 'none';
        this.displayDtls = 'block';
        this.viewdata = resp.data[0];
      }else{
        this.pcs = resp.data[0];
        this.edit = true;
      }
    })
  }

  backToList(){
    this.displayDtls = 'none';
    this.displayform = 'block';
  }

  ChangePCSStatus(event,id){
    (event.target.checked) ? this.pcs.status = "Y" : this.pcs.status = "N";
    this.pcs.pcs_id = id;
    this.restApi.postMethod('changeStatusOfPCS',this.pcs).subscribe((resp:any) => {
      //this.getPCS('all','status');
      this.changePagination(this.paginatecnt);
      alert(resp.message);
    })
  }

  resetForm(){
    this.pcs = {pcs_id:'',name_of_user:'',relation_with_user:'',city:'',state:'',current_status:'',user_id:'',status:'',pcs_description:''}
  }

  upDatePCS(f:NgForm){
    alert ('hi i am test from update pcs')
    event.preventDefault();
    this.pcs.pcs_id = this.pcs.pcs_id;
    this.restApi.postMethod('upDatePCS',this.pcs).subscribe((resp:any) => {
<<<<<<< HEAD
      this.getPCS('all','update');
      //f.resetForm()
=======
      //this.getPCS('all','update');
      this.changePagination(this.paginatecnt);
>>>>>>> 9524e35278c47ef79c81f3815ab6a06ad05b3359
      this.resetForm();
      this.edit = false;
     alert(resp.message);
    })
  }

  print_state(){
    this.option_str = document.getElementById("contact_state");
    this.option_str.length=0;
    this.option_str.options[0] = new Option('Select State','');
    this.option_str.selectedIndex = 0;
    for (var i=0; i< state.state_arr.length; i++) {
      this.option_str.options[this.option_str.length] = new Option(state.state_arr[i], state.state_arr[i]);
    }
  }

  print_city(event:Event){
    let city_index:number = event.target["selectedIndex"];
    this.option_str = document.getElementById("contact_city");
    this.option_str.length=0;
    this.option_str.options[0] = new Option('Select City','');
    this.option_str.selectedIndex = 0;
    let city_arr = state.s_a[city_index].split("|");
    for (var i=0; i<city_arr.length; i++) {
      this.option_str.options[this.option_str.length] = new Option(city_arr[i],city_arr[i]);
    }
  }

  changePagination(event){
    let cnt;
    if(event == 'load'){cnt = 1;}else{cnt=event}
    this.restApi.getMethod('getPaginatedPCS/'+this.tk.user_id+'/'+cnt).subscribe((resp:any) => {
      this.checklist = resp.data.data;
      if(event == 'load'){
        this.print_state();
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
