import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { url } from 'src/app/shared/app.constant';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from "jwt-decode";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  public form : any;
  public formelem : any;
  public resp:any;
  public eventtypelist :any = [];
  public eventstatus :any = [];
  display='none'; typedisplay='none'; gallerydisplay='none';
  public eventlist:any = []; public pasteventlist:any = [];
  public imgurl = url.imgurl;
  edit = false; startDate; endDate;
  tk:any = {}; storedFiles:any = []; images:any=[]; galleryid; mainimages; eventimages;

  @Input() registeruser = {contact_sal:'',contact_first_name:'', contact_last_name:'', contact_email_id:'', contact_number:'',contact_state:'',contact_city:'',contact_address:'',contact_referrer:'',event_id:''};
  @Input() eventtype = {event_type:'',multiple_images:'',created_by_user_id:''}
  @Input() addevent = {event_id:'',event_name:'',event_start_date:'', event_end_date:'', cost_per_person:'', venue_name:'',description:'',event_type_id:'',created_by_user_id:'',modified_user_id:'',imgurl:'',status:'',connection_link:''}; // ,event_status_id:''

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.tk = jwt_decode(sessionStorage.getItem('user_token'));
    this.getEventType();
    this.getEventStatus();
    this.getEvents();
    this.getPastEvents();
  }

  eventsTab(id){
    var el = Array.from(document.getElementsByClassName('tab-pane') as HTMLCollectionOf<HTMLElement>);
    var tab_el = Array.from(document.getElementsByClassName('event-tab') as HTMLCollectionOf<HTMLElement>);
    for(var i=0;i<el.length;i++){
      el[i].style.display = 'none';
      el[i].classList.remove('active');
      el[i].classList.remove('in');
    }
    for(var i=0;i<tab_el.length;i++){
      tab_el[i].classList.remove('active');
    }
    document.getElementById(id).style.display = 'block';
    document.getElementById(id).classList.add('active');
    document.getElementById(id).classList.add('in');
    document.getElementById(id+'_tab').classList.add('active');
  }

  submit(f){
    if(this.edit==false)
    this.addEvent(f);
    else
    this.updateEvent(f);
  }

  addEvent(f:NgForm){
    //debugger;
    this.edit = false;
   // event.preventDefault();
     if(this.eventimages !== ''){
      const formData = new FormData();
       formData.append('image', this.eventimages);
      //formData.append('image', this.addevent.imgurl);
      let nme = this.addevent.event_name.split(' ').join('_');
      let dte = (<HTMLInputElement>document.getElementById('event_start_date')).value;
     // console.log(dte)
      dte = dte.replace(/-/g, '_').replace(/:/g, '_');
      this.restApi.postImgMethod('addEventImg/'+dte+'/'+nme,formData).subscribe((data:any) => {
       // console.log(data)
       this.addevent.imgurl = data.filepath;
       //  console.log(this.addevent.imgurl)
        this.addEventData(f);
      //  console.log(f.value)
      })
    }else{
      this.addevent.imgurl = '';
      this.addEventData(f);
    }
  }

  addEventData(f:NgForm){
    this.addevent.created_by_user_id = this.tk.user_id;
    this.restApi.postMethod('addEvent',this.addevent).subscribe((resp:any) => {
      this.resp = resp.data;
      this.getEvents();
      this.closeModal(f)
      alert(resp.message);
      this.eventimages = '';
    })
  }

  changeDateFormat(newdte){
    //debugger;
    let create_dte = new Date(newdte); //changing date 30th to 1st
   // console.log('this is newdte'+newdte)
   // console.log('this is create_dte'+create_dte)
    let month, dte, hrs, mins;
    (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
    ((create_dte.getMonth()+1) < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
    (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
    (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();
    return create_dte.getFullYear()+'-'+month+'-'+dte+' '+hrs+':'+mins;
  }

  changeMinMax(newdte){
    let create_dte = new Date(newdte);
    let month, dte, hrs, mins;
    (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
    ((create_dte.getMonth()+1) < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
    (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
    (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();
    return create_dte.getFullYear()+'-'+month+'-'+dte+'T'+hrs+':'+mins;
  }

  updateEvent(f:NgForm){
    console.log('update')
    // console.log(this.addevent.event_start_date)
    // let val = this.changeDateFormat(this.addevent.event_start_date)
    // console.log(val)
  // event.preventDefault();
    if(this.eventimages != ''){
      const formData = new FormData();
      formData.append('image', this.eventimages);
     let nme = this.addevent.event_name.split(' ').join('_');
      let dte = (<HTMLInputElement>document.getElementById('event_start_date')).value;
     //let dte = this.addevent.event_start_date
      dte = dte.replace(/-/g, '_').replace(/:/g, '_');
      this.restApi.postImgMethod('addEventImg/'+dte+'/'+nme,formData).subscribe((data:any) => {
      
      this.addevent.imgurl = data.filepath;  //error
      this.updateEventData(f);
      
     // this.closeModal(f);
      })
    }else{
     this.addevent.imgurl = '';
      this.updateEventData(f);
    }
  }
  
  updateEventData(f:NgForm){
    console.log('??????????',(<HTMLInputElement>document.getElementById('event_start_date')).value)
    this.addevent.modified_user_id = this.tk.user_id;
    this.addevent.event_start_date = this.changeDateFormat((<HTMLInputElement>document.getElementById('event_start_date')).value);
    console.log('##########',this.addevent.event_start_date)
    this.addevent.event_end_date = this.changeDateFormat((<HTMLInputElement>document.getElementById('event_end_date')).value);   
    this.restApi.postMethod('editEvent',this.addevent).subscribe((resp:any) => {
      this.getEvents();
      alert(resp.message);
      this.addevent.imgurl = '';
      this.closeModal(f);
    })
  }

  editEvent(id:any){
    this.edit = true;
    this.addevent.event_id = id;
    this.restApi.getMethod('getEvents/'+id).subscribe((resp:any) => {
      this.addevent = resp.data[0];
      this.openModal();
      setTimeout(function(){
        let create_dte = new Date(resp.data[0].event_start_date);
        let month, dte, hrs, mins;
        (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
        (create_dte.getMonth() < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
        (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
        (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();

        (<HTMLInputElement>document.getElementById('event_start_date')).value = create_dte.getFullYear()+'-'+month+'-'+dte+'T'+hrs+':'+mins;

        create_dte = new Date(resp.data[0].event_end_date);
        (create_dte.getDate() < 10) ? dte = '0'+create_dte.getDate() : dte = create_dte.getDate();
        (create_dte.getMonth() < 10) ? month = '0'+(create_dte.getMonth()+1) : month = (create_dte.getMonth()+1);
        (create_dte.getHours() < 10) ? hrs = '0'+create_dte.getHours() : hrs = create_dte.getHours();
        (create_dte.getMinutes() < 10) ? mins = '0'+create_dte.getMinutes() : mins = create_dte.getMinutes();
        (<HTMLInputElement>document.getElementById('event_end_date')).value = create_dte.getFullYear()+'-'+month+'-'+dte+'T'+hrs+':'+mins;
      },100)
    });  
  }

  changeStatus(event,id){
    (event.target.checked) ? this.addevent.status = "Enable" : this.addevent.status = "Disable";
    this.addevent.modified_user_id = this.tk.user_id;
    this.addevent.event_id = id;
    this.restApi.postMethod('changeEventStatus',this.addevent).subscribe((data:any) => {
      this.getEvents();
      alert("The status of the event has been changed successfully");
    })
  }

  getEventType() {
    this.restApi.getMethod('getEventType')
      .subscribe((resp:any) => {
        this.eventtypelist = resp.data;
      })
  }

  getEvents() {
    this.restApi.getMethod('getEvents/all').subscribe((resp) => {
      this.eventlist = resp;
    })
  }

  getPastEvents() {
    this.restApi.getMethod('pastEvents').subscribe((resp:any) => {
      this.pasteventlist = resp.data;
      console.log( this.pasteventlist)
    })
  }

  getEventStatus() {
    this.restApi.getMethod('getEventStatus')
      .subscribe((resp) => {
        this.eventstatus = resp;
      })
  }

  openModal(){
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    var dte = new Date();
    this.startDate = this.changeMinMax(dte);
    this.endDate = this.changeMinMax(dte);
  }

  startDteChange(){
    this.endDate = this.addevent.event_start_date;
  }

  closeModal(f:NgForm) {
   f.resetForm();
    this.display='none';
    this.typedisplay='none';
    this.checkedhttp = true
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  openEventType(){
    this.typedisplay='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
  }

  addEventType(g:NgForm){
  //  event.preventDefault();    
    this.eventtype.created_by_user_id = this.tk.user_id;
    this.restApi.postMethod('addEventType',this.eventtype).subscribe((resp:any) => {
      this.getEventType();
      this.closeModal(g);
      alert(resp.data[0].message);
    })
  }

  openGallery(id){
    this.gallerydisplay = 'block';
    this.galleryid = id;
  }
 
  imageurls =[];
  base64String: string;
  name: string;
  imagePath: string;
 
  // removeImageEdit(i, imagepath) {
  //   this.imageDeleteFrom.value.id = i;
  //   this.imageDeleteFrom.value.ImagePath = imagepath;
  // }

  removeImage(i) {
    this.imageurls.splice(i, 1);
    this.images.splice(i, 1);
    console.log(this.images)
   // (<HTMLInputElement>document.getElementById('event_gallery_img')).value= "";
   
  }
  onSelectFile(event,h:NgForm) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files;
      for (let i = 0; i < filesAmount.length; i++) {
        this.images.push(filesAmount[i]);
        var reader = new FileReader();
        reader.onload = (event: any) => {
         this.imageurls.push({ base64String: event.target.result, });
        // this.eventtype.multiple_images = this.images
        // console.log(h.controls.multiple_images.value)
       
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }



  handleFileSelect(e){
    if(e.target.files.length > 0){
      var files = e.target.files, filesArr = Array.prototype.slice.call(files), html;
      for (var i = 0; i < e.target.files.length; i++) { 
        this.images.push(e.target.files[i]);
      }
      filesArr.forEach(function(f) {
        var reader = new FileReader();
        var node = document.getElementById('preview_gallery_img');
        reader.onload = function(e) {
          html = "<div class='preview-img-div' style='width:150px;height:150px;margin:10px 0;position:relative;'><img src=\"" + e.target.result + "\" data-file='" + f.name + "' class='selFile w-100 h-100' title='Click to remove'></div>"; 
          var txt3 = document.getElementById("dummyelem");
          txt3.innerHTML = html;
          node.appendChild(txt3.firstChild);
        }
        reader.readAsDataURL(f);
      });
    }
  }
  // <i class='fa fa-times cancel-img' aria-hidden='true' (click)='removeFile($event)' style='position: absolute;top:-5px;right:5px;'></i>

  removeFile(e) {
    debugger;
    //var file = $(this).data("file");
    for (var i = 0; i < this.storedFiles.length; i++) {
      if (this.storedFiles[i].name) { // === file
        this.storedFiles.splice(i, 1);
        break;
      }
    }
    //$(this).parent().remove();
  }

  closegalModal(h:NgForm){
    this.gallerydisplay = 'none';
    document.getElementById('preview_main_img').innerHTML = '';
    document.getElementById('preview_gallery_img').innerHTML = '';
    document.getElementById('dummymainelem').innerHTML = '';
    document.getElementById('dummyelem').innerHTML = '';
    (<HTMLInputElement>document.getElementById('event_gallery_img')).value = '';
    (<HTMLInputElement>document.getElementById('event_main_img')).value = '';
    this.mainimages = '';
    this.images = [];
    h.resetForm()
  }

  selectMainImage(e){
    if(e.target.files.length > 0){
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      var html;
      this.mainimages = e.target.files[0];
      filesArr.forEach(function(f) {
        var reader = new FileReader();
        var node = document.getElementById('preview_main_img');
        reader.onload = function(e) {
          html = "<div class='preview-main-img-div' style='width:150px;height:150px;position:relative;'><img src=\"" + e.target.result + "\" data-file='" + f.name + "' class='selFile w-100 h-100' title='Click to remove'> </div>"; 
          var txt3 = document.getElementById("dummymainelem");
          txt3.innerHTML = html;
          node.appendChild(txt3.firstChild);
        }
        reader.readAsDataURL(f);
      });
    }
  }
 
  selectImage(event){
    //debugger;
    if(event.target.files.length > 0){
      const file = event.target.files[0];
       this.eventimages = file;
    
    }
  }

  addGallery(h:NgForm){
 //   debugger;
    //event.preventDefault();
    const formData = new FormData();
    for (var i = 0; i < this.images.length; i++) { 
      formData.append("image", this.images[i]);
    }
    this.restApi.postImgMethod('addGalleryImg/'+this.galleryid,formData).subscribe((resp:any) => {
      const formData = new FormData();
      formData.append("image", this.mainimages);
      this.restApi.postImgMethod('addGalleryMainImg/'+this.galleryid,formData).subscribe((resp:any) => {
        this.closegalModal(h);
        alert(resp.message);
      });
    })
  }

  deleteGallery(id){
    this.restApi.getMethod('deleteGalleryImg/'+id).subscribe((resp:any) => {
      alert(resp.message);
    })
  }

  http_string:string
  checkedhttp:boolean
  includehttp(event:any){
    this.http_string = event.target.value;
    if(this.http_string.includes('http'))
     this.checkedhttp = true
      else 
      this.checkedhttp = false
     // f.resetForm();
  }
}
