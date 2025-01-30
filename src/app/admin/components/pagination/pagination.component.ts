import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  
  @Input() currentPage: number = 1;
  @Input() totalPages: number[] = [];
  @Input() itemsPerPage: number = 10;
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const itemsPerPage = +selectElement.value;
    this.itemsPerPageChange.emit(itemsPerPage);
  }
}
