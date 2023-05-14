import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BackgroundComponent } from '../Background/background.component';
import { LoginComponent } from './Login/login.component';
import { RegisterComponent } from './Register/register.component';

@Component({
  selector: 'app-login.screen',
  templateUrl: './login.screen.component.html',
  standalone: true,
  imports: [IonicModule, BackgroundComponent, LoginComponent, RegisterComponent],
})
export class LoginScreenComponent implements OnInit {

    public currentScreen = "login"
    
    public constructor() { }

    public ngOnInit() {
    }

    public onChangeScreen(newScreen: string): void {
        this.currentScreen = newScreen;
    }
}
