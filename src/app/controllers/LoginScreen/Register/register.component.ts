import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular/ionic-module';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [IonicModule]
})
export class RegisterComponent {
    @Output() changeScreenEmitter = new EventEmitter<string>();
      
    public form: FormGroup;
    public isBusy: boolean = false;
    public errorMessage: string = "";

    constructor(private _usersService: UsersService
        ) { 
        this.form = this.createForm();
    }


    public createForm(): FormGroup {
        var newForm = new FormGroup({
            username : new FormControl(null, Validators.required),
            password : new FormControl(null, Validators.required),
            password2: new FormControl(null, Validators.required),
        });

        
        return newForm;
    }
    
    public onFormSubmit(): void {
        if(!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        if(this.form.value.password != this.form.value.password2) {
            this.errorMessage = "Passwords do not match";
            return;
        }

        var model = new User;
        model.username = this.form.value.username;
        model.password = this.form.value.password;
        
        this.isBusy = true;
        lastValueFrom(this._usersService.createUser(model))
            .then(() => {
                this.changeScreen();
            })
            .catch(err => {
                this.errorMessage = err?.error;
            })
            .finally(() => this.isBusy = false);
        
    }
    
    public changeScreen(): void {
        this.changeScreenEmitter.next("login");
    }
}
