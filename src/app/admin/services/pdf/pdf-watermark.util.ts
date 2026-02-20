import jsPDF from 'jspdf';

export function addAnuladoWatermark(doc: jsPDF, estado?: string): void {
  if (estado !== 'ANULADO') return;

  const pageCount = doc.getNumberOfPages();
  const anyDoc = doc as any;
  const hasGState = typeof anyDoc.GState === 'function';
  const hasSaveRestore =
    typeof (doc as any).saveGraphicsState === 'function' &&
    typeof (doc as any).restoreGraphicsState === 'function';
  const gState = hasGState ? new anyDoc.GState({ opacity: 0.15 }) : null;

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    if (hasSaveRestore) (doc as any).saveGraphicsState();
    if (gState) doc.setGState(gState);

    doc.setTextColor(255, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(80);

    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.text('ANULADO', w / 2 + 60, h / 2, { angle: 45, align: 'center' });

    if (hasSaveRestore) (doc as any).restoreGraphicsState();
  }
}
