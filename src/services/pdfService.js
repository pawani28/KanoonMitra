// PDF and Document Export Service for KanoonMitra

/**
 * Generate a unique verification hash & QR code data for the legal document
 */
export function generateDocumentHash(title, preamble, clauses) {
  const content = `${title}|${preamble}|${clauses.map(c => c.legalText).join('|')}`;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `KM-IN-2026-${hex}`;
}

/**
 * Trigger print dialog formatted specifically for clean legal document print / save to PDF
 */
export function printLegalDocument(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Legal Document - KanoonMitra</title>
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Merriweather', 'Georgia', serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #111;
            background: #fff;
            padding: 0;
            margin: 0;
          }
          h1 {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 20px;
            letter-spacing: 0.5px;
          }
          .stamp-box {
            border: 2px dashed #666;
            padding: 12px;
            text-align: center;
            font-size: 9pt;
            text-transform: uppercase;
            margin-bottom: 24px;
            color: #444;
          }
          .preamble {
            margin-bottom: 16px;
            text-align: justify;
          }
          .recital {
            margin-bottom: 12px;
            text-align: justify;
            font-style: italic;
          }
          .clause {
            margin-bottom: 16px;
            text-align: justify;
          }
          .clause-heading {
            font-weight: bold;
            display: block;
            margin-bottom: 4px;
          }
          .signature-grid {
            margin-top: 40px;
            display: table;
            width: 100%;
            page-break-inside: avoid;
          }
          .sig-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding: 10px;
          }
          .sig-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
            font-size: 10pt;
            font-weight: bold;
          }
          .footer-note {
            margin-top: 30px;
            font-size: 8pt;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 8px;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
}

/**
 * Export document as structured plain text file (.txt / .doc format)
 */
export function downloadDocumentAsText(docData, plainLanguage = false) {
  if (!docData) return;

  let text = `========================================================================\n`;
  text += `${docData.title.toUpperCase()}\n`;
  if (docData.hindiTitle) text += `(${docData.hindiTitle})\n`;
  text += `Governing Act: ${docData.actReference || 'Indian Contract Act, 1872'}\n`;
  text += `========================================================================\n\n`;

  if (docData.stampDutyNotice) {
    text += `[STAMP DUTY GUIDANCE]: ${docData.stampDutyNotice}\n\n`;
  }

  text += `PREAMBLE:\n${plainLanguage && docData.preamblePlain ? docData.preamblePlain : docData.preamble}\n\n`;

  if (docData.recitals && docData.recitals.length > 0) {
    text += `RECITALS:\n`;
    docData.recitals.forEach((r, idx) => {
      text += `(${String.fromCharCode(65 + idx)}) ${r}\n`;
    });
    text += `\nNOW THEREFORE IT IS MUTUALLY AGREED AS FOLLOWS:\n\n`;
  }

  docData.clauses.forEach((c) => {
    text += `CLAUSE ${c.number}: ${c.heading.toUpperCase()}\n`;
    if (plainLanguage) {
      text += `[Plain English]: ${c.plainEnglish}\n`;
      if (c.plainHindi) text += `[सरल हिन्दी]: ${c.plainHindi}\n`;
    } else {
      text += `${c.legalText}\n`;
    }
    text += `\n`;
  });

  text += `========================================================================\n`;
  text += `EXECUTION & SIGNATURES:\n`;
  text += `Jurisdiction: ${docData.execution?.jurisdiction || 'India'}\n`;
  text += `Note: ${docData.execution?.signingNote || 'Signed in the presence of witnesses.'}\n\n`;
  text += `FIRST PARTY / LICENSOR / CLIENT: ____________________\n\n`;
  text += `SECOND PARTY / LICENSEE / CONTRACTOR: ____________________\n\n`;
  text += `WITNESS 1: ____________________        WITNESS 2: ____________________\n`;
  text += `========================================================================\n`;
  text += `Drafted with KanoonMitra (कानून मित्र) - Verified AI Legal Platform\n`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${docData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_kanoonmitra.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
