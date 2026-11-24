    // ==============================================
    // SLOT LOCATION FLOOR MAP MODAL (POP-UP HIGHLIGHT)
    // ==============================================
    function openSlotLocationModal(orderId) {
      const modal = document.getElementById('slot-location-modal');
      if (!modal) return;

      const item = storedOrdersMaster.find(o => o.orderId === orderId) || storedOrdersMaster[0];
      const targetSlot = (item.slotId || 'A4').toUpperCase();

      // Populate text details
      const titleSlotEl = document.getElementById('slot-loc-title-slot');
      if (titleSlotEl) titleSlotEl.textContent = `Slot ${targetSlot}`;

      const targetBadgeEl = document.getElementById('slot-loc-target-badge');
      if (targetBadgeEl) targetBadgeEl.textContent = `Target Slot: ${targetSlot}`;

      const subtitleEl = document.getElementById('slot-loc-subtitle');
      if (subtitleEl) subtitleEl.textContent = `${item.orderId} · ${item.supplier} · ${item.location}`;

      const whPillEl = document.getElementById('slot-loc-wh-pill');
      if (whPillEl) whPillEl.textContent = `${currentFacilityName} · Floor 1 (Ground)`;

      const slotNameEl = document.getElementById('slot-loc-slot-name');
      if (slotNameEl) slotNameEl.textContent = `${item.location} (Slot ${targetSlot})`;

      const skuNameEl = document.getElementById('slot-loc-sku-name');
      if (skuNameEl) skuNameEl.textContent = `${item.sku} · ${item.qty}`;

      const handlerNameEl = document.getElementById('slot-loc-handler-name');
      if (handlerNameEl) handlerNameEl.textContent = `${item.handler} (${item.time})`;

      const statusNameEl = document.getElementById('slot-loc-status-name');
      if (statusNameEl) statusNameEl.innerHTML = `✓ ${item.status}`;

      const tipSlotEl = document.getElementById('slot-loc-footer-tip');
      if (tipSlotEl) tipSlotEl.textContent = targetSlot;

      // Render Floor Map with Target Slot Highlighted and Every Other Space Greyed Out
      renderSlotLocationFloorMap(targetSlot);

      // Show modal
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeSlotLocationModal() {
      const modal = document.getElementById('slot-location-modal');
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function renderSlotLocationFloorMap(targetSlot) {
      const gridContainer = document.getElementById('slot-loc-grid-container');
      if (!gridContainer) return;

      gridContainer.innerHTML = '';

      // Standard Rows: A, B, C, D, E, F, and H (Heavy Bays)
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'H'];
      const targetRow = targetSlot.charAt(0);
      const targetCol = parseInt(targetSlot.substring(1), 10);

      // Build grid header: Corner empty cell + Columns 1 to 8
      let headerHtml = '<div class="text-[10px] uppercase font-bold text-gray-400 font-arial text-center py-1">Row</div>';
      for (let c = 1; c <= 8; c++) {
        const isColActive = (c === targetCol);
        headerHtml += `<div class="text-[10.5px] font-bold ${isColActive ? 'text-[#D84E55] font-black' : 'text-gray-400'} font-arial text-center py-1">Bay 0${c}</div>`;
      }

      // Build rows
      let rowsHtml = '';
      rows.forEach(r => {
        const isRowActive = (r === targetRow);
        const rowLabel = r === 'H' ? 'Bay H' : `Row ${r}`;
        
        // Row header on the left
        rowsHtml += `
          <div class="text-[11px] font-bold ${isRowActive ? 'bg-[#FEECEE] text-[#D84E55] border-[#FECDD3] font-black shadow-2xs' : 'bg-gray-50 text-gray-500 border-gray-200'} font-arial text-center py-2 px-1 rounded-lg border flex items-center justify-center whitespace-nowrap">
            ${rowLabel}
          </div>
        `;

        // 8 Slot Cells in this row
        for (let c = 1; c <= 8; c++) {
          const slotId = `${r}${c}`;
          const isTarget = (slotId === targetSlot);

          if (isTarget) {
            // PROMINENT HIGHLIGHT FOR TARGET SLOT
            rowsHtml += `
              <div class="relative flex flex-col items-center justify-center h-12 rounded-xl bg-[#D84E55] text-white font-extrabold border-2 border-[#B91C1C] ring-4 ring-[#FECDD3] shadow-lg scale-105 z-10 animate-pulse transition-all select-none">
                <span class="text-[7.5px] uppercase tracking-wider font-arial bg-white text-[#D84E55] font-black px-1 rounded-xs -mt-0.5">TARGET</span>
                <span class="text-[13px] font-black font-arial tracking-wide">${slotId}</span>
              </div>
            `;
          } else {
            // GREYED OUT FOR EVERY OTHER SPACE
            rowsHtml += `
              <div class="flex items-center justify-center h-12 rounded-xl bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB] opacity-35 select-none font-arial text-[11px] font-semibold cursor-default hover:opacity-50 transition-opacity">
                <span>${slotId}</span>
              </div>
            `;
          }
        }
      });

      gridContainer.innerHTML = headerHtml + rowsHtml;
    }

    function filterStoredTable() {
      const q = (document.getElementById('stored-search-input')?.value || '').toLowerCase().trim();
      const zone = document.getElementById('stored-zone-filter')?.value || 'all';

      const filtered = storedOrdersMaster.filter(item => {
        const matchesQuery = !q || 
          item.orderId.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.handler.toLowerCase().includes(q);

        const matchesZone = zone === 'all' || item.location.includes(zone);
        return matchesQuery && matchesZone;
      });

      renderStoredOrdersTable(filtered);
    }


