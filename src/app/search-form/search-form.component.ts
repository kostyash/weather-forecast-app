import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {
  cityForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cityForm = this.fb.group({
      city: ['']
    })
  }


  ngOnInit(): void {

  }

  onSubmit(): void {
    console.log(this.cityForm.value);
  }
}
