import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { EffectCoverflow, Pagination } from "swiper/core";
SwiperCore.use([EffectCoverflow, Pagination]);
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  gallerylist;
  

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.fetchGallery();
  }
  customOptions: OwlOptions = {
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

  fetchGallery(){
    this.restApi.getMethod('getGalleryImg/all').subscribe((resp:any) => {
      this.gallerylist = resp.data;
    });
  }
}
