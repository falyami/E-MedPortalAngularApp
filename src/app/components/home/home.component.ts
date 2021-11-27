import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Declare Variables, Objects, & Arrays
  categories: Category[] = [];
  
  constructor(private router: Router, private apiService: ApiService) {
    this.getAllCategories();
  }

  ngOnInit(): void {}

  getAllCategories(){
    this.categories = [];
    this.apiService.getCategories().subscribe((data: any) => {
      this.categories = data as Category[];
    }, error => { console.log(error); });
  }

  navigateToProducts(id:any) {
    this.router.navigate(['/categories', id]);
  }
}
