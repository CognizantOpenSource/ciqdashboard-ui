import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-image',
  templateUrl: './display-image.component.html',
  styleUrls: ['./display-image.component.scss']
})
export class DisplayImageComponent implements OnInit {
  imageURL: any;
  imageName : string = "new Image";

  @Input('imageConfig') set imageConfig(config) {
    this.imageURL= config.ImageSrc;
  }
  constructor() { }

  ngOnInit() {
  }

}
