import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/app.service';
import { url } from 'src/app/shared/app.constant';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import SwiperCore, { EffectFade, Autoplay, Swiper } from 'swiper/core';
import { SwiperOptions } from 'swiper';

//Swiper.use([Autoplay]);
//SwiperCore.use([EffectFade]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public slides:any;
  public eventslide: any;
  public imgArr: any = [];
  public imgurl : any;
  public display='none';
  bloglist:any = [];

  /*config: SwiperOptions = {
    allowTouchMove: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    },
    loop: true
  };*/
  
  @Input() verifyuser = {user_email_id:''};
  
  constructor(public restApi: ApiService, public router: Router) {
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchBlog();
    /* window.addEventListener('scroll', function() {
      if(window.pageYOffset >= 100){
        document.getElementById('header').classList.remove('header-transparent');
      }else{
        document.getElementById('header').classList.add('header-transparent');
      }
    }); */
  }

  fetchEvents() {
    this.restApi.getMethod('getEvents/home')
      .subscribe((resp) => {
        this.eventslide = resp;
        this.imgurl = url.imgurl;
        this.eventslide.data.forEach(e => {
          this.imgArr.push({
            id: e.event_id,
            url : this.imgurl + e.poster_url
          });
        })
        console.log(this.imgArr);
      });
  }

  openModal(id){
    this.display='block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    var el = document.getElementsByClassName('hide-first');
    for(var i=0;i<el.length;i++){
      Array.from(document.getElementsByClassName('hide-first') as HTMLCollectionOf<HTMLElement>)[i].style.display = 'none';
    }
    (<HTMLInputElement>document.getElementById('event_hidden_id')).value=id;
    (<HTMLInputElement>document.getElementById('verify_email_btn')).style.display = 'block';
  }

  closeModal() {
    this.display='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  fetchBlog(){
    this.restApi.getMethod('getBlogs/multiple/3')
      .subscribe((resp:any) => {
        this.bloglist = resp.data;
      });
  }
}
