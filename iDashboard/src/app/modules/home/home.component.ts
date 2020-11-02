import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {
  }
  ngOnInit() {
  }
} 
export function cut(value: string, len: number) {
  return (value || 'user').substr(0, len);
}
