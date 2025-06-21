export const generateQuotationPDF = (project, measurements) => {
  // Calculate totals
  let totalClothCost = 0;
  let totalStitchingCost = 0;
  let grandTotal = 0;
  
  measurements.forEach(item => {
    const clothCost = parseFloat(item.clothRatePerMeter) * parseFloat(item.totalMeters);
    const stitchingCost = parseFloat(item.stitchingCost) * parseFloat(item.pieces);
    totalClothCost += clothCost;
    totalStitchingCost += stitchingCost;
    grandTotal += parseFloat(item.totalCost);
  });

  // Calculate rod information
  const getTotalWidth = () => {
    return measurements.reduce((total, measurement) => total + parseFloat(measurement.widthInches), 0);
  };

  const getRodLength = () => {
    const totalWidth = getTotalWidth();
    return totalWidth / 12; // Convert inches to length (12 inches = 1 length)
  };

  const getRodCost = () => {
    const rodLength = getRodLength();
    const rate = parseFloat(project.rodRatePerLength) || 0;
    return rodLength * rate;
  };

  const totalWidth = getTotalWidth();
  const rodLength = getRodLength();
  const rodCost = getRodCost();
  const finalGrandTotal = grandTotal + rodCost;

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Royal Curtain Quotation</title>
      <style>
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #333;
          padding-bottom: 15px;
        }
        
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        
        .company-details {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
        }
        
        .quotation-title {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          color: #2c3e50;
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          padding-top:5px;
          margin_top:5px;
        }
        
        .customer-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
        }
        
        .customer-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .customer-row:last-child {
          margin-bottom: 0;
        }
        
        .table-container {
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #dee2e6;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        th {
          background: #343a40;
          color: white;
          padding: 10px 5px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #dee2e6;
        }
        
        td {
          padding: 8px 5px;
          text-align: center;
          border: 1px solid #dee2e6;
          vertical-align: middle;
        }
        
        tbody tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        tbody tr:hover {
          background: #e9ecef;
        }
        
        .summary-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        
        .summary-box {
          background: #e3f2fd;
          border: 2px solid #2196f3;
          border-radius: 8px;
          padding: 20px;
          min-width: 300px;
        }
        
        .summary-title {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
          color: #1976d2;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
        }
        
        .summary-total {
          border-top: 2px solid #1976d2;
          padding-top: 10px;
          margin-top: 10px;
          font-weight: bold;
          font-size: 14px;
        }
        
        .terms-section {
          margin-bottom: 30px;
        }
        
        .terms-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .terms-list {
          padding-left: 0;
          list-style: none;
        }
        
        .terms-list li {
          margin-bottom: 6px;
          padding-left: 15px;
          position: relative;
        }
        
        .terms-list li:before {
          content: "•";
          color: #2196f3;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .signature-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
        }
        
        .signature-box {
          text-align: center;
          min-width: 200px;
        }
        
        .signature-line {
          border-bottom: 2px solid #333;
          width: 200px;
          margin: 20px auto 10px;
        }
        
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #dee2e6;
          font-size: 10px;
          color: #666;
          font-style: italic;
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          z-index: 1000;
        }
        
        .print-button:hover {
          background: #1976d2;
        }
        
        @media print {
          .print-button { display: none; }
        }
      </style>
    </head>    <body>
      <button class="print-button no-print" onclick="window.print()">📄 Print / Save as PDF</button>
      
      <div class="quotation-title">QUOTATION</div>
      
      <div class="customer-info">
        <div class="customer-row">
          <div><strong>Customer:</strong> ${project.clientName || 'N/A'}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
        </div>
        <div class="customer-row">
          <div><strong>Project:</strong> ${project.projectTitle || 'Curtain Installation'}</div>
          <div><strong>Quote #:</strong> QT${Date.now().toString().slice(-6)}</div>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 6%">S.No</th>
              <th style="width: 18%">Room Label</th>
              <th style="width: 8%">Width</th>
              <th style="width: 8%">Height</th>
              <th style="width: 8%">Pieces</th>
              <th style="width: 8%">Meter</th>
              <th style="width: 10%">Fabric Type</th>
              <th style="width: 12%">Cloth Price (₹)</th>
              <th style="width: 12%">Stitching Price (₹)</th>
              <th style="width: 10%">Total Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${measurements.map((item, index) => {
              const clothCost = parseFloat(item.clothRatePerMeter) * parseFloat(item.totalMeters);
              const stitchingCost = parseFloat(item.stitchingCost) * parseFloat(item.pieces);
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.roomLabel}</td>
                  <td>${item.widthInches}"</td>
                  <td>${item.heightInches}"</td>
                  <td>${item.pieces}</td>
                  <td>${item.totalMeters}m</td>
                  <td>${item.curtainType}</td>
                  <td>₹${clothCost.toFixed(0)}</td>
                  <td>₹${stitchingCost.toFixed(0)}</td>
                  <td><strong>₹${parseFloat(item.totalCost).toFixed(0)}</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>      </div>
      
      <!-- Rod Installation Requirements Section -->
      ${rodLength > 0 ? `
      <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; text-align: center;">Rod Installation Requirements</h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #dee2e6; text-align: center;">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total Coverage</div>
            <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${totalWidth.toFixed(1)}"</div>
            <div style="font-size: 10px; color: #888;">Combined window width</div>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #dee2e6; text-align: center;">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Rod Length Required</div>
            <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">${rodLength.toFixed(2)} units</div>
            <div style="font-size: 10px; color: #888;">Standard measurement</div>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #dee2e6; text-align: center;">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Rate per Unit</div>
            <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">₹${parseFloat(project.rodRatePerLength || 0).toFixed(0)}</div>
            <div style="font-size: 10px; color: #888;">Installation cost</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      <div class="summary-section">
        <div class="summary-box">
          <div class="summary-title">QUOTATION SUMMARY</div>
          <div class="summary-row">
            <span>Cloth Total:</span>
            <span>₹${totalClothCost.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Stitching Total:</span>
            <span>₹${totalStitchingCost.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Curtain Sub-Total:</span>
            <span>₹${grandTotal.toFixed(2)}</span>
          </div>
          ${rodCost > 0 ? `
          <div class="summary-row" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
            <span>Rod Installation:</span>
            <span>₹${rodCost.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="summary-row summary-total">
            <span>Grand Total:</span>
            <span>₹${finalGrandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a new window/tab with the PDF content
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Auto-focus the new window and trigger print dialog
  printWindow.focus();
  
  // Wait for content to load, then trigger print
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
