import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receta } from '../../../models';
import { RecetaService } from '../../../services/receta.service';

@Component({
  selector: 'app-receta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receta-list.component.html',
  styleUrl: './receta-list.component.css'
})
export class RecetaListComponent implements OnInit {
  recetas: Receta[] = [];
  loading = false;
  error: string | null = null;
  selectedReceta: Receta | null = null;
  showModal = false;

  constructor(private recetaService: RecetaService) {}

  ngOnInit() {
    this.loadRecetas();
  }

  loadRecetas() {
    this.loading = true;
    this.recetaService.getAll().subscribe({
      next: (data) => {
        this.recetas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando recetas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  viewReceta(receta: Receta) {
    this.selectedReceta = receta;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedReceta = null;
  }

  cancelarReceta(id: number) {
    if (confirm('¿Está seguro de cancelar esta receta?')) {
      this.recetaService.cancelar(id).subscribe({
        next: () => this.loadRecetas(),
        error: (err) => console.error(err)
      });
    }
  }

  // Las recetas son documentos médico-legales y no se pueden eliminar.
  // Solo se pueden cancelar usando cancelarReceta()

  getEstadoClass(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'activa': 'estado-activa',
      'vencida': 'estado-vencida',
      'cancelada': 'estado-cancelada'
    };
    return estadoMap[estado] || '';
  }
}
