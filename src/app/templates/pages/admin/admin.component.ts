import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [AdminProjectService] // Add this line to provide the service
})
export class AdminComponent implements OnInit {
  projectForm!: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private adminProjectService: AdminProjectService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.adminProjectService.getProjects().subscribe(
      projects => console.log(projects),
      error => console.error('Error fetching projects:', error)
    );
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      tags: this.fb.array([this.fb.control('')]),
      description: this.fb.array([this.fb.control('')]),
      technologies: this.fb.array([this.fb.control('')]),
      imageUrl: this.fb.group({
        grid: ['', Validators.required],
        list: ['', Validators.required]
      }),
      link: ['', Validators.required]
    });
  }

  // Helper getters for form arrays
  get tagsArray(): FormArray {
    return this.projectForm.get('tags') as FormArray;
  }

  get descriptionArray(): FormArray {
    return this.projectForm.get('description') as FormArray;
  }

  get technologiesArray(): FormArray {
    return this.projectForm.get('technologies') as FormArray;
  }

  // Methods to add new form controls to arrays
  addTag(): void {
    this.tagsArray.push(this.fb.control(''));
  }

  addDescription(): void {
    this.descriptionArray.push(this.fb.control(''));
  }

  addTechnology(): void {
    this.technologiesArray.push(this.fb.control(''));
  }

  // Methods to remove form controls from arrays
  removeTag(index: number): void {
    this.tagsArray.removeAt(index);
  }

  removeDescription(index: number): void {
    this.descriptionArray.removeAt(index);
  }

  removeTechnology(index: number): void {
    this.technologiesArray.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.projectForm.invalid) {
      return;
    }

    this.adminProjectService.addProject(this.projectForm.value).subscribe(
      response => {
        console.log('Project added successfully', response);
        this.success = true;
        this.submitted = false;
        this.projectForm.reset();
        this.initForm();
      },
      error => {
        console.error('Error adding project:', error);
        this.error = 'Failed to add project: ' + (error.message || 'Unknown error');
        this.submitted = false;
      }
    );
  }
}