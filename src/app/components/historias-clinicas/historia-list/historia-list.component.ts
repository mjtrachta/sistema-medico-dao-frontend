import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HistoriaClinica } from '../../../models';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';

@Component({
  selector: 'app-historia-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-list.component.html',
  styleUrl: './historia-list.component.css'
})
export class HistoriaListComponent implements OnInit {
  historias: HistoriaClinica[] = [];
  loading = false;
  error: string | null = null;
  selectedHistoria: HistoriaClinica | null = null;
  showModal = false;

  constructor(
    private historiaService: HistoriaClinicaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHistorias();
  }

  loadHistorias() {
    this.loading = true;
    this.historiaService.getAll().subscribe({
      next: (data) => {
        this.historias = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando historias clínicas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  viewHistoria(historia: HistoriaClinica) {
    this.selectedHistoria = historia;
    this.showModal = true;
  }

  editHistoria(id: number) {
    // Navegar al formulario de edición si existe, o abrir en modal
    this.router.navigate(['/historias-clinicas', id, 'editar']);
  }

  closeModal() {
    this.showModal = false;
    this.selectedHistoria = null;
  }

  deleteHistoria(id: number) {
    if (confirm('¿Está seguro de eliminar esta historia clínica?')) {
      this.historiaService.delete(id).subscribe({
        next: () => this.loadHistorias(),
        error: (err: any) => console.error(err)
      });
    }
  }
}
