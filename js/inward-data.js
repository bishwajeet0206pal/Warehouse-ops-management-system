    /* ==============================================
       INWARD ORDERS MASTER DATA & ACTIVE PIPELINE (29 ORDERS)
       ============================================== */
    const inwardOrdersList = [
      // Stage 1: Expected (3 orders) - All Pending
      { id: 'ORD-IN-8827', transporter: 'Gati KWE Express', sku: 'SKU-MED-40K Cold Packs', qty: '600 pcs', pallets: '12 pallets', bay: 'Bay 02 (ETA 11:30)', stageNum: 1, stageName: '1. Expected', isPending: true, pendingDetail: 'Vehicle in transit to facility (ETA 11:30). Security gate pass entry, bay docking, and delivery challan signature are pending.' },
      { id: 'ORD-IN-8828', transporter: 'TCI Freight Logistics', sku: 'SKU-ELEC-88 Sensors', qty: '1,200 pcs', pallets: '24 pallets', bay: 'Bay 03 (ETA 12:15)', stageNum: 1, stageName: '1. Expected', isPending: true, pendingDetail: 'Vehicle in transit (ETA 12:15). e-Way bill verified; physical arrival at security gate and unlading are pending.' },
      { id: 'ORD-IN-8829', transporter: 'Blue Dart Surface', sku: 'SKU-AUTO-12 Hub Belts', qty: '850 pcs', pallets: '17 pallets', bay: 'Bay 04 (ETA 13:00)', stageNum: 1, stageName: '1. Expected', isPending: true, pendingDetail: 'Advance ASN synchronized. Gate check-in, dock bay allocation, and QC verification are pending.' },

      // Stage 2: At Dock (2 orders) - All Pending
      { id: 'ORD-IN-8825', transporter: 'V-Trans Logistics', sku: 'SKU-IND-50 Motor Spares', qty: '900 pcs', pallets: '18 pallets', bay: 'Inbound Bay 02', stageNum: 2, stageName: '2. At Dock', isPending: true, pendingDetail: 'Vehicle docked at Bay 02. Gate pass logged; pallet offloading crew assignment and QC seal verification are pending.' },
      { id: 'ORD-IN-8826', transporter: 'Spoton Logistics', sku: 'SKU-CHEM-10 Liquid Drums', qty: '450 pcs', pallets: '15 pallets', bay: 'Inbound Bay 03', stageNum: 2, stageName: '2. At Dock', isPending: true, pendingDetail: 'Truck positioned at Bay 03. Hazmat offload checklist, de-stuffing, and delivery receipt sign-off are pending.' },

      // Stage 3: Unloading (4 orders) - All Pending
      { id: 'ORD-IN-8824', transporter: 'Safexpress Surface', sku: 'SKU-FMCG-22 Home Essentials', qty: '1,800 pcs', pallets: '36 pallets', bay: 'Bay 01', stageNum: 3, stageName: '3. Unloading', isPending: true, pendingDetail: 'Pallet unloading in progress (65%). Physical carton count, damage check, and supervisor POD signature are pending.' },
      { id: 'ORD-IN-8823', transporter: 'DTDC Freight Supply', sku: 'SKU-PKG-15 Polybags', qty: '4,000 pcs', pallets: '20 pallets', bay: 'Bay 01', stageNum: 3, stageName: '3. Unloading', isPending: true, pendingDetail: 'De-stuffing cartons onto staging floor. Barcode sorting, piece verification, and signed delivery challan are pending.' },
      { id: 'ORD-IN-8830', transporter: 'Express Cargo Transit', sku: 'SKU-TEXT-99 Yarn Spools', qty: '2,100 pcs', pallets: '42 pallets', bay: 'Bay 05', stageNum: 3, stageName: '3. Unloading', isPending: true, pendingDetail: 'Forklift offload active (45%). Staging verification, weight confirmation, and POD stamping are pending.' },
      { id: 'ORD-IN-8831', transporter: 'Gati-KWE Surface', sku: 'SKU-FOOD-08 Canned Goods', qty: '1,500 pcs', pallets: '30 pallets', bay: 'Bay 05', stageNum: 3, stageName: '3. Unloading', isPending: true, pendingDetail: 'De-stuffing at 80%. Batch code validation, food safety scan, and driver copy sign-off are pending.' },

      // Stage 4: QC & POD (8 orders) - 2 Pending, 6 Done
      { id: 'ORD-IN-8821', transporter: 'Bhiwandi Logistics', sku: 'SKU-LED-60W UltraSlim', qty: '2,400 pcs', pallets: '48 pallets', bay: 'Bay 04', stageNum: 4, stageName: '4. QC & POD', isPending: false, isPriority: true },
      { id: 'ORD-IN-8822', transporter: 'Rivigo Surface Line', sku: 'SKU-SOLAR-04 Inverter Kits', qty: '320 pcs', pallets: '16 pallets', bay: 'Bay 04', stageNum: 4, stageName: '4. QC & POD', isPending: false },
      { id: 'ORD-IN-8832', transporter: 'Delhivery Freight', sku: 'SKU-PHARM-12 Sterile Vials', qty: '5,000 pcs', pallets: '25 pallets', bay: 'Bay 06', stageNum: 4, stageName: '4. QC & POD', isPending: true, pendingDetail: 'Intake Seal #9901 verification in progress. Cold chain temperature log validation and supervisor signature are pending.' },
      { id: 'ORD-IN-8833', transporter: 'Bluedart Express', sku: 'SKU-ELEC-44 Microchips', qty: '3,200 pcs', pallets: '16 pallets', bay: 'Bay 06', stageNum: 4, stageName: '4. QC & POD', isPending: false },
      { id: 'ORD-IN-8834', transporter: 'Safexpress Surface', sku: 'SKU-APPA-10 Denim Roll', qty: '1,400 pcs', pallets: '28 pallets', bay: 'Bay 07', stageNum: 4, stageName: '4. QC & POD', isPending: true, pendingDetail: 'Barcode scanning 70% complete. Gross weight metrology calibration and POD endorsement are pending.' },
      { id: 'ORD-IN-8835', transporter: 'TCI Supply Chain', sku: 'SKU-FURN-02 Office Desks', qty: '180 pcs', pallets: '18 pallets', bay: 'Bay 07', stageNum: 4, stageName: '4. QC & POD', isPending: false },
      { id: 'ORD-IN-8836', transporter: 'Mahindra Logistics', sku: 'SKU-AUTO-77 Gaskets', qty: '950 pcs', pallets: '19 pallets', bay: 'Bay 08', stageNum: 4, stageName: '4. QC & POD', isPending: false },
      { id: 'ORD-IN-8837', transporter: 'V-Xpress Cargo', sku: 'SKU-COSM-55 Lotions', qty: '2,800 pcs', pallets: '28 pallets', bay: 'Bay 08', stageNum: 4, stageName: '4. QC & POD', isPending: false },

      // Stage 5: Putaway (12 orders) - All Done
      { id: 'ORD-IN-8820', transporter: 'Delhivery Freight', sku: 'SKU-BLK-99 Industrial Casings', qty: '3,500 pcs', pallets: '70 pallets', bay: 'Bay 03 / Zone C', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8819', transporter: 'Blue Dart Supply', sku: 'SKU-COMP-01 Power Units', qty: '800 pcs', pallets: '16 pallets', bay: 'Bay 02 / Zone B', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8818', transporter: 'Safexpress Logistics', sku: 'SKU-TOOL-90 Wrenches', qty: '1,100 pcs', pallets: '22 pallets', bay: 'Bay 01 / Zone A', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8817', transporter: 'Spoton Express', sku: 'SKU-WIRE-33 Copper Cable', qty: '2,400 pcs', pallets: '24 pallets', bay: 'Bay 04 / Zone C', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8816', transporter: 'Gati KWE Surface', sku: 'SKU-BEV-12 Fruit Juices', qty: '1,800 pcs', pallets: '36 pallets', bay: 'Bay 05 / Zone A', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8815', transporter: 'Rivigo Freight', sku: 'SKU-MED-05 Bandages', qty: '6,000 pcs', pallets: '30 pallets', bay: 'Bay 06 / Zone B', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8814', transporter: 'TCI Freight', sku: 'SKU-CHEM-88 Resin Cans', qty: '500 pcs', pallets: '20 pallets', bay: 'Bay 07 / Zone C', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8813', transporter: 'Mahindra Logistics', sku: 'SKU-ELEC-19 LED Strips', qty: '2,200 pcs', pallets: '22 pallets', bay: 'Bay 08 / Zone B', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8812', transporter: 'DTDC Express', sku: 'SKU-PLAS-04 Buckets', qty: '900 pcs', pallets: '18 pallets', bay: 'Bay 03 / Zone A', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8811', transporter: 'V-Trans Line', sku: 'SKU-TEXT-12 Cotton Bales', qty: '400 pcs', pallets: '20 pallets', bay: 'Bay 02 / Zone C', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8810', transporter: 'Express Surface', sku: 'SKU-FOOD-21 Rice Bags', qty: '1,200 pcs', pallets: '24 pallets', bay: 'Bay 01 / Zone A', stageNum: 5, stageName: '5. Putaway', isPending: false },
      { id: 'ORD-IN-8809', transporter: 'Bhiwandi Logistics', sku: 'SKU-SOLAR-09 Cells', qty: '750 pcs', pallets: '15 pallets', bay: 'Bay 04 / Zone B', stageNum: 5, stageName: '5. Putaway', isPending: false }
    ];

    let currentInwardFilter = 'all';

    function filterInwardTable(stage) {
      currentInwardFilter = stage;
      
      // Update tab active classes
      ['all', 1, 2, 3, 4, 5].forEach(st => {
        const btn = document.getElementById('inward-tab-' + st);
        if (btn) {
          if (st === stage) {
            btn.className = 'px-3 py-1 rounded-lg font-bold bg-[#1F2937] text-white shadow-2xs cursor-pointer transition-all';
          } else if (st === 4) {
            btn.className = 'px-3 py-1 rounded-lg font-semibold bg-[#FEECEE] text-[#D84E55] border border-[#FECACA] hover:bg-[#FECACA] cursor-pointer transition-all';
          } else {
            btn.className = 'px-3 py-1 rounded-lg font-medium bg-white border border-[#E5E7EB] text-gray-700 hover:bg-gray-100 cursor-pointer transition-all';
          }
        }
      });

      renderInwardTable();
    }

    function formatCargoCell(cargoStr) {
      if (!cargoStr) return '<span class="text-gray-400">—</span>';
      const parenMatch = cargoStr.match(/^(.*?)\s*\((.*?)\)$/);
      if (parenMatch) {
        const name = parenMatch[1].trim();
        const qty = parenMatch[2].trim();
        return `<span class="font-medium text-[#1F2937] block leading-tight">${name}</span><span class="text-gray-500 text-[11px] block mt-0.5">${qty}</span>`;
      }
      if (cargoStr.includes('·')) {
        const parts = cargoStr.split('·');
        const first = parts[0].trim();
        const second = parts[1].trim();
        const numMatch = second.match(/^(\d+(?:x|\s*(?:units|cartons|boxes|crates|pallets|bales|rolls|kits))?)\s*(.*)$/i);
        if (numMatch && numMatch[2]) {
          const qty = /^\d+$/.test(numMatch[1]) ? `${numMatch[1]} units` : numMatch[1];
          return `<span class="font-medium text-[#1F2937] block leading-tight">${numMatch[2]}</span><span class="text-gray-500 text-[11px] block mt-0.5">${qty}</span>`;
        }
        return `<span class="font-medium text-[#1F2937] block leading-tight">${first}</span><span class="text-gray-500 text-[11px] block mt-0.5">${second}</span>`;
      }
      return `<span class="font-medium text-[#1F2937] block leading-tight">${cargoStr}</span>`;
    }

        const warehouseInwardData = {
      'WH-01 Bhiwandi': {
        total: 29,
        stages: { 1: 3, 2: 2, 3: 4, 4: 8, 5: 12, 6: 145 },
        bayPrefix: 'Dock Bay 0'
      },
      'WH-02 Guwahati': {
        total: 24,
        stages: { 1: 2, 2: 3, 3: 3, 4: 6, 5: 10, 6: 128 },
        bayPrefix: 'Inbound Bay 0'
      },
      'WH-03 Bengaluru': {
        total: 31,
        stages: { 1: 4, 2: 3, 3: 5, 4: 7, 5: 12, 6: 160 },
        bayPrefix: 'Dock Bay 0'
      },
      'WH-04 Pune': {
        total: 20,
        stages: { 1: 2, 2: 2, 3: 3, 4: 5, 5: 8, 6: 110 },
        bayPrefix: 'Dock Gate 0'
      },
      'WH-06 Hyderabad': {
        total: 36,
        stages: { 1: 5, 2: 4, 3: 6, 4: 9, 5: 12, 6: 172 },
        bayPrefix: 'Dock Bay 0'
      },
      'WH-07 Kolkata': {
        total: 27,
        stages: { 1: 3, 2: 3, 3: 4, 4: 7, 5: 10, 6: 135 },
        bayPrefix: 'Inbound Gate 0'
      },
      'WH-08 Delhi NCR': {
        total: 33,
        stages: { 1: 4, 2: 3, 3: 5, 4: 8, 5: 13, 6: 180 },
        bayPrefix: 'Dock Bay 0',
        code: 'DL'
      },
      'WH-12 Ahmedabad': {
        total: 26,
        stages: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 11, 6: 142 },
        bayPrefix: 'Dock Bay 0',
        code: 'AH'
      }
    };

    // Attach codes to other warehouses
    warehouseInwardData['WH-01 Bhiwandi'].code = 'BW';
    warehouseInwardData['WH-02 Guwahati'].code = 'GW';
    warehouseInwardData['WH-03 Bengaluru'].code = 'BL';
    warehouseInwardData['WH-04 Pune'].code = 'PN';
    warehouseInwardData['WH-06 Hyderabad'].code = 'HY';
    warehouseInwardData['WH-07 Kolkata'].code = 'KL';

    const inwardWarehouseOrdersCache = {};

    function getInwardOrdersForWarehouse(whName) {
      const facility = whName || currentFacilityName || 'WH-01 Bhiwandi';
      if (facility === 'WH-01 Bhiwandi') {
        return inwardOrdersList;
      }
      if (inwardWarehouseOrdersCache[facility]) {
        return inwardWarehouseOrdersCache[facility];
      }

      const meta = warehouseInwardData[facility] || warehouseInwardData['WH-01 Bhiwandi'];
      const code = meta.code || 'WH';
      const bay = meta.bayPrefix || 'Dock Bay 0';
      const list = [];
      const transporters = ["Blue Dart Surface", "Safexpress Logistics", "Delhivery Freight", "TCI Freight Supply", "VRL Logistics", "Gati-KWE Surface", "Spoton Express", "Rivigo Surface", "Mahindra Logistics", "Express Cargo Line"];
      const skus = [
        { name: "SKU-ELEC-44 Microchips", qty: "3,200 pcs", pallets: "16 pallets" },
        { name: "SKU-MED-40K Cold Packs", qty: "600 pcs", pallets: "12 pallets" },
        { name: "SKU-AUTO-77 Gaskets", qty: "950 pcs", pallets: "19 pallets" },
        { name: "SKU-SOLAR-04 Inverter Kits", qty: "320 pcs", pallets: "16 pallets" },
        { name: "SKU-FMCG-22 Home Essentials", qty: "1,800 pcs", pallets: "36 pallets" },
        { name: "SKU-LED-60W UltraSlim", qty: "2,400 pcs", pallets: "48 pallets" },
        { name: "SKU-CHEM-10 Liquid Drums", qty: "450 pcs", pallets: "15 pallets" },
        { name: "SKU-IND-50 Motor Spares", qty: "900 pcs", pallets: "18 pallets" },
        { name: "SKU-TEXT-99 Yarn Spools", qty: "2,100 pcs", pallets: "42 pallets" },
        { name: "SKU-FOOD-08 Canned Goods", qty: "1,500 pcs", pallets: "30 pallets" },
        { name: "SKU-PKG-15 Polybags", qty: "4,000 pcs", pallets: "20 pallets" },
        { name: "SKU-WIRE-33 Copper Cable", qty: "2,400 pcs", pallets: "24 pallets" },
        { name: "SKU-PLAS-04 Buckets", qty: "900 pcs", pallets: "18 pallets" }
      ];

      let ordNum = 8801;
      const stageNames = { 1: "1. Expected", 2: "2. At Dock", 3: "3. Unloading", 4: "4. QC & POD", 5: "5. Putaway" };

      for (let s = 1; s <= 5; s++) {
        const count = (meta.stages && meta.stages[s]) || 0;
        for (let i = 0; i < count; i++) {
          const skuObj = skus[(ordNum + i) % skus.length];
          const trans = transporters[(ordNum + i * 2) % transporters.length];
          const isPending = s < 4 || (s === 4 && i < 2);
          const bayNum = ((i % 6) + 1);
          const bayStr = s === 1 ? `${bay}${bayNum} (ETA 1${1 + (i % 3)}:${15 * (i % 4)})` : (s === 5 ? `${bay}${bayNum} / Zone ${String.fromCharCode(65 + (i % 3))}` : `${bay}${bayNum}`);

          list.push({
            id: `ORD-${code}-${ordNum}`,
            transporter: trans,
            sku: skuObj.name,
            qty: skuObj.qty,
            pallets: skuObj.pallets,
            bay: bayStr,
            stageNum: s,
            stageName: stageNames[s],
            isPending: isPending,
            pendingDetail: isPending ? `Intake verification active at ${bayStr}. Awaiting dock sign-off.` : undefined,
            isPriority: s === 4 && i === 0
          });
          ordNum++;
        }
      }

      inwardWarehouseOrdersCache[facility] = list;
      return list;
    }

    function renderInwardTable() {
      const whName = currentFacilityName || 'WH-01 Bhiwandi';
      const inSel = document.getElementById('inward-warehouse-select');
      if (inSel && inSel.value !== whName) inSel.value = whName;
      const inTableWh = document.getElementById('inward-table-wh');
      if (inTableWh) inTableWh.textContent = whName;
      const inBadge = document.getElementById('inward-facility-badge');
      if (inBadge) inBadge.textContent = `${whName} · Intake Operations`;

      // Update KPI Stage Boxes
      const whData = warehouseInwardData[whName] || warehouseInwardData['WH-01 Bhiwandi'];
      if (whData && whData.stages) {
        for (let s = 1; s <= 6; s++) {
          const countEl = document.getElementById(`inward-kpi-count-${s}`);
          if (countEl && whData.stages[s] !== undefined) {
            countEl.textContent = `${whData.stages[s]} orders`;
          }
        }
      }

      const activeOrders = getInwardOrdersForWarehouse(whName);

      // Update Filter Tabs with accurate dynamic counts for this warehouse
      const allTab = document.getElementById('inward-tab-all');
      if (allTab) {
        allTab.textContent = `All Active (${activeOrders.length})`;
      }
      [1, 2, 3, 4, 5].forEach(stNum => {
        const tabBtn = document.getElementById(`inward-tab-${stNum}`);
        if (tabBtn) {
          const stageCount = activeOrders.filter(o => o.stageNum === stNum).length;
          const stageNames = {
            1: 'Expected',
            2: 'At Dock',
            3: 'Unloading',
            4: 'QC & POD',
            5: 'Putaway'
          };
          tabBtn.textContent = `${stNum}. ${stageNames[stNum]} (${stageCount})`;
        }
      });

      const tbody = document.getElementById('inward-orders-tbody');
      const badge = document.getElementById('inward-table-count-badge');
      if (!tbody) return;

      const filtered = currentInwardFilter === 'all'
        ? activeOrders
        : activeOrders.filter(o => o.stageNum === currentInwardFilter);

      if (badge) {
        badge.textContent = `${filtered.length} Orders ${currentInwardFilter === 'all' ? 'Total' : '(Filtered)'}`;
      }

      tbody.innerHTML = '';
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-gray-500 text-[13px]">No orders found for this stage.</td></tr>`;
        return;
      }

      filtered.forEach(order => {
        const isPending = order.isPending !== false;
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-[#F9FAFB] cursor-pointer transition-colors';
        
        // When clicking anywhere on the row: if pending, open pending details; if done, open POD preview
        tr.onclick = () => {
          if (isPending) {
            openInwardPendingModal(order.id);
          } else {
            openPodModal();
          }
        };

        let stageBadgeClass = 'bg-gray-100 text-gray-700';
        if (order.stageNum === 1) stageBadgeClass = 'bg-blue-50 text-blue-700 border border-blue-200';
        else if (order.stageNum === 2) stageBadgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
        else if (order.stageNum === 3) stageBadgeClass = 'bg-amber-50 text-amber-800 border border-amber-300';
        else if (order.stageNum === 4) stageBadgeClass = 'bg-[#FEECEE] text-[#D84E55] font-bold border border-[#FECACA]';
        else if (order.stageNum === 5) stageBadgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';

        const podPill = isPending
          ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial border bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] shadow-2xs hover:shadow-xs transition-shadow">
               <span class="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span>
               Pending
             </span>`
          : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial border bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] shadow-2xs hover:shadow-xs transition-shadow">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
               Done
             </span>`;

        tr.innerHTML = `
          <td class="py-3 px-3 font-bold ${order.stageNum === 4 ? 'text-[#D84E55]' : 'text-[#1F2937]'} font-arial">${order.id}</td>
          <td class="py-3 px-3 font-medium">${order.transporter}</td>
          <td class="py-3 px-3">
            <span class="font-medium text-[#1F2937] block leading-tight">${order.sku}</span>
            <span class="text-gray-500 text-[11px] block mt-0.5">${order.qty}</span>
          </td>
          <td class="py-3 px-3 font-arial font-semibold">${order.bay}</td>
          <td class="py-3 px-3">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial inline-block ${stageBadgeClass}">
              ${order.stageName}
            </span>
          </td>
          <td class="py-3 px-3" onclick="event.stopPropagation(); ${isPending ? `openInwardPendingModal('${order.id}')` : 'openPodModal()'}">
            ${podPill}
          </td>
          <td class="py-3 px-3 text-right">
            <button onclick="event.stopPropagation(); openInwardOrderDetail('${order.id}')" class="${order.stageNum === 4 ? 'btn-redbus' : 'btn-redbus-secondary'} text-[11px] py-1 px-3 cursor-pointer">
              ${order.stageNum === 4 ? 'View Full Journey &rarr;' : 'Inspect &rarr;'}
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    const inwardOrdersMaster = {
      'ORD-IN-8821': {
        id: 'ORD-IN-8821',
        transporter: 'Bhiwandi Logistics',
        stageNum: 4,
        stageName: 'Stage 4 · QC & Proof of Delivery',
        stageLocation: 'Dock Bay 04',
        stageDesc: 'Physical cargo verified against manifest · Delivery challan signed',
        sku: 'SKU-LED-60W UltraSlim Smart Bulbs',
        qty: '2,400 pcs manifest',
        pallets: '48 wooden pallets',
        matchMsg: 'Arrived cargo matches electronic manifest (100% matched)',
        qcNote: 'Condition notes: 0 damaged cartons. Outer wrap intact with seal #ODW-8821.',
        labour: '4 workers (Scanner #04 R. Kumar)',
        forklift: 'Reach Truck #3',
        shelf: 'Zone B, Shelf B8 (Ground Tier) · Direct reach truck access',
        lrNo: 'LR-BL-994201',
        vehicleNo: 'MH-04-GP-8821',
        driver: 'Harpreet Singh · +91 98231-44910'
      },
      'ORD-IN-8824': {
        id: 'ORD-IN-8824',
        transporter: 'Safexpress Surface',
        stageNum: 3,
        stageName: 'Stage 3 · Unloading in Progress',
        stageLocation: 'Dock Bay 01',
        stageDesc: 'Offloading 1,800 cartons from container truck to staging floor',
        sku: 'SKU-FMCG-22 Home Essentials',
        qty: '1,800 pcs manifest',
        pallets: '36 wooden pallets',
        matchMsg: 'Vehicle arrived on schedule · Offload 60% complete',
        qcNote: 'Outer seal #SF-4402 intact on arrival. Visual carton check in progress.',
        labour: '3 workers (Supervisor M. Das)',
        forklift: 'Forklift #1',
        shelf: 'Zone A, Shelf A4 (Level 2) · Fast-moving grocery rack',
        lrNo: 'LR-SF-883019',
        vehicleNo: 'DL-01-AB-4412',
        driver: 'Sukhwinder Singh · +91 98112-99210'
      },
      'ORD-IN-8820': {
        id: 'ORD-IN-8820',
        transporter: 'Delhivery Freight',
        stageNum: 5,
        stageName: 'Stage 5 · Putaway to Racks',
        stageLocation: 'Dock Bay 03 & Zone C',
        stageDesc: 'Forklift transporting verified pallets from bay to high rack shelf C6',
        sku: 'SKU-BLK-99 Industrial Bulk Casings',
        qty: '3,500 pcs manifest',
        pallets: '70 wooden pallets',
        matchMsg: 'QC Passed · 100% accepted · POD signed at dock',
        qcNote: 'All 70 pallets barcoded and scanned. 0 discrepancies.',
        labour: '2 forklift operators (V. Sharma, P. Nair)',
        forklift: 'Reach Truck #2 & #4',
        shelf: 'Zone C, Shelf C6 (Bulk Tier) · Heavy duty industrial rack',
        lrNo: 'LR-DL-773120',
        vehicleNo: 'HR-55-TR-9901',
        driver: 'Rajesh Yadav · +91 98771-33214'
      }
    };

