    // ==============================================
    // STAGE 6: DISPATCHED & POD DATA & FUNCTIONS
    // ==============================================
    const dispatchedOrdersMaster = [
      { orderId: 'ORD-BW-1088', customer: 'Maruti Suzuki Ancillary (Gurgaon Hub)', cargo: 'Clutch Plates (50 sets · 2 Pallets)', carrier: 'Blue Dart Express', waybill: 'BLUEDART-882910-HYD', time: '20 Nov 2026, 05:40 PM', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1085', customer: 'Mahindra Auto Depot (Chakan Plant)', cargo: 'Heavy Alternators (24 units · 3 Crates)', carrier: 'VRL Logistics', waybill: 'VRL-TRK-MH04-8812', time: '20 Nov 2026, 01:30 PM', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1082', customer: 'Tata Motors CV Depot (Pune)', cargo: 'Leaf Springs (16 bundles · 2 Trailers)', carrier: 'Safexpress Surface', waybill: 'SAFE-MH-43-1022', time: '20 Nov 2026, 12:45 PM', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1079', customer: 'Bajaj Auto Chakan Logistics', cargo: 'Piston Assemblies (100 units · 4 Pallets)', carrier: 'Delhivery Freight', waybill: 'DEL-FRT-992014', time: '20 Nov 2026, 11:20 AM', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1075', customer: 'Force Motors Chakan Plant', cargo: 'Radiator Fans (22 units · 2 Pallets)', carrier: 'GATI KWE Cargo', waybill: 'GATI-EXP-44021', time: '20 Nov 2026, 10:15 AM', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1071', customer: 'Ashok Leyland Depot (Nagpur Hub)', cargo: 'Axle Hubs (18 crates · Heavy Load)', carrier: 'TCI Freight', waybill: 'TCI-FRT-88102', time: '20 Nov 2026, 09:00 AM', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1068', customer: 'Eicher Motors Depot (Bhopal Hub)', cargo: 'Flywheels (10 units · 2 Crates)', carrier: 'Blue Dart Express', waybill: 'BLUEDART-441092-BHP', time: 'Yesterday, 18:30 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1065', customer: 'Hyundai Mobis Regional Depot', cargo: 'Headlamp Assemblies (35 boxes)', carrier: 'Safexpress Surface', waybill: 'SAFE-HYU-33019', time: 'Yesterday, 17:15 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1061', customer: 'Honda Motorcycle Depot (Narsapura)', cargo: 'Carburetor Assemblies (40 boxes)', carrier: 'VRL Logistics', waybill: 'VRL-HND-99104', time: 'Yesterday, 16:00 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1058', customer: 'Kalyani Steels Regional Warehouse', cargo: 'Forged Steel Castings (14 heavy crates)', carrier: 'TCI Freight', waybill: 'TCI-STEEL-22019', time: 'Yesterday, 14:40 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1054', customer: 'Lumax Industries Distribution', cargo: 'Lighting Wiring Harness (28 kits)', carrier: 'Delhivery Freight', waybill: 'DEL-LMX-77102', time: 'Yesterday, 13:20 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1050', customer: 'Gabriel India Logistics Central', cargo: 'Shock Absorbers (30 crates · 3 Pallets)', carrier: 'Blue Dart Express', waybill: 'BLUEDART-GBR-55011', time: 'Yesterday, 11:50 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1046', customer: 'Sundram Fasteners Distribution', cargo: 'High-Tensile Fastener Bolts (60 bags)', carrier: 'TCI Freight', waybill: 'TCI-SND-44091', time: 'Yesterday, 10:30 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1042', customer: 'Uno Minda Systems Logistics', cargo: 'Alloy Wheels (20 cartons · 2 Pallets)', carrier: 'Safexpress Surface', waybill: 'SAFE-MIN-11029', time: '2 days ago, 18:00 IST', podStatus: 'Customer Signed POD' },
      { orderId: 'ORD-BW-1038', customer: 'Subros Air Conditioning Depot', cargo: 'HVAC Ducting & Blowers (25 bundles)', carrier: 'GATI KWE Cargo', waybill: 'GATI-SBR-88201', time: '2 days ago, 15:30 IST', podStatus: 'Customer Signed POD' }
    ];

    function openDispatchedOrdersPage(whName) {
      if (whName) currentFacilityName = whName;

      const titleEl = document.getElementById('dispatched-page-title');
      if (titleEl) titleEl.textContent = currentFacilityName;

      const badgeEl = document.getElementById('dispatched-page-count-badge');
      if (badgeEl) badgeEl.textContent = `${currentFacilityName === 'WH-01 Bhiwandi' ? '410' : '410'} Dispatches Delivered`;

      renderDispatchedOrdersTable();
      goToScreen('dispatched');
    }

    function renderDispatchedOrdersTable(data) {
      const tbody = document.getElementById('dispatched-orders-tbody');
      if (!tbody) return;

      const list = data || dispatchedOrdersMaster;
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-gray-500 text-[13px]">No dispatched shipments found matching your criteria.</td></tr>`;
        return;
      }

      list.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-[#F9FAFB] transition-colors';

        tr.innerHTML = `
          <td class="py-3 px-3 font-bold text-[#1F2937] font-arial whitespace-nowrap">${item.orderId}</td>
          <td class="py-3 px-3 font-medium text-[#1F2937]">${item.customer}</td>
          <td class="py-3 px-3">${formatCargoCell(item.cargo)}</td>
          <td class="py-3 px-3 whitespace-nowrap">
            <span class="font-medium text-[#1F2937] block">${item.carrier}</span>
            <span class="text-gray-400 font-mono text-[11px] block">${item.waybill}</span>
          </td>
          <td class="py-3 px-3 text-[#4B5563] text-[12px] whitespace-nowrap">${item.time}</td>
          <td class="py-3 px-3 whitespace-nowrap">
            <span onclick="openOutwardPodModal()" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold border border-[#A7F3D0] hover:bg-emerald-100 cursor-pointer shadow-2xs transition-all text-[11px] font-arial" title="Click to preview customer-signed POD">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              ${item.podStatus}
            </span>
          </td>
          <td class="py-3 px-3 text-right whitespace-nowrap">
            <button onclick="openOutwardPodModal()" class="btn-redbus-secondary text-[11px] py-1 px-3 cursor-pointer">
              View Signed POD &rarr;
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function filterDispatchedTable() {
      const q = (document.getElementById('dispatched-search-input')?.value || '').toLowerCase().trim();
      const carrier = document.getElementById('dispatched-carrier-filter')?.value || 'all';

      const filtered = dispatchedOrdersMaster.filter(item => {
        const matchesQuery = !q || 
          item.orderId.toLowerCase().includes(q) ||
          item.customer.toLowerCase().includes(q) ||
          item.cargo.toLowerCase().includes(q) ||
          item.carrier.toLowerCase().includes(q) ||
          item.waybill.toLowerCase().includes(q);

        const matchesCarrier = carrier === 'all' || item.carrier.includes(carrier);
        return matchesQuery && matchesCarrier;
      });

      renderDispatchedOrdersTable(filtered);
    }


