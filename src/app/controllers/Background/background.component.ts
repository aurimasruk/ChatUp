import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular/ionic-module';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
   standalone: true,
   imports: [IonicModule], 
})
export class BackgroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
