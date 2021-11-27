import { Product } from 'src/app/models/product.model';
import { Component, Injectable, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Category } from 'src/app/models/category.model';

@Pipe({
  name: 'filter'
})
@Injectable()
export class SearchFilterPipe implements PipeTransform {
  transform(items: Product[], value: string): any[] {
    if (!items || !value) {
      return items;
    }
    return items.filter(e => e.categoryId.includes(value));
  }
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  showMessage: number = 0;
  product: Product = new Product();
  products: Product[] = [];
  categories: Category[] = [];
  editProduct: boolean = false;
  imgSRC = './assets/images/preview-icon.png';
  imgALT = '';
  file:any;
  imgPATH = this.apiService.baseUri + '/img/';

  constructor(public apiService: ApiService, private formBuilder: FormBuilder) {
    this.submitted = false;
    this.imgSRC = './assets/images/preview-icon.png';
   // Create Form Group
    this.form = this.formBuilder.group(
      {
        _id: [null],
        name: [null, Validators.required],
        img: [null],
        avatar: [null],
        categoryId: [null, Validators.required],
        size: [null, Validators.required],
        price: [, [Validators.required, Validators.min(1)]],
        description: [null, Validators.required],
        alt: [null, Validators.required],
        quantity: [, [Validators.required, Validators.min(1)]],
        status: [0]
      }
    );
  }

  ngOnInit(): void {
    this.refresh();
  }

  resetForm() {
    this.imgSRC = './assets/images/preview-icon.png';
    this.form.reset();
  }

  refresh() {
    this.apiService.getCategories().subscribe((res:any) => {
      this.categories = res as Category[];
    });
    this.apiService.getProducts().subscribe((res:any) => {
      this.products = res as Product[];
      this.products.forEach(product => {
        product.img = this.apiService.baseUri + '/img/' + product.img;
      });
    });
  }

  getProductInfo(product:Product) {
    this.editProduct = true;
    this.showMessage = 0;
    this.imgSRC = './assets/images/preview-icon.png';
    this.form.reset();
    let status = false;
    if (product.status == 1) {
      status = true;
    } else {
      status = false;
    }
    this.form.patchValue({
      _id: product._id,
      categoryId: product.categoryId,
      name: product.name,
      size: product.size,
      price: product.price,
      description: product.description,
      alt: product.alt,
      quantity: product.quantity,
      status: status
    });
    this.imgSRC = product.img;
    this.imgALT = product.alt;
  }

  onFileChange(event:any) {
    this.showMessage = 0;
    this.file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: this.file
    });
    this.form.get('avatar').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imgSRC = reader.result as string;
    }
    reader.readAsDataURL(this.file)
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.valid) {
      console.log('invalid');
      return;
    }
    console.log('valid');
    let formdata = new FormData();
    formdata.append('_id',this.form.value._id);
    formdata.append('categoryId',this.form.value.categoryId);
    formdata.append('name',this.form.value.name);
    formdata.append('size',this.form.value.size);
    formdata.append('price',this.form.value.price);
    formdata.append('description',this.form.value.description);
    formdata.append('alt',this.form.value.alt);
    formdata.append('quantity',this.form.value.quantity);
    if (this.form.value.avatar) {
      formdata.append('img',this.form.value.avatar.name);
      console.log(this.form.value.avatar.name);
    }
    formdata.append('imgFile',this.form.value.avatar);

    if (this.form.value.status == true) {
      formdata.append('status', '1');
    } else {
      formdata.append('status', '0');
    }
    
    if (!this.form.value._id) {
      this.apiService.postProduct(formdata).subscribe((res: any) => {
        console.log(res);
        this.submitted = false;
        if (res) {
          this.showMessage = 2;
          this.form.reset();
          this.imgSRC = './assets/images/preview-icon.png';
          this.refresh();
        } else {
          this.showMessage = 1;
        }
      }, error => { console.log(error); });
    } else {
      this.apiService.putProduct(this.form.value._id, formdata).subscribe((res: any) => {
        console.log(res);
        this.submitted = false;
        if (res) {
          this.showMessage = 2;
          this.refresh();
        } else {
          this.showMessage = 1;
        }
      }, error => { console.log(error); });
    }
  }
}
