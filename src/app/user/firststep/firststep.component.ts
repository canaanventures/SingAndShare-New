import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import SwiperCore, { EffectFade, Swiper } from 'swiper/core';

SwiperCore.use([EffectFade]);

@Component({
  selector: 'app-firststep',
  templateUrl: './firststep.component.html',
  styleUrls: ['./firststep.component.css']
})
export class FirststepComponent implements OnInit {

  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"; 

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm){
    console.log(f.value)

  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  
}
