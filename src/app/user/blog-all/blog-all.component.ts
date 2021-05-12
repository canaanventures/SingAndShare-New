import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/app.service';

@Component({
  selector: 'app-blog-all',
  templateUrl: './blog-all.component.html',
  styleUrls: ['./blog-all.component.css']
})
export class BlogAllComponent implements OnInit {
  bloglist;

  constructor(public restApi: ApiService) { }

  ngOnInit(): void {
    this.fetchApprovedBlogs();
  }

  fetchApprovedBlogs(){
    this.restApi.getMethod('getApprovedBlogs').subscribe((resp:any) => {
      this.bloglist = resp.data;
    });
  }
}
