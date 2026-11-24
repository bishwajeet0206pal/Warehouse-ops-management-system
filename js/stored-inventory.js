    // ==============================================
    // STAGE 6: STORED INVENTORY DATA & FUNCTIONS
    // ==============================================
    const storedOrdersMaster = [
      { orderId: 'ORD-IN-8801', supplier: 'Tata AutoComp Systems (Bhiwandi)', sku: 'SKU-LED-60W · High-Bay Floodlights', qty: '450 pcs (10 Pallets)', location: 'Rack A-04 · Shelf 2', slotId: 'A4', time: '20 Nov 2026, 11:20 AM', handler: 'S. Kadam (Reach Truck #02)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8798', supplier: 'Mahindra Logistics Hub (Chakan)', sku: 'SKU-BRK-102 · Heavy Brake Drums', qty: '80 crates (16 Pallets)', location: 'Rack B-02 · Shelf 1', slotId: 'B2', time: '20 Nov 2026, 10:45 AM', handler: 'P. Bhosale (Reach Truck #01)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8795', supplier: 'Bajaj Auto Depot (Akurdi)', sku: 'SKU-SPK-99 · Iridium Spark Plugs', qty: '200 boxes (4 Pallets)', location: 'Rack A-01 · Shelf 3', slotId: 'A1', time: '20 Nov 2026, 09:30 AM', handler: 'R. Mane (Forklift #05)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8792', supplier: 'Bosch Automotive India (Nashik)', sku: 'SKU-ECU-04 · Diesel ECU Sensors', qty: '45 kits (High Value)', location: 'Security Cage C-01', slotId: 'C1', time: 'Yesterday, 17:15', handler: 'A. Shinde (Security Marshal)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8789', supplier: 'Ceat Tyres Regional Depot', sku: 'SKU-TYR-16 · Commercial Inner Tubes', qty: '150 bundles (Bulk Bay)', location: 'Bulk Bay E-02', slotId: 'E2', time: 'Yesterday, 16:00', handler: 'D. Salve (Forklift #02)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8785', supplier: 'Hero MotoCorp Ancillary', sku: 'SKU-CHN-55 · Roller Drive Chains', qty: '90 crates (9 Pallets)', location: 'Rack C-04 · Shelf 1', slotId: 'C4', time: 'Yesterday, 14:20', handler: 'V. More (Reach Truck #03)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8782', supplier: 'TVS Motor Parts Regional', sku: 'SKU-FLT-21 · Oil Filter Cartridges', qty: '75 cartons (5 Pallets)', location: 'Rack B-06 · Shelf 2', slotId: 'B6', time: 'Yesterday, 12:40', handler: 'M. Tambe (Picker #08)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8778', supplier: 'Ashok Leyland Central Depot', sku: 'SKU-AXL-88 · Heavy Axle Hub Assemblies', qty: '50 crates (Heavy Cargo)', location: 'Heavy Bay H-01', slotId: 'H1', time: 'Yesterday, 11:10', handler: 'S. Patil (Crane Operator)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8774', supplier: 'Force Motors Chakan Plant', sku: 'SKU-RAD-12 · Radiator Cooling Fans', qty: '40 units (8 Pallets)', location: 'Rack D-02 · Shelf 1', slotId: 'D2', time: 'Yesterday, 10:00', handler: 'G. Shinde (Forklift #04)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8770', supplier: 'Hyundai Mobis Parts Hub', sku: 'SKU-LMP-03 · Projector Headlamps', qty: '60 boxes (6 Pallets)', location: 'Rack B-08 · Shelf 3', slotId: 'B8', time: '2 days ago, 18:30', handler: 'K. Raut (Reach Truck #02)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8765', supplier: 'Toyota Kirloskar Ancillary', sku: 'SKU-STR-09 · Hydraulic Steering Columns', qty: '35 crates (7 Pallets)', location: 'Heavy Bay H-02', slotId: 'H2', time: '2 days ago, 16:50', handler: 'H. Jadhav (Crane Operator)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8761', supplier: 'Skoda Auto Volkswagen India', sku: 'SKU-LCK-44 · Electronic Door Latches', qty: '110 boxes (11 Pallets)', location: 'Rack C-02 · Shelf 2', slotId: 'C2', time: '2 days ago, 15:10', handler: 'T. Gaikwad (Forklift #01)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8758', supplier: 'Renault Nissan Logistics Hub', sku: 'SKU-FLT-80 · Fuel Filter Assemblies', qty: '95 boxes (8 Pallets)', location: 'Rack A-07 · Shelf 1', slotId: 'A7', time: '2 days ago, 13:45', handler: 'L. Chavan (Reach Truck #01)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8754', supplier: 'SKF India Distribution Center', sku: 'SKU-BRG-22 · Deep Groove Ball Bearings', qty: '85 boxes (5 Pallets)', location: 'Rack A-03 · Shelf 2', slotId: 'A3', time: '2 days ago, 11:20', handler: 'B. Jagtap (Picker #04)', status: 'Verified & Stored' },
      { orderId: 'ORD-IN-8750', supplier: 'Timken Bearings Depot Pune', sku: 'SKU-BRG-77 · Tapered Roller Bearings', qty: '60 crates (12 Pallets)', location: 'Rack C-05 · Shelf 3', slotId: 'C5', time: '2 days ago, 09:15', handler: 'N. Gite (Forklift #03)', status: 'Verified & Stored' }
    ];

    function openStoredOrdersPage(whName) {
      if (whName) currentFacilityName = whName;
      
      const titleEl = document.getElementById('stored-page-title');
      if (titleEl) titleEl.textContent = currentFacilityName;

      const badgeEl = document.getElementById('stored-page-count-badge');
      if (badgeEl) badgeEl.textContent = `${currentFacilityName === 'WH-01 Bhiwandi' ? '145' : '145'} Orders Stored in Inventory`;

      renderStoredOrdersTable();
      goToScreen('stored');
    }

    function renderStoredOrdersTable(data) {
      const tbody = document.getElementById('stored-orders-tbody');
      if (!tbody) return;

      const list = data || storedOrdersMaster;
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-gray-500 text-[13px]">No stored inventory orders found matching your criteria.</td></tr>`;
        return;
      }

      list.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-[#F9FAFB] transition-colors';

        tr.innerHTML = `
          <td class="py-3 px-3 font-bold text-[#1F2937] font-arial whitespace-nowrap">${item.orderId}</td>
          <td class="py-3 px-3 font-medium text-[#1F2937]">${item.supplier}</td>
          <td class="py-3 px-3">
            <span class="font-medium text-[#1F2937]">${item.sku.split('·')[0]}</span>
            <span class="text-gray-500 text-[12px] block">${item.sku.split('·')[1] || ''}</span>
          </td>
          <td class="py-3 px-3 font-arial font-semibold text-[#1F2937] whitespace-nowrap">${item.qty}</td>
          <td class="py-3 px-3 whitespace-nowrap">
            <button onclick="openSlotLocationModal('${item.orderId}');" class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px] font-arial hover:bg-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer inline-flex items-center gap-1" title="Click to view Slot on Floor Map">
              <span>${item.location}</span>
              <span class="text-[9.5px] text-emerald-600 font-semibold bg-emerald-100/60 px-1 rounded">Slot ${item.slotId}</span>
            </button>
          </td>
          <td class="py-3 px-3 text-[#4B5563] text-[12px] whitespace-nowrap">${item.time}</td>
          <td class="py-3 px-3 text-[#1F2937] font-medium text-[12px] whitespace-nowrap">${item.handler}</td>
          <td class="py-3 px-3 whitespace-nowrap">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold border border-[#A7F3D0] text-[11px] font-arial">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              ${item.status}
            </span>
          </td>
          <td class="py-3 px-3 text-right whitespace-nowrap">
            <button onclick="openSlotLocationModal('${item.orderId}');" class="btn-redbus-secondary text-[11px] py-1 px-3 cursor-pointer inline-flex items-center gap-1.5 font-bold hover:bg-gray-100 shadow-2xs">
              <span>View Slot</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    
