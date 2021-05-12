import { Component, OnInit } from '@angular/core';
import SwiperCore, { EffectFade, Swiper } from 'swiper/core';

SwiperCore.use([EffectFade]);

@Component({
  selector: 'app-firststep',
  templateUrl: './firststep.component.html',
  styleUrls: ['./firststep.component.css']
})
export class FirststepComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
}
