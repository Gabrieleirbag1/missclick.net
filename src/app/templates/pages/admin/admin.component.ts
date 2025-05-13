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
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from '../../../models/projects.model';
import { GlobalService } from '../../../services/global.service';

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
  editMode = false;
  projectId = '';
  pageTitle = 'Add New Project';

  gridImageFile: File | null = null;
  listImageFile: File | null = null;

  gridImagePreview: string | ArrayBuffer | null = null;
  listImagePreview: string | ArrayBuffer | null = null;

  gridImageName: string | null = null;
  listImageName: string | null = null;

  private imageAPIUrl = 'http://localhost:3100/api/projects/image/';

  constructor(
    private adminProjectService: AdminProjectService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.projectId = params['id'];
        this.pageTitle = 'Edit Project';
        this.loadProject(this.projectId);
      }
    });

    if (!this.editMode) {
      this.addTag();
      this.addDescription();
      this.addTechnology();
    }
  }

  loadProject(id: string): void {
    this.adminProjectService.getProject(id).subscribe(
      (project: Project) => {
        // Populate the form with project data
        this.populateForm(project);

        // Show image previews
        if (project.imageUrl.grid) {
          this.gridImagePreview = this.imageAPIUrl + project.imageUrl.grid;
        }

        if (project.imageUrl.list) {
          this.listImagePreview = this.imageAPIUrl + project.imageUrl.list;
        }
      },
      (error) => {
        console.error('Error loading project:', error);
        this.error =
          'Failed to load project: ' + (error.message || 'Unknown error');
      }
    );
  }

  populateFormArray(formArrayName: string, values: string[] | undefined): void {
    const formArray = this.getFormArray(formArrayName);
    while (formArray.length > 0) {
      formArray.removeAt(0);
    }
    
    if (values && values.length > 0) {
      values.forEach(value => {
        formArray.push(this.fb.control(value));
      });
    } else {
      if (!this.editMode) {
        formArray.push(this.fb.control(''));
      }
    }
  }

  populateForm(project: Project): void {
    this.projectForm.patchValue({
      title: project.title,
      date: project.date,
      link: project.link,
      imageUrl: {
        grid: project.imageUrl.grid,
        list: project.imageUrl.list,
      },
    });

    this.populateFormArray('tags', project.tags);
    this.populateFormArray('description', project.description);
    this.populateFormArray('technologies', project.technologies);
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      tags: this.fb.array([]),
      description: this.fb.array([]),
      technologies: this.fb.array([]),
      imageUrl: this.fb.group({
        grid: [''],
        list: [''],
      }),
      link: ['', Validators.required],
    });
  }

  onImageSelected(type: 'grid' | 'list', event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    if (type === 'grid') {
      this.gridImageName = file.name;
      this.gridImageFile = file;
    } else {
      this.listImageName = file.name;
      this.listImageFile = file;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (type === 'grid') {
        this.gridImagePreview = e.target.result;
      } else {
        this.listImagePreview = e.target.result;
      }
    };
    reader.readAsDataURL(file);
    
    this.projectForm.get(`imageUrl.${type}`)?.setValue(file);
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

  getFormArray(name: string): FormArray {
    return this.projectForm.get(name) as FormArray;
  }

  addFormArrayItem(arrayName: string): void {
    const formArray = this.getFormArray(arrayName);
    formArray.push(this.fb.control(''));
  }

  removeFormArrayItem(arrayName: string, index: number): void {
    const formArray = this.getFormArray(arrayName);
    formArray.removeAt(index);
  }

  addTag(): void {
    this.addFormArrayItem('tags');
  }

  addDescription(): void {
    this.addFormArrayItem('description');
  }

  addTechnology(): void {
    this.addFormArrayItem('technologies');
  }

  removeTag(index: number): void {
    this.removeFormArrayItem('tags', index);
  }

  removeDescription(index: number): void {
    this.removeFormArrayItem('description', index);
  }

  removeTechnology(index: number): void {
    this.removeFormArrayItem('technologies', index);
  }

  resetForm(): void {
    this.projectForm.reset();
    this.initForm();
    this.gridImageFile = null;
    this.listImageFile = null;
    this.gridImagePreview = null;
    this.listImagePreview = null;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.projectForm.invalid) {
      return;
    }

    const projectData = this.projectForm.value;

    const request$ = this.editMode
      ? this.adminProjectService.updateProject(this.projectId, projectData, this.gridImageFile, this.listImageFile)
      : this.adminProjectService.addProject(projectData, this.gridImageFile, this.listImageFile);

    request$.subscribe(
      (response) => {
        console.log(
          this.editMode ? 'Project updated successfully' : 'Project added successfully',
          response
        );
        this.success = true;
        this.submitted = false;
        
        this.globalService.scroll();

        if (this.editMode) {
          setTimeout(() => this.router.navigate(['/projects']), 1500);
        } else {
          // Reset the form when adding a new project
          this.resetForm();
        }
      },
      (error) => {
        console.error(
          this.editMode ? 'Error updating project:' : 'Error adding project:',
          error
        );
        this.error =
          'Failed to ' +
          (this.editMode ? 'update' : 'add') +
          ' project: ' +
          (error.message || 'Unknown error');
        this.submitted = false;
      }
    );
}

  cancelEdit(): void {
    this.router.navigate(['/projects']);
  }
}
