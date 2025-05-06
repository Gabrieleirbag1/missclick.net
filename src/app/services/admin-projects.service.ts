import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Project } from "../models/projects.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminProjectService {
    private apiUrl = "http://localhost:3000/api/projects";

    constructor(private http: HttpClient) {}

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.apiUrl);
    }

    addProject(project: Project, gridImage: File | null, listImage: File | null): Observable<Project> {
        const formData = new FormData();
        
        // Add the project data as JSON
        formData.append('projectData', JSON.stringify(project));
        
        // Add image files if they exist
        if (gridImage) {
            formData.append('gridImage', gridImage);
        }
        
        if (listImage) {
            formData.append('listImage', listImage);
        }
        
        return this.http.post<Project>(this.apiUrl, formData);
    }

    updateProject(id: string, project: Project, gridImage: File | null, listImage: File | null): Observable<Project> {
        const formData = new FormData();
        
        // Add the project data as JSON
        formData.append('projectData', JSON.stringify(project));
        
        // Add image files if they exist
        if (gridImage) {
            formData.append('gridImage', gridImage);
        }
        
        if (listImage) {
            formData.append('listImage', listImage);
        }
        
        return this.http.put<Project>(`${this.apiUrl}/${id}`, formData);
    }

    deleteProject(id: string): Observable<Project> {
        return this.http.delete<Project>(`${this.apiUrl}/${id}`);
    }
}