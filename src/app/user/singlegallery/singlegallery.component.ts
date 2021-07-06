import { Component, OnInit,ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'src/app/shared/app.service';
import SwiperCore, {Navigation, EffectFade, Autoplay, Swiper, Thumbs } from 'swiper/core';
import { SwiperOptions } from 'swiper';


// install Swiper modules
SwiperCore.use([Navigation, Thumbs]);
SwiperCore.use([ Navigation, EffectFade]);
SwiperCore.use([  Autoplay]);

@Component({
  selector: 'app-singlegallery',
  templateUrl: './singlegallery.component.html',
  styleUrls: ['./singlegallery.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SinglegalleryComponent implements OnInit {
  public slides:any;
  public eventslide: any;
  gallery:any = []; 
  param;
  thumbsSwiper: any;
 
  
  config: SwiperOptions = {
    allowTouchMove: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    },
    loop: true
  };

  

  constructor(public restApi: ApiService, public router: Router, public activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.param = this.activatedroute.snapshot.params;
    this.fetchGallery();
    
    
  }
  
  fetchGallery(){   
    this.restApi.getMethod('getGalleryImg/'+this.param.event_id).subscribe((resp:any) => {
      this.gallery = resp.data;
     
    });
  }

  goToNextPage() {
    //this.homeSlide.swiper.slideNext();
  }
}
