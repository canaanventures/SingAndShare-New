import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/app.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SwiperComponent } from "swiper/angular";


// import Swiper core and required modules
import SwiperCore, { Navigation, EffectCoverflow, Pagination } from "swiper/core";
SwiperCore.use([Navigation,EffectCoverflow, Pagination]);

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
  public display='none'; eventmodaldisplay = 'none';
  bloglist:any = []; galleryitems:any=[]; eventlist:any=[];
  imageToShow: any;
  modalimage:any;
  
  @Input() verifyuser = {user_email_id:''};
  
  constructor(public restApi: ApiService, public router: Router) {
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchBlog();
    this.fetchGallery();
    /* window.addEventListener('scroll', function() {
      if(window.pageYOffset >= 100){
        document.getElementById('header').classList.remove('header-transparent');
      }else{
        document.getElementById('header').classList.add('header-transparent');
      }
    }); */
  }


  customOptions: OwlOptions = {
    loop: true,
    // mouseDrag: true,
    // touchDrag: true,
    // pullDrag: true,
    dots: false,
    autoplay:true,
    navSpeed: 100,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  customOptionsevents: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay:true,
    navSpeed: 100,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3
      }
    },
    nav: true
  }
  customOptionsblog: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay:true,
    navSpeed: 500,
    navText: ['', ''],
    merge: false,
		mergeFit: true,
		autoWidth: false,
		startPosition: 0,
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: true
  }

  fetchEvents() {
    this.restApi.getMethod('getMultiEventImg').subscribe((resp:any) => {
      this.eventlist = resp.data;
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

  openEventRegister(id){
    this.eventmodaldisplay = 'block';
    document.getElementsByTagName('body')[0].classList.add('modal-open');
    document.getElementsByTagName('html')[0].classList.add('modal-open');
    document.getElementById('event_register_modal').style.display = 'block';
    (<HTMLInputElement>document.getElementById('event_hidden_id')).value = id;
   
    var el = document.getElementsByClassName('backdrop');
    for (var i = 0; i < el.length; i++) {
      Array.from(document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>)[i].style.display = 'block';
     
    }
    var el = document.getElementsByClassName('hide-first');
    for (var i = 0; i < el.length; i++) {
      Array.from(document.getElementsByClassName('hide-first') as HTMLCollectionOf<HTMLElement>)[i].style.display = 'none';      
    }
    (<HTMLInputElement>document.getElementById('contact_email_id')).removeAttribute('disabled');
    this.resetForm()
    //console.log('event image id',id)
    this.restApi.getImgMethod('getEventImg/'+id).subscribe((resp:any) => {
      this.createImageFromBlob(resp);

     // console.log('event image res',resp)
     // this.modalimage=resp;
      
    });


  }
  resetForm(){
    this.verifyuser  = { user_email_id:'' };
  }
  

  closeEventRegister(){
    this.eventmodaldisplay = 'none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.getElementsByTagName('html')[0].classList.remove('modal-open');
    document.getElementById('event_register_modal').style.display = 'none';
    var el = document.getElementsByClassName('backdrop');
    for (var i = 0; i < el.length; i++) {
      Array.from(document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>)[i].style.display = 'none';
    }
  }

  closeModal() {
    this.display='none';
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.getElementsByTagName('html')[0].classList.remove('modal-open');
    var el = document.getElementsByClassName('backdrop');
    for (var i = 0; i < el.length; i++) {
      Array.from(document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>)[i].style.display = 'none';
    }
  }

  fetchBlog(){
    this.restApi.getMethod('getMultiBlogImg').subscribe((resp:any) => {
      //if(resp.data.length > 0){
        this.bloglist = resp.data;
        /* this.restApi.getImgMethod('getBlogImg/'+this.bloglist.blog_id).subscribe((resp:any) => {
          this.createImageFromBlob(resp);
        }); */
      //}   
    });
  }

  fetchGallery(){
    this.restApi.getMethod('getGalleryImg/home').subscribe((resp:any) => {
      this.galleryitems = resp.data;
    });
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
}
