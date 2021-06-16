import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';

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

  fetchGallery(){
    this.restApi.getMethod('getGalleryImg/all').subscribe((resp:any) => {
      this.gallerylist = resp.data;
    });
  }
}
