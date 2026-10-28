import { Component, OnInit } from '@angular/core';
import { Orden } from '../models/orden';
import { OrdenService } from '../services/orden.services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements OnInit {

  ordenes: Orden[] = [];
  cargando: boolean = true;
  error: string = '';

  //Filtros
  ordenesFiltradas: Orden[] = [];
  textoBusqueda: string='';

  precioMinimo: number = 0;
  precioMaximo: number = 1000000;

  ordenSeleccionada: Orden | null=null;
  modalAbierto:boolean=false;


  constructor(private ordenService: OrdenService) {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {

    this.cargando = true;
    this.error = '';

    this.ordenService.obtenerOrdenes().subscribe({

      next: (datos) => {
        this.ordenes = datos;
        this.aplicarFiltros();
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener las órdenes:', error);
        this.error = 'No se pudieron cargar las órdenes.';
        this.cargando = false;
      }

    });

  }

  obtenerSubtotal(): number {
   if (!this.ordenSeleccionada) {
     return 0;
    } return this.ordenSeleccionada.precio * this.ordenSeleccionada.cantidad;
  }

  obtenerIVA(): number {
    return this.obtenerSubtotal() * 0.19;
  }

  obtenerTotalFactura(): number {
    return this.obtenerSubtotal() + this.obtenerIVA();
  }
  abrirModal(orden: Orden) {
    this.ordenSeleccionada = orden;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.ordenSeleccionada = null;
  }

  aplicarFiltros() {
  this.ordenesFiltradas = this.ordenes.filter(orden => {

    const texto = this.textoBusqueda.toLowerCase();

    const coincideTexto =
      orden.title.toLowerCase().includes(texto) || orden.body.toLowerCase().includes(texto);

    const coincidePrecio =
      orden.precio >= this.precioMinimo && orden.precio <= this.precioMaximo;
    return coincideTexto && coincidePrecio;

  }); }
  
  limpiarFiltros() {
    this.textoBusqueda=''
    this.precioMinimo = 0;
    this.precioMaximo = 1000000;

    this.aplicarFiltros();
  }

  obtenerTotalOrdenes(): number {
    return this.ordenesFiltradas.length;
  }

  obtenerStockCritico(): number {
   return this.ordenesFiltradas.filter(
      orden => orden.stock < 5
    ).length;
  }

  obtenerValorTotal(): number {
    return this.ordenesFiltradas.reduce(
      (total, orden) => total + (orden.precio * orden.cantidad),
     0
    );
  }

}
