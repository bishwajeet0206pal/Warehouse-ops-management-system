    function closeCustomerModal() {
      const modal = document.getElementById('customer-modal');
      const backdrop = document.getElementById('customer-modal-backdrop');
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100', 'scale-100');
      modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    }
    function toggleExceptionsPanel(show) {
      const panel = document.getElementById('exceptions-panel');
      const backdrop = document.getElementById('exceptions-backdrop');
      const buddyDock = document.getElementById('ai-buddy-dock');
      const chatBox = document.getElementById('ai-chat-box');
      if (show) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('translate-x-full');
        panel.classList.add('translate-x-0');
        document.body.style.overflow = 'hidden';

        const panelWidth = panel ? (panel.offsetWidth || 500) : 500;
        const shiftPx = Math.min(window.innerWidth - 80, panelWidth + 24);

        if (buddyDock) {
          buddyDock.style.transform = `translateX(-${shiftPx}px)`;
        }
        if (chatBox) {
          chatBox.style.transform = `translateX(-${shiftPx}px)`;
        }
      } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        panel.classList.remove('translate-x-0');
        panel.classList.add('translate-x-full');
        document.body.style.overflow = '';

        if (buddyDock) {
          buddyDock.style.transform = '';
        }
        if (chatBox) {
          chatBox.style.transform = '';
        }
      }
    }

    function toggleOrgHierarchyModal(show) {
      const modal = document.getElementById('org-hierarchy-modal');
      const backdrop = document.getElementById('org-hierarchy-backdrop');
      if (show) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        modal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
        modal.classList.add('opacity-100', 'scale-100');
        document.body.style.overflow = 'hidden';
      } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'scale-100');
        modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
        document.body.style.overflow = '';
      }
    }

    function filterOrgTree(level) {
      const allBtn = document.getElementById('org-filter-all');
      const l1Btn = document.getElementById('org-filter-l1');
      const l2Btn = document.getElementById('org-filter-l2');
      const l3Btn = document.getElementById('org-filter-l3');
      const btns = [allBtn, l1Btn, l2Btn, l3Btn];

      btns.forEach(b => {
        if (b) b.className = 'px-2.5 py-1 rounded-lg text-[#4B5563] hover:text-[#1F2937] transition-all';
      });

      const n1 = document.getElementById('node-level-1');
      const n2 = document.getElementById('node-level-2');
      const n4 = document.getElementById('node-level-4');

      if (level === 'all') {
        if (allBtn) allBtn.className = 'px-2.5 py-1 rounded-lg bg-white text-[#1F2937] font-bold shadow-2xs';
        if (n1) n1.style.display = 'block';
        if (n2) n2.style.display = 'block';
        if (n4) n4.style.display = 'block';
      } else if (level === 'l1') {
        if (l1Btn) l1Btn.className = 'px-2.5 py-1 rounded-lg bg-white text-[#D84E55] font-bold shadow-2xs';
        if (n1) n1.style.display = 'block';
        if (n2) n2.style.display = 'none';
        if (n4) n4.style.display = 'none';
      } else if (level === 'l2') {
        if (l2Btn) l2Btn.className = 'px-2.5 py-1 rounded-lg bg-white text-[#2563EB] font-bold shadow-2xs';
        if (n1) n1.style.display = 'none';
        if (n2) n2.style.display = 'block';
        if (n4) n4.style.display = 'none';
      } else if (level === 'l3') {
        if (l3Btn) l3Btn.className = 'px-2.5 py-1 rounded-lg bg-white text-[#10B981] font-bold shadow-2xs';
        if (n1) n1.style.display = 'none';
        if (n2) n2.style.display = 'block';
        if (n4) n4.style.display = 'block';
      }
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        toggleExceptionsPanel(false);
        toggleAiBuddyDrawer(false);
        toggleOrgHierarchyModal(false);
        toggleAiOpsModal(false);
        closeCustomerModal();
        closeSlotDetailModal();
      }
    });

    function openSlotDetailModal(storeyNum, slotId, heat, pct, sku) {
      const modal = document.getElementById('slot-detail-modal');
      const backdrop = document.getElementById('slot-detail-backdrop');
      if (!modal || !backdrop) return;

      const storey = storeyData[storeyNum] || storeyData[1];
      const isAvailable = heat === 'empty' || pct === '0%';
      const rowLetter = slotId.charAt(0);
      const colNum = slotId.substring(1);

      // Title & Subtitle
      document.getElementById('slot-modal-title').textContent = `Slot ${slotId}`;
      const slotSubEl = document.getElementById('slot-modal-subtitle');
      if (slotSubEl) slotSubEl.remove();

      // Badges
      const heatBadge = document.getElementById('slot-modal-heat-badge');
      const iconContainer = document.getElementById('slot-modal-icon-container');
      if (isAvailable) {
        heatBadge.className = 'px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-[11px] font-arial border border-[#A7F3D0]';
        heatBadge.textContent = 'AVAILABLE · 0% OCCUPIED';
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-[18px] border border-[#A7F3D0] shadow-2xs shrink-0';
      } else if (heat === 'critical') {
        heatBadge.className = 'px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] font-bold text-[11px] font-arial border border-[#FECACA] animate-pulse';
        heatBadge.textContent = `${pct} OCCUPIED · HIGH DENSITY`;
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center font-bold text-[18px] border border-[#FECACA] shadow-2xs shrink-0';
      } else if (heat === 'medium') {
        heatBadge.className = 'px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#D97706] font-bold text-[11px] font-arial border border-[#FDE68A]';
        heatBadge.textContent = `${pct} OCCUPIED · OPTIMAL`;
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold text-[18px] border border-[#FDE68A] shadow-2xs shrink-0';
      } else {
        heatBadge.className = 'px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-[11px] font-arial border border-[#A7F3D0]';
        heatBadge.textContent = `${pct} OCCUPIED · LOW DENSITY`;
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-[18px] border border-[#A7F3D0] shadow-2xs shrink-0';
      }

      document.getElementById('slot-modal-zone-badge').textContent = `ZONE ${rowLetter} · FAST MOVING`;

      // 4 Summary Tiles
      document.getElementById('slot-modal-loc').textContent = `Aisle ${rowLetter} · Bay 0${colNum} · L2`;
      document.getElementById('slot-modal-barcode').textContent = `BIN-${currentFacilityName.substring(0,5).replace(/\s/g,'')}-${storeyNum}-${slotId}`;

      // Inventory Data resolution
      const inventory = generateSlotInventory(storeyNum, slotId, heat, pct, sku);
      
      document.getElementById('slot-modal-occ-load').textContent = isAvailable ? '0 / 50 Cartons' : `${inventory.totalPcs} (${inventory.packagingSummary})`;
      document.getElementById('slot-modal-occ-pct').textContent = isAvailable ? '0% (Shelf Sanitized & Ready)' : `${pct} Space Stuffed`;
      document.getElementById('slot-modal-weight').textContent = isAvailable ? '0 kg' : inventory.totalWeight;
      document.getElementById('slot-modal-custody').textContent = inventory.custodian;
      document.getElementById('slot-modal-audittime').textContent = inventory.auditTime;
      document.getElementById('slot-modal-handling-desc').textContent = inventory.handlingNotes;

      const itemCountBadge = document.getElementById('slot-modal-item-count');
      const tbody = document.getElementById('slot-modal-tbody');
      tbody.innerHTML = '';

      if (isAvailable || inventory.items.length === 0) {
        if (itemCountBadge) itemCountBadge.className = 'px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#6B7280] font-bold text-[11px] font-arial border border-[#E5E7EB]';
        if (itemCountBadge) itemCountBadge.textContent = '0 Items · Shelf Empty';

        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="py-8 px-4 text-center">
              <div class="flex flex-col items-center justify-center space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-[22px]">
                  📦
                </div>
                <strong class="text-[14px] text-[#1F2937]">Slot ${slotId} is Currently Empty &amp; Available</strong>
                <p class="text-[12px] text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  Zero items currently stuffed in this bay. Capacity available for up to 50 cartons / 1,500 kg payload. Pre-allocated for incoming container intake from Dock Bay 04.
                </p>
                <div class="pt-2">
                  <button onclick="closeSlotDetailModal(); openInwardOrderDetail('ORD-IN-8821');" class="btn-redbus text-[11px] py-1.5 px-4 cursor-pointer">
                    Allocate Inbound Putaway &rarr;
                  </button>
                </div>
              </div>
            </td>
          </tr>
        `;
      } else {
        if (itemCountBadge) itemCountBadge.className = 'px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-[11px] font-arial border border-[#A7F3D0]';
        if (itemCountBadge) itemCountBadge.textContent = `${inventory.items.length} SKU Line Item${inventory.items.length > 1 ? 's' : ''} Stored`;

        inventory.items.forEach(item => {
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-gray-50/80 transition-colors';
          tr.innerHTML = `
            <td class="py-3 px-3 align-top break-words">
              <div class="font-bold text-[#1F2937] text-[13px] font-arial">${item.sku}</div>
              <div class="text-[11px] text-[#4B5563] mt-0.5 leading-snug">${item.name}</div>
              <span class="inline-block px-1.5 py-0.2 rounded bg-gray-100 text-[#4B5563] text-[9.5px] mt-1 font-arial font-semibold">${item.category}</span>
            </td>
            <td class="py-3 px-3 align-top break-words">
              <div class="font-bold text-[#1F2937] text-[13px]">${item.qty}</div>
              <div class="text-[11px] text-[#6B7280] mt-0.5 leading-tight">${item.packaging}</div>
            </td>
            <td class="py-3 px-3 align-top break-words">
              <div class="font-mono text-[11px] font-bold text-[#1F2937]">${item.batchLot}</div>
              <div class="text-[10.5px] text-[#6B7280] mt-0.5">Mfg: <strong class="text-[#374151]">${item.mfgDate}</strong></div>
              <div class="text-[10.5px] text-[#6B7280]">Exp: <strong class="text-[#374151]">${item.expDate}</strong></div>
            </td>
            <td class="py-3 px-3 align-top break-words">
              <div class="font-semibold text-[#1F2937] text-[12px]">${item.client}</div>
              <div class="text-[10.5px] text-[#6B7280] mt-0.5 font-mono">${item.inwardRef}</div>
              <div class="text-[10px] text-[#059669] mt-0.5 font-medium">Putaway: ${item.putawayDate}</div>
            </td>
            <td class="py-3 px-3 align-top text-right">
              <div class="flex flex-col items-end gap-1">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${item.statusClass} font-semibold text-[10.5px] font-arial border whitespace-nowrap shadow-2xs">
                  ${item.status}
                </span>
                <span class="text-[11px] text-[#64748B] font-mono font-medium">${item.weight}</span>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }

      // Show modal
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
      modal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
      modal.classList.add('opacity-100', 'scale-100');
      document.body.style.overflow = 'hidden';
    }

    function closeSlotDetailModal() {
      const modal = document.getElementById('slot-detail-modal');
      const backdrop = document.getElementById('slot-detail-backdrop');
      if (!modal || !backdrop) return;
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100', 'scale-100');
      modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
      document.body.style.overflow = '';
    }

    function generateSlotInventory(storeyNum, slotId, heat, pct, sku) {
      if (heat === 'empty' || pct === '0%') {
        return {
          totalPcs: '0 pcs',
          packagingSummary: 'Empty',
          totalWeight: '0 kg',
          custodian: 'Pooja Gupta (Inward Lead)',
          auditTime: '20 Nov 2026, 09:15 AM',
          handlingNotes: 'Shelf sanitized and cleared for new inward container putaway.',
          items: []
        };
      }

      let parsedSku = 'SKU-GEN-01';
      let parsedQty = '40 pcs';
      if (sku) {
        const m = sku.match(/^(.*?)\s*\((.*?)\)$/);
        if (m) {
          parsedSku = m[1].trim();
          parsedQty = m[2].trim();
        } else {
          parsedSku = sku;
        }
      }

      let name = 'Commercial Industrial Freight';
      let category = 'Industrial Goods';
      let client = 'Odwen Contract Logistics';
      let packaging = 'Palletized & Strapped';
      let batch = 'LOT-2026-NOV-88' + (slotId.charCodeAt(0) % 9) + (slotId.charCodeAt(1) % 9);
      let mfg = '10 Oct 2026';
      let exp = 'N/A (Durable)';
      let inwardRef = 'ORD-IN-88' + (slotId.charCodeAt(0) % 9) + '0';
      let weight = '820 kg';
      let status = '✓ QC Cleared · Stock Ready';
      let statusClass = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';

      if (parsedSku.includes('LED-60W')) {
        name = '60W UltraSlim LED Panel Light 2x2ft (Warm White & Daylight)';
        category = 'Electronics · Commercial Lighting';
        client = 'Amazon FBA Hub (Guwahati)';
        packaging = '4 Master Wooden Pallets · 12 Cartons (4 pcs/ctn)';
        weight = '1,152 kg (24 kg/ctn)';
        if (slotId === 'B8') {
          status = 'Allocated for Dispatch';
          statusClass = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
        }
      } else if (parsedSku.includes('SMART-FAN')) {
        name = 'Atomberg 1200mm BLDC Smart Ceiling Fan (Matte Black)';
        category = 'Home Appliances · Energy Star';
        client = 'Tata Croma (Paltan Bazar)';
        packaging = '3 Euro Pallets · 13 Master Cartons (3 units/box)';
        weight = '468 kg';
      } else if (parsedSku.includes('FMCG-22')) {
        name = 'HUL Dove Body Wash & Shampoo 500ml Retail Packs';
        category = 'FMCG · Personal Care & Groceries';
        client = 'Blinkit Hub 04 (Dispur)';
        packaging = '8 Plastic Totes · 48 Inner Cartons';
        exp = 'Oct 2028 (24M Shelf Life)';
        weight = '560 kg';
      } else if (parsedSku.includes('HV-CABLE')) {
        name = 'Polycab 4-Core Armored Copper Cable 16sq.mm (100m Drum)';
        category = 'Electrical Equipment · Heavy Industrial';
        client = 'L&T Infrastructure Projects';
        packaging = '2 Heavy Duty Wooden Cable Drums';
        weight = '1,420 kg (Heavy Duty Beam)';
      } else if (parsedSku.includes('BOAT-AIR')) {
        name = 'boAt Airdopes 141 ANC Bluetooth Wireless Earbuds (Cyan)';
        category = 'Consumer Tech · Fast Moving';
        client = 'Flipkart Fulfillment Center';
        packaging = '2 Corrugated Master Cases · 60 Inner Boxes';
        weight = '180 kg';
      } else if (parsedSku.includes('LENS-OPT')) {
        name = 'Canon 50mm f/1.8 STM Full-Frame Prime Camera Lenses';
        category = 'Precision Optics · High Value / Fragile';
        client = 'Reliance Digital Megastore';
        packaging = 'Shock-Resistant Foam Cases · 46 units';
        weight = '138 kg';
        status = 'High-Value Vault Inspected';
        statusClass = 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]';
      } else if (parsedSku.includes('ACC')) {
        name = 'Bosch Premium Ceramic Brake Pad Sets (Front Axle)';
        category = 'Automotive Aftermarket Parts';
        client = 'Maruti Suzuki Regional Parts Depot';
        packaging = 'Metal Stacking Bins · 35 Sets';
        weight = '420 kg';
      } else if (parsedSku.includes('BULK')) {
        name = 'Nilkamal Heavy Corrugated Double-Wall Shipping Cartons';
        category = 'Packaging Materials & Consumables';
        client = 'Odwen Internal Repackaging Store';
        packaging = 'Bundled Flatpacks on Skid';
        weight = '310 kg';
      }

      return {
        totalPcs: parsedQty,
        packagingSummary: packaging,
        totalWeight: weight,
        custodian: 'R. Kumar (Scanner #04) / Amit Patel',
        auditTime: '20 Nov 2026, 11:25 AM',
        handlingNotes: 'Forklift clearance verified · Keep dry · Double-palletized with corner strapping.',
        items: [
          {
            sku: parsedSku,
            name: name,
            category: category,
            qty: parsedQty,
            packaging: packaging,
            batchLot: batch,
            mfgDate: mfg,
            expDate: exp,
            client: client,
            inwardRef: inwardRef,
            putawayDate: '21 Nov 2026',
            status: status,
            statusClass: statusClass,
            weight: weight
          }
        ]
      };
    }

    function toggleAiOpsModal(show) {
      const modal = document.getElementById('ai-ops-modal');
      const backdrop = document.getElementById('ai-ops-backdrop');
      if (!modal || !backdrop) return;
      if (show) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        modal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
        modal.classList.add('opacity-100', 'scale-100');
        document.body.style.overflow = 'hidden';
      } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'scale-100');
        modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
        document.body.style.overflow = '';
      }
    }

    function showAiToast(title, desc) {
      const toast = document.getElementById('ai-toast');
      const tTitle = document.getElementById('ai-toast-title');
      const tDesc = document.getElementById('ai-toast-desc');
      if (!toast || !tTitle || !tDesc) return;
      tTitle.textContent = title;
      tDesc.textContent = desc;
      toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      }, 4200);
    }

