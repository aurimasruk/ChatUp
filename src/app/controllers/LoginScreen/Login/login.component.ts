import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular/ionic-module';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { LocalStorageService } from 'src/app/services/local.storage.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class LoginComponent {
    @HostListener('window:resize', ['$event']) onWindowResize() {
        if (window.innerWidth < 580) {
            this.smallScreen = true;
        }
        else {
            // Big screen
            this.smallScreen = false;
        }
    }
    @Output() changeScreenEmitter = new EventEmitter<string>();
    
    public form: FormGroup;
    public isBusy: boolean = false;
    public errorMessage: string = "";
    public smallScreen: boolean = false;

    constructor(private _authService: AuthService,
                private _localStorageService: LocalStorageService,
                private _router: Router) { 
        this.form = this.createForm();
    }


    public createForm(): FormGroup {
        var newForm = new FormGroup({
            'username' : new FormControl(null, Validators.required),
            'password' : new FormControl(null, Validators.required),
        });

        return newForm;
    }
    
    public onFormSubmit(): void {
        if(!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        var username = this.form.value.username;
        var password = this.form.value.password;
        
        this.isBusy = true;
        lastValueFrom(this._authService.loginUser(username, password))
        .then(loginResult => {
            if (loginResult.currentUser == null || loginResult.token == null) {
                return;
            }
            
            this._localStorageService.currentUser = loginResult.currentUser;
            this._localStorageService.set("auth_token", loginResult.token);
            this._router.navigate([""])
        })
        .catch(err => {
            this.errorMessage = err?.error;
        })
        .finally(() => {
            this.isBusy = false;
        })
    }
  
  
    public changeScreen(): void {
        this.changeScreenEmitter.next("register");
    }
}
