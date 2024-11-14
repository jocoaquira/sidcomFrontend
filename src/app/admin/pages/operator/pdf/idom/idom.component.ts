import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-idom',
  templateUrl: './idom.component.html',
  styleUrls: ['./idom.component.css']
})
export class IdomComponent {

  constructor() {
    this.downloadPDF();
   }

  public downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    doc.save('hello-world.pdf');
  }
}
