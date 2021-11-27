import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Admin } from 'src/app/models/admin.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  showMessage: number = 0;
  admin: Admin = new Admin();
  administrators: Admin[] = [];

  constructor(public apiService: ApiService, private formBuilder: FormBuilder) {
    this.submitted = false;
   // Create Form Group
    this.form = this.formBuilder.group(
      {
        _id: [''],
        fullName: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        status: [false]
      }
    );
  }

  ngOnInit(): void { 
    this.refreshAdministratorList();
  }

  resetForm() {
    this.submitted = false;
    this.showMessage = 0;
    this.form.reset();
  }

  refreshAdministratorList() {
    this.apiService.getAdministrators().subscribe((data: any) => {
      this.administrators = data as Admin[];
    }, error => { console.log(error); });
  }

  editAdministrator(admin:Admin) {
    this.submitted = false;
    this.showMessage = 0;
    this.form.patchValue({_id: admin._id, fullName: admin.fullName, username: admin.username, email: admin.email, status: admin.status});
  }

  removeAdministrator(_id:any) {
    this.submitted = false;
    this.showMessage = 0;
    this.apiService.removeAdministrator(_id).subscribe((data: any) => {
      this.form.reset();
      this.refreshAdministratorList();
    }, error => { console.log(error); });
  }

  onSubmit() {
    // Assign Values to Variables
    this.submitted = true;
    this.showMessage = 0;

    // Validate Form Entires
    if (this.form.valid) {
      let admin: Admin = this.form.value;
      admin.username = admin.username.toLowerCase();
      if (admin.status != true) {
        admin.status = false;
      }

      if (!this.form.value._id) {
        this.apiService.postAdministrator(admin).subscribe((res: any) => {
          console.log(res);
          this.submitted = false;
          if (res) {
            this.showMessage = 2;
            this.form.reset();
            this.refreshAdministratorList();
            return;
          } else {
            this.showMessage = 1;
            return;
          }
        }, error => { console.log(error); });
      } else {
        this.apiService.putAdministrator(admin).subscribe((res: any) => {
          console.log(res);
          this.submitted = false;
          if (res) {
            this.showMessage = 2;
            this.form.reset();
            this.refreshAdministratorList();
            return;
          } else {
            this.showMessage = 1;
            return;
          }
        }, error => { console.log(error); });
      }
    }
  }

}
