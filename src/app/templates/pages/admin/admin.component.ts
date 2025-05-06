import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [AdminProjectService],
})
export class AdminComponent implements OnInit {
  projectForm!: FormGroup;
  submitted = false;
  success = false;
  error = '';

  // File inputs
  gridImageFile: File | null = null;
  listImageFile: File | null = null;

  // Image previews
  gridImagePreview: string | ArrayBuffer | null = null;
  listImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private adminProjectService: AdminProjectService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.adminProjectService.getProjects().subscribe(
      (projects) => console.log(projects),
      (error) => console.error('Error fetching projects:', error)
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
        grid: [''],
        list: [''],
      }),
      link: ['', Validators.required],
    });
  }

  // File handling methods
  onGridImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.gridImageFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.gridImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onListImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.listImageFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.listImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
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

    // Get form data
    const projectData = this.projectForm.value;

    // Use the service to add the project with files
    this.adminProjectService
      .addProject(projectData, this.gridImageFile, this.listImageFile)
      .subscribe(
        (response) => {
          console.log('Project added successfully', response);
          this.success = true;
          this.submitted = false;

          // Reset form and file inputs
          this.projectForm.reset();
          this.initForm();
          this.gridImageFile = null;
          this.listImageFile = null;
          this.gridImagePreview = null;
          this.listImagePreview = null;
        },
        (error) => {
          console.error('Error adding project:', error);
          this.error =
            'Failed to add project: ' + (error.message || 'Unknown error');
          this.submitted = false;
        }
      );
  }
}
