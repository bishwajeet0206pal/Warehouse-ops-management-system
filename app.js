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

    /* ==============================================
       ✦ LINKEDIN-STYLE FLOATING AI CHAT BOX CONTROLLER
       Supports Open/Close, Minimize, Maximize, and Dynamic Shift
       ============================================== */
    let aiChatMinimized = false;
    let aiChatMaximized = false;

    function toggleAiBuddyDrawer(show) {
      const chatBox = document.getElementById('ai-chat-box');
      const buddyDock = document.getElementById('ai-buddy-dock');
      if (!chatBox) return;

      if (show) {
        // Dismiss bubble if visible
        const bubble = document.getElementById('ai-buddy-bubble');
        if (bubble) bubble.style.display = 'none';

        // Check if exceptions panel is currently open
        const exceptionsPanel = document.getElementById('exceptions-panel');
        const exceptionsOpen = exceptionsPanel && !exceptionsPanel.classList.contains('translate-x-full');
        if (exceptionsOpen) {
          const panelWidth = exceptionsPanel.offsetWidth || 500;
          const shiftPx = Math.min(window.innerWidth - 80, panelWidth + 24);
          chatBox.style.transform = `translateX(-${shiftPx}px)`;
        } else {
          chatBox.style.transform = '';
        }

        // Open floating chat box smoothly
        chatBox.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-6', 'scale-95');
        chatBox.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0', 'scale-100');

        // Hide resting orb dock while chat box is open
        if (buddyDock) {
          buddyDock.classList.add('opacity-0', 'pointer-events-none');
        }

        setTimeout(() => {
          const input = document.getElementById('ai-buddy-input');
          if (input && !aiChatMinimized) input.focus();
        }, 150);
      } else {
        // Close floating chat box
        chatBox.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'scale-100');
        chatBox.classList.add('opacity-0', 'pointer-events-none', 'translate-y-6', 'scale-95');

        // Restore resting orb dock
        if (buddyDock) {
          buddyDock.classList.remove('opacity-0', 'pointer-events-none');
        }
      }
    }

    function toggleAiChatMinimize() {
      const chatBox = document.getElementById('ai-chat-box');
      const minBtn = document.getElementById('ai-chat-btn-minimize');
      if (!chatBox) return;

      aiChatMinimized = !aiChatMinimized;
      if (aiChatMinimized) {
        // If maximized, restore normal first
        if (aiChatMaximized) toggleAiChatMaximize();
        chatBox.classList.add('ai-chat-minimized');
        if (minBtn) {
          minBtn.title = 'Expand chat';
          minBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
        }
      } else {
        chatBox.classList.remove('ai-chat-minimized');
        if (minBtn) {
          minBtn.title = 'Minimize chat';
          minBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        }
        setTimeout(() => {
          const input = document.getElementById('ai-buddy-input');
          if (input) input.focus();
        }, 100);
      }
    }

    function toggleAiChatMinimizeFromHeader(e) {
      if (aiChatMinimized) {
        toggleAiChatMinimize();
      }
    }

    function toggleAiChatMaximize() {
      const chatBox = document.getElementById('ai-chat-box');
      const maxBtn = document.getElementById('ai-chat-btn-maximize');
      if (!chatBox) return;

      // If minimized, restore normal first
      if (aiChatMinimized) {
        toggleAiChatMinimize();
      }

      aiChatMaximized = !aiChatMaximized;
      if (aiChatMaximized) {
        chatBox.classList.add('ai-chat-maximized');
        if (maxBtn) {
          maxBtn.title = 'Restore size';
          maxBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>';
        }
      } else {
        chatBox.classList.remove('ai-chat-maximized');
        if (maxBtn) {
          maxBtn.title = 'Maximize chat';
          maxBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
        }
      }
    }

    function dismissAiBuddyBubble(e) {
      if (e) e.stopPropagation();
      const bubble = document.getElementById('ai-buddy-bubble');
      if (bubble) {
        bubble.classList.add('opacity-0', 'scale-90', 'pointer-events-none');
        setTimeout(() => bubble.style.display = 'none', 300);
      }
    }

    function askAiBuddy(question) {
      const input = document.getElementById('ai-buddy-input');
      if (input) input.value = question;
      handleAiBuddySubmit(new Event('submit'));
    }

    function handleAiBuddySubmit(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('ai-buddy-input');
      const thread = document.getElementById('ai-chat-thread');
      if (!input || !thread) return;
      const query = input.value.trim();
      if (!query) return;

      // Append User message
      const userBubble = document.createElement('div');
      userBubble.className = 'flex items-start justify-end gap-2 text-right';
      userBubble.innerHTML = `
        <div class="space-y-1 max-w-[85%]">
          <div class="p-3 rounded-2xl rounded-tr-sm bg-[#4F46E5] text-white text-[12.5px] leading-snug">
            ${escapeHtml(query)}
          </div>
          <span class="text-[10px] text-gray-400 pr-1">Jaswant Singh · Just now</span>
        </div>
      `;
      thread.appendChild(userBubble);
      input.value = '';
      thread.scrollTop = thread.scrollHeight;

      // Thinking Indicator with Mini-Orb Glow
      const thinkingEl = document.createElement('div');
      thinkingEl.id = 'ai-buddy-thinking';
      thinkingEl.className = 'flex items-center gap-2 text-gray-500 text-[12px] italic pl-2';
      thinkingEl.innerHTML = `
        <span class="w-3 h-3 rounded-full bg-indigo-500 animate-ping"></span>
        <span>Odwen AI analyzing network telemetry...</span>
      `;
      thread.appendChild(thinkingEl);
      thread.scrollTop = thread.scrollHeight;

      setTimeout(() => {
        const thinking = document.getElementById('ai-buddy-thinking');
        if (thinking) thinking.remove();

        const responseHtml = generateAiBuddyResponse(query);
        const aiBubble = document.createElement('div');
        aiBubble.className = 'flex items-start gap-2.5';
        aiBubble.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-[12px] shrink-0 border border-[#C7D2FE]">
            ✦
          </div>
          <div class="space-y-1.5 max-w-[88%]">
            <div class="p-3.5 rounded-2xl rounded-tl-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] space-y-2">
              ${responseHtml}
            </div>
            <span class="text-[10px] text-gray-400 pl-1">Odwen AI Assistant · Just now</span>
          </div>
        `;
        thread.appendChild(aiBubble);
        thread.scrollTop = thread.scrollHeight;
      }, 550);
    }

    function generateAiBuddyResponse(q) {
      const lower = q.toLowerCase();

      if (lower.includes('guwahati') || lower.includes('flight') || lower.includes('cutoff') || lower.includes('indigo') || lower.includes('sla')) {
        return `
          <p><strong>Guwahati Indigo 6E-882 Air Cargo Risk Analysis:</strong></p>
          <p class="text-[12px] text-gray-600">The scheduled runway cutoff is <strong>16:30</strong> (in ~90 mins). 2 orders are currently halted in Guwahati:</p>
          <ul class="list-disc pl-4 text-[12px] space-y-1 text-gray-600">
            <li><strong>ORD-GW-9014:</strong> Weight scale tare variance (+3.4kg from pallet timber moisture).</li>
            <li><strong>ORD-GW-9022:</strong> 20-unit cold-chain bin deficit. AI located 40 identical reserve units in Buffer R-12.</li>
          </ul>
          <div class="pt-1">
            <button onclick="applyAiRecommendation('guwahati_fix'); toggleAiBuddyDrawer(false);" class="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg cursor-pointer">
              ✦ Execute 1-Click Resolution (Jaswant Sign-off)
            </button>
          </div>
        `;
      }

      if (lower.includes('slot') || lower.includes('a1') || lower.includes('stuffed') || lower.includes('sku') || lower.includes('hyderabad')) {
        return `
          <p><strong>Slot A1 Stuffed Space Analysis (WH-06 Hyderabad):</strong></p>
          <p class="text-[12px] text-gray-600">Slot A1 is an active High-Bay storage location in Zone A. It contains:</p>
          <ul class="list-disc pl-4 text-[12px] space-y-0.5 text-gray-600">
            <li>450 units of <strong>SKU-AP-100</strong> (Smart LED Bulbs)</li>
            <li>300 units of <strong>SKU-OR-200</strong> (Organic Tea Cartons)</li>
          </ul>
          <p class="text-[12px] text-emerald-600 font-semibold">Utilization: 95% · Last cycle count verified 2 hours ago.</p>
          <div class="pt-1">
            <button onclick="openSlotDetail('A1'); toggleAiBuddyDrawer(false);" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
              ↳ Open Interactive Slot A1 Table Modal &rarr;
            </button>
          </div>
        `;
      }

      if (lower.includes('idle') || lower.includes('equipment') || lower.includes('forklift') || lower.includes('truck')) {
        return `
          <p><strong>Network Equipment Utilization Report:</strong></p>
          <div class="grid grid-cols-2 gap-2 text-[11.5px] my-1">
            <div class="p-2 bg-white rounded border border-gray-200">
              <span class="text-emerald-600 font-bold">31 In Use</span>
              <span class="block text-gray-500">Peak active sorting</span>
            </div>
            <div class="p-2 bg-white rounded border border-gray-200">
              <span class="text-red-500 font-bold">11 Idle</span>
              <span class="block text-gray-500">Available for rebalancing</span>
            </div>
          </div>
          <p class="text-[12px] text-gray-600">Idle breakdown: 4 Forklifts in Pune/Hyderabad, 3 Pallet Jacks in Kolkata, 2 Reach Trucks in Bhiwandi, 2 Conveyor lines on standby.</p>
        `;
      }

      if (lower.includes('velocity') || lower.includes('18 uph') || lower.includes('uph') || lower.includes('pick')) {
        return `
          <p><strong>Pick Velocity Explained (18 UPH):</strong></p>
          <p class="text-[12px] text-gray-600"><strong>UPH</strong> stands for <em>Units Per Hour</em>. It measures the aggregate picking throughput per picker across active warehouse waves.</p>
          <p class="text-[12px] text-gray-600">Current velocity of <strong>18 UPH</strong> is below the optimal threshold of 24 UPH due to Wave 2 cold-chain item locating delays in Guwahati.</p>
        `;
      }

      if (lower.includes('inward') || lower.includes('8821') || lower.includes('receipt') || lower.includes('manifest')) {
        return `
          <p><strong>Inward Order ORD-IN-8821 Status:</strong></p>
          <p class="text-[12px] text-gray-600">Transporter: <em>Bhiwandi Logistics</em> · Vehicle #MH-04-GP-8821. 2,400 units of Smart LEDs arrived at Dock Bay 04.</p>
          <p class="text-[12px] text-emerald-600 font-semibold">Stages 1–3 completed. Stage 4 (QC & POD) verified with 0 carton damage via Gemini 1.5 Flash Vision.</p>
          <div class="pt-1">
            <button onclick="openInwardOrderDetail('ORD-IN-8821'); toggleAiBuddyDrawer(false);" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
              ↳ Open Vertical Sequence Detail &rarr;
            </button>
          </div>
        `;
      }

      // Default Intelligent Response
      return `
        <p><strong>Telemetry Analysis for: "${escapeHtml(q)}"</strong></p>
        <p class="text-[12px] text-gray-600">All 38 Odwen fulfillment centers are synchronized. Network inventory occupancy is at <strong>86.4%</strong>, total active orders in transit: <strong>41,200</strong>, with 3 open exceptions requiring manager sign-off.</p>
        <div class="flex items-center gap-2 pt-1">
          <button onclick="toggleExceptionsPanel(true); toggleAiBuddyDrawer(false);" class="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer">
            ↳ Review 3 Open Exceptions &rarr;
          </button>
        </div>
      `;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function applyAiRecommendation(recId) {
      if (recId === 'guwahati_fix') {
        const fac = warehouseOutwardData['WH-02 Guwahati'];
        if (fac) {
          fac.stuckCount = 0;
          fac.stages.forEach(st => st.stuck = 0);
          fac.issues = [];
          fac.normalOrders.unshift(
            { orderId: 'ORD-GW-9014', customer: 'Amazon FBA Hub (Guwahati)', cargo: 'Electronics (12 TVs)', picker: 'P. Kalita', stage: '4. QC & Weighing', pod: 'GS1 Label Verified' },
            { orderId: 'ORD-GW-9022', customer: 'Apollo Pharmacy Regional HQ', cargo: 'Pharmaceuticals (100 Ampoules)', picker: 'M. Nath / Reach Truck 02', stage: '2. Wave Picking', pod: 'Buffer R-12 Allocated' }
          );
        }

        // Update Screen 1 Card (WH-02 Guwahati)
        const whCards = document.querySelectorAll('.warehouse-card');
        whCards.forEach(card => {
          if (card.textContent.includes('WH-02 Guwahati')) {
            card.className = 'warehouse-card bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer space-y-3';
            card.setAttribute('data-health', 'optimal');
            const b = card.querySelector('span');
            if (b && b.textContent.includes('ATTENTION')) {
              b.className = 'px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold text-[11px] font-arial';
              b.textContent = 'OPTIMAL';
            }
            const outStrong = card.querySelector('strong.text-\\[\\#D97706\\]');
            if (outStrong) {
              outStrong.className = 'text-[#059669]';
              outStrong.textContent = '0 orders (All Clear)';
            }
          }
        });

        // If inside Guwahati Outward tab, re-render
        if (currentFacilityName === 'WH-02 Guwahati') {
          renderOutwardJourney('WH-02 Guwahati');
        }

        // Update Modal Card
        const recGuwahati = document.getElementById('ai-rec-guwahati');
        if (recGuwahati) {
          recGuwahati.className = 'bg-[#F0FDF4] border border-[#A7F3D0] rounded-2xl p-4 text-[12px] text-[#065F46] flex items-center justify-between';
          recGuwahati.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="font-bold text-[14px]">✓</span>
              <span><strong>Guwahati Carrier Cutoff SLA Secured:</strong> Jaswant Singh approved tare offset and buffer stock pull. Dispatches en route.</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-white text-[#059669] font-bold text-[11px] border border-[#A7F3D0]">RESOLVED</span>
          `;
        }

        showAiToast(
          '✦ Authorized by Jaswant Singh',
          'Tare offset applied (-3.4kg) & Buffer R-12 stock allocated. Guwahati Air Cargo SLA secured!'
        );
      } else if (recId === 'pune_rebalance') {
        const recPune = document.getElementById('ai-rec-pune');
        if (recPune) {
          recPune.className = 'bg-[#F0FDF4] border border-[#A7F3D0] rounded-2xl p-4 text-[12px] text-[#065F46] flex items-center justify-between';
          recPune.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="font-bold text-[14px]">✓</span>
              <span><strong>Labour Rebalance Authorized:</strong> 2 Pune standby pickers assigned to evening flex wave.</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-white text-[#059669] font-bold text-[11px] border border-[#A7F3D0]">APPLIED</span>
          `;
        }
        showAiToast(
          '✦ Authorized by Jaswant Singh',
          '2 standby pickers in Pune WH-04 successfully re-assigned to flex wave!'
        );
      }
    }

    function resolveIssueWithAi(orderId) {
      const fac = warehouseOutwardData[currentFacilityName];
      if (!fac || !fac.issues) return;

      const issueIdx = fac.issues.findIndex(i => i.orderId === orderId);
      if (issueIdx !== -1) {
        const issue = fac.issues[issueIdx];
        const actionText = issue.aiDiagnostic ? issue.aiDiagnostic.actionShort : 'AI Resolution';

        // Decrement stuck count
        fac.stuckCount = Math.max(0, fac.stuckCount - 1);
        
        // Decrement stage stuck
        const st = fac.stages.find(s => s.id === issue.stageNum);
        if (st) st.stuck = Math.max(0, st.stuck - 1);

        // Move order to normal dispatches
        fac.normalOrders.unshift({
          orderId: issue.orderId,
          customer: issue.customer,
          cargo: issue.cargo,
          picker: issue.handlers[issue.handlers.length - 1].name,
          stage: issue.stage,
          pod: 'AI Verified & Cleared'
        });

        // Remove from issues
        fac.issues.splice(issueIdx, 1);

        // Re-render
        renderOutwardJourney(currentFacilityName);

        showAiToast(
          '✦ Jaswant Singh Approved: ' + orderId,
          actionText + ' executed. Order cleared to next outward stage!'
        );
      }
    }
    
    function filterWarehouseCards(type) {
      const allBtn = document.getElementById('filter-wh-all');
      const critBtn = document.getElementById('filter-wh-critical');
      const optBtn = document.getElementById('filter-wh-optimal');
      
      [allBtn, critBtn, optBtn].forEach(b => {
        if (b) {
          b.className = 'px-3.5 py-1.5 rounded-full bg-white text-[#4B5563] text-[12px] font-medium border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer transition-colors';
        }
      });

      const activeBtn = type === 'all' ? allBtn : (type === 'critical' ? critBtn : optBtn);
      if (activeBtn) {
        activeBtn.className = 'px-3.5 py-1.5 rounded-full bg-[#1F2937] text-white text-[12px] font-medium cursor-pointer transition-colors';
      }

      const cards = document.querySelectorAll('#screen-1 .warehouse-card');
      cards.forEach(card => {
        const health = card.getAttribute('data-health');
        if (type === 'all') {
          card.classList.remove('hidden');
        } else if (type === 'critical') {
          if (health === 'critical' || health === 'attention') card.classList.remove('hidden');
          else card.classList.add('hidden');
        } else if (type === 'optimal') {
          if (health === 'optimal') card.classList.remove('hidden');
          else card.classList.add('hidden');
        }
      });
    }

    
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

    function renderInwardTable() {
      const inFacility = document.getElementById('inward-facility-title');
      if (inFacility) inFacility.textContent = currentFacilityName || 'WH-01 Bhiwandi';
      const inTableWh = document.getElementById('inward-table-wh');
      if (inTableWh) inTableWh.textContent = currentFacilityName || 'WH-01 Bhiwandi';
      const inBadge = document.getElementById('inward-facility-badge');
      if (inBadge) inBadge.textContent = `${currentFacilityName || 'WH-01 Bhiwandi'} · Intake Operations`;
      const tbody = document.getElementById('inward-orders-tbody');
      const badge = document.getElementById('inward-table-count-badge');
      if (!tbody) return;

      const filtered = currentInwardFilter === 'all'
        ? inwardOrdersList
        : inwardOrdersList.filter(o => o.stageNum === currentInwardFilter);

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

    /* =========================================================================
       FIXED WORKFLOW SOP TASK CHECKLISTS (INWARD & OUTWARD SEQUENCES)
       Each stage is composed of sequential tasks; when all tasks are complete,
       the stage is marked Done.
       ========================================================================= */

    const inwardStageChecklistsData = {
      1: {
        name: 'Manifest & ASN Ingestion',
        tasks: [
          { num: 1, name: 'Electronic ASN Sync', detail: 'Advance Shipping Notice parsed & validated against ERP purchase order' },
          { num: 2, name: 'PO Line Item Verification', detail: 'Supplier item code, SKU details, and manifest quantities matched' },
          { num: 3, name: 'GST e-Way Bill Validation', detail: 'National e-Way Bill Portal cross-check passed with 0 discrepancies' },
          { num: 4, name: 'Dock Bay Pre-Allocation', detail: 'Dedicated inbound dock bay & material handling equipment assigned' }
        ]
      },
      2: {
        name: 'Gate Inward & Docking',
        tasks: [
          { num: 1, name: 'Security Gate Check-in', detail: 'Vehicle number, transporter credentials & driver identity logged' },
          { num: 2, name: 'Gate Intake Token & LR', detail: 'Physical Lorry Receipt endorsed with gate arrival timestamp' },
          { num: 3, name: 'Dock Bay Positioning', detail: 'Container truck reversed and docked securely at bay cushion' },
          { num: 4, name: 'Safety Leveler & Chocks', detail: 'Dock leveler ramp engaged and wheel safety chocks locked' }
        ]
      },
      3: {
        name: 'Unloading from Vehicle',
        tasks: [
          { num: 1, name: 'Labour Crew Deployment', detail: 'Workforce handlers and forklift operator stationed at bay apron' },
          { num: 2, name: 'Pallet De-stuffing', detail: 'Pallets offloaded from container truck bed onto intake staging area' },
          { num: 3, name: 'Gross Carton Count', detail: 'Initial physical carton and pallet count tallied against gate token' },
          { num: 4, name: 'Dock Apron Pathway Clear', detail: 'Pallets aligned in designated rows; clear pathway maintained' }
        ]
      },
      4: {
        name: 'QC & Proof of Delivery (POD)',
        tasks: [
          { num: 1, name: 'Container Seal Integrity', detail: 'Tamper-evident seal verified unbroken by intake inspector' },
          { num: 2, name: 'Physical Carton Check', detail: '0 crushed, 0 damp; pallet shrink-wrap verified upright & tight' },
          { num: 3, name: 'GS1-128 Barcode Scan', detail: 'Every pallet and master carton scanned via handheld terminal' },
          { num: 4, name: 'Challan Quantity Reconciliation', detail: 'Physical count 100% matched against vendor invoice' },
          { num: 5, name: 'Gemini AI Vision Audit', detail: 'Visual verification of cargo packaging integrity & label OCR' },
          { num: 6, name: 'Signed Delivery Challan (POD)', detail: 'Consignee official stamp affixed & driver receipt signed' }
        ]
      },
      5: {
        name: 'Rack Putaway & Slotting',
        tasks: [
          { num: 1, name: 'WMS Storage Bin Allocation', detail: 'System designates optimal zone, aisle, and rack shelf location' },
          { num: 2, name: 'Reach Truck Pallet Retrieval', detail: 'High-bay reach truck retrieves verified pallets from staging bay' },
          { num: 3, name: 'Aisle Pathway Transit', detail: 'Safe transit along designated aisle with pedestrian clearance verified' },
          { num: 4, name: 'Rack Slotting & Barcode Scan', detail: 'Pallet elevated to shelf tier; shelf bin barcode scan confirmed' }
        ]
      },
      6: {
        name: 'Final Bin Storage & ERP Sync',
        tasks: [
          { num: 1, name: 'Shelf Bin Location Scan', detail: 'High-rack physical location confirmed by handheld scanner' },
          { num: 2, name: 'ERP Inventory Posting', detail: 'Units credited to live available inventory stock ledger' },
          { num: 3, name: 'Digital GRN Notification', detail: 'Goods Receipt Note automatically transmitted to supplier' }
        ]
      }
    };

    const outwardStageChecklistsData = {
      1: {
        name: 'Order Intake & Wave Release',
        tasks: [
          { num: 1, name: 'ERP Order Validation', detail: 'Customer sales order validated & inventory stock locked in WMS' },
          { num: 2, name: 'Wave Batching & Grouping', detail: 'Order batched into wave run with travel-distance optimized pick path' },
          { num: 3, name: 'Pick List Dispatch', detail: 'Digital pick sequence transmitted to floor picker terminal' },
          { num: 4, name: 'Tote & Cart Assignment', detail: 'Rolling cart prepped with color-coded destination tote bins' }
        ]
      },
      2: {
        name: 'Wave Picking from Racks',
        tasks: [
          { num: 1, name: 'Aisle Navigation', detail: 'Picker dispatched to designated warehouse zone, aisle & shelf bin' },
          { num: 2, name: 'Bin Barcode Verification', detail: 'Scanner confirms correct rack shelf location before retrieval' },
          { num: 3, name: 'Carton Retrieval & Count', detail: 'Ordered piece quantity verified and placed into assigned tote' },
          { num: 4, name: 'Wave Pick Completion Scan', detail: 'Tote barcode scanned to close wave pick run for packaging' }
        ]
      },
      3: {
        name: 'Sorting & Packing',
        tasks: [
          { num: 1, name: 'Consolidation at Pack Station', detail: 'Picked totes transferred to designated packing workbench' },
          { num: 2, name: 'Protective Cushioning', detail: 'Bubble wrap & void-fill added for fragile transport protection' },
          { num: 3, name: 'Carton Sealing & Strapping', detail: 'Double-corrugated box taped & poly-strapped tamper-evident' },
          { num: 4, name: 'Shipping Label Affixed', detail: 'Carrier Airway Bill & customer destination shipping label pasted' }
        ]
      },
      4: {
        name: 'QC, Weighing & Manifest',
        tasks: [
          { num: 1, name: 'Digital Gross Weighing', detail: 'Accurate parcel gross weight recorded by calibrated scale' },
          { num: 2, name: 'Volumetric Cubic Scan', detail: 'Length, width, and height scanned by 3D optical dimensioner' },
          { num: 3, name: 'Carrier Manifest API Sync', detail: 'Electronic shipping manifest transmitted to courier gateway' },
          { num: 4, name: 'Security Gate Out Token', detail: 'Outbound dispatch pass generated with QR verification' }
        ]
      },
      5: {
        name: 'Dock Bay Staging & Marshalling',
        tasks: [
          { num: 1, name: 'Transit to Outbound Bay', detail: 'Hand pallet truck moves packed boxes to outbound dock bay' },
          { num: 2, name: 'Route & Pincode Grouping', detail: 'Consignments sorted by carrier delivery zone and hub cluster' },
          { num: 3, name: 'Carrier Vehicle Positioning', detail: 'Transporter container truck docked at designated bay' },
          { num: 4, name: 'Pre-Loading Staging Audit', detail: 'Carton count tallied against driver load manifest' }
        ]
      },
      6: {
        name: 'Carrier Handover & Dispatch',
        tasks: [
          { num: 1, name: 'Vehicle Loading & Restraint', detail: 'Cargo loaded into carrier vehicle and strapped securely' },
          { num: 2, name: 'Signed Proof of Dispatch', detail: 'Transporter driver signs physical delivery challan & POD copy' },
          { num: 3, name: 'Gate Out & Tracking Live', detail: 'Truck departs facility gate; customer live tracking activated' }
        ]
      }
    };

    function updateInwardStageChecklists(currentStageNum) {
      currentStageNum = parseInt(currentStageNum) || 1;
      
      for (let s = 1; s <= 6; s++) {
        const data = inwardStageChecklistsData[s];
        if (!data) continue;

        const isDone = s < currentStageNum;
        const isInProgress = s === currentStageNum;
        const isUpcoming = s > currentStageNum;

        // 1. Update Spine Node
        const nodeEl = document.getElementById(`inward-stage-node-${s}`);
        if (nodeEl) {
          if (isDone) {
            nodeEl.className = 'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#10B981] text-white border-4 border-white shadow-sm flex items-center justify-center text-[11px] font-bold';
            nodeEl.innerHTML = '✓';
          } else if (isInProgress) {
            nodeEl.className = 'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#3B82F6] text-white border-4 border-white shadow-md flex items-center justify-center text-[11px] font-bold';
            nodeEl.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>';
          } else {
            nodeEl.className = 'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white text-gray-400 border-2 border-gray-300 shadow-2xs flex items-center justify-center text-[11px] font-bold font-arial';
            nodeEl.innerHTML = `${s}`;
          }
        }

        // 2. Update Top Badge in Card Header
        const badgeEl = document.getElementById(`inward-stage-badge-${s}`);
        if (badgeEl) {
          if (isDone) {
            badgeEl.className = 'text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]';
            badgeEl.textContent = 'Stage Completed · All Tasks Done';
          } else if (isInProgress) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold border border-[#BFDBFE] animate-pulse';
            badgeEl.textContent = 'In Progress';
          } else {
            badgeEl.className = 'text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200';
            badgeEl.textContent = 'Pending Prior Stage';
          }
        }

        // 3. Update Card Container Styling
        const cardEl = document.getElementById(`inward-stage-card-${s}`);
        if (cardEl) {
          if (isDone) {
            cardEl.className = 'bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs relative transition-all';
          } else if (isInProgress) {
            cardEl.className = 'bg-white border-2 border-[#93C5FD] rounded-2xl p-5 shadow-md space-y-4 relative transition-all';
          } else {
            cardEl.className = 'opacity-65 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-5 shadow-2xs relative transition-all';
          }
        }

        // 4. Render Checklist Box
        const checklistBox = document.getElementById(`inward-stage-${s}-checklist`);
        if (checklistBox) {
          const totalTasks = data.tasks.length;
          let completedCount = 0;
          let headerBadge = '';
          
          if (isDone) {
            completedCount = totalTasks;
            headerBadge = `<span class="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold font-arial">${totalTasks}/${totalTasks} Tasks Complete · Stage Done</span>`;
          } else if (isInProgress) {
            completedCount = Math.max(1, totalTasks - 1);
            headerBadge = `<span class="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[11px] font-bold font-arial flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span> ${completedCount}/${totalTasks} Tasks Complete · In Progress</span>`;
          } else {
            completedCount = 0;
            headerBadge = `<span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold font-arial">0/${totalTasks} Tasks · Upcoming</span>`;
          }

          const tasksHtml = data.tasks.map((task, idx) => {
            let taskBadge = '';
            let taskCardClass = 'bg-white border-gray-200';
            
            if (isDone) {
              taskCardClass = 'bg-[#F9FCFA] border-[#A7F3D0]';
              taskBadge = `<span class="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10.5px] font-bold font-arial shrink-0 flex items-center gap-1 border border-[#A7F3D0]">✓ Done</span>`;
            } else if (isInProgress) {
              if (idx < completedCount) {
                taskCardClass = 'bg-[#F9FCFA] border-[#A7F3D0]';
                taskBadge = `<span class="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10.5px] font-bold font-arial shrink-0 flex items-center gap-1 border border-[#A7F3D0]">✓ Done</span>`;
              } else if (idx === completedCount) {
                taskCardClass = 'bg-[#EFF6FF] border-[#BFDBFE] shadow-2xs';
                taskBadge = `<span class="px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF] text-[10.5px] font-bold font-arial shrink-0 flex items-center gap-1 border border-[#93C5FD]"><span class="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span> Active</span>`;
              } else {
                taskCardClass = 'bg-gray-50 border-gray-200 text-gray-400';
                taskBadge = `<span class="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10.5px] font-bold font-arial shrink-0">Pending</span>`;
              }
            } else {
              taskCardClass = 'bg-gray-50/80 border-gray-200 text-gray-400';
              taskBadge = `<span class="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[10.5px] font-medium font-arial shrink-0">Upcoming</span>`;
            }

            return `
              <div class="flex items-center justify-between p-2.5 rounded-lg border ${taskCardClass} shadow-2xs gap-2">
                <div>
                  <span class="font-bold text-[#1F2937] block text-[12px]">${task.num}. ${task.name}</span>
                  <span class="text-[11px] text-[#4B5563] block mt-0.5 leading-snug">${task.detail}</span>
                </div>
                ${taskBadge}
              </div>
            `;
          }).join('');

          checklistBox.innerHTML = `
            <div class="rounded-xl border border-gray-200 bg-[#F9FAFB] p-3.5 space-y-2.5">
              <div class="flex items-center justify-between pb-2 border-b border-gray-200 flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-arial block">Stage ${s} SOP Task Checklist</span>
                  <span class="text-[11px] text-gray-400 hidden sm:inline">· Sequential Workflow</span>
                </div>
                <div>${headerBadge}</div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(totalTasks, 3)} gap-2">
                ${tasksHtml}
              </div>
            </div>
          `;
        }
      }
    }

    function updateOutwardStageChecklists(currentStageNum) {
      currentStageNum = parseInt(currentStageNum) || 1;
      
      for (let s = 1; s <= 6; s++) {
        const data = outwardStageChecklistsData[s];
        if (!data) continue;

        const isDone = s < currentStageNum;
        const isInProgress = s === currentStageNum;
        const isUpcoming = s > currentStageNum;

        // 1. Update Spine Node
        const nodeEl = document.getElementById(`outward-stage-node-${s}`);
        if (nodeEl) {
          if (isDone) {
            nodeEl.className = 'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#10B981] text-white border-4 border-white shadow-sm flex items-center justify-center text-[11px] font-bold';
            nodeEl.innerHTML = '✓';
          } else if (isInProgress) {
            nodeEl.className = 'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#3B82F6] text-white border-4 border-white shadow-md flex items-center justify-center text-[11px] font-bold';
            nodeEl.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>';
          } else {
            nodeEl.className = 'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white text-gray-400 border-2 border-gray-300 shadow-2xs flex items-center justify-center text-[11px] font-bold font-arial';
            nodeEl.innerHTML = `${s}`;
          }
        }

        // 2. Update Top Badge in Card Header
        const badgeEl = document.getElementById(`outward-stage-badge-${s}`);
        if (badgeEl) {
          if (isDone) {
            badgeEl.className = 'text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]';
            badgeEl.textContent = 'Stage Completed · All Tasks Done';
          } else if (isInProgress) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold border border-[#BFDBFE] animate-pulse';
            badgeEl.textContent = 'In Progress';
          } else {
            badgeEl.className = 'text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200';
            badgeEl.textContent = 'Pending Prior Stage';
          }
        }

        // 3. Update Card Container Styling
        const cardEl = document.getElementById(`outward-stage-card-${s}`);
        if (cardEl) {
          if (isDone) {
            cardEl.className = 'bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs relative transition-all';
          } else if (isInProgress) {
            cardEl.className = 'bg-white border-2 border-[#93C5FD] rounded-2xl p-5 shadow-md space-y-4 relative transition-all';
          } else {
            cardEl.className = 'opacity-65 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-5 shadow-2xs relative transition-all';
          }
        }

        // 4. Render Checklist Box
        const checklistBox = document.getElementById(`outward-stage-${s}-checklist`);
        if (checklistBox) {
          const totalTasks = data.tasks.length;
          let completedCount = 0;
          let headerBadge = '';
          
          if (isDone) {
            completedCount = totalTasks;
            headerBadge = `<span class="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold font-arial">${totalTasks}/${totalTasks} Tasks Complete · Stage Done</span>`;
          } else if (isInProgress) {
            completedCount = Math.max(1, totalTasks - 1);
            headerBadge = `<span class="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[11px] font-bold font-arial flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span> ${completedCount}/${totalTasks} Tasks Complete · In Progress</span>`;
          } else {
            completedCount = 0;
            headerBadge = `<span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold font-arial">0/${totalTasks} Tasks · Upcoming</span>`;
          }

          const tasksHtml = data.tasks.map((task, idx) => {
            let taskBadge = '';
            let taskCardClass = 'bg-white border-gray-200';
            
            if (isDone) {
              taskCardClass = 'bg-[#F9FCFA] border-[#A7F3D0]';
              taskBadge = `<span class="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10.5px] font-bold font-arial shrink-0 flex items-center gap-1 border border-[#A7F3D0]">✓ Done</span>`;
            } else if (isInProgress) {
              if (idx < completedCount) {
                taskCardClass = 'bg-[#F9FCFA] border-[#A7F3D0]';
                taskBadge = `<span class="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] text-[10.5px] font-bold font-arial shrink-0 flex items-center gap-1 border border-[#A7F3D0]">✓ Done</span>`;
              } else if (idx === completedCount) {
                taskCardClass = 'bg-[#EFF6FF] border-[#BFDBFE] shadow-2xs';
                taskBadge = `<span class="px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF] text-[10.5px] font-bold font-arial shrink-0 flex items-center gap-1 border border-[#93C5FD]"><span class="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span> Active</span>`;
              } else {
                taskCardClass = 'bg-gray-50 border-gray-200 text-gray-400';
                taskBadge = `<span class="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10.5px] font-bold font-arial shrink-0">Pending</span>`;
              }
            } else {
              taskCardClass = 'bg-gray-50/80 border-gray-200 text-gray-400';
              taskBadge = `<span class="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[10.5px] font-medium font-arial shrink-0">Upcoming</span>`;
            }

            return `
              <div class="flex items-center justify-between p-2.5 rounded-lg border ${taskCardClass} shadow-2xs gap-2">
                <div>
                  <span class="font-bold text-[#1F2937] block text-[12px]">${task.num}. ${task.name}</span>
                  <span class="text-[11px] text-[#4B5563] block mt-0.5 leading-snug">${task.detail}</span>
                </div>
                ${taskBadge}
              </div>
            `;
          }).join('');

          checklistBox.innerHTML = `
            <div class="rounded-xl border border-gray-200 bg-[#F9FAFB] p-3.5 space-y-2.5">
              <div class="flex items-center justify-between pb-2 border-b border-gray-200 flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-arial block">Stage ${s} SOP Task Checklist</span>
                  <span class="text-[11px] text-gray-400 hidden sm:inline">· Sequential Workflow</span>
                </div>
                <div>${headerBadge}</div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(totalTasks, 3)} gap-2">
                ${tasksHtml}
              </div>
            </div>
          `;
        }
      }
    }

    function openInwardOrderDetail(orderId) {
      const inDetailWh = document.getElementById('inward-detail-wh');
      if (inDetailWh) inDetailWh.textContent = currentFacilityName || 'WH-01 Bhiwandi';
      let order = inwardOrdersMaster[orderId];
      if (!order) {
        const found = inwardOrdersList.find(o => o.id === orderId);
        if (found) {
          order = {
            id: found.id,
            transporter: found.transporter,
            stageNum: found.stageNum,
            stageName: found.stageName,
            stageLocation: found.bay,
            stageDesc: `Operational status: ${found.podStatus} at ${found.bay}`,
            sku: found.sku,
            qty: found.qty,
            pallets: found.pallets || '24 pallets',
            matchMsg: 'Electronic manifest and ASN synchronized',
            qcNote: 'Outer seal intact on arrival. Physical verification scheduled.',
            labour: '3 workers assigned',
            forklift: 'Reach Truck #02',
            shelf: 'Zone B, Shelf B8 (Ground Tier)',
            lrNo: 'LR-IN-' + found.id.replace('ORD-IN-', '') + '-88',
            vehicleNo: 'MH-04-TR-' + (Math.floor(1000 + Math.random() * 9000)),
            driver: 'Gurpreet Singh · +91 98200-88120'
          };
        } else {
          order = inwardOrdersMaster['ORD-IN-8821'];
        }
      }
      
      const titleEl = document.getElementById('inward-detail-title');
      if (titleEl) titleEl.textContent = `${order.id} · ${order.transporter} Transporter`;

      const stageNumber = order.stageNum || 1;
      const stageTitles = {
        1: 'Stage 1 · Expected Cargo',
        2: 'Stage 2 · Truck at Dock',
        3: 'Stage 3 · Cargo Unloading',
        4: 'Stage 4 · QC & Proof of Delivery',
        5: 'Stage 5 · Putaway to Racks',
        6: 'Stage 6 · Stored in Inventory'
      };

      updateInwardStageChecklists(stageNumber);

      const cleanStageTitle = stageTitles[stageNumber] || (order.stageName ? order.stageName.replace(/^\d+\.\s*/, `Stage ${stageNumber} · `) : `Stage ${stageNumber}`);

      // Parse Bay & ETA without nested brackets
      let cleanBay = 'Dock Bay 04';
      let cleanEta = '20 Nov 2026, On Schedule';
      const rawLocation = order.stageLocation || order.bay || '';

      if (rawLocation.includes('ETA')) {
        const bayMatch = rawLocation.match(/(Bay\s*\d+|Dock\s*Bay\s*\d+|Dock\s*\d+)/i);
        if (bayMatch) cleanBay = bayMatch[0];
        const etaMatch = rawLocation.match(/ETA\s*([0-9:]+)/i);
        if (etaMatch) cleanEta = `${etaMatch[1]} IST`;
      } else if (rawLocation) {
        cleanBay = rawLocation;
        cleanEta = stageNumber === 1 ? 'Expected 11:30 IST' : (stageNumber === 4 ? '09:40 AM IST' : 'Active on Site');
      }

      const cleanStatus = order.podStatus || (stageNumber === 4 ? 'Active QC Inspection' : (stageNumber === 1 ? 'Manifest Registered' : (stageNumber === 3 ? 'Unloading Active' : 'In Progress')));

      const stageDescriptions = {
        1: 'Advance shipping notice registered · En route to facility',
        2: 'Vehicle parked at dock gate · Gate paperwork verification',
        3: 'Offloading cartons and pallets onto intake staging area',
        4: 'Physical cargo verified against manifest · Delivery challan signed',
        5: 'Transporting verified pallets from bay to designated storage racks',
        6: 'Putaway completed · Cargo stored in active racks'
      };

      const stageLabel = document.getElementById('inward-stage-label');
      if (stageLabel) stageLabel.textContent = cleanStageTitle;

      const stageNumBadge = document.getElementById('inward-stage-num-badge');
      if (stageNumBadge) stageNumBadge.textContent = `Stage ${stageNumber} of 5 Active`;

      const bayVal = document.getElementById('inward-bay-val');
      if (bayVal) bayVal.textContent = cleanBay;

      const etaVal = document.getElementById('inward-eta-val');
      if (etaVal) etaVal.textContent = cleanEta;

      const statusVal = document.getElementById('inward-status-val');
      if (statusVal) statusVal.textContent = cleanStatus;

      const stageDesc = document.getElementById('inward-stage-desc');
      if (stageDesc) stageDesc.textContent = stageDescriptions[stageNumber] || order.stageDesc || 'Active physical fulfillment';

      // Update right-side progress pills
      const progressContainer = document.getElementById('inward-stage-progress-pills');
      if (progressContainer) {
        if (stageNumber === 1) {
          progressContainer.innerHTML = `
            <span class="text-[11px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
              Stage 1 in Progress
            </span>
            <span class="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
              4 Stages Remaining
            </span>
          `;
        } else {
          progressContainer.innerHTML = `
            <span class="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
              Stages 1–${stageNumber - 1} Completed
            </span>
            <span class="text-[11px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
              Stage ${stageNumber} in Progress
            </span>
          `;
        }
      }

      const skuEl = document.getElementById('inward-sku');
      if (skuEl) skuEl.textContent = order.sku;

      const qtyEl = document.getElementById('inward-qty');
      if (qtyEl) qtyEl.textContent = order.qty;

      const palletsEl = document.getElementById('inward-pallets');
      if (palletsEl) palletsEl.textContent = order.pallets;

      const matchEl = document.getElementById('inward-match');
      if (matchEl) matchEl.textContent = (order.matchMsg || '').replace(/^[✓✔]\s*/, '');

      const chkQty = document.getElementById('inward-checklist-qty');
      if (chkQty) chkQty.textContent = `${order.qty} (100% Match)`;

      const labourEl = document.getElementById('inward-labour');
      if (labourEl) labourEl.textContent = order.labour;

      const forkEl = document.getElementById('inward-forklift');
      if (forkEl) forkEl.textContent = order.forklift;

      const shelfEl = document.getElementById('inward-shelf');
      if (shelfEl) shelfEl.textContent = order.shelf;

      const lrEl = document.getElementById('inward-lr-no');
      if (lrEl) lrEl.textContent = order.lrNo;

      const vehEl = document.getElementById('inward-vehicle-no');
      if (vehEl) vehEl.textContent = order.vehicleNo;

      // Parse Driver Name and single Phone Number consistently
      const rawDriver = order.driver || 'Harpreet Singh · +91 98231-44910';
      let dName = rawDriver;
      let dPhone = '+91 98231-44910';

      if (rawDriver.includes('·')) {
        const parts = rawDriver.split('·');
        dName = parts[0].trim();
        dPhone = parts[1].trim();
      } else if (rawDriver.match(/\+?\d/)) {
        const match = rawDriver.match(/\+?\d[\d\s-]{8,}/);
        if (match) {
          dPhone = match[0].trim();
          dName = rawDriver.replace(dPhone, '').replace(/[-•·]/g, '').trim() || dName;
        }
      }

      const driverNameEl = document.getElementById('inward-driver-name') || document.getElementById('inward-driver');
      if (driverNameEl) driverNameEl.textContent = dName;

      const driverPhoneEl = document.getElementById('inward-driver-phone');
      if (driverPhoneEl) driverPhoneEl.textContent = dPhone;

      goToScreen(4);
    }

    function openInwardOrderByStage(stageNum) {
      if (stageNum === 3) openInwardOrderDetail('ORD-IN-8824');
      else if (stageNum === 5) openInwardOrderDetail('ORD-IN-8820');
      else openInwardOrderDetail('ORD-IN-8821');
    }

    const outwardOrdersMaster = {
      'ORD-OUT-4521': {
        id: 'ORD-OUT-4521',
        customer: 'Acme Industries (Hyderabad)',
        stageNum: 2,
        stageName: 'Stage 2 · Picking from Shelves',
        stageLocation: 'Zone B, Shelf B4',
        stageDesc: 'Assigned picker collecting items from floor rack bins using barcode scanner',
        items: 'Electronics (5 items · 50 units)',
        picker: 'S. Rao (Scanner #04 · Morning Shift)',
        carrier: 'Blue Dart Express',
        trackingId: 'BLUEDART-882910-HYD',
        cutoff: '16:00 IST (22 min remaining)',
        packingNote: 'Packing confirmed: Yes (Double corrugated + tamper-evident tape)',
        podNote: 'Delivered: Pending courier transit · Est. arrival 20 Nov 2026, 18:30 IST',
        pickerInfo: 'Assigned Picker: S. Rao (Scanner #04) · Staged at Dock Bay 02'
      },
      'ORD-OUT-4522': {
        id: 'ORD-OUT-4522',
        customer: 'Metro Logistics (Bengaluru)',
        stageNum: 4,
        stageName: 'Stage 4 · Staged at Outbound Dock',
        stageLocation: 'Dock Bay 03 Outbound',
        stageDesc: 'Packaged cases consolidated on dispatch pallet · Awaiting carrier truck arrival',
        items: 'Packaged Food (25 cases · 250 units)',
        picker: 'M. Das (Reach Truck #2)',
        carrier: 'Safexpress Freight Surface',
        trackingId: 'SAFE-BLR-441092',
        cutoff: '17:30 IST (Scheduled arrival 15:45 IST)',
        packingNote: 'Packing confirmed: Pallet shrink-wrapped · Security seal #ODW-OUT-4522 applied',
        podNote: 'Carrier Pickup: Safexpress truck in gate queue · Gate pass verified',
        pickerInfo: 'Consolidated by M. Das · Staged at Outbound Bay 03'
      },
      'ORD-OUT-4519': {
        id: 'ORD-OUT-4519',
        customer: 'Zenith Retail (Mumbai)',
        stageNum: 6,
        stageName: 'Stage 6 · Delivered & POD Confirmed',
        stageLocation: 'Customer Facility (Mumbai)',
        stageDesc: 'Consignment successfully handed over · Customer signed digital delivery receipt',
        items: 'Industrial Parts (12 units · 3 cartons)',
        picker: 'V. Sharma',
        carrier: 'Blue Dart Express Surface (Van MH-02-CP-9104)',
        trackingId: 'BLUEDART-882910-HYD',
        cutoff: 'Delivered 20 Nov 2026 at 17:40 IST',
        packingNote: 'Delivered in good condition · Zero carton damage acknowledged by receiver',
        podNote: 'Signed by Customer: K. Pillai (Store In-Charge) · Digital POD stored',
        pickerInfo: 'Fulfillment completed by V. Sharma · Delivered by Blue Dart'
      }
    };

    const outwardStageSteps = [
      { num: 1, name: '1. Order Received' },
      { num: 2, name: '2. Picking' },
      { num: 3, name: '3. Packing & QC' },
      { num: 4, name: '4. Staged at Dock' },
      { num: 5, name: '5. Dispatched' },
      { num: 6, name: '6. Delivered & POD' }
    ];

    function openOutwardOrderDetail(orderId) {
      const outDetailWh = document.getElementById('outward-detail-wh');
      if (outDetailWh) outDetailWh.textContent = currentFacilityName || 'WH-01 Bhiwandi';
      let order = outwardOrdersMaster[orderId];
      if (!order) {
        const facility = warehouseOutwardData[currentFacilityName];
        if (facility) {
          const foundNorm = (facility.normalOrders || []).find(o => o.orderId === orderId);
          const foundIssue = (facility.issues || []).find(o => o.orderId === orderId);
          if (foundNorm) {
            order = {
              id: foundNorm.orderId,
              customer: foundNorm.customer,
              stageNum: foundNorm.stageNum || 2,
              stageName: foundNorm.stage,
              stageLocation: 'Assigned Outbound Zone',
              stageDesc: `Order items: ${foundNorm.cargo}. Current status: ${foundNorm.pod}`,
              items: foundNorm.cargo,
              picker: foundNorm.picker,
              carrier: 'Blue Dart Express',
              trackingId: `BLUEDART-${foundNorm.orderId.replace('ORD-', '')}`,
              cutoff: '16:00 IST (22 min remaining)',
              packingNote: 'Double-corrugated packaging verified with tamper seal',
              podNote: foundNorm.pod,
              pickerInfo: `Assigned Handler: ${foundNorm.picker}`
            };
          } else if (foundIssue) {
            order = {
              id: foundIssue.orderId,
              customer: foundIssue.customer,
              stageNum: foundIssue.stageNum || 2,
              stageName: foundIssue.stage,
              stageLocation: 'Problem Resolution Zone',
              stageDesc: `Bottleneck Issue: ${foundIssue.reason} (${foundIssue.timeStuck})`,
              items: foundIssue.cargo,
              picker: foundIssue.handlers && foundIssue.handlers.length > 0 ? foundIssue.handlers[foundIssue.handlers.length - 1].name : 'Floor Marshal',
              carrier: 'Blue Dart Express',
              trackingId: `BLUEDART-${foundIssue.orderId.replace('ORD-', '')}`,
              cutoff: foundIssue.slaImpact || 'SLA Critical',
              packingNote: 'Inspection on hold pending resolution',
              podNote: `Blocked: ${foundIssue.reason}`,
              pickerInfo: `Supervisory Lead: ${foundIssue.supervisor}`
            };
          }
        }
      }
      if (!order) {
        order = outwardOrdersMaster['ORD-OUT-4521'];
      }

      const titleEl = document.getElementById('outward-detail-title');
      if (titleEl) titleEl.textContent = `${order.id} · ${order.customer}`;

      const outStageNum = order.stageNum || 2;
      updateOutwardStageChecklists(outStageNum);
      const outStageTitles = {
        1: 'Stage 1 · Order Received',
        2: 'Stage 2 · Wave Picking from Shelves',
        3: 'Stage 3 · Sorting & Packing',
        4: 'Stage 4 · QC & Weighing Check',
        5: 'Stage 5 · Staged at Dock',
        6: 'Stage 6 · Dispatched & POD'
      };

      const outCleanTitle = outStageTitles[outStageNum] || (order.stageName ? order.stageName.replace(/^\d+\.\s*/, `Stage ${outStageNum} · `) : `Stage ${outStageNum}`);

      const outStageDescriptions = {
        1: 'Customer order confirmed · Wave release scheduled for floor pickers',
        2: 'Picker collecting items from floor rack bins using barcode scanner',
        3: 'Items sorted, wrapped with bubble cushioning, and packed into cartons',
        4: 'Package placed on bench scale for gross weight & label verification',
        5: 'Packed cargo staged on dock pallets · Gate pass prepared for truck',
        6: 'Carrier dispatched cargo · Signed POD document archived'
      };

      const stageLabel = document.getElementById('outward-stage-label');
      if (stageLabel) stageLabel.textContent = outCleanTitle;

      const stageNumBadge = document.getElementById('outward-stage-num-badge');
      if (stageNumBadge) stageNumBadge.textContent = `Stage ${outStageNum} of 5 Active`;

      const statusVal = document.getElementById('outward-status-val');
      if (statusVal) statusVal.textContent = order.pod || order.podNote || (outStageNum === 2 ? 'Picking Active' : (outStageNum === 5 ? 'Staged at Bay' : 'In Progress'));

      const zoneVal = document.getElementById('outward-zone-val');
      if (zoneVal) zoneVal.textContent = order.stageLocation || order.dockBay || 'Zone B, Shelf B4';

      const cutoffVal = document.getElementById('outward-cutoff-val');
      if (cutoffVal) cutoffVal.textContent = order.cutoff || '20 Nov 2026, 16:00 IST';

      const stageDesc = document.getElementById('outward-stage-desc');
      if (stageDesc) stageDesc.textContent = outStageDescriptions[outStageNum] || order.stageDesc || 'Active fulfillment sequence';

      // Update right-side progress pills
      const progressContainer = document.getElementById('outward-stage-progress-pills');
      if (progressContainer) {
        if (outStageNum === 1) {
          progressContainer.innerHTML = `
            <span class="text-[11px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
              Stage 1 in Progress
            </span>
            <span class="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
              4 Stages Remaining
            </span>
          `;
        } else {
          progressContainer.innerHTML = `
            <span class="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
              Stage${outStageNum - 1 > 1 ? `s 1–${outStageNum - 1}` : ' 1'} Completed
            </span>
            <span class="text-[11px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
              Stage ${outStageNum} in Progress
            </span>
          `;
        }
      }

      const custEl = document.getElementById('outward-customer');
      if (custEl) custEl.textContent = order.customer;

      const itemsEl = document.getElementById('outward-items');
      if (itemsEl) itemsEl.textContent = order.items;

      const leadEl = document.getElementById('outward-picker-lead');
      if (leadEl) leadEl.textContent = order.pickerInfo || order.picker;

      const packEl = document.getElementById('outward-packingnote');
      if (packEl) packEl.textContent = order.packingNote;

      const carrierEl = document.getElementById('outward-carrier');
      if (carrierEl) carrierEl.textContent = order.carrier;

      const trackEl = document.getElementById('outward-trackerid');
      if (trackEl) trackEl.textContent = order.trackingId;

      const cutEl = document.getElementById('outward-cutoff');
      if (cutEl) cutEl.textContent = order.cutoff;

      const podEl = document.getElementById('outward-podnote');
      if (podEl) podEl.textContent = order.podNote;

      goToScreen(5);
    }

    function openOutwardOrderByStage(stageNum) {
      if (stageNum === 4) openOutwardOrderDetail('ORD-OUT-4522');
      else if (stageNum === 6) openOutwardOrderDetail('ORD-OUT-4519');
      else openOutwardOrderDetail('ORD-OUT-4521');
    }

    let currentFacilityName = 'WH-02 Guwahati';

    const warehouseOutwardData = {
      'WH-02 Guwahati': {
        code: 'WH-02',
        name: 'WH-02 Guwahati',
        stuckCount: 2,
        badgeClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
        stages: [
          { id: 1, name: '1. Order Received', count: 4, subtitle: 'Queued & batched', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 6, subtitle: '1 order short-picked', stuck: 1 },
          { id: 3, name: '3. Sorting & Packing', count: 3, subtitle: 'Boxed & taped', stuck: 0 },
          { id: 4, name: '4. QC & Weighing', count: 2, subtitle: '1 order barcode failed', stuck: 1 },
          { id: 5, name: '5. Staged at Dock', count: 5, subtitle: 'Dock 02 ready', stuck: 0 },
          { id: 6, name: '6. Dispatched & POD', count: 148, subtitle: 'Customer signed POD', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-GW-9014',
            customer: 'Amazon FBA Hub (Guwahati)',
            priority: 'Express Prime',
            cargo: 'Electronics · 12x 55" Smart LED TVs',
            stage: 'Stage 4 · QC & Weighing (Desk QC-02)',
            stageNum: 4,
            reason: 'Barcode unreadable on Carton 2/4 · Weight discrepancy: manifest 42.0kg vs actual 45.4kg (+3.4kg)',
            severity: 'Critical Block',
            timeStuck: '2h 15m overdue',
            slaImpact: 'Indigo Air Cargo cutoff at 16:30 (At Risk)',
            handlers: [
              { stage: '1. Order Release', name: 'R. Barman', role: 'System Dispatcher', time: '10:15' },
              { stage: '2. Wave Picking', name: 'B. Das', role: 'Floor Picker (Zone B, Aisle 3)', time: '10:48' },
              { stage: '3. MHE Transit', name: 'T. Saikia', role: 'Forklift Operator #02', time: '11:10' },
              { stage: '4. QC & Weighing', name: 'P. Kalita', role: 'QC Inspector Desk 2', time: '11:25', isCurrent: true }
            ],
            supervisor: 'Arun Verma (Outbound Lead)',
            aiDiagnostic: {
              rootCause: 'Tare offset discrepancy (+3.4kg). Pallet lot #PL-204 timber moisture tare detected. Barcode unreadable due to thermal printer ribbon burnout on Desk 2.',
              recommendation: 'Apply calibrated tare offset (-3.4kg) and print GS1-128 replacement overlay label on Mobile Zebra Printer #04.',
              confidence: '98.2%',
              actionShort: 'Apply Tare Offset & GS1 Label'
            }
          },
          {
            orderId: 'ORD-GW-9022',
            customer: 'Apollo Pharmacy Regional HQ',
            priority: 'Cold-Chain SLA',
            cargo: 'Pharmaceuticals · 100 Ampoules Insulated Kit',
            stage: 'Stage 2 · Wave Picking (Cold Zone 04)',
            stageNum: 2,
            reason: 'Physical pick deficit: 20 units missing from primary Shelf B-04 · Requires supervisor batch split or restock',
            severity: 'High Attention',
            timeStuck: '1h 40m overdue',
            slaImpact: 'BlueDart Express transit SLA breach in 45m',
            handlers: [
              { stage: '1. Order Release', name: 'R. Barman', role: 'System Dispatcher', time: '11:05' },
              { stage: '2. Wave Picking', name: 'M. Nath', role: 'Cold-Chain Picker #19', time: '11:32', isCurrent: true }
            ],
            supervisor: 'Vikram Malhotra / Arun Verma',
            aiDiagnostic: {
              rootCause: 'Primary Cold Bin B-04 short by 20 units. 40 identical units of Lot #AP-99 verified in Reserve Buffer Rack R-12.',
              recommendation: 'Direct Reach Truck #02 to pull 20 units from Buffer R-12 and split wave picking batch.',
              confidence: '96.8%',
              actionShort: 'Pull from Buffer R-12'
            }
          }
        ],
        normalOrders: [
          // Stage 1: Order Received (4 orders)
          { orderId: 'ORD-GW-9031', customer: 'Blinkit Hub 04', cargo: 'FMCG Consumables (120 totes)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-GW-9032', customer: 'Zepto Darkstore 02', cargo: 'Snacks & Beverages (65 totes)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-GW-9033', customer: 'Apollo Pharmacy Dispur', cargo: 'First Aid Packs (30 cartons)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', pod: 'Wave Grouped' },
          { orderId: 'ORD-GW-9034', customer: 'MedPlus Store Panbazar', cargo: 'Medical Diagnostics (15 kits)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', pod: 'Batch Release Pending' },

          // Stage 2: Wave Picking (5 normal + 1 in issues = 6 orders)
          { orderId: 'ORD-GW-9023', customer: 'BigBasket Regional Hub', cargo: 'Organic Staples (45 crates)', picker: 'A. Hazarika (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', pod: 'Picking Active (70%)' },
          { orderId: 'ORD-GW-9024', customer: 'Smart Bazaar (GS Road)', cargo: 'Personal Care (55 cartons)', picker: 'P. Bora (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-GW-9025', customer: 'Vishal Mega Mart', cargo: 'Apparel & Footwear (80 boxes)', picker: 'R. Saikia (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', pod: 'Cart 04 Loading' },
          { orderId: 'ORD-GW-9026', customer: 'V-Mart Retail Hub', cargo: 'Luggage & Backpacks (35 units)', picker: 'N. Das (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', pod: 'Tote Staging' },
          { orderId: 'ORD-GW-9027', customer: 'Spencers Daily', cargo: 'Packaged Staples (40 bags)', picker: 'D. Kalita (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', pod: 'Pick Cycle Active' },

          // Stage 3: Sorting & Packing (3 orders)
          { orderId: 'ORD-GW-9018', customer: 'Flipkart Logistics Center', cargo: 'Tech Accessories (200 units)', picker: 'M. Nath (Pack Desk 01)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Carton Strapping' },
          { orderId: 'ORD-GW-9019', customer: 'Myntra Express Depot', cargo: 'Branded Footwear (120 pairs)', picker: 'T. Gogoi (Pack Desk 02)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-GW-9020', customer: 'Nykaa Beauty Hub', cargo: 'Cosmetics Hampers (90 units)', picker: 'S. Barua (Pack Desk 03)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Scale Queued' },

          // Stage 4: QC & Weighing (1 normal + 1 in issues = 2 orders)
          { orderId: 'ORD-GW-9015', customer: 'Samsung Service Depot', cargo: 'Mobile Spares (45 boxes)', picker: 'L. Chetia (Desk QC-01)', stageNum: 4, stage: '4. QC & Weighing', pod: 'Weight Calibrated & Passed' },

          // Stage 5: Staged at Dock (5 orders)
          { orderId: 'ORD-GW-9008', customer: 'Reliance Retail (Dispur)', cargo: 'Apparel (40 cartons)', picker: 'K. Deka (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-GW-9009', customer: 'Shoppers Stop (Guwahati)', cargo: 'Designer Apparel (25 cartons)', picker: 'B. Medhi (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Staged for BlueDart' },
          { orderId: 'ORD-GW-9010', customer: 'Pantaloons Store (Six Mile)', cargo: 'Winter Wear (30 cartons)', picker: 'H. Sarma (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Trailer Handover Queued' },
          { orderId: 'ORD-GW-9011', customer: 'Lifestyle International', cargo: 'Fashion Accessories (18 boxes)', picker: 'J. Das (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-GW-9012', customer: 'Westside Assam Branch', cargo: 'Home Decor (22 cartons)', picker: 'U. Dutta (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Seal Affixed' },

          // Stage 6: Dispatched & POD (sample recent completed shipments)
          { orderId: 'ORD-GW-8995', customer: 'Tata Croma (Paltan Bazar)', cargo: 'Home Appliances (8 crates)', picker: 'J. Gogoi (Bay 02)', stageNum: 6, stage: '6. Dispatched & POD', pod: 'Customer Signed POD' },
          { orderId: 'ORD-GW-8996', customer: 'Vijay Sales Store', cargo: 'Microwaves & Coolers (14 units)', picker: 'P. Barman (Bay 03)', stageNum: 6, stage: '6. Dispatched & POD', pod: 'Customer Signed POD' }
        ]
      },
      'WH-06 Hyderabad': {
        code: 'WH-06',
        name: 'WH-06 Hyderabad',
        stuckCount: 4,
        badgeClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        stages: [
          { id: 1, name: '1. Order Received', count: 8, subtitle: 'Queued for floor', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 12, subtitle: '2 orders delayed', stuck: 2 },
          { id: 3, name: '3. Sorting & Packing', count: 6, subtitle: '1 order carton missing', stuck: 1 },
          { id: 4, name: '4. QC & Weighing', count: 5, subtitle: 'Checked on scales', stuck: 0 },
          { id: 5, name: '5. Staged at Dock', count: 7, subtitle: '1 trailer delayed', stuck: 1 },
          { id: 6, name: '6. Dispatched & POD', count: 320, subtitle: 'Customer signed POD', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-HY-4521',
            customer: 'Acme Industries (HYD)',
            priority: 'Critical Tier-1',
            cargo: 'Electronics · 5 Pallets Premium Displays',
            stage: 'Stage 2 · Wave Picking (Aisle 02)',
            stageNum: 2,
            reason: 'Picker RFID scanner disconnected; 8 serial numbers missing from WMS sync',
            severity: 'Critical Block',
            timeStuck: '2h 45m overdue',
            slaImpact: 'Delhivery line-haul vehicle waiting at Bay 02',
            handlers: [
              { stage: '1. Order Release', name: 'N. Reddy', role: 'Outbound Controller', time: '09:30' },
              { stage: '2. Wave Picking', name: 'S. Rao', role: 'Senior Picker Bay 02', time: '10:05', isCurrent: true }
            ],
            supervisor: 'Arun Verma (Outbound Lead)'
          },
          {
            orderId: 'ORD-HY-4524',
            customer: 'Flipkart Wholesale Hub',
            priority: 'Same-Day SLA',
            cargo: 'Consumer Goods · 35 Master Cartons',
            stage: 'Stage 3 · Sorting & Packing (Station 3)',
            stageNum: 3,
            reason: 'Master carton strapping snapped; repackaging required before conveyor intake',
            severity: 'High Attention',
            timeStuck: '1h 35m overdue',
            slaImpact: 'Dispatch gate window closes at 14:00',
            handlers: [
              { stage: '1. Order Release', name: 'N. Reddy', role: 'Outbound Controller', time: '10:00' },
              { stage: '2. Wave Picking', name: 'A. Khan', role: 'Picker PK-08', time: '10:30' },
              { stage: '3. Sorting & Packing', name: 'K. Patel', role: 'Packer Station 3', time: '11:15', isCurrent: true }
            ],
            supervisor: 'Vikram Malhotra (Shift In-Charge)'
          },
          {
            orderId: 'ORD-HY-4528',
            customer: 'MedPlus Pharma Central',
            priority: 'Cold-Chain SLA',
            cargo: 'Healthcare · 18 Temperature Controlled Totes',
            stage: 'Stage 2 · Wave Picking (Cold Storage C-1)',
            stageNum: 2,
            reason: 'Cold sensor seal tampered in shelf retrieval; secondary inspection required',
            severity: 'Critical Block',
            timeStuck: '1h 50m overdue',
            slaImpact: 'Temperature breach limit within 60 mins',
            handlers: [
              { stage: '1. Order Release', name: 'N. Reddy', role: 'Outbound Controller', time: '10:20' },
              { stage: '2. Wave Picking', name: 'R. Srinivas', role: 'Cold Handler #04', time: '10:55', isCurrent: true }
            ],
            supervisor: 'Sunita Rao (Inventory Lead)'
          },
          {
            orderId: 'ORD-HY-4531',
            customer: 'Schneider Electric Regional',
            priority: 'Industrial Express',
            cargo: 'Switchgear & Heavy Breakers (3 Wooden Crates)',
            stage: 'Stage 5 · Staged at Dock (Dock Bay 04)',
            stageNum: 5,
            reason: 'Transporter Truck TRK-001 delayed on NH44 highway; Dock 04 slot idle',
            severity: 'Critical Block',
            timeStuck: '45m overdue',
            slaImpact: 'Bay 04 blocked; carrier handover delayed',
            handlers: [
              { stage: '1. Order Release', name: 'N. Reddy', role: 'Outbound Controller', time: '09:10' },
              { stage: '2. Wave Picking', name: 'M. Das', role: 'Heavy Cargo Picker', time: '09:40' },
              { stage: '3. MHE Transit', name: 'T. Goud', role: 'Forklift Operator #01', time: '10:15' },
              { stage: '4. QC & Weighing', name: 'P. Nair', role: 'QC Desk 1', time: '10:45' },
              { stage: '5. Staged at Dock', name: 'Rajesh Kumar', role: 'Dock Master', time: '11:10', isCurrent: true }
            ],
            supervisor: 'Jaswant Singh / Vikram Malhotra'
          }
        ],
        normalOrders: [
          // Stage 1: Order Received (8 orders)
          { orderId: 'ORD-HY-4532', customer: 'Amazon IN Fulfilment', cargo: 'Audio Accessories (80 units)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-HY-4533', customer: 'Flipkart Hub Shamshabad', cargo: 'Smart Wearables (40 boxes)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-HY-4534', customer: 'Reliance Digital Secunderabad', cargo: 'LED TV Mounts (25 sets)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', pod: 'Wave Grouped' },
          { orderId: 'ORD-HY-4535', customer: 'Croma Retail Banjara Hills', cargo: 'Air Purifiers (15 units)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', pod: 'Batch Release Pending' },
          { orderId: 'ORD-HY-4536', customer: 'Apollo Pharmacy Central', cargo: 'Nutrition Shakes (50 cartons)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-HY-4537', customer: 'D-Mart Regional Depot', cargo: 'Household FMCG (110 crates)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', pod: 'Wave Grouped' },
          { orderId: 'ORD-HY-4538', customer: 'Vijetha Supermarkets', cargo: 'Snack Foods (70 boxes)', picker: 'Floor Queue D', stageNum: 1, stage: '1. Order Received', pod: 'Batch Release Pending' },
          { orderId: 'ORD-HY-4539', customer: 'Ratnadeep Retail', cargo: 'Beverages & Juices (90 cases)', picker: 'Floor Queue D', stageNum: 1, stage: '1. Order Received', pod: 'Wave Grouped' },

          // Stage 2: Wave Picking (10 normal + 2 in issues = 12 orders)
          { orderId: 'ORD-HY-4540', customer: 'BigBasket Fulfillment', cargo: 'Fresh Produce (45 crates)', picker: 'K. Varma (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', pod: 'Picking Active (80%)' },
          { orderId: 'ORD-HY-4541', customer: 'Zepto Darkstore Gachibowli', cargo: 'Personal Care (35 totes)', picker: 'M. Krishna (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', pod: 'Cart 02 Loading' },
          { orderId: 'ORD-HY-4542', customer: 'Blinkit Depot Kondapur', cargo: 'Dairy & Cold Items (28 totes)', picker: 'R. Babu (Cold Bin 01)', stageNum: 2, stage: '2. Wave Picking', pod: 'Picking Active (60%)' },
          { orderId: 'ORD-HY-4543', customer: 'MedPlus Depot Madhapur', cargo: 'OTC Medications (50 boxes)', picker: 'T. Rao (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', pod: 'Tote Staging' },
          { orderId: 'ORD-HY-4544', customer: 'Myntra Express Hitec City', cargo: 'Fashion Footwear (60 pairs)', picker: 'P. Chary (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-HY-4545', customer: 'Ajio Logistics Hub', cargo: 'Denim & Tops (45 boxes)', picker: 'S. Naidu (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', pod: 'Cart 05 Loading' },
          { orderId: 'ORD-HY-4546', customer: 'Nykaa Depot Begumpet', cargo: 'Cosmetics (30 cartons)', picker: 'B. Mahesh (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-HY-4547', customer: 'Tata Cliq Warehouse', cargo: 'Smart Watches (20 units)', picker: 'V. Goud (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', pod: 'Tote Staging' },
          { orderId: 'ORD-HY-4548', customer: 'Titan Eyeplus Depot', cargo: 'Optical Frames (40 cases)', picker: 'A. Srinivas (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-HY-4549', customer: 'Decathlon Shamshabad', cargo: 'Sporting Equipment (18 crates)', picker: 'D. Kumar (Heavy Bay)', stageNum: 2, stage: '2. Wave Picking', pod: 'Picking Active (75%)' },

          // Stage 3: Sorting & Packing (5 normal + 1 in issues = 6 orders)
          { orderId: 'ORD-HY-4550', customer: 'Philips Healthcare Hub', cargo: 'Diagnostic Lights (12 crates)', picker: 'N. Prasad (Pack Desk 01)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Carton Strapping' },
          { orderId: 'ORD-HY-4551', customer: 'Havells Distribution', cargo: 'Switchgear Kits (25 boxes)', picker: 'S. Begum (Pack Desk 02)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-HY-4552', customer: 'Godrej Appliances Hub', cargo: 'Microwaves (8 units)', picker: 'K. Ram (Pack Desk 03)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Scale Queued' },
          { orderId: 'ORD-HY-4553', customer: 'Voltas AC Spares Depot', cargo: 'Compressor Units (10 crates)', picker: 'G. Suresh (Pack Desk 04)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Carton Strapping' },
          { orderId: 'ORD-HY-4554', customer: 'Blue Star Logistics', cargo: 'Copper Piping Spools (14 spools)', picker: 'L. Narsing (Pack Desk 05)', stageNum: 3, stage: '3. Sorting & Packing', pod: 'Scale Queued' },

          // Stage 4: QC & Weighing (5 orders)
          { orderId: 'ORD-HY-4555', customer: 'Samsung Service Central', cargo: 'Motherboard Spares (30 boxes)', picker: 'A. Qureshi (Desk QC-01)', stageNum: 4, stage: '4. QC & Weighing', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-HY-4556', customer: 'LG Electronics Depot', cargo: 'Panel Inverters (15 boxes)', picker: 'J. Mohan (Desk QC-02)', stageNum: 4, stage: '4. QC & Weighing', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-HY-4557', customer: 'Sony India Distribution', cargo: 'Headphones & Speakers (22 cases)', picker: 'M. Ali (Desk QC-03)', stageNum: 4, stage: '4. QC & Weighing', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-HY-4558', customer: 'Whirlpool Parts Center', cargo: 'Motor Assemblies (18 crates)', picker: 'P. Rani (Desk QC-01)', stageNum: 4, stage: '4. QC & Weighing', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-HY-4559', customer: 'Bosch Power Tools Hub', cargo: 'Drill Sets & Blades (40 boxes)', picker: 'R. Kanth (Desk QC-02)', stageNum: 4, stage: '4. QC & Weighing', pod: 'Weight Calibrated & Passed' },

          // Stage 5: Staged at Dock (6 normal + 1 in issues = 7 orders)
          { orderId: 'ORD-HY-4522', customer: 'Metro Logistics (BLR)', cargo: 'Packaged Food (25 cases)', picker: 'M. Das (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-HY-4560', customer: 'Delhivery Surface Bay', cargo: 'Consolidated E-com (95 bags)', picker: 'S. Jadhav (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Staged for Delhivery' },
          { orderId: 'ORD-HY-4561', customer: 'BlueDart Air Hub Express', cargo: 'Priority Parcels (40 cartons)', picker: 'K. More (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-HY-4562', customer: 'Safexpress Logistics', cargo: 'Industrial Fasteners (15 wooden cases)', picker: 'H. Shinde (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Trailer Handover Queued' },
          { orderId: 'ORD-HY-4563', customer: 'GATI KWE Cargo', cargo: 'Apparel Cartons (50 boxes)', picker: 'G. Pawar (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Seal Affixed' },
          { orderId: 'ORD-HY-4564', customer: 'TCI Freight Depot', cargo: 'Auto Lubricants (30 drums)', picker: 'T. Goud (Bay 05)', stageNum: 5, stage: '5. Staged at Dock', pod: 'Gate Pass Ready' },

          // Stage 6: Delivered & POD
          { orderId: 'ORD-HY-4519', customer: 'Zenith Retail (BOM)', cargo: 'Industrial Parts (12 units)', picker: 'V. Sharma (Bay 01)', stageNum: 6, stage: '6. Delivered & POD', pod: 'Customer Signed POD' }
        ]
      },
      'WH-01 Bhiwandi': {
        code: 'WH-01',
        name: 'WH-01 Bhiwandi',
        stuckCount: 1,
        badgeClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        stages: [
          { id: 1, name: '1. Order Received', count: 6, subtitle: 'Queued', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 14, subtitle: 'Picking active', stuck: 0 },
          { id: 3, name: '3. Sorting & Packing', count: 8, subtitle: 'Boxed', stuck: 0 },
          { id: 4, name: '4. QC & Weighing', count: 4, subtitle: 'Verified', stuck: 0 },
          { id: 5, name: '5. Staged at Dock', count: 3, subtitle: '1 gate pass held', stuck: 1 },
          { id: 6, name: '6. Dispatched & POD', count: 410, subtitle: 'Delivered', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-BW-1092',
            customer: 'Tata Motors Parts Hub',
            priority: 'Priority OEM',
            cargo: 'Transmission Gears (14 units)',
            stage: 'Stage 5 · Staged at Dock (Bay 06)',
            stageNum: 5,
            dockBay: 'Dock Bay 06',
            reason: 'Consignee e-way bill mismatch with invoice tax breakdown; manual e-way bill regen required',
            severity: 'Attention Needed',
            timeStuck: '1h 10m overdue',
            slaImpact: 'VRL Logistics truck waiting at outbound gate',
            handlers: [
              { stage: '1. Order Release', name: 'H. Shinde', role: 'Dispatch Clerk', time: '10:00' },
              { stage: '2. Wave Picking', name: 'G. Pawar', role: 'Picker #11', time: '10:35' },
              { stage: '3. MHE Transit', name: 'K. More', role: 'Forklift Op #04', time: '11:00' },
              { stage: '4. Staged at Dock', name: 'S. Jadhav', role: 'Gate Pass Marshall', time: '11:20', isCurrent: true }
            ],
            supervisor: 'Arun Verma (Outbound Lead)',
            aiDiagnostic: {
              rootCause: 'Consignee tax breakdown mismatch between GST portal and ERP invoice. Automated API sync blocked.',
              recommendation: 'Regenerate GS1-128 e-way bill with consolidated tax slab breakdown and re-issue digital gate pass.',
              confidence: '98.4%',
              actionShort: 'Regenerate E-Way Bill & Gate Pass'
            }
          }
        ],
        normalOrders: [
          // Stage 1: Order Received (6 orders)
          { orderId: 'ORD-BW-1101', customer: 'Mahindra Logistics Hub', cargo: 'Brake Linings (40 crates)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BW-1102', customer: 'Bajaj Auto Depot', cargo: 'Spark Plugs (15 boxes)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BW-1103', customer: 'TVS Motor Parts Regional', cargo: 'Filter Elements (25 cartons)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-01', pod: 'Wave Grouped' },
          { orderId: 'ORD-BW-1104', customer: 'Hero MotoCorp Ancillary', cargo: 'Drive Chains (30 crates)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-02', pod: 'Batch Release Pending' },
          { orderId: 'ORD-BW-1105', customer: 'Bosch Automotive India', cargo: 'ECU Sensors (12 kits)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BW-1106', customer: 'Ceat Tyres Distribution', cargo: 'Inner Tubes (50 bundles)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-02', pod: 'Wave Grouped' },

          // Stage 2: Wave Picking (14 orders)
          { orderId: 'ORD-BW-1111', customer: 'Ashok Leyland Depot', cargo: 'Axle Hubs (18 crates)', picker: 'R. Mane (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 1', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-BW-1112', customer: 'Eicher Motors Hub', cargo: 'Flywheels (10 units)', picker: 'S. Kadam (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 2', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-BW-1113', customer: 'Force Motors Chakan', cargo: 'Radiator Fans (22 units)', picker: 'A. Shinde (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 3', pod: 'Cart 01 Loading' },
          { orderId: 'ORD-BW-1114', customer: 'Hyundai Mobis Depot', cargo: 'Headlamp Sets (35 boxes)', picker: 'P. Bhosale (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 4', pod: 'Tote Staging' },
          { orderId: 'ORD-BW-1115', customer: 'Honda Motorcycle Parts', cargo: 'Carburetor Assemblies (40 boxes)', picker: 'V. More (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 5', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-BW-1116', customer: 'Kalyani Steels Regional', cargo: 'Forged Castings (14 crates)', picker: 'D. Salve (Heavy Bay)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Heavy Bay H-1', pod: 'MHE Transit' },
          { orderId: 'ORD-BW-1117', customer: 'Lumax Industries', cargo: 'Lighting Wiring Harness (28 kits)', picker: 'M. Tambe (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 6', pod: 'Cart 03 Loading' },
          { orderId: 'ORD-BW-1118', customer: 'Minda Corp Distribution', cargo: 'Ignition Switches (45 boxes)', picker: 'K. Raut (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 7', pod: 'Tote Staging' },
          { orderId: 'ORD-BW-1119', customer: 'Gabriel India Ltd', cargo: 'Shock Absorbers (30 crates)', picker: 'G. Shinde (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 8', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-BW-1120', customer: 'Sundram Fasteners', cargo: 'High-Tensile Bolts (60 bags)', picker: 'H. Jadhav (Aisle 09)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 9', pod: 'Picking Active (70%)' },
          { orderId: 'ORD-BW-1121', customer: 'Uno Minda Systems', cargo: 'Alloy Wheels (20 cartons)', picker: 'N. Gite (Aisle 10)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 10', pod: 'Cart 04 Loading' },
          { orderId: 'ORD-BW-1122', customer: 'Varroc Engineering', cargo: 'Polymer Trim Kits (16 sets)', picker: 'T. Gaikwad (Aisle 11)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 11', pod: 'Tote Staging' },
          { orderId: 'ORD-BW-1123', customer: 'Subros Air Conditioning', cargo: 'HVAC Ducting (25 bundles)', picker: 'L. Chavan (Aisle 12)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 12', pod: 'Picking Active (60%)' },
          { orderId: 'ORD-BW-1124', customer: 'Endurance Technologies', cargo: 'Clutch Housings (12 crates)', picker: 'B. Jagtap (Aisle 13)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 13', pod: 'Pick Cycle Active' },

          // Stage 3: Sorting & Packing (8 orders)
          { orderId: 'ORD-BW-1131', customer: 'Toyota Kirloskar Ancillary', cargo: 'Steering Columns (15 crates)', picker: 'M. Patil (Pack Desk 01)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 01', pod: 'Carton Strapping' },
          { orderId: 'ORD-BW-1132', customer: 'Skoda Auto Volkswagen', cargo: 'Door Lock Latches (30 boxes)', picker: 'S. Pawar (Pack Desk 02)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 02', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-BW-1133', customer: 'Renault Nissan Logistics', cargo: 'Oil Filters (45 boxes)', picker: 'R. Koli (Pack Desk 03)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 03', pod: 'Scale Queued' },
          { orderId: 'ORD-BW-1134', customer: 'Schaeffler India Hub', cargo: 'Roller Bearings (22 cartons)', picker: 'P. Sonawane (Pack Desk 04)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 04', pod: 'Carton Strapping' },
          { orderId: 'ORD-BW-1135', customer: 'SKF India Distribution', cargo: 'Wheel Bearings (28 boxes)', picker: 'A. Gurav (Pack Desk 05)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 05', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-BW-1136', customer: 'Timken Bearings Depot', cargo: 'Tapered Bearings (18 crates)', picker: 'K. Bhagat (Pack Desk 06)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 06', pod: 'Scale Queued' },
          { orderId: 'ORD-BW-1137', customer: 'Rane Brake Linings', cargo: 'Brake Disc Pads (40 sets)', picker: 'N. Kamble (Pack Desk 07)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 07', pod: 'Carton Strapping' },
          { orderId: 'ORD-BW-1138', customer: 'Federal-Mogul Goetze', cargo: 'Piston Rings (50 boxes)', picker: 'D. Shinde (Pack Desk 08)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 08', pod: 'Bubble Wrap & Taping' },

          // Stage 4: QC & Weighing (4 orders)
          { orderId: 'ORD-BW-1141', customer: 'Mahindra CIE Automotive', cargo: 'Differential Gears (10 crates)', picker: 'S. Wagh (QC Desk 01)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-01', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BW-1142', customer: 'Bharat Forge Hub', cargo: 'Crankshaft Blanks (8 crates)', picker: 'Y. Sawant (QC Desk 02)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-02', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BW-1143', customer: 'GKN Driveline India', cargo: 'Constant Velocity Joints (20 boxes)', picker: 'V. Dhale (QC Desk 03)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-03', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BW-1144', customer: 'Dana India Distribution', cargo: 'Drive Axle Kits (12 crates)', picker: 'G. Thorat (QC Desk 04)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-04', pod: 'Weight Calibrated & Passed' },

          // Stage 5: Staged at Dock (2 normal + 1 issue ORD-BW-1092 = 3 orders total)
          { orderId: 'ORD-BW-1151', customer: 'Maruti Suzuki Ancillary', cargo: 'Clutch Plates (50 sets)', picker: 'N. Patil (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 04', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-BW-1152', customer: 'Tata Motors CV Depot', cargo: 'Leaf Springs (16 bundles)', picker: 'K. Shirodkar (Bay 05)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 05', pod: 'Staged for VRL Freight' }
        ]
      },
      'WH-04 Pune': {
        code: 'WH-04',
        name: 'WH-04 Pune',
        stuckCount: 0,
        badgeClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        stages: [
          { id: 1, name: '1. Order Received', count: 3, subtitle: 'Queued', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 8, subtitle: '100% on pace', stuck: 0 },
          { id: 3, name: '3. Sorting & Packing', count: 5, subtitle: 'Packed', stuck: 0 },
          { id: 4, name: '4. QC & Weighing', count: 3, subtitle: 'Verified', stuck: 0 },
          { id: 5, name: '5. Staged at Dock', count: 4, subtitle: 'Carrier loading', stuck: 0 },
          { id: 6, name: '6. Dispatched & POD', count: 285, subtitle: 'Signed POD', stuck: 0 }
        ],
        issues: [],
        normalOrders: [
          // Stage 1 (3 orders)
          { orderId: 'ORD-PN-3015', customer: 'Bharat Forge Mundhwa', cargo: 'Axle Forgings (20 crates)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-PN-3016', customer: 'Tata Motors Bhosari', cargo: 'Wiring Harness (30 boxes)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-PN-3017', customer: 'Cummins India Kothrud', cargo: 'Engine Filters (40 cartons)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-01', pod: 'Wave Grouped' },
          
          // Stage 2 (8 orders)
          { orderId: 'ORD-PN-3021', customer: 'Kalyani Maxion Wheels', cargo: 'Steel Rims (35 units)', picker: 'R. Shinde (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 1', pod: 'Picking Active (80%)' },
          { orderId: 'ORD-PN-3022', customer: 'ZF Steering Gear', cargo: 'Tie Rods (50 sets)', picker: 'P. More (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 2', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-PN-3023', customer: 'Mahindra Heavy Chakan', cargo: 'Cabin Mounts (15 crates)', picker: 'S. Patil (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 3', pod: 'Cart 01 Loading' },
          { orderId: 'ORD-PN-3024', customer: 'Force Motors Akurdi', cargo: 'Door Panels (22 sets)', picker: 'V. Kadam (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 4', pod: 'Tote Staging' },
          { orderId: 'ORD-PN-3025', customer: 'Lear Automotive Pune', cargo: 'Seat Frames (18 units)', picker: 'M. Pawar (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 5', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-PN-3026', customer: 'Faurecia Emission Tech', cargo: 'Silencer Baffles (25 boxes)', picker: 'D. Mane (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 6', pod: 'Cart 02 Loading' },
          { orderId: 'ORD-PN-3027', customer: 'Motherson Sumi Systems', cargo: 'Rearview Mirrors (40 cartons)', picker: 'G. Thorat (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 7', pod: 'Tote Staging' },
          { orderId: 'ORD-PN-3028', customer: 'Cooper Standard Pune', cargo: 'Rubber Sealing Kits (55 sets)', picker: 'K. Jagtap (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 8', pod: 'Pick Cycle Active' },
          
          // Stage 3 (5 orders)
          { orderId: 'ORD-PN-3031', customer: 'Thermax Ltd Chinchwad', cargo: 'Heat Valves (12 crates)', picker: 'M. Gaikwad (Pack 01)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 01', pod: 'Carton Strapping' },
          { orderId: 'ORD-PN-3032', customer: 'Kirloskar Oil Engines', cargo: 'Injector Nozzles (35 boxes)', picker: 'A. Gurav (Pack 02)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 02', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-PN-3033', customer: 'Atlas Copco Dapodi', cargo: 'Air Dryer Filters (20 boxes)', picker: 'N. Kamble (Pack 03)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 03', pod: 'Scale Queued' },
          { orderId: 'ORD-PN-3034', customer: 'Sandvik Mining Pune', cargo: 'Drill Bits (15 crates)', picker: 'S. Wagh (Pack 04)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 04', pod: 'Carton Strapping' },
          { orderId: 'ORD-PN-3035', customer: 'Alfa Laval India', cargo: 'Heat Plate Gaskets (28 sets)', picker: 'Y. Sawant (Pack 05)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 05', pod: 'Bubble Wrap & Taping' },
          
          // Stage 4 (3 orders)
          { orderId: 'ORD-PN-3041', customer: 'SKF Bearings Talegaon', cargo: 'Spherical Bearings (25 boxes)', picker: 'V. Dhale (QC Desk 1)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-01', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-PN-3042', customer: 'Schaeffler Savli Hub', cargo: 'Clutch Bearings (30 cartons)', picker: 'G. Thorat (QC Desk 2)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-02', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-PN-3043', customer: 'Bosch Chassis Systems', cargo: 'ABS Hydraulic Units (14 crates)', picker: 'N. Patil (QC Desk 3)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-03', pod: 'Weight Calibrated & Passed' },
          
          // Stage 5 (4 orders)
          { orderId: 'ORD-PN-3012', customer: 'Bajaj Auto Chakan', cargo: 'Piston Assemblies (100 units)', picker: 'P. Joshi (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 01', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-PN-3051', customer: 'Tata Motors CV Pune', cargo: 'Leaf Spring Brackets (20 sets)', picker: 'R. Koli (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 02', pod: 'Staged for TCI' },
          { orderId: 'ORD-PN-3052', customer: 'Mahindra Auto Chakan', cargo: 'Drive Shafts (15 bundles)', picker: 'S. Pawar (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 03', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-PN-3053', customer: 'Piaggio Vehicles Baramati', cargo: 'Engine Casings (12 crates)', picker: 'M. Patil (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 04', pod: 'Trailer Loading' }
        ]
      },
      'WH-07 Kolkata': {
        code: 'WH-07',
        name: 'WH-07 Kolkata',
        stuckCount: 3,
        badgeClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        stages: [
          { id: 1, name: '1. Order Received', count: 5, subtitle: 'Queued', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 9, subtitle: '1 order stock gap', stuck: 1 },
          { id: 3, name: '3. Sorting & Packing', count: 4, subtitle: '1 packaging split', stuck: 1 },
          { id: 4, name: '4. QC & Weighing', count: 3, subtitle: '1 weight issue', stuck: 1 },
          { id: 5, name: '5. Staged at Dock', count: 6, subtitle: 'Staging ready', stuck: 0 },
          { id: 6, name: '6. Dispatched & POD', count: 190, subtitle: 'Signed POD', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-KL-7031',
            customer: 'ITC Infotech Retail',
            priority: 'High Urgency',
            cargo: 'FMCG Goods · 80 Cartons Sunfeast Biscuits',
            stage: 'Stage 3 · Sorting & Packing (Station 2)',
            stageNum: 3,
            reason: 'Carton strapping machine jammed; manual banding needed to prevent palette collapse',
            severity: 'Critical Block',
            timeStuck: '2h 05m overdue',
            slaImpact: 'Regional feeder truck waiting at outbound gate',
            handlers: [
              { stage: '1. Order Release', name: 'S. Bhattacharya', role: 'Dispatcher', time: '09:40' },
              { stage: '2. Wave Picking', name: 'A. Mondal', role: 'Picker Zone C', time: '10:15' },
              { stage: '3. Sorting & Packing', name: 'B. Roy', role: 'Packer Station 2', time: '10:50', isCurrent: true }
            ],
            supervisor: 'Manoj Tiwari (Wave Supervisor)'
          },
          {
            orderId: 'ORD-KL-7035',
            customer: 'Spencer Retail Ltd',
            priority: 'Retail Restock',
            cargo: 'Personal Care · 40 Cases Shampoos',
            stage: 'Stage 4 · QC & Weighing (Desk 1)',
            stageNum: 4,
            reason: 'Bottle leakage detected on case #12; isolation and replacement case needed from stock',
            severity: 'High Attention',
            timeStuck: '1h 30m overdue',
            slaImpact: 'Spencer delivery cutoff at 15:00',
            handlers: [
              { stage: '1. Order Release', name: 'S. Bhattacharya', role: 'Dispatcher', time: '10:10' },
              { stage: '2. Wave Picking', name: 'D. Das', role: 'Picker Zone A', time: '10:45' },
              { stage: '3. QC & Weighing', name: 'S. Sen', role: 'QC Marshal Desk 1', time: '11:15', isCurrent: true }
            ],
            supervisor: 'Arun Verma (Outbound Lead)'
          },
          {
            orderId: 'ORD-KL-7040',
            customer: 'Exide Industries Central',
            priority: 'Heavy Cargo',
            cargo: 'Inverter Batteries (20 Heavy Crates)',
            stage: 'Stage 2 · Wave Picking (Heavy Bay)',
            stageNum: 2,
            reason: 'Reach truck battery depleted mid-pick; awaiting replacement forklift #03',
            severity: 'Critical Block',
            timeStuck: '1h 45m overdue',
            slaImpact: 'Heavy carrier loading halted',
            handlers: [
              { stage: '1. Order Release', name: 'S. Bhattacharya', role: 'Dispatcher', time: '09:50' },
              { stage: '2. Wave Picking', name: 'P. Ghosh', role: 'Forklift Operator #01', time: '10:20', isCurrent: true }
            ],
            supervisor: 'Deepak Sharma (MHE Lead)'
          }
        ],
        normalOrders: [
          // Stage 1 (5 orders)
          { orderId: 'ORD-KL-7051', customer: 'Bata India Batanagar', cargo: 'Footwear Boxes (45 cartons)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-KL-7052', customer: 'Emami Consumer Products', cargo: 'Ayurvedic Oils (30 cases)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-KL-7053', customer: 'Berger Paints Howrah', cargo: 'Color Tinters (20 cans)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-01', pod: 'Wave Grouped' },
          { orderId: 'ORD-KL-7054', customer: 'Tata Tea Distribution', cargo: 'Packaged Tea (60 sacks)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-02', pod: 'Batch Release Pending' },
          { orderId: 'ORD-KL-7055', customer: 'Century Plyboards Joka', cargo: 'Laminate Sheets (15 crates)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-01', pod: 'Awaiting Wave Release' },

          // Stage 2 (8 normal + 1 issue ORD-KL-7040 = 9 orders)
          { orderId: 'ORD-KL-7061', customer: 'Britannia Taratala Hub', cargo: 'Biscuits (50 cartons)', picker: 'P. Ghosh (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 1', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-KL-7062', customer: 'ITC Sunfeast Depot', cargo: 'Confectionery (40 boxes)', picker: 'R. Sen (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 2', pod: 'Cart 01 Loading' },
          { orderId: 'ORD-KL-7063', customer: 'Hindustan Unilever Garden Reach', cargo: 'Detergents (35 crates)', picker: 'A. Das (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 3', pod: 'Picking Active (70%)' },
          { orderId: 'ORD-KL-7064', customer: 'Dabur India Dankuni', cargo: 'Herbal Pastes (28 boxes)', picker: 'S. Paul (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 4', pod: 'Tote Staging' },
          { orderId: 'ORD-KL-7065', customer: 'Marico Limited Barasat', cargo: 'Edible Oils (45 cartons)', picker: 'T. Roy (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 5', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-KL-7066', customer: 'Godrej Consumer Uluberia', cargo: 'Household FMCG (22 boxes)', picker: 'B. Majumder (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 6', pod: 'Cart 02 Loading' },
          { orderId: 'ORD-KL-7067', customer: 'Nestle India Kalyani', cargo: 'Instant Noodles (60 cartons)', picker: 'K. Biswas (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 7', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-KL-7068', customer: 'Parle Agro Dankuni', cargo: 'Fruit Drinks (40 cases)', picker: 'M. Halder (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 8', pod: 'Tote Staging' },

          // Stage 3 (3 normal + 1 issue ORD-KL-7031 = 4 orders)
          { orderId: 'ORD-KL-7071', customer: 'Amul Milk Dairy Barasat', cargo: 'Tetra Packs (30 cases)', picker: 'N. Sarkar (Pack 01)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 01', pod: 'Carton Strapping' },
          { orderId: 'ORD-KL-7072', customer: 'Mother Dairy Dankuni', cargo: 'Butter & Ghee (25 boxes)', picker: 'C. Roy (Pack 02)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 02', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-KL-7073', customer: 'Haldiram Bhujiawala', cargo: 'Snack Cartons (35 boxes)', picker: 'D. Dutta (Pack 03)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 03', pod: 'Scale Queued' },

          // Stage 4 (2 normal + 1 issue ORD-KL-7035 = 3 orders)
          { orderId: 'ORD-KL-7081', customer: 'Linc Pens Serampore', cargo: 'Writing Instruments (50 boxes)', picker: 'P. Nandi (QC Desk 1)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-01', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-KL-7082', customer: 'Lux Industries Kolkata', cargo: 'Hosiery Products (40 cartons)', picker: 'S. Mitra (QC Desk 2)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-02', pod: 'Weight Calibrated & Passed' },

          // Stage 5 (6 orders)
          { orderId: 'ORD-KL-7091', customer: 'Spencer Retail Salt Lake', cargo: 'Groceries (80 bags)', picker: 'R. Banerjee (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 01', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-KL-7092', customer: 'Big Bazaar Sealdah', cargo: 'Apparel (35 cartons)', picker: 'T. Ghosh (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 02', pod: 'Staged for BlueDart' },
          { orderId: 'ORD-KL-7093', customer: 'Reliance Smart New Town', cargo: 'Staples (45 crates)', picker: 'M. Kundu (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 03', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-KL-7094', customer: 'More Retail Gariahat', cargo: 'Packaged Food (25 boxes)', picker: 'A. Chatterjee (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 04', pod: 'Trailer Loading' },
          { orderId: 'ORD-KL-7095', customer: 'D-Mart Howrah Central', cargo: 'Home Cleaning (40 cartons)', picker: 'S. Barman (Bay 05)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 05', pod: 'Seal Affixed' },
          { orderId: 'ORD-KL-7096', customer: 'Smart Point Rajarhat', cargo: 'Beverages (30 cases)', picker: 'K. Mandal (Bay 06)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 06', pod: 'Gate Pass Ready' }
        ]
      },
      'WH-08 Delhi NCR': {
        code: 'WH-08',
        name: 'WH-08 Delhi NCR',
        stuckCount: 1,
        badgeClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        stages: [
          { id: 1, name: '1. Order Received', count: 12, subtitle: 'Queued', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 24, subtitle: 'Picking active', stuck: 0 },
          { id: 3, name: '3. Sorting & Packing', count: 15, subtitle: 'Packed', stuck: 0 },
          { id: 4, name: '4. QC & Weighing', count: 8, subtitle: '1 order serial missing', stuck: 1 },
          { id: 5, name: '5. Staged at Dock', count: 11, subtitle: 'Dock 03 ready', stuck: 0 },
          { id: 6, name: '6. Dispatched & POD', count: 680, subtitle: 'Delivered', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-DL-8114',
            customer: 'Samsung Electronics India',
            priority: 'High-Value Express',
            cargo: 'Smartphones · 250 Units Galaxy Series',
            stage: 'Stage 4 · QC & Weighing (High-Security Cage)',
            stageNum: 4,
            reason: 'Security tamper-tape tag missing on Master Box #03; dual supervisor verification required',
            severity: 'High Attention',
            timeStuck: '1h 15m overdue',
            slaImpact: 'Express armored vehicle waiting at Outbound Gate 2',
            handlers: [
              { stage: '1. Order Release', name: 'A. Mehra', role: 'High-Value Controller', time: '10:00' },
              { stage: '2. Wave Picking', name: 'V. Singh', role: 'Certified Cage Picker', time: '10:30' },
              { stage: '3. QC & Weighing', name: 'R. Kapoor', role: 'Security QC Lead', time: '11:10', isCurrent: true }
            ],
            supervisor: 'Jaswant Singh / Arun Verma'
          }
        ],
        normalOrders: [
          // Stage 1 (12 orders)
          { orderId: 'ORD-DL-8121', customer: 'Samsung India Fulfilment', cargo: 'LED TV Mounts (40 units)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-DL-8122', customer: 'LG Electronics Okhla', cargo: 'Microwaves (25 units)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-DL-8123', customer: 'Voltas AC Spares Gurgaon', cargo: 'Compressor Kits (18 crates)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-01', pod: 'Wave Grouped' },
          { orderId: 'ORD-DL-8124', customer: 'Havells Logistics Noida', cargo: 'Switchgear (50 boxes)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-02', pod: 'Batch Release Pending' },
          { orderId: 'ORD-DL-8125', customer: 'Crompton Greaves Faridabad', cargo: 'Ceiling Fans (60 units)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-DL-8126', customer: 'Orient Electric Gurgaon', cargo: 'LED Bulbs (80 cartons)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-02', pod: 'Wave Grouped' },
          { orderId: 'ORD-DL-8127', customer: 'Usha International Okhla', cargo: 'Sewing Machines (15 units)', picker: 'Floor Queue D', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue D-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-DL-8128', customer: 'Bajaj Electricals Noida', cargo: 'Water Heaters (20 units)', picker: 'Floor Queue D', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue D-02', pod: 'Wave Grouped' },
          { orderId: 'ORD-DL-8129', customer: 'Philips Lighting Manesar', cargo: 'Panel Lights (45 boxes)', picker: 'Floor Queue E', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue E-01', pod: 'Batch Release Pending' },
          { orderId: 'ORD-DL-8130', customer: 'Panasonic Life Solutions', cargo: 'Modular Switches (70 boxes)', picker: 'Floor Queue E', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue E-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-DL-8131', customer: 'Whirlpool India Faridabad', cargo: 'Refrigerator Shelves (30 sets)', picker: 'Floor Queue F', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue F-01', pod: 'Wave Grouped' },
          { orderId: 'ORD-DL-8132', customer: 'Godrej Appliances Okhla', cargo: 'Washing Machine Motors (22 units)', picker: 'Floor Queue F', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue F-02', pod: 'Awaiting Wave Release' },

          // Stage 2 (24 orders)
          { orderId: 'ORD-DL-8141', customer: 'Amazon Delhi Hub', cargo: 'Electronics (120 units)', picker: 'A. Mehra (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 1', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-DL-8142', customer: 'Flipkart Manesar Depot', cargo: 'Wearables (80 boxes)', picker: 'B. Singh (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 2', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-DL-8143', customer: 'Blinkit SuperHub Gurgaon', cargo: 'Snacks & FMCG (90 crates)', picker: 'C. Sharma (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 3', pod: 'Cart 01 Loading' },
          { orderId: 'ORD-DL-8144', customer: 'Zepto Darkstore Saket', cargo: 'Personal Care (60 boxes)', picker: 'D. Kumar (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 4', pod: 'Tote Staging' },
          { orderId: 'ORD-DL-8145', customer: 'Myntra Depot Bilaspur', cargo: 'Apparel (110 cartons)', picker: 'E. Verma (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 5', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-DL-8146', customer: 'Nykaa Regional Okhla', cargo: 'Cosmetics (45 cartons)', picker: 'F. Gupta (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 6', pod: 'Cart 02 Loading' },
          { orderId: 'ORD-DL-8147', customer: 'Tata Cliq Manesar', cargo: 'Watches (30 boxes)', picker: 'G. Yadav (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 7', pod: 'Picking Active (80%)' },
          { orderId: 'ORD-DL-8148', customer: 'Ajio Logistics Noida', cargo: 'Denims (75 cartons)', picker: 'H. Tiwari (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 8', pod: 'Tote Staging' },
          { orderId: 'ORD-DL-8149', customer: 'Lenskart Warehouse Gurgaon', cargo: 'Optical Frames (50 cases)', picker: 'I. Joshi (Aisle 09)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 9', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-DL-8150', customer: 'Boat Lifestyle Okhla', cargo: 'Earphones (95 boxes)', picker: 'J. Malik (Aisle 10)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 10', pod: 'Cart 03 Loading' },
          { orderId: 'ORD-DL-8151', customer: 'Noise Wearables Manesar', cargo: 'Smart Bands (60 boxes)', picker: 'K. Rathi (Aisle 11)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 11', pod: 'Picking Active (75%)' },
          { orderId: 'ORD-DL-8152', customer: 'Realme India Depot', cargo: 'Smartphones (40 cases)', picker: 'L. Tanwar (Aisle 12)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 12', pod: 'Tote Staging' },
          { orderId: 'ORD-DL-8153', customer: 'Xiaomi Central Warehouse', cargo: 'Tablets & Spares (55 boxes)', picker: 'M. Tomar (Aisle 13)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone E, Aisle 13', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-DL-8154', customer: 'Oppo Mobiles Greater Noida', cargo: 'Adapters & Cables (70 boxes)', picker: 'N. Kasana (Aisle 14)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone E, Aisle 14', pod: 'Cart 04 Loading' },
          { orderId: 'ORD-DL-8155', customer: 'Vivo India Factory Hub', cargo: 'Display Panels (35 crates)', picker: 'O. Nagar (Aisle 15)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone E, Aisle 15', pod: 'Picking Active (95%)' },
          { orderId: 'ORD-DL-8156', customer: 'OnePlus Service Central', cargo: 'Battery Replacements (45 boxes)', picker: 'P. Bhati (Aisle 16)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone F, Aisle 16', pod: 'Tote Staging' },
          { orderId: 'ORD-DL-8157', customer: 'Apple India Logistics', cargo: 'iPads (20 crates)', picker: 'Q. Chauhan (High Security)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Security Cage 1', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-DL-8158', customer: 'Dell Technologies Gurgaon', cargo: 'Monitors (30 units)', picker: 'R. Rawat (Aisle 17)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone F, Aisle 17', pod: 'Cart 05 Loading' },
          { orderId: 'ORD-DL-8159', customer: 'HP India Depot Noida', cargo: 'Printers (25 units)', picker: 'S. Negi (Aisle 18)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone F, Aisle 18', pod: 'Picking Active (80%)' },
          { orderId: 'ORD-DL-8160', customer: 'Lenovo Logistics Manesar', cargo: 'Laptops (35 units)', picker: 'T. Bisht (Aisle 19)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone G, Aisle 19', pod: 'Tote Staging' },
          { orderId: 'ORD-DL-8161', customer: 'Acer India Central', cargo: 'Keyboards (50 boxes)', picker: 'U. Bhandari (Aisle 20)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone G, Aisle 20', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-DL-8162', customer: 'Asus Regional Hub', cargo: 'Gaming Mice (65 boxes)', picker: 'V. Panwar (Aisle 21)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone G, Aisle 21', pod: 'Cart 06 Loading' },
          { orderId: 'ORD-DL-8163', customer: 'Sony India Gurgaon', cargo: 'Audio Systems (18 crates)', picker: 'W. Rana (Aisle 22)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone H, Aisle 22', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-DL-8164', customer: 'JBL Harman Okhla', cargo: 'Bluetooth Speakers (40 boxes)', picker: 'X. Semwal (Aisle 23)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone H, Aisle 23', pod: 'Tote Staging' },

          // Stage 3 (15 orders)
          { orderId: 'ORD-DL-8171', customer: 'Apollo Pharmacy Central', cargo: 'Medicines (80 boxes)', picker: 'Y. Nautiyal (Pack 01)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 01', pod: 'Carton Strapping' },
          { orderId: 'ORD-DL-8172', customer: 'MedPlus Pharma Gurgaon', cargo: 'First Aid (50 boxes)', picker: 'Z. Bhatt (Pack 02)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 02', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-DL-8173', customer: 'Tata 1mg Okhla Hub', cargo: 'Supplements (65 cartons)', picker: 'AA. Uniyal (Pack 03)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 03', pod: 'Scale Queued' },
          { orderId: 'ORD-DL-8174', customer: 'PharmEasy Manesar Hub', cargo: 'Diagnostics (40 kits)', picker: 'AB. Gairola (Pack 04)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 04', pod: 'Carton Strapping' },
          { orderId: 'ORD-DL-8175', customer: 'D-Mart Regional Depot', cargo: 'Staples (90 sacks)', picker: 'AC. Kandari (Pack 05)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 05', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-DL-8176', customer: 'Reliance Retail Ghaziabad', cargo: 'Groceries (100 bags)', picker: 'AD. Mamgain (Pack 06)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 06', pod: 'Scale Queued' },
          { orderId: 'ORD-DL-8177', customer: 'Big Bazaar Rajouri Garden', cargo: 'Home Essentials (45 cartons)', picker: 'AE. Thapliyal (Pack 07)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 07', pod: 'Carton Strapping' },
          { orderId: 'ORD-DL-8178', customer: 'More Retail Faridabad', cargo: 'Packaged Food (55 boxes)', picker: 'AF. Sundriyal (Pack 08)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 08', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-DL-8179', customer: 'Spencers Daily Noida', cargo: 'Beverages (40 cases)', picker: 'AG. Kothari (Pack 09)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 09', pod: 'Scale Queued' },
          { orderId: 'ORD-DL-8180', customer: 'Nature Basket Gurgaon', cargo: 'Organic Food (30 crates)', picker: 'AH. Chamoli (Pack 10)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 10', pod: 'Carton Strapping' },
          { orderId: 'ORD-DL-8181', customer: 'Modern Bazaar Saket', cargo: 'Gourmet Packs (25 boxes)', picker: 'AI. Raturi (Pack 11)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 11', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-DL-8182', customer: 'Le Marche Vasant Kunj', cargo: 'Cheeses & Deli (18 totes)', picker: 'AJ. Payal (Pack 12)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 12', pod: 'Scale Queued' },
          { orderId: 'ORD-DL-8183', customer: 'Decathlon Noida Depot', cargo: 'Sporting Equipment (25 crates)', picker: 'AK. Dobhal (Pack 13)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 13', pod: 'Carton Strapping' },
          { orderId: 'ORD-DL-8184', customer: 'Shoppers Stop Connaught Place', cargo: 'Apparel (35 cartons)', picker: 'AL. Silswal (Pack 14)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 14', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-DL-8185', customer: 'Lifestyle Vasant Kunj', cargo: 'Cosmetics (30 boxes)', picker: 'AM. Barthwal (Pack 15)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 15', pod: 'Scale Queued' },

          // Stage 4 (7 normal + 1 issue ORD-DL-8114 = 8 orders)
          { orderId: 'ORD-DL-8191', customer: 'Tata Motors CV Faridabad', cargo: 'Gearboxes (8 units)', picker: 'AN. Kukreti (QC 01)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-01', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-DL-8192', customer: 'Maruti Suzuki Manesar Hub', cargo: 'Alternators (30 boxes)', picker: 'AO. Dabral (QC 02)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-02', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-DL-8193', customer: 'Hero MotoCorp Dharuhera', cargo: 'Chain Sprockets (45 crates)', picker: 'AP. Dimri (QC 03)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-03', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-DL-8194', customer: 'Honda Cars Greater Noida', cargo: 'Brake Boosters (20 units)', picker: 'AQ. Baluni (QC 04)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-04', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-DL-8195', customer: 'Yamaha Motors Surajpur', cargo: 'Handlebars (50 units)', picker: 'AR. Badoni (QC 05)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-05', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-DL-8196', customer: 'Mahindra Heavy Kundli', cargo: 'Leaf Springs (15 bundles)', picker: 'AS. Gosain (QC 06)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-06', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-DL-8197', customer: 'Ashok Leyland Ghaziabad', cargo: 'Air Tanks (18 units)', picker: 'AT. Gairola (QC 07)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-07', pod: 'Weight Calibrated & Passed' },

          // Stage 5 (11 orders)
          { orderId: 'ORD-DL-8201', customer: 'Delhivery Surface Central', cargo: 'E-commerce Freight (120 bags)', picker: 'AU. Kotnala (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 01', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-DL-8202', customer: 'BlueDart Aviation IGI Hub', cargo: 'Priority Air Packages (50 boxes)', picker: 'AV. Khanduri (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 02', pod: 'Staged for BlueDart' },
          { orderId: 'ORD-DL-8203', customer: 'Safexpress Manesar Logistics', cargo: 'Heavy Auto Spares (25 crates)', picker: 'AW. Maithani (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 03', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-DL-8204', customer: 'GATI KWE Cargo Okhla', cargo: 'Apparel Cargo (40 cartons)', picker: 'AX. Semwal (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 04', pod: 'Trailer Loading' },
          { orderId: 'ORD-DL-8205', customer: 'TCI Freight Faridabad', cargo: 'Chemical Drums (15 drums)', picker: 'AY. Saklani (Bay 05)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 05', pod: 'Seal Affixed' },
          { orderId: 'ORD-DL-8206', customer: 'VRL Logistics Kundli', cargo: 'Ceramic Tiles (30 crates)', picker: 'AZ. Bijalwan (Bay 06)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 06', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-DL-8207', customer: 'DTDC Express Gurgaon', cargo: 'Consumer Parcels (75 bags)', picker: 'BA. Pokhriyal (Bay 07)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 07', pod: 'Staged for DTDC' },
          { orderId: 'ORD-DL-8208', customer: 'Trackon Couriers Noida', cargo: 'Documents & Small Cargo (60 bags)', picker: 'BB. Dhoundiyal (Bay 08)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 08', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-DL-8209', customer: 'Shadowfax Central Hub', cargo: 'Hyperlocal Bags (90 totes)', picker: 'BC. Aswal (Bay 09)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 09', pod: 'Trailer Loading' },
          { orderId: 'ORD-DL-8210', customer: 'Xpressbees Regional Okhla', cargo: 'Footwear & Fashion (65 cartons)', picker: 'BD. Pundir (Bay 10)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 10', pod: 'Seal Affixed' },
          { orderId: 'ORD-DL-8211', customer: 'Ecom Express Manesar', cargo: 'Apparel Parcels (85 bags)', picker: 'BE. Ghildiyal (Bay 11)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 11', pod: 'Gate Pass Ready' }
        ]
      },
      'WH-12 Ahmedabad': {
        code: 'WH-12',
        name: 'WH-12 Ahmedabad',
        stuckCount: 3,
        badgeClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
        stages: [
          { id: 1, name: '1. Order Received', count: 6, subtitle: 'Queued', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 11, subtitle: '1 pick delay', stuck: 1 },
          { id: 3, name: '3. Sorting & Packing', count: 7, subtitle: '1 tote missing', stuck: 1 },
          { id: 4, name: '4. QC & Weighing', count: 4, subtitle: 'Verified', stuck: 0 },
          { id: 5, name: '5. Staged at Dock', count: 6, subtitle: '1 carrier late', stuck: 1 },
          { id: 6, name: '6. Dispatched & POD', count: 240, subtitle: 'Delivered', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-AH-6012',
            customer: 'Arvind Mills Logistics',
            priority: 'Textile Export',
            cargo: 'Denim Fabric · 30 Bales (Heavy Roll)',
            stage: 'Stage 2 · Wave Picking (Aisle 05)',
            stageNum: 2,
            reason: 'Roll diameter exceeds conveyor limit; manual crane hoist needed',
            severity: 'Critical Block',
            timeStuck: '2h 10m overdue',
            slaImpact: 'Mundra Port container cutoff at 17:00',
            handlers: [
              { stage: '1. Order Release', name: 'K. Patel', role: 'Dispatcher', time: '09:20' },
              { stage: '2. Wave Picking', name: 'J. Shah', role: 'Heavy Picker #06', time: '09:55', isCurrent: true }
            ],
            supervisor: 'Vikram Malhotra (Shift Lead)'
          },
          {
            orderId: 'ORD-AH-6018',
            customer: 'Zydus Lifesciences',
            priority: 'Pharma Cold-Chain',
            cargo: 'Vaccines · 50 Insulated Cold Shippers',
            stage: 'Stage 3 · Sorting & Packing',
            stageNum: 3,
            reason: 'Dry ice level below minimum spec; dry-ice top-up required before box seal',
            severity: 'Critical Block',
            timeStuck: '1h 25m overdue',
            slaImpact: 'Cold-chain integrity limit: 40 mins remaining',
            handlers: [
              { stage: '1. Order Release', name: 'K. Patel', role: 'Dispatcher', time: '10:15' },
              { stage: '2. Wave Picking', name: 'N. Solanki', role: 'Pharma Picker', time: '10:45' },
              { stage: '3. Sorting & Packing', name: 'B. Dave', role: 'Cold Packer Desk 1', time: '11:15', isCurrent: true }
            ],
            supervisor: 'Sunita Rao (Inventory Lead)'
          },
          {
            orderId: 'ORD-AH-6025',
            customer: 'Adani Wilmar Edible Oil',
            priority: 'Bulk Dispatch',
            cargo: 'Cooking Oil · 100 Tins (15L each)',
            stage: 'Stage 5 · Staged at Dock (Dock Bay 03)',
            stageNum: 5,
            reason: 'Transporter driver arrived without safety PPE; gate entry denied pending boots',
            severity: 'High Attention',
            timeStuck: '55m overdue',
            slaImpact: 'Dock Bay 03 blocked',
            handlers: [
              { stage: '1. Order Release', name: 'K. Patel', role: 'Dispatcher', time: '09:30' },
              { stage: '2. Wave Picking', name: 'M. Vaghela', role: 'Picker', time: '10:00' },
              { stage: '3. MHE Transit', name: 'R. Desai', role: 'Forklift Operator', time: '10:30' },
              { stage: '4. QC & Weighing', name: 'P. Trivedi', role: 'QC Desk', time: '10:55' },
              { stage: '5. Staged at Dock', name: 'Rajesh Kumar', role: 'Safety Marshal', time: '11:20', isCurrent: true }
            ],
            supervisor: 'Vikram Malhotra / Rajesh Kumar'
          }
        ],
        normalOrders: [
          // Stage 1 (6 orders)
          { orderId: 'ORD-AH-6031', customer: 'Nirma Chemicals Sanand', cargo: 'Detergents (50 bags)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-AH-6032', customer: 'Cadila Healthcare Moraiya', cargo: 'Pharma Cartons (30 boxes)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-AH-6033', customer: 'Torrent Pharma Indrad', cargo: 'Active Ingredients (20 drums)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-01', pod: 'Wave Grouped' },
          { orderId: 'ORD-AH-6034', customer: 'Intas Pharma Matoda', cargo: 'Injectables (25 totes)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-02', pod: 'Batch Release Pending' },
          { orderId: 'ORD-AH-6035', customer: 'Amneal Pharma Changodar', cargo: 'Solid Dose (35 boxes)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-AH-6036', customer: 'Sun Pharma Halol', cargo: 'Capsule Blisters (40 cartons)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-02', pod: 'Wave Grouped' },

          // Stage 2 (10 normal + 1 issue ORD-AH-6012 = 11 orders)
          { orderId: 'ORD-AH-6041', customer: 'Adani Wilmar Mundra', cargo: 'Refined Oil (80 cartons)', picker: 'M. Vaghela (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 1', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-AH-6042', customer: 'Gujarat Co-op Milk (Amul)', cargo: 'Butter & Ghee (60 cases)', picker: 'R. Desai (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 2', pod: 'Cart 01 Loading' },
          { orderId: 'ORD-AH-6043', customer: 'Sintex Plastics Kalol', cargo: 'Storage Drums (15 units)', picker: 'P. Trivedi (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 3', pod: 'Picking Active (70%)' },
          { orderId: 'ORD-AH-6044', customer: 'Astral Pipes Santej', cargo: 'PVC Fittings (45 boxes)', picker: 'K. Patel (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 4', pod: 'Tote Staging' },
          { orderId: 'ORD-AH-6045', customer: 'Ashima Textiles Naroda', cargo: 'Grey Fabrics (25 rolls)', picker: 'J. Shah (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 5', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-AH-6046', customer: 'Mafatlal Industries Nadiad', cargo: 'Shirting Fabrics (30 rolls)', picker: 'N. Solanki (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 6', pod: 'Cart 02 Loading' },
          { orderId: 'ORD-AH-6047', customer: 'Aegis Logistics Kandla', cargo: 'Gas Cylinders (20 units)', picker: 'B. Dave (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 7', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-AH-6048', customer: 'Tata Motors Sanand Hub', cargo: 'Body Stampings (18 crates)', picker: 'C. Joshi (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 8', pod: 'Tote Staging' },
          { orderId: 'ORD-AH-6049', customer: 'Ford Ancillary Sanand', cargo: 'Wire Assemblies (35 boxes)', picker: 'D. Parmar (Aisle 09)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 9', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-AH-6050', customer: 'Suzuki Motor Hansalpur', cargo: 'Engine Bracket (14 crates)', picker: 'E. Barot (Aisle 10)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 10', pod: 'Cart 03 Loading' },

          // Stage 3 (6 normal + 1 issue ORD-AH-6018 = 7 orders)
          { orderId: 'ORD-AH-6061', customer: 'Havells India Vadodara', cargo: 'Switchgear (40 boxes)', picker: 'F. Makwana (Pack 01)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 01', pod: 'Carton Strapping' },
          { orderId: 'ORD-AH-6062', customer: 'Polycab India Halol', cargo: 'Cable Spools (25 reels)', picker: 'G. Chauhan (Pack 02)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 02', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-AH-6063', customer: 'RR Kabel Waghodia', cargo: 'Building Wires (50 rolls)', picker: 'H. Thakor (Pack 03)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 03', pod: 'Scale Queued' },
          { orderId: 'ORD-AH-6064', customer: 'Apar Industries Umbergaon', cargo: 'Transformer Oils (20 barrels)', picker: 'I. Rathod (Pack 04)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 04', pod: 'Carton Strapping' },
          { orderId: 'ORD-AH-6065', customer: 'Asian Paints Ankleshwar', cargo: 'Paints & Primers (30 buckets)', picker: 'J. Zala (Pack 05)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 05', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-AH-6066', customer: 'Pidilite Industries Vapi', cargo: 'Adhesives (45 cartons)', picker: 'K. Vala (Pack 06)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 06', pod: 'Scale Queued' },

          // Stage 4 (4 orders)
          { orderId: 'ORD-AH-6071', customer: 'Welspun India Anjar', cargo: 'Terry Towels (60 cartons)', picker: 'L. Mori (QC 01)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-01', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-AH-6072', customer: 'Trident Group Regional', cargo: 'Bed Linen (40 cartons)', picker: 'M. Dabhi (QC 02)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-02', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-AH-6073', customer: 'Alok Industries Vapi', cargo: 'Polyester Yarn (30 boxes)', picker: 'N. Raval (QC 03)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-03', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-AH-6074', customer: 'Raymond Silver Spark', cargo: 'Suiting Fabrics (25 rolls)', picker: 'O. Vyas (QC 04)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-04', pod: 'Weight Calibrated & Passed' },

          // Stage 5 (5 normal + 1 issue ORD-AH-6025 = 6 orders)
          { orderId: 'ORD-AH-6081', customer: 'Reliance Retail Ahmedabad', cargo: 'Consumer Goods (90 bags)', picker: 'P. Trivedi (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 01', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-AH-6082', customer: 'D-Mart Sarkhej Depot', cargo: 'Household FMCG (70 crates)', picker: 'Q. Joshi (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 02', pod: 'Staged for Delhivery' },
          { orderId: 'ORD-AH-6083', customer: 'Croma Retail SG Highway', cargo: 'Appliances (20 crates)', picker: 'R. Shah (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 03', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-AH-6084', customer: 'Vijay Sales Ashram Road', cargo: 'Smart TVs (15 units)', picker: 'S. Patel (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 04', pod: 'Trailer Loading' },
          { orderId: 'ORD-AH-6085', customer: 'Osia Hypermarket Naroda', cargo: 'Groceries (60 bags)', picker: 'T. Bhatt (Bay 05)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 05', pod: 'Seal Affixed' }
        ]
      },
      'WH-03 Bengaluru': {
        code: 'WH-03',
        name: 'WH-03 Bengaluru',
        stuckCount: 1,
        badgeClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        stages: [
          { id: 1, name: '1. Order Received', count: 8, subtitle: 'Queued', stuck: 0 },
          { id: 2, name: '2. Wave Picking', count: 18, subtitle: '1 pick item missing', stuck: 1 },
          { id: 3, name: '3. Sorting & Packing', count: 10, subtitle: 'Boxed', stuck: 0 },
          { id: 4, name: '4. QC & Weighing', count: 6, subtitle: 'Verified', stuck: 0 },
          { id: 5, name: '5. Staged at Dock', count: 8, subtitle: 'Carrier handover', stuck: 0 },
          { id: 6, name: '6. Dispatched & POD', count: 520, subtitle: 'Delivered', stuck: 0 }
        ],
        issues: [
          {
            orderId: 'ORD-BL-3309',
            customer: 'Infosys Campus Store',
            priority: 'IT Hardware',
            cargo: 'IT Peripherals · 50 Mechanical Keyboards',
            stage: 'Stage 2 · Wave Picking (Aisle 03-C)',
            stageNum: 2,
            reason: 'SKU lot number mismatch between physical box (LOT-2026A) and system order (LOT-2026B)',
            severity: 'Attention Needed',
            timeStuck: '1h 10m overdue',
            slaImpact: 'Courier pickup scheduled at 14:30',
            handlers: [
              { stage: '1. Order Release', name: 'D. Gowda', role: 'Order Dispatcher', time: '10:10' },
              { stage: '2. Wave Picking', name: 'K. Venkatesh', role: 'Floor Picker #07', time: '10:45', isCurrent: true }
            ],
            supervisor: 'Arun Verma (Outbound Lead)'
          }
        ],
        normalOrders: [
          // Stage 1 (8 orders)
          { orderId: 'ORD-BL-3311', customer: 'Infosys Electronic City', cargo: 'Monitors (50 units)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BL-3312', customer: 'Wipro Sarjapur Campus', cargo: 'Laptops (35 units)', picker: 'Floor Queue A', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue A-02', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BL-3313', customer: 'TCS Whitefield Hub', cargo: 'Desktops (40 units)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-01', pod: 'Wave Grouped' },
          { orderId: 'ORD-BL-3314', customer: 'Intel India Bellandur', cargo: 'Motherboard Test Units (15 kits)', picker: 'Floor Queue B', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue B-02', pod: 'Batch Release Pending' },
          { orderId: 'ORD-BL-3315', customer: 'Cisco Systems Cessna', cargo: 'Switches & Routers (25 crates)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BL-3316', customer: 'Dell Technologies Domlur', cargo: 'Docking Stations (60 boxes)', picker: 'Floor Queue C', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue C-02', pod: 'Wave Grouped' },
          { orderId: 'ORD-BL-3317', customer: 'HP Enterprise Mahadevapura', cargo: 'Blade Servers (10 crates)', picker: 'Floor Queue D', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue D-01', pod: 'Awaiting Wave Release' },
          { orderId: 'ORD-BL-3318', customer: 'IBM Manyata Tech Park', cargo: 'Storage Arrays (8 units)', picker: 'Floor Queue D', stageNum: 1, stage: '1. Order Received', dockBay: 'Queue D-02', pod: 'Batch Release Pending' },

          // Stage 2 (17 normal + 1 issue ORD-BL-3309 = 18 orders)
          { orderId: 'ORD-BL-3321', customer: 'Flipkart Logistics Hub Hoskote', cargo: 'Consumer Tech (110 units)', picker: 'D. Gowda (Aisle 01)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 1', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-BL-3322', customer: 'Amazon IN Fulfillment Attibele', cargo: 'Electronics (90 boxes)', picker: 'K. Venkatesh (Aisle 02)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 2', pod: 'Cart 01 Loading' },
          { orderId: 'ORD-BL-3323', customer: 'BigBasket HQ Chikkajala', cargo: 'Fresh Staples (80 crates)', picker: 'M. Swamy (Aisle 03)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone A, Aisle 3', pod: 'Picking Active (70%)' },
          { orderId: 'ORD-BL-3324', customer: 'Zepto Darkstore Indiranagar', cargo: 'Snacks & Drinks (50 boxes)', picker: 'P. Murthy (Aisle 04)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 4', pod: 'Tote Staging' },
          { orderId: 'ORD-BL-3325', customer: 'Blinkit Depot Koramangala', cargo: 'Dairy & Bakery (45 totes)', picker: 'R. Reddy (Aisle 05)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 5', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-BL-3326', customer: 'Myntra Express Bommasandra', cargo: 'Designer Footwear (70 pairs)', picker: 'S. Naidu (Aisle 06)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone B, Aisle 6', pod: 'Cart 02 Loading' },
          { orderId: 'ORD-BL-3327', customer: 'Ajio Warehouse Nelamangala', cargo: 'Winter Jackets (40 cartons)', picker: 'T. Kumar (Aisle 07)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 7', pod: 'Picking Active (90%)' },
          { orderId: 'ORD-BL-3328', customer: 'Nykaa Regional Peenya', cargo: 'Beauty Products (55 boxes)', picker: 'U. Prasad (Aisle 08)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 8', pod: 'Tote Staging' },
          { orderId: 'ORD-BL-3329', customer: 'Titan Eyeplus Electronic City', cargo: 'Spectacle Frames (60 cases)', picker: 'V. Rao (Aisle 09)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone C, Aisle 9', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-BL-3330', customer: 'Fastrack Store Jayanagar', cargo: 'Smart Watches (35 units)', picker: 'W. Hegde (Aisle 10)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 10', pod: 'Cart 03 Loading' },
          { orderId: 'ORD-BL-3331', customer: 'Croma Retail Marathahalli', cargo: 'Air Conditioners (12 units)', picker: 'X. Shettar (Aisle 11)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 11', pod: 'Picking Active (80%)' },
          { orderId: 'ORD-BL-3332', customer: 'Reliance Digital HSR Layout', cargo: 'OLED Smart TVs (10 units)', picker: 'Y. Patil (Aisle 12)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone D, Aisle 12', pod: 'Tote Staging' },
          { orderId: 'ORD-BL-3333', customer: 'Vijay Sales Whitefield', cargo: 'Soundbars (25 boxes)', picker: 'Z. Kulkarni (Aisle 13)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone E, Aisle 13', pod: 'Pick Cycle Active' },
          { orderId: 'ORD-BL-3334', customer: 'Decathlon Anubhava Hub', cargo: 'Tents & Camping (18 crates)', picker: 'AA. Joshi (Aisle 14)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone E, Aisle 14', pod: 'Cart 04 Loading' },
          { orderId: 'ORD-BL-3335', customer: 'IKEA Nagasandra Distribution', cargo: 'Flatpack Furniture (30 boxes)', picker: 'AB. Desai (Aisle 15)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone E, Aisle 15', pod: 'Picking Active (85%)' },
          { orderId: 'ORD-BL-3336', customer: 'Home Centre Koramangala', cargo: 'Crockery Sets (22 cartons)', picker: 'AC. Bhat (Aisle 16)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone F, Aisle 16', pod: 'Tote Staging' },
          { orderId: 'ORD-BL-3337', customer: 'Fabindia Central Depot', cargo: 'Handloom Curtains (35 bundles)', picker: 'AD. Nayak (Aisle 17)', stageNum: 2, stage: '2. Wave Picking', dockBay: 'Zone F, Aisle 17', pod: 'Pick Cycle Active' },

          // Stage 3 (10 orders)
          { orderId: 'ORD-BL-3341', customer: 'MedPlus Depot Peenya', cargo: 'Pharmaceuticals (60 cartons)', picker: 'AE. Acharya (Pack 01)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 01', pod: 'Carton Strapping' },
          { orderId: 'ORD-BL-3342', customer: 'Apollo Pharmacy Rajajinagar', cargo: 'Healthcare Devices (40 boxes)', picker: 'AF. Shenoy (Pack 02)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 02', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-BL-3343', customer: 'Manipal Hospital Pharmacy', cargo: 'Surgical Disposables (25 crates)', picker: 'AG. Pai (Pack 03)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 03', pod: 'Scale Queued' },
          { orderId: 'ORD-BL-3344', customer: 'Fortis Hospital BG Road', cargo: 'Saline Solutions (30 cartons)', picker: 'AH. Kamath (Pack 04)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 04', pod: 'Carton Strapping' },
          { orderId: 'ORD-BL-3345', customer: 'Biocon Park Jigani', cargo: 'Laboratory Glassware (15 crates)', picker: 'AI. Prabhu (Pack 05)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 05', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-BL-3346', customer: 'Syngene International Bommasandra', cargo: 'Research Reagents (20 boxes)', picker: 'AJ. Kudva (Pack 06)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 06', pod: 'Scale Queued' },
          { orderId: 'ORD-BL-3347', customer: 'AstraZeneca Pharma Hebbal', cargo: 'Insulin Kits (35 insulated boxes)', picker: 'AK. Alva (Pack 07)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 07', pod: 'Carton Strapping' },
          { orderId: 'ORD-BL-3348', customer: 'Micro Labs Kudlu Gate', cargo: 'Tablet Strips (50 cartons)', picker: 'AL. Shetty (Pack 08)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 08', pod: 'Bubble Wrap & Taping' },
          { orderId: 'ORD-BL-3349', customer: 'Strides Pharma Bannerghatta', cargo: 'Softgel Capsules (40 boxes)', picker: 'AM. Ballal (Pack 09)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 09', pod: 'Scale Queued' },
          { orderId: 'ORD-BL-3350', customer: 'Himalaya Wellness Makali', cargo: 'Personal Care (70 cartons)', picker: 'AN. Hegde (Pack 10)', stageNum: 3, stage: '3. Sorting & Packing', dockBay: 'Pack Desk 10', pod: 'Carton Strapping' },

          // Stage 4 (6 orders)
          { orderId: 'ORD-BL-3361', customer: 'Bosch Automotive Adugodi', cargo: 'Fuel Injection Pumps (18 crates)', picker: 'AO. Rao (QC 01)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-01', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BL-3362', customer: 'Toyota Kirloskar Bidadi', cargo: 'Axle Gearings (12 crates)', picker: 'AP. Murthy (QC 02)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-02', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BL-3363', customer: 'TVS Motor Harita Depot', cargo: 'Alloy Wheels (25 cartons)', picker: 'AQ. Swamy (QC 03)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-03', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BL-3364', customer: 'Volvo Trucks Hosakote', cargo: 'Brake Calipers (15 crates)', picker: 'AR. Reddy (QC 04)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-04', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BL-3365', customer: 'Scania Commercial Vehicles', cargo: 'Radiator Cores (10 units)', picker: 'AS. Naidu (QC 05)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-05', pod: 'Weight Calibrated & Passed' },
          { orderId: 'ORD-BL-3366', customer: 'BEML Limited Bangalore Complex', cargo: 'Hydraulic Cylinders (8 heavy crates)', picker: 'AT. Kumar (QC 06)', stageNum: 4, stage: '4. QC & Weighing', dockBay: 'Desk QC-06', pod: 'Weight Calibrated & Passed' },

          // Stage 5 (8 orders)
          { orderId: 'ORD-BL-3371', customer: 'Delhivery Surface Nelamangala', cargo: 'Consolidated Parcels (95 bags)', picker: 'AU. Patil (Bay 01)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 01', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-BL-3372', customer: 'BlueDart Air Hub Devanahalli', cargo: 'Express Cargo (45 boxes)', picker: 'AV. Joshi (Bay 02)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 02', pod: 'Staged for BlueDart' },
          { orderId: 'ORD-BL-3373', customer: 'Safexpress Peenya Logistics', cargo: 'Industrial Fasteners (30 wooden cases)', picker: 'AW. Kulkarni (Bay 03)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 03', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-BL-3374', customer: 'GATI KWE Electronic City', cargo: 'Tech Equipment (25 crates)', picker: 'AX. Shettar (Bay 04)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 04', pod: 'Trailer Loading' },
          { orderId: 'ORD-BL-3375', customer: 'TCI Freight Hosur Road', cargo: 'Auto Lubricants (20 drums)', picker: 'AY. Hegde (Bay 05)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 05', pod: 'Seal Affixed' },
          { orderId: 'ORD-BL-3376', customer: 'VRL Logistics Tumkur Road', cargo: 'Consumer Appliances (35 units)', picker: 'AZ. Desai (Bay 06)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 06', pod: 'Gate Pass Ready' },
          { orderId: 'ORD-BL-3377', customer: 'DTDC Express Peenya Hub', cargo: 'E-commerce Parcels (60 bags)', picker: 'BA. Bhat (Bay 07)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 07', pod: 'Staged for DTDC' },
          { orderId: 'ORD-BL-3378', customer: 'Shadowfax Central Bommasandra', cargo: 'Hyperlocal Bags (75 totes)', picker: 'BB. Nayak (Bay 08)', stageNum: 5, stage: '5. Staged at Dock', dockBay: 'Dock Bay 08', pod: 'Gate Pass Ready' }
        ]
      }
    };

    // Active issue cache for quick lookup in modal
    window.outwardIssuesRegistry = {};

    function renderOutwardJourney(whName) {
      const facility = warehouseOutwardData[whName] || warehouseOutwardData['WH-01 Bhiwandi'] || warehouseOutwardData['WH-02 Guwahati'];
      if (!facility) return;

      currentFacilityName = facility.name;

      // 1. Update Card 1: Funnel Header & Title
      const titleEl = document.getElementById('outward-facility-title');
      const badgeEl = document.getElementById('outward-facility-badge');
      const subtitleEl = document.getElementById('outward-facility-subtitle');

      if (titleEl) titleEl.textContent = facility.name;
      if (badgeEl) badgeEl.textContent = `${facility.name} · Dispatch Operations`;
      if (subtitleEl) subtitleEl.textContent = '';

      // 2. Render Card 1: 6-Stage Journey Pipeline Funnel (Matching Inward Journey 1:1)
      const funnelContainer = document.getElementById('outward-funnel-stages');
      if (funnelContainer) {
        funnelContainer.innerHTML = '';
        facility.stages.forEach(stage => {
          const card = document.createElement('div');
          const isStuck = stage.stuck > 0;
          const isComplete = stage.id === 6;

          let cardStyle = 'border-[#E5E7EB] bg-[#F9FAFB]';
          let badgeStyle = 'text-[#6B7280]';
          let numStyle = 'text-[#1F2937]';
          let subStyle = 'text-[#6B7280]';

          if (isStuck) {
            cardStyle = 'border-2 border-[#EF4444] bg-[#FEF2F2] shadow-xs relative';
            badgeStyle = 'text-[#DC2626]';
            numStyle = 'text-[#DC2626]';
            subStyle = 'text-[#DC2626] font-semibold';
          } else if (isComplete) {
            cardStyle = 'border border-[#A7F3D0] bg-[#ECFDF5] relative';
            badgeStyle = 'text-[#059669]';
            numStyle = 'text-[#059669]';
            subStyle = 'text-[#059669] font-semibold';
          }

          if (isComplete) {
            card.className = `relative p-3.5 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] text-center select-none shadow-2xs cursor-pointer hover:border-[#059669] hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] group`;
            card.onclick = () => openDispatchedOrdersPage();
            card.title = `Click to view all ${stage.count} delivered dispatches with PODs in table format`;
            card.innerHTML = `
              <button type="button" onclick="event.stopPropagation(); showStageDefinition('outward', 6)" class="absolute top-2 right-2 w-4 h-4 rounded-full border border-emerald-300 bg-white text-[#059669] hover:border-[#059669] flex items-center justify-center text-[10px] font-serif font-bold italic shadow-2xs transition-all z-10 cursor-pointer" title="What does Stage 6 (Dispatched & POD) mean?">i</button>
              <span class="text-[10px] uppercase font-bold text-[#059669] font-arial block">${stage.name}</span>
              <span class="text-[20px] font-bold text-[#059669] block mt-0.5">${stage.count} orders</span>
              <span class="text-[11px] text-[#059669] font-semibold block font-arial mt-0.5 flex items-center justify-center gap-1">
                Delivered <span class="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </span>
            `;
          } else {
            card.className = `relative p-3.5 rounded-2xl border ${cardStyle} text-center select-none shadow-2xs`;
            card.innerHTML = `
              ${isStuck ? `
                <span class="absolute -top-2.5 left-2 px-2 py-0.5 rounded-full bg-[#DC2626] text-white text-[9px] font-bold font-arial animate-pulse shadow-xs">
                  ${stage.stuck} STUCK
                </span>
              ` : ''}
              <button type="button" onclick="event.stopPropagation(); showStageDefinition('outward', ${stage.id})" class="absolute top-2 right-2 w-4 h-4 rounded-full border border-gray-300 bg-white text-gray-500 hover:text-[#D84E55] hover:border-[#D84E55] flex items-center justify-center text-[10px] font-serif font-bold italic shadow-2xs transition-all z-10 cursor-pointer" title="What does ${stage.name} mean?">i</button>
              <span class="text-[10px] uppercase font-bold ${badgeStyle} font-arial block">${stage.name}</span>
              <span class="text-[20px] font-bold ${numStyle} block mt-0.5">${stage.count} orders</span>
              <span class="text-[11px] ${subStyle} block font-arial mt-0.5">${stage.subtitle}</span>
            `;
          }
          funnelContainer.appendChild(card);
        });
      }

      // 3. Card 2: Active Outward Orders Table (Matching Inward Journey 1:1)
      const tableTitle = document.getElementById('outward-table-title');
      if (tableTitle) {
        tableTitle.textContent = facility.name;
      }

      // Register and format issues
      const issueOrders = (facility.issues || []).map(iss => {
        window.outwardIssuesRegistry[iss.orderId] = iss;
        return {
          orderId: iss.orderId,
          customer: iss.customer,
          cargo: iss.cargo,
          picker: iss.handlers && iss.handlers.length > 0
            ? `${iss.handlers[iss.handlers.length - 1].name} (${iss.handlers[iss.handlers.length - 1].role})`
            : (iss.supervisor || 'Floor Marshal'),
          dockBay: iss.dockBay || (iss.stage && iss.stage.includes('Bay') ? iss.stage.match(/Bay\s*\d+/i)?.[0] || 'Dock Bay 06' : 'Dock Bay 06'),
          stageNum: iss.stageNum || 5,
          stage: iss.stage ? iss.stage.split('(')[0].replace(/Stage\s*\d+\s*[·•-]\s*/i, '').trim() : 'Staged at Dock',
          pod: iss.timeStuck ? `${iss.timeStuck.replace(/overdue/i, '').trim()} Overdue` : 'Action Required',
          isIssue: true,
          priority: iss.priority || 'Action Required',
          reason: iss.reason,
          timeStuck: iss.timeStuck,
          rawIssue: iss
        };
      });

      const normalOrders = (facility.normalOrders || []).map(ord => ({
        ...ord,
        isIssue: false
      }));

      // High priority blocked orders first so supervisors see them immediately
      const allActiveOrders = [...issueOrders, ...normalOrders];

      // Update Filter Tabs with accurate dynamic counts
      const allBtn = document.getElementById('outward-tab-all');
      if (allBtn) {
        allBtn.textContent = `All Active (${allActiveOrders.length})`;
        if (currentOutwardFilter === 'all') {
          allBtn.className = 'px-3 py-1 rounded-lg font-bold bg-[#1F2937] text-white shadow-2xs cursor-pointer transition-all';
        } else {
          allBtn.className = 'px-3 py-1 rounded-lg font-medium bg-white border border-[#E5E7EB] text-gray-700 hover:bg-gray-100 cursor-pointer transition-all';
        }
      }

      [1, 2, 3, 4, 5].forEach(stNum => {
        const tabBtn = document.getElementById(`outward-tab-${stNum}`);
        if (tabBtn) {
          const countForStage = allActiveOrders.filter(o => o.stageNum === stNum).length;
          const stageObj = (facility.stages || []).find(s => s.id === stNum);
          const stageName = stageObj ? stageObj.name.replace(/^\d+\.\s*/, '') : `Stage ${stNum}`;
          tabBtn.textContent = `${stNum}. ${stageName} (${countForStage})`;

          const hasIssueInStage = allActiveOrders.some(o => o.stageNum === stNum && o.isIssue);
          if (currentOutwardFilter === stNum) {
            tabBtn.className = 'px-3 py-1 rounded-lg font-bold bg-[#1F2937] text-white shadow-2xs cursor-pointer transition-all';
          } else if (hasIssueInStage) {
            tabBtn.className = 'px-3 py-1 rounded-lg font-semibold bg-[#FEECEE] text-[#D84E55] border border-[#FECACA] hover:bg-[#FECACA] cursor-pointer transition-all';
          } else {
            tabBtn.className = 'px-3 py-1 rounded-lg font-medium bg-white border border-[#E5E7EB] text-gray-700 hover:bg-gray-100 cursor-pointer transition-all';
          }
        }
      });

      // Filter rows by selected stage
      const filtered = currentOutwardFilter === 'all'
        ? allActiveOrders
        : allActiveOrders.filter(o => o.stageNum === currentOutwardFilter);

      const countBadge = document.getElementById('outward-table-count-badge');
      if (countBadge) {
        countBadge.textContent = `${filtered.length} Orders ${currentOutwardFilter === 'all' ? 'Total' : '(Filtered)'}`;
      }

      // Render Single Unified Outward Table Body
      const tbody = document.getElementById('outward-orders-tbody');
      if (tbody) {
        tbody.innerHTML = '';
        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-gray-500 text-[13px]">No outward orders currently in this stage.</td></tr>`;
        } else {
          filtered.forEach(order => {
            const tr = document.createElement('tr');
            tr.className = order.isIssue
              ? 'hover:bg-red-50/60 bg-red-50/20 border-l-4 border-l-[#DC2626] cursor-pointer transition-colors'
              : 'hover:bg-[#F9FAFB] cursor-pointer transition-colors';
            tr.onclick = () => {
              if (order.isIssue) {
                openOutwardIssueModal(order.orderId);
              } else {
                openOutwardOrderDetail(order.orderId);
              }
            };

            let podClass = 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
            if (order.isIssue) {
              podClass = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] font-bold';
            } else if (order.pod && (order.pod.includes('Signed') || order.pod.includes('Passed') || order.pod.includes('Delivered'))) {
              podClass = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
            } else if (order.pod && (order.pod.includes('Ready') || order.pod.includes('Override') || order.pod.includes('Affixed') || order.pod.includes('Staged') || order.pod.includes('Active'))) {
              podClass = 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
            }

            let stageBadgeClass = 'bg-gray-100 text-gray-700';
            if (order.isIssue) stageBadgeClass = 'bg-[#FEECEE] text-[#DC2626] font-bold border border-[#FECACA]';
            else if (order.stageNum === 1) stageBadgeClass = 'bg-blue-50 text-blue-700 border border-blue-200';
            else if (order.stageNum === 2) stageBadgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
            else if (order.stageNum === 3) stageBadgeClass = 'bg-purple-50 text-purple-700 border border-purple-200';
            else if (order.stageNum === 4) stageBadgeClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
            else if (order.stageNum === 5) stageBadgeClass = 'bg-amber-50 text-amber-800 border border-amber-300';
            else if (order.stageNum === 6) stageBadgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';

            const stageDisplay = order.stage.includes('.') ? order.stage : `${order.stageNum}. ${order.stage}`;

            // Clean fixed status for Proof of Dispatch: "Done" or "Pending"
            const isPodDone = order.stageNum === 6 || (order.pod && (order.pod.toLowerCase().includes('signed') || order.pod.toLowerCase().includes('delivered')));
            const statusContent = isPodDone ? `
              <span onclick="event.stopPropagation(); openOutwardPodModal()" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-emerald-100 cursor-pointer transition-colors shadow-2xs whitespace-nowrap" title="Proof of Dispatch completed · Click to view signed POD">
                Done
              </span>
            ` : (order.isIssue ? `
              <span onclick="event.stopPropagation(); openDispatchPendingModal('${order.orderId}')" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-red-100 cursor-pointer transition-colors shadow-2xs whitespace-nowrap" title="Click to see what is pending">
                Pending
              </span>
            ` : `
              <span onclick="event.stopPropagation(); openDispatchPendingModal('${order.orderId}')" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] hover:bg-amber-100 cursor-pointer transition-colors shadow-2xs whitespace-nowrap" title="Click to see what is pending">
                Pending
              </span>
            `);

            tr.innerHTML = `
              <td class="py-3 px-3 font-bold ${order.isIssue ? 'text-[#DC2626]' : 'text-[#1F2937]'} font-arial whitespace-nowrap">
                <span>${order.orderId}</span>
              </td>
              <td class="py-3 px-3 font-medium text-[#1F2937]">${order.customer}</td>
              <td class="py-3 px-3">${formatCargoCell(order.cargo)}</td>
              <td class="py-3 px-3 font-arial font-semibold text-[#1F2937]">${order.dockBay || order.picker}</td>
              <td class="py-3 px-3">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial inline-block ${stageBadgeClass}">
                  ${stageDisplay}
                </span>
              </td>
              <td class="py-3 px-3">
                ${statusContent}
              </td>
              <td class="py-3 px-3 text-right">
                <button onclick="event.stopPropagation(); ${order.isIssue ? `openOutwardIssueModal('${order.orderId}')` : `openOutwardOrderDetail('${order.orderId}')`}" class="${order.isIssue ? 'btn-redbus' : 'btn-redbus-secondary'} text-[11px] py-1 px-3 cursor-pointer whitespace-nowrap shadow-xs">
                  ${order.isIssue ? 'View Full Journey &rarr;' : 'Inspect &rarr;'}
                </button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        }
      }
    }

    let currentOutwardFilter = 'all';

    function filterOutwardTable(stage) {
      currentOutwardFilter = stage;
      renderOutwardJourney(currentFacilityName);
    }

    function openOutwardIssueModal(orderId) {
      const issue = window.outwardIssuesRegistry[orderId];
      if (!issue) {
        // Fallback to full journey detail
        openOutwardOrderDetail(orderId);
        return;
      }

      const modal = document.getElementById('outward-issue-modal');
      if (!modal) {
        openOutwardOrderDetail(orderId);
        return;
      }

      // Populate Modal Content
      document.getElementById('issue-modal-order-id').textContent = issue.orderId;
      document.getElementById('issue-modal-priority-badge').textContent = issue.priority || 'Action Required';
      document.getElementById('issue-modal-customer').textContent = issue.customer;
      document.getElementById('issue-modal-cargo').textContent = issue.cargo;
      document.getElementById('issue-modal-stage').textContent = issue.stage;
      document.getElementById('issue-modal-time-stuck').textContent = issue.timeStuck;
      document.getElementById('issue-modal-sla').textContent = issue.slaImpact;
      document.getElementById('issue-modal-reason').textContent = issue.reason;

      // Custody chain
      const handlersContainer = document.getElementById('issue-modal-handlers');
      if (handlersContainer) {
        handlersContainer.innerHTML = (issue.handlers || []).map(h => `
          <div class="flex items-center gap-2 p-2 rounded-xl ${h.isCurrent ? 'bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] font-semibold' : 'bg-gray-50 text-[#374151]'} text-[12px]">
            <span class="w-24 text-[11px] text-gray-500 font-arial shrink-0">${h.stage}:</span>
            <span class="w-2 h-2 rounded-full ${h.isCurrent ? 'bg-[#DC2626] animate-ping' : 'bg-gray-400'} shrink-0"></span>
            <strong class="${h.isCurrent ? 'text-[#DC2626]' : 'text-gray-900'}">${h.name}</strong>
            <span class="text-[11px] text-gray-500">(${h.role})</span>
            <span class="text-[10px] text-gray-400 font-mono ml-auto">${h.time}</span>
            ${h.isCurrent ? '<span class="px-1.5 py-0.5 rounded bg-[#DC2626] text-white text-[9px] font-bold uppercase tracking-wider shrink-0">Active Custody</span>' : ''}
          </div>
        `).join('');
      }

      // AI Root cause section
      const aiContainer = document.getElementById('issue-modal-ai-box');
      if (aiContainer) {
        if (issue.aiDiagnostic) {
          aiContainer.classList.remove('hidden');
          document.getElementById('issue-modal-ai-confidence').textContent = issue.aiDiagnostic.confidence || '98%';
          document.getElementById('issue-modal-ai-root-cause').textContent = issue.aiDiagnostic.rootCause;
          document.getElementById('issue-modal-ai-recommendation').textContent = issue.aiDiagnostic.recommendation;
        } else {
          aiContainer.classList.add('hidden');
        }
      }

      // Action buttons
      const overrideBtn = document.getElementById('issue-modal-override-btn');
      if (overrideBtn) {
        overrideBtn.onclick = () => {
          closeOutwardIssueModal();
          resolveOutwardIssue(issue.orderId, issue.customer);
        };
      }

      const viewJourneyBtn = document.getElementById('issue-modal-journey-btn');
      if (viewJourneyBtn) {
        viewJourneyBtn.onclick = () => {
          closeOutwardIssueModal();
          openOutwardOrderDetail(issue.orderId);
        };
      }

      modal.classList.remove('hidden');
    }

    function closeOutwardIssueModal() {
      const modal = document.getElementById('outward-issue-modal');
      if (modal) modal.classList.add('hidden');
    }

    function resolveOutwardIssue(orderId, customer) {
      const facility = warehouseOutwardData[currentFacilityName];
      if (!facility) return;

      const idx = facility.issues.findIndex(i => i.orderId === orderId);
      if (idx !== -1) {
        const resolved = facility.issues.splice(idx, 1)[0];
        facility.stuckCount = Math.max(0, facility.stuckCount - 1);

        facility.normalOrders.unshift({
          orderId: resolved.orderId,
          customer: resolved.customer,
          cargo: resolved.cargo,
          picker: `${resolved.handlers[resolved.handlers.length - 1].name} (Overridden)`,
          stage: '5. Staged at Dock',
          pod: 'Supervisor Override Passed'
        });

        const stage = facility.stages.find(s => s.id === resolved.stageNum);
        if (stage && stage.stuck > 0) stage.stuck--;

        renderOutwardJourney(currentFacilityName);

        alert(`✓ Manual Intervention Executed by Jaswant Singh:\nOrder ${orderId} (${customer}) has been manually overridden by Ops Manager.\nStatus updated to Gate Staging & Carrier Notification Sent.`);
      }
    }

    function contactHandler(name, orderId) {
      alert(`Connecting to On-Duty Handler ${name} for ${orderId}:\n• Role: Active Outward Custodian\n• Mobile: +91 98201-XXXXX\n• Intercom: Desk QC Bay #02`);
    }

    function switchMetricsTime(timeframe, btn) {
      document.querySelectorAll('.ops-time-btn').forEach(b => {
        b.className = 'ops-time-btn px-3 py-1 rounded-lg text-[11.5px] font-medium text-[#4B5563] hover:text-[#1F2937] transition-all cursor-pointer';
      });
      if (btn) {
        btn.className = 'ops-time-btn px-3 py-1 rounded-lg text-[11.5px] font-bold bg-[#1F2937] text-white shadow-2xs transition-all cursor-pointer';
      }
    }

    function scrollToWarehouseNetwork() {
      const target = document.getElementById('warehouse-network-header') || document.getElementById('screen-1');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function goToScreen(screenNum, whName, subTab) {
      // 1. Hide all screen views
      document.querySelectorAll('.screen-view').forEach(s => s.classList.add('hidden'));
      
      // 2. Show target screen
      const targetScreen = document.getElementById('screen-' + screenNum);
      if (targetScreen) targetScreen.classList.remove('hidden');

      // 3. Update active soft-bordered tab in global navbar
      document.querySelectorAll('header .top-tab').forEach(t => t.classList.remove('active-tab'));
      const activeTab = document.getElementById('tab-screen-' + screenNum);
      if (activeTab) {
        activeTab.classList.add('active-tab');
      } else if (screenNum <= 3) {
        const whTab = document.getElementById('tab-screen-1');
        if (whTab) whTab.classList.add('active-tab');
      }

      // 4. Update warehouse facility label if provided
      if (whName) {
        currentFacilityName = whName;
        const subFacility = document.getElementById('subtab-facility-label');
        if (subFacility) subFacility.textContent = whName;
        const inFacility = document.getElementById('inward-facility-title');
        if (inFacility) inFacility.textContent = whName;
        const inTableWh = document.getElementById('inward-table-wh');
        if (inTableWh) inTableWh.textContent = whName;
        const outFacility = document.getElementById('outward-facility-title');
        if (outFacility) outFacility.textContent = whName;
        const outTableWh = document.getElementById('outward-table-title');
        if (outTableWh) outTableWh.textContent = whName;
        const inDetailWh = document.getElementById('inward-detail-wh');
        if (inDetailWh) inDetailWh.textContent = whName;
        const outDetailWh = document.getElementById('outward-detail-wh');
        if (outDetailWh) outDetailWh.textContent = whName;
        const storedWh = document.getElementById('stored-page-title');
        if (storedWh) storedWh.textContent = whName;
        const dispWh = document.getElementById('dispatched-page-title');
        if (dispWh) dispWh.textContent = whName;
      }

      // 5. If navigating to screen 3, switch to the requested warehouse sub-tab
      if (screenNum === 3) {
        switchWhTab(subTab || 'overview');
      }

      // 6. Scroll page smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function switchWhTab(tabName) {
      document.querySelectorAll('#screen-3 .wh-tab-section').forEach(sec => sec.classList.add('hidden'));
      document.querySelectorAll('#screen-3 [id^="wh-tab-"]').forEach(btn => btn.classList.remove('active-tab'));

      const targetSec = document.getElementById('wh-section-' + tabName);
      if (targetSec) targetSec.classList.remove('hidden');

      const targetBtn = document.getElementById('wh-tab-' + tabName);
      if (targetBtn) targetBtn.classList.add('active-tab');

      if (tabName === 'inward') {
        renderInwardTable();
      }
      if (tabName === 'outward') {
        renderOutwardJourney(currentFacilityName);
      }
    }

    
    const storeyData = {
      1: {
        name: 'Floor 1 (Ground)',
        badge: '91% OCCUPIED',
        badgeClass: 'bg-[#FEF2F2] text-[#DC2626]',
        meta: 'Floor 1 · Pallet Racks A1–F8 · 38/48 Slots Used (10 Empty)',
        selectedSlot: 'B8',
        slots: [
          // Row A
          { id: 'A1', heat: 'critical', pct: '96%', sku: 'SKU-LED-60W (48 pcs)' },
          { id: 'A2', heat: 'medium',   pct: '78%', sku: 'SKU-SMART-FAN (39 pcs)' },
          { id: 'A3', heat: 'low',      pct: '35%', sku: 'SKU-FMCG-22 (18 pcs)' },
          { id: 'A4', heat: 'critical', pct: '94%', sku: 'SKU-FMCG-22 (47 pcs)' },
          { id: 'A5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A6', heat: 'medium',   pct: '65%', sku: 'SKU-LED-30W (32 pcs)' },
          { id: 'A7', heat: 'critical', pct: '98%', sku: 'SKU-LED-60W (49 pcs)' },
          { id: 'A8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          // Row B
          { id: 'B1', heat: 'low',      pct: '42%', sku: 'SKU-HV-CABLE (21 pcs)' },
          { id: 'B2', heat: 'critical', pct: '92%', sku: 'SKU-HV-CABLE (46 pcs)' },
          { id: 'B3', heat: 'medium',   pct: '75%', sku: 'SKU-HV-CABLE (38 pcs)' },
          { id: 'B4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B5', heat: 'critical', pct: '95%', sku: 'SKU-BOAT-AIR (57 pcs)' },
          { id: 'B6', heat: 'medium',   pct: '80%', sku: 'SKU-BOAT-AIR (48 pcs)' },
          { id: 'B7', heat: 'low',      pct: '28%', sku: 'SKU-BOAT-AIR (17 pcs)' },
          { id: 'B8', heat: 'critical', pct: '98%', sku: 'SKU-LED-60W (50 pcs)', selected: true },
          // Row C
          { id: 'C1', heat: 'critical', pct: '91%', sku: 'SKU-LENS-OPT (45 pcs)' },
          { id: 'C2', heat: 'low',      pct: '45%', sku: 'SKU-LENS-OPT (22 pcs)' },
          { id: 'C3', heat: 'medium',   pct: '84%', sku: 'SKU-LENS-OPT (42 pcs)' },
          { id: 'C4', heat: 'critical', pct: '93%', sku: 'SKU-LENS-OPT (46 pcs)' },
          { id: 'C5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C6', heat: 'medium',   pct: '70%', sku: 'SKU-BLK-99 (35 pcs)' },
          { id: 'C7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C8', heat: 'low',      pct: '30%', sku: 'SKU-BLK-99 (15 pcs)' },
          // Row D (New Row 4)
          { id: 'D1', heat: 'medium',   pct: '68%', sku: 'SKU-IND-PUMP (34 pcs)' },
          { id: 'D2', heat: 'critical', pct: '95%', sku: 'SKU-IND-PUMP (47 pcs)' },
          { id: 'D3', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D4', heat: 'low',      pct: '38%', sku: 'SKU-ELEC-KIT (19 pcs)' },
          { id: 'D5', heat: 'medium',   pct: '82%', sku: 'SKU-ELEC-KIT (41 pcs)' },
          { id: 'D6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D7', heat: 'critical', pct: '92%', sku: 'SKU-HEAVY-ROL (46 pcs)' },
          { id: 'D8', heat: 'medium',   pct: '58%', sku: 'SKU-HEAVY-ROL (29 pcs)' },
          // Row E (New Row 5)
          { id: 'E1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E2', heat: 'low',      pct: '40%', sku: 'SKU-FMCG-TEA (20 pcs)' },
          { id: 'E3', heat: 'medium',   pct: '74%', sku: 'SKU-FMCG-TEA (37 pcs)' },
          { id: 'E4', heat: 'critical', pct: '96%', sku: 'SKU-FMCG-TEA (48 pcs)' },
          { id: 'E5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E6', heat: 'low',      pct: '25%', sku: 'SKU-SOL-DRV (12 pcs)' },
          { id: 'E7', heat: 'medium',   pct: '66%', sku: 'SKU-SOL-DRV (33 pcs)' },
          { id: 'E8', heat: 'critical', pct: '90%', sku: 'SKU-SOL-DRV (45 pcs)' },
          // Row F (New Row 6)
          { id: 'F1', heat: 'low',      pct: '32%', sku: 'SKU-BULK-OIL (16 pcs)' },
          { id: 'F2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F3', heat: 'medium',   pct: '85%', sku: 'SKU-BULK-OIL (42 pcs)' },
          { id: 'F4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F5', heat: 'low',      pct: '48%', sku: 'SKU-TUBE-PVC (24 pcs)' },
          { id: 'F6', heat: 'medium',   pct: '62%', sku: 'SKU-TUBE-PVC (31 pcs)' },
          { id: 'F7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F8', heat: 'low',      pct: '18%', sku: 'SKU-TUBE-PVC (9 pcs)' }
        ]
      },
      2: {
        name: 'Floor 2 (Mezzanine)',
        badge: '72% OCCUPIED',
        badgeClass: 'bg-[#FFFBEB] text-[#D97706]',
        meta: 'Floor 2 · Fast-Moving Carton Shelves · 34/48 Slots Used (14 Empty)',
        selectedSlot: 'B8',
        slots: [
          // Row A
          { id: 'A1', heat: 'medium',   pct: '65%', sku: 'SKU-ACC-01 (32 pcs)' },
          { id: 'A2', heat: 'medium',   pct: '70%', sku: 'SKU-ACC-02 (35 pcs)' },
          { id: 'A3', heat: 'low',      pct: '40%', sku: 'SKU-ACC-03 (20 pcs)' },
          { id: 'A4', heat: 'medium',   pct: '68%', sku: 'SKU-ACC-04 (34 pcs)' },
          { id: 'A5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A7', heat: 'medium',   pct: '72%', sku: 'SKU-ACC-05 (36 pcs)' },
          { id: 'A8', heat: 'low',      pct: '45%', sku: 'SKU-ACC-06 (22 pcs)' },
          // Row B
          { id: 'B1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B2', heat: 'medium',   pct: '60%', sku: 'SKU-FMCG-08 (30 pcs)' },
          { id: 'B3', heat: 'medium',   pct: '75%', sku: 'SKU-FMCG-09 (37 pcs)' },
          { id: 'B4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B5', heat: 'low',      pct: '35%', sku: 'SKU-FMCG-10 (18 pcs)' },
          { id: 'B6', heat: 'medium',   pct: '64%', sku: 'SKU-FMCG-11 (32 pcs)' },
          { id: 'B7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B8', heat: 'medium',   pct: '72%', sku: 'SKU-FMCG-12 (36 pcs)', selected: true },
          // Row C
          { id: 'C1', heat: 'low',      pct: '40%', sku: 'SKU-SPARE-01 (20 pcs)' },
          { id: 'C2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C3', heat: 'medium',   pct: '62%', sku: 'SKU-SPARE-02 (31 pcs)' },
          { id: 'C4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C6', heat: 'low',      pct: '38%', sku: 'SKU-SPARE-03 (19 pcs)' },
          { id: 'C7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          // Row D
          { id: 'D1', heat: 'medium',   pct: '65%', sku: 'SKU-CART-01 (32 pcs)' },
          { id: 'D2', heat: 'low',      pct: '42%', sku: 'SKU-CART-02 (21 pcs)' },
          { id: 'D3', heat: 'medium',   pct: '78%', sku: 'SKU-CART-03 (39 pcs)' },
          { id: 'D4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D5', heat: 'low',      pct: '30%', sku: 'SKU-CART-04 (15 pcs)' },
          { id: 'D6', heat: 'medium',   pct: '74%', sku: 'SKU-CART-05 (37 pcs)' },
          { id: 'D7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D8', heat: 'low',      pct: '48%', sku: 'SKU-CART-06 (24 pcs)' },
          // Row E
          { id: 'E1', heat: 'medium',   pct: '70%', sku: 'SKU-PACK-01 (35 pcs)' },
          { id: 'E2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E3', heat: 'medium',   pct: '66%', sku: 'SKU-PACK-02 (33 pcs)' },
          { id: 'E4', heat: 'low',      pct: '35%', sku: 'SKU-PACK-03 (17 pcs)' },
          { id: 'E5', heat: 'medium',   pct: '75%', sku: 'SKU-PACK-04 (37 pcs)' },
          { id: 'E6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E7', heat: 'low',      pct: '25%', sku: 'SKU-PACK-05 (12 pcs)' },
          { id: 'E8', heat: 'medium',   pct: '80%', sku: 'SKU-PACK-06 (40 pcs)' },
          // Row F
          { id: 'F1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F2', heat: 'low',      pct: '30%', sku: 'SKU-BIN-01 (15 pcs)' },
          { id: 'F3', heat: 'medium',   pct: '64%', sku: 'SKU-BIN-02 (32 pcs)' },
          { id: 'F4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F5', heat: 'low',      pct: '45%', sku: 'SKU-BIN-03 (22 pcs)' },
          { id: 'F6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F7', heat: 'medium',   pct: '72%', sku: 'SKU-BIN-04 (36 pcs)' },
          { id: 'F8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' }
        ]
      },
      3: {
        name: 'Floor 3 (Upper Deck)',
        badge: '38% OCCUPIED',
        badgeClass: 'bg-[#ECFDF5] text-[#059669]',
        meta: 'Floor 3 · Bulk & Seasonal Overstock · 18/48 Slots Used (30 Empty)',
        selectedSlot: 'B8',
        slots: [
          // Row A
          { id: 'A1', heat: 'low',      pct: '30%', sku: 'SKU-BULK-01 (15 pcs)' },
          { id: 'A2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A3', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A4', heat: 'low',      pct: '42%', sku: 'SKU-BULK-02 (21 pcs)' },
          { id: 'A5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'A8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          // Row B
          { id: 'B1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B2', heat: 'low',      pct: '35%', sku: 'SKU-OVER-01 (18 pcs)' },
          { id: 'B3', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B5', heat: 'low',      pct: '44%', sku: 'SKU-OVER-02 (22 pcs)' },
          { id: 'B6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'B8', heat: 'low',      pct: '40%', sku: 'SKU-OVER-03 (20 pcs)', selected: true },
          // Row C
          { id: 'C1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C3', heat: 'low',      pct: '28%', sku: 'SKU-SEAS-01 (14 pcs)' },
          { id: 'C4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'C8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          // Row D
          { id: 'D1', heat: 'low',      pct: '32%', sku: 'SKU-RES-01 (16 pcs)' },
          { id: 'D2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D3', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D4', heat: 'low',      pct: '25%', sku: 'SKU-RES-02 (12 pcs)' },
          { id: 'D5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'D7', heat: 'low',      pct: '36%', sku: 'SKU-RES-03 (18 pcs)' },
          { id: 'D8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          // Row E
          { id: 'E1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E3', heat: 'low',      pct: '20%', sku: 'SKU-ARCH-01 (10 pcs)' },
          { id: 'E4', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E6', heat: 'low',      pct: '34%', sku: 'SKU-ARCH-02 (17 pcs)' },
          { id: 'E7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'E8', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          // Row F
          { id: 'F1', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F2', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F3', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F4', heat: 'low',      pct: '15%', sku: 'SKU-SLOW-01 (7 pcs)' },
          { id: 'F5', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F6', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F7', heat: 'empty',    pct: '0%',  sku: 'Available Empty Shelf' },
          { id: 'F8', heat: 'low',      pct: '18%', sku: 'SKU-SLOW-02 (9 pcs)' }
        ]
      }
    };

    let currentStorey = 1;

    function changeStorey(num) {
      currentStorey = num;
      const data = storeyData[num];
      if (!data) return;

      // Update button & floor row styles
      [1, 2, 3].forEach(n => {
        const btn = document.getElementById('storey-btn-' + n);
        if (btn) {
          if (n === num) {
            btn.className = 'px-3 py-1.5 rounded-lg bg-white text-[#1F2937] font-bold text-[12px] shadow-xs cursor-pointer transition-all';
          } else {
            btn.className = 'px-3 py-1.5 rounded-lg text-[#6B7280] hover:text-[#1F2937] font-medium text-[12px] cursor-pointer transition-all';
          }
        }
        const row = document.getElementById('floor-row-' + n);
        if (row) {
          if (n === num) {
            row.className = 'p-2.5 rounded-xl border border-[#D84E55] bg-[#FEF2F2] cursor-pointer hover:border-[#D84E55] transition-all flex items-center justify-between';
          } else {
            row.className = 'p-2.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] cursor-pointer hover:border-[#D84E55] transition-all flex items-center justify-between';
          }
        }
      });

      // Update badge & metadata
      const badge = document.getElementById('storey-badge');
      if (badge) {
        badge.textContent = data.badge;
        badge.className = 'px-2.5 py-0.5 rounded-full font-bold text-[11px] font-arial ' + data.badgeClass;
      }

      const meta = document.getElementById('storey-meta');
      if (meta) meta.textContent = data.meta;

      // Render slots
      const container = document.getElementById('floor-grid-container');
      if (!container) return;
      container.innerHTML = '';

      data.slots.forEach(slot => {
        const slotEl = document.createElement('div');
        let heatClass = '';
        if (slot.heat === 'critical') {
          heatClass = 'bg-[#EF4444] text-white font-bold border border-[#DC2626] shadow-2xs';
        } else if (slot.heat === 'medium') {
          heatClass = 'bg-[#F59E0B] text-white font-bold border border-[#D97706] shadow-2xs';
        } else if (slot.heat === 'low') {
          heatClass = 'bg-[#10B981] text-white font-bold border border-[#059669] shadow-2xs';
        } else {
          heatClass = 'bg-white border-2 border-dashed border-[#CBD5E1] text-[#64748B] hover:border-[#10B981]';
        }

        const isSelected = slot.selected ? 'ring-2 ring-offset-1 ring-[#D84E55] scale-105' : '';
        slotEl.className = `floor-slot h-9 rounded-lg flex items-center justify-center text-[12px] cursor-pointer transition-all hover:scale-105 select-none ${heatClass} ${isSelected}`;
        slotEl.id = `slot-box-${slot.id}`;
        slotEl.textContent = slot.id;

        // Parse SKU and Quantity for Hover Tooltip
        const isAvailable = slot.heat === 'empty' || slot.pct === '0%';
        let skuName = 'Empty Shelf';
        let qtyVal = '0 pcs';
        if (!isAvailable && slot.sku) {
          const match = slot.sku.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            skuName = match[1];
            qtyVal = match[2];
          } else {
            skuName = slot.sku;
            qtyVal = 'Verified';
          }
        }
        const occText = isAvailable ? '0% (Available)' : `${slot.pct} occupied`;

        slotEl.onmouseenter = function(e) {
          showSlotTooltip(e, slot.id, occText, skuName, qtyVal, slot.heat);
        };
        slotEl.onmousemove = function(e) {
          moveSlotTooltip(e);
        };
        slotEl.onmouseleave = function() {
          hideSlotTooltip();
        };

        slotEl.onclick = function() {
          hideSlotTooltip();
          selectHeatSlot(num, slot.id, slot.heat, slot.pct, slot.sku);
          openSlotDetailModal(num, slot.id, slot.heat, slot.pct, slot.sku);
        };

        container.appendChild(slotEl);
      });
    }

    function showSlotTooltip(e, slotId, occ, sku, qty, heat) {
      const tt = document.getElementById('slot-tooltip');
      if (!tt) return;
      document.getElementById('tt-slot').textContent = `Slot ${slotId}`;
      const occEl = document.getElementById('tt-occ');
      occEl.textContent = occ;
      if (heat === 'critical') {
        occEl.className = 'text-[#EF4444] px-2 py-0.5 rounded bg-[#374151] text-[11px] font-bold';
      } else if (heat === 'medium') {
        occEl.className = 'text-[#F59E0B] px-2 py-0.5 rounded bg-[#374151] text-[11px] font-bold';
      } else if (heat === 'low') {
        occEl.className = 'text-[#10B981] px-2 py-0.5 rounded bg-[#374151] text-[11px] font-bold';
      } else {
        occEl.className = 'text-[#9CA3AF] px-2 py-0.5 rounded bg-[#374151] text-[11px] font-bold';
      }
      document.getElementById('tt-sku').textContent = sku;
      document.getElementById('tt-qty').textContent = qty;
      tt.classList.remove('hidden');
      moveSlotTooltip(e);
    }

    function moveSlotTooltip(e) {
      const tt = document.getElementById('slot-tooltip');
      if (!tt) return;
      const ttWidth = tt.offsetWidth || 210;
      const ttHeight = tt.offsetHeight || 90;
      let x = e.clientX + 14;
      let y = e.clientY + 14;
      if (x + ttWidth > window.innerWidth - 10) {
        x = e.clientX - ttWidth - 14;
      }
      if (y + ttHeight > window.innerHeight - 10) {
        y = e.clientY - ttHeight - 14;
      }
      tt.style.left = x + 'px';
      tt.style.top = y + 'px';
    }

    function hideSlotTooltip() {
      const tt = document.getElementById('slot-tooltip');
      if (tt) tt.classList.add('hidden');
    }

    function selectHeatSlot(storeyNum, slotId, heat, pct, sku) {
      document.querySelectorAll('#floor-grid-container .floor-slot').forEach(el => {
        el.classList.remove('ring-2', 'ring-offset-1', 'ring-[#D84E55]', 'scale-105');
      });
      const activeEl = document.getElementById('slot-box-' + slotId);
      if (activeEl) {
        activeEl.classList.add('ring-2', 'ring-offset-1', 'ring-[#D84E55]', 'scale-105');
      }
      updateSlotInspector(storeyNum, slotId, heat, pct, sku);
    }

    function updateSlotInspector(storeyNum, slotId, heat, pct, sku) {
      const nameEl = document.getElementById('slot-name');
      const skuEl = document.getElementById('slot-sku');
      const storey = storeyData[storeyNum];
      if (nameEl && storey) {
        nameEl.textContent = `${slotId} (${storey.name} · Zone ${slotId.charAt(0)})`;
      }
      if (skuEl) {
        const heatLabel = heat === 'empty' ? 'Available' : `${pct} occupied`;
        skuEl.textContent = `${sku} · ${heatLabel}`;
      }
    }

    function closeInwardPendingModal() {
      const modal = document.getElementById('inward-pending-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function openInwardPendingModal(orderId) {
      const modal = document.getElementById('inward-pending-modal');
      if (!modal) return;

      const order = inwardOrdersList.find(o => o.id === orderId) || {
        id: orderId,
        transporter: 'Transporter Fleet',
        sku: 'Commercial Goods',
        qty: '1,000 units',
        stageNum: 1,
        stageName: 'Stage 1 · Expected Cargo',
        bay: 'Dock Bay 02',
        isPending: true,
        pendingDetail: 'Arrival check-in and de-stuffing pending.'
      };

      const stageNum = order.stageNum || 1;

      const subEl = document.getElementById('inward-pending-modal-subtitle');
      if (subEl) subEl.textContent = `${order.id} · ${order.transporter} (${order.sku})`;

      const stageEl = document.getElementById('inward-pending-modal-stage');
      if (stageEl) stageEl.textContent = order.stageName || `Stage ${stageNum}`;

      const locEl = document.getElementById('inward-pending-modal-location');
      if (locEl) locEl.textContent = order.bay || 'Assigned Dock Bay';

      const badgeEl = document.getElementById('inward-pending-modal-status-badge');
      if (badgeEl) {
        badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]';
        badgeEl.textContent = 'Pending';
      }

      const summaryEl = document.getElementById('inward-pending-modal-summary');
      if (summaryEl) {
        if (order.pendingDetail) {
          summaryEl.textContent = order.pendingDetail;
        } else if (stageNum === 1) {
          summaryEl.textContent = 'Truck is in transit to warehouse gate. Gate pass entry, dock bay allocation, cargo de-stuffing, QC inspection, and driver delivery challan signature are pending before Proof of Delivery (POD) is issued.';
        } else if (stageNum === 2) {
          summaryEl.textContent = 'Truck is positioned at dock bay. Unloading workforce assignment, pallet offloading, physical barcode scan, and QC inspection are pending before Proof of Delivery (POD) can be completed.';
        } else if (stageNum === 3) {
          summaryEl.textContent = 'Cargo is currently being offloaded and de-stuffed from the truck. Pallet count verification, physical damage inspection, serialization scanning, and authorized receipt signing are pending.';
        } else if (stageNum === 4) {
          summaryEl.textContent = 'Consignment is undergoing physical QC inspection and piece verification. Barcode scanning calibration and supervisor POD signature are pending.';
        } else {
          summaryEl.textContent = 'Intake processing and verification steps are pending before Proof of Delivery is finalized.';
        }
      }

      const milestones = [
        { num: 1, name: '1. Advance Shipping Notice (ASN) & Manifest Sync', detail: 'Electronic manifest and e-Way bill synchronized with WMS' },
        { num: 2, name: '2. Security Gate Entry & Bay Docking', detail: 'Truck check-in, gate pass issued, vehicle parked at assigned bay' },
        { num: 3, name: '3. Cargo Unloading & Pallet De-stuffing', detail: 'Physical cargo offloading from vehicle onto dock staging area' },
        { num: 4, name: '4. QC Inspection & Seal Verification', detail: 'Tamper-evident seal match, piece count & physical damage check' },
        { num: 5, name: '5. Signed Proof of Delivery (POD) & GRN Generation', detail: 'Supervisor sign-off, transporter copy stamped, Goods Receipt Note created' },
        { num: 6, name: '6. Warehouse Rack Putaway', detail: 'Reach truck transit and slotting into designated warehouse storage rack' }
      ];

      const milestonesContainer = document.getElementById('inward-pending-modal-milestones');
      if (milestonesContainer) {
        milestonesContainer.innerHTML = '';
        milestones.forEach(m => {
          let statusBadge = '';
          let icon = '';
          let bgClass = 'bg-white border-gray-200 text-gray-700';

          const currentMilestone = stageNum;
          if (m.num < currentMilestone) {
            bgClass = 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]';
            icon = `<span class="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>`;
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#047857] text-[10px] font-bold font-arial">COMPLETED</span>`;
          } else if (m.num === currentMilestone) {
            bgClass = 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E] shadow-2xs';
            icon = `<span class="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 animate-pulse">●</span>`;
            statusBadge = `<span class="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold font-arial flex items-center gap-1 border border-[#FCD34D]"><span class="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span> IN PROGRESS</span>`;
          } else {
            bgClass = 'bg-gray-50 border-gray-200 text-gray-400';
            icon = `<span class="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">○</span>`;
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-semibold font-arial">UPCOMING</span>`;
          }

          const div = document.createElement('div');
          div.className = `flex items-center justify-between p-2.5 rounded-xl border ${bgClass} text-[12px] transition-all`;
          div.innerHTML = `
            <div class="flex items-center gap-2.5">
              ${icon}
              <div>
                <strong class="block leading-tight text-[12.5px]">${m.name}</strong>
                <span class="text-[11px] opacity-80 block">${m.detail}</span>
              </div>
            </div>
            <div>${statusBadge}</div>
          `;
          milestonesContainer.appendChild(div);
        });
      }

      const inspectBtn = document.getElementById('inward-pending-modal-inspect-btn');
      if (inspectBtn) {
        inspectBtn.onclick = () => {
          closeInwardPendingModal();
          openInwardOrderDetail(order.id);
        };
      }

      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeDispatchPendingModal() {
      const modal = document.getElementById('dispatch-pending-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function openDispatchPendingModal(orderId) {
      const modal = document.getElementById('dispatch-pending-modal');
      if (!modal) return;

      const facility = warehouseOutwardData[currentFacilityName] || warehouseOutwardData['WH-01 Bhiwandi'];
      let order = null;
      let isIssue = false;

      if (facility) {
        if (facility.issues) {
          order = facility.issues.find(iss => iss.orderId === orderId);
          if (order) isIssue = true;
        }
        if (!order && facility.normalOrders) {
          order = facility.normalOrders.find(o => o.orderId === orderId);
        }
      }

      if (!order && window.outwardIssuesRegistry && window.outwardIssuesRegistry[orderId]) {
        order = window.outwardIssuesRegistry[orderId];
        isIssue = true;
      }

      if (!order) {
        order = {
          orderId: orderId,
          customer: 'Customer Destination',
          cargo: 'Commercial Goods',
          stageNum: 2,
          stage: '2. Wave Picking',
          dockBay: 'Zone A, Aisle 01'
        };
      }

      const stageNum = order.stageNum || (isIssue ? 5 : 2);

      const subEl = document.getElementById('pending-modal-subtitle');
      if (subEl) subEl.textContent = `${order.orderId} · ${order.customer}`;

      const stageEl = document.getElementById('pending-modal-stage');
      if (stageEl) stageEl.textContent = order.stage || `Stage ${stageNum}`;

      const locEl = document.getElementById('pending-modal-location');
      if (locEl) locEl.textContent = order.dockBay || order.picker || 'Assigned Fulfillment Zone';

      const badgeEl = document.getElementById('pending-modal-status-badge');
      if (badgeEl) {
        if (isIssue) {
          badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]';
          badgeEl.textContent = 'Pending (Issue Blocked)';
        } else {
          badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold font-arial bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]';
          badgeEl.textContent = 'Pending';
        }
      }

      const summaryEl = document.getElementById('pending-modal-summary');
      if (summaryEl) {
        if (isIssue) {
          summaryEl.textContent = `Action Required: ${order.reason || 'Consignee e-way bill mismatch; manual e-way bill regen required'}. Transporter truck waiting at outbound gate. Carrier handover and signed Proof of Dispatch are on hold pending resolution.`;
        } else if (stageNum === 1) {
          summaryEl.textContent = 'Order is awaiting wave release to floor pickers. Physical picking, packing, QC validation, dock staging, and carrier handover must be completed before Proof of Dispatch is issued.';
        } else if (stageNum === 2) {
          summaryEl.textContent = 'Picker is currently retrieving cargo from warehouse bins. Sorting, packing, QC inspection, dock bay staging, and carrier handover are pending before Proof of Dispatch is issued.';
        } else if (stageNum === 3) {
          summaryEl.textContent = 'Cartons are at pack desk for bubble wrapping and sealing. Weighing check, dock bay staging, and carrier handover are pending.';
        } else if (stageNum === 4) {
          summaryEl.textContent = 'Consignment is undergoing weight calibration and QC scan. Outbound dock staging and carrier handover are pending.';
        } else if (stageNum === 5) {
          summaryEl.textContent = 'Consignment is staged at dock bay awaiting carrier pickup. Driver vehicle check and signed gate pass are required to complete Proof of Dispatch.';
        } else {
          summaryEl.textContent = 'Fulfillment steps are in progress across the warehouse floor before carrier handover.';
        }
      }

      const milestones = [
        { num: 1, name: '1. Order Received & Manifest Sync', detail: 'ASN validated and synced with WMS' },
        { num: 2, name: '2. Wave Picking from Bins', detail: 'Items retrieved from rack bin locations' },
        { num: 3, name: '3. Sorting & Packing', detail: 'Protective packaging & tamper-evident taping' },
        { num: 4, name: '4. QC & Weighing', detail: 'Gross weight calibration & dimension check' },
        { num: 5, name: '5. Staged at Dock Bay', detail: 'Consolidated at outbound gate bay for carrier' },
        { num: 6, name: '6. Carrier Handover & Signed POD', detail: 'Final carrier transfer & signed delivery receipt' }
      ];

      const milestonesContainer = document.getElementById('pending-modal-milestones');
      if (milestonesContainer) {
        milestonesContainer.innerHTML = milestones.map(m => {
          let statusTag = '';
          let rowBg = 'bg-gray-50/60 border-gray-100';

          if (m.num < stageNum) {
            statusTag = '<span class="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-md">Done</span>';
            rowBg = 'bg-[#F0FDF4]/50 border-[#DCFCE7]';
          } else if (m.num === stageNum) {
            if (isIssue) {
              statusTag = '<span class="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-md">Action Required</span>';
              rowBg = 'bg-[#FEF2F2]/60 border-[#FECACA]';
            } else {
              statusTag = '<span class="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md">In Progress</span>';
              rowBg = 'bg-[#EFF6FF]/60 border-[#BFDBFE]';
            }
          } else {
            statusTag = '<span class="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">Pending</span>';
          }

          return `
            <div class="flex items-center justify-between p-2.5 rounded-xl border ${rowBg} text-[12px]">
              <div>
                <strong class="text-[#1F2937] block leading-tight">${m.name}</strong>
                <span class="text-[10.5px] text-[#6B7280] block">${m.detail}</span>
              </div>
              <div>${statusTag}</div>
            </div>
          `;
        }).join('');
      }

      const inspectBtn = document.getElementById('pending-modal-inspect-btn');
      if (inspectBtn) {
        inspectBtn.onclick = () => {
          closeDispatchPendingModal();
          if (isIssue) {
            openOutwardIssueModal(order.orderId);
          } else {
            openOutwardOrderDetail(order.orderId);
          }
        };
      }

      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function openPodModal() {
      const modal = document.getElementById('pod-modal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    
    function openOutwardPodModal() {
      const modal = document.getElementById('outward-pod-modal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeOutwardPodModal() {
      const modal = document.getElementById('outward-pod-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function closePodModal() {
      const modal = document.getElementById('pod-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    }
  
    // Introductory Splash Screen Controller
    let splashDismissed = false;
    function dismissSplashScreen() {
      if (splashDismissed) return;
      splashDismissed = true;
      const splash = document.getElementById('intro-splash-screen');
      if (splash) {
        splash.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          splash.remove();
        }, 700);
      }
    }

    function startSplashCountdown() {
      const splash = document.getElementById('intro-splash-screen');
      if (!splash) return;
      const duration = 4000; // 4 seconds preview
      const startTime = Date.now();
      const progressEl = document.getElementById('splash-progress');
      const timerText = document.getElementById('splash-timer-text');

      const interval = setInterval(() => {
        if (splashDismissed) {
          clearInterval(interval);
          return;
        }
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
        const pct = Math.min(100, (elapsed / duration) * 100);

        if (progressEl) progressEl.style.width = pct + '%';
        if (timerText) timerText.textContent = `Opening dashboard in ${remaining}s...`;

        if (elapsed >= duration) {
          clearInterval(interval);
          dismissSplashScreen();
        }
      }, 50);
    }

    // Initialize Floor Map Storey 1 Heat Map & Direct Dashboard Load
    window.addEventListener('DOMContentLoaded', function() {
      if (typeof changeStorey === 'function') changeStorey(1);

      if (typeof openInwardOrderDetail === 'function') openInwardOrderDetail('ORD-IN-8821');
      if (typeof openOutwardOrderDetail === 'function') openOutwardOrderDetail('ORD-OUT-4521');
      if (typeof renderInwardTable === 'function') renderInwardTable();
      if (typeof renderOutwardJourney === 'function') renderOutwardJourney(currentFacilityName);
      goToScreen(1);

    });


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


    // ==============================================
    // STAGE DEFINITIONS (Plain Everyday English, No Jargon)
    // ==============================================
    const STAGE_DEFINITIONS = {
      inward: {
        1: {
          category: 'Inward Stage 1',
          title: '1. Expected',
          desc: 'Goods are on their way. The supplier or delivery truck is traveling on the road to the warehouse, but has not arrived at the gate yet.',
          action: 'The warehouse team monitors the arrival schedule to assign a dock unloading bay as soon as the vehicle pulls up.'
        },
        2: {
          category: 'Inward Stage 2',
          title: '2. At Dock',
          desc: 'The delivery truck has reached the warehouse and is safely parked at the gate bay, waiting to be unloaded.',
          action: 'The driver checks in their invoice and gate papers while dock workers prepare to open the vehicle.'
        },
        3: {
          category: 'Inward Stage 3',
          title: '3. Unloading',
          desc: 'Warehouse workers are physically taking the boxes and cargo items out of the truck and placing them on the ground floor.',
          action: 'Workers and forklifts unload pallets, count carton boxes, and arrange them neatly in the intake staging area.'
        },
        4: {
          category: 'Inward Stage 4',
          title: '4. QC & POD (Quality Check & Delivery Receipt)',
          desc: 'Checking the items to make sure nothing is broken or missing, and signing the delivery receipt for the driver.',
          action: 'Inspectors check carton conditions against the manifest bill. Once verified, the delivery slip (POD) is signed and stamped.'
        },
        5: {
          category: 'Inward Stage 5',
          title: '5. Putaway',
          desc: 'Moving the checked boxes and items to their final shelves and storage racks inside the warehouse.',
          action: 'Forklifts and pickers scan barcodes and place goods into designated storage racks so they can be quickly found later.'
        },
        6: {
          category: 'Inward Stage 6',
          title: '6. Stored',
          desc: 'Items are safely stored on warehouse shelves, ready to be picked and sold whenever a customer places an order.',
          action: 'Stock is officially entered into the warehouse inventory system and is ready for customer orders.'
        }
      },
      outward: {
        1: {
          category: 'Outward Stage 1',
          title: '1. Order Received',
          desc: 'A customer placed an order. It is confirmed and waiting in line for warehouse staff to start gathering the items.',
          action: 'The system creates an order pick-list and assigns it to the warehouse floor team.'
        },
        2: {
          category: 'Outward Stage 2',
          title: '2. Wave Picking',
          desc: 'Workers walk through the warehouse aisles to find and collect the ordered items from the shelves.',
          action: 'Pickers follow a route map with handheld barcode scanners to take items off the shelves and place them into pick carts.'
        },
        3: {
          category: 'Outward Stage 3',
          title: '3. Sorting & Packing',
          desc: 'Collected items are brought together, safely wrapped with bubble wrap, and packed into courier boxes.',
          action: 'Packers box the items securely, tape the cartons shut, and stick shipping address labels on the outside.'
        },
        4: {
          category: 'Outward Stage 4',
          title: '4. QC & Weighing',
          desc: 'Weighing the packed parcel and double-checking that the right items are inside before shipping.',
          action: 'The box is weighed on a digital scale to ensure package weight matches the shipping invoice.'
        },
        5: {
          category: 'Outward Stage 5',
          title: '5. Staged at Dock',
          desc: 'Packed boxes are placed near the warehouse exit gate, ready for the delivery truck to load them.',
          action: 'Boxes are stacked by transport route while security prepares the gate pass for the outbound vehicle.'
        },
        6: {
          category: 'Outward Stage 6',
          title: '6. Dispatched & POD',
          desc: 'The truck has picked up the order, carried it to the customer, and delivered it with a signed proof of delivery receipt.',
          action: 'The customer has received their goods and signed the delivery receipt (POD), successfully completing the order.'
        }
      }
    };

    window.showStageDefinition = function(type, stageNum) {
      const stageData = STAGE_DEFINITIONS[type] && STAGE_DEFINITIONS[type][stageNum];
      if (!stageData) return;

      const modal = document.getElementById('stage-info-modal');
      const catEl = document.getElementById('stage-info-category');
      const titleEl = document.getElementById('stage-info-title');
      const descEl = document.getElementById('stage-info-desc');
      const actEl = document.getElementById('stage-info-action');

      if (catEl) catEl.textContent = stageData.category;
      if (titleEl) titleEl.textContent = stageData.title;
      if (descEl) descEl.textContent = stageData.desc;
      if (actEl) actEl.textContent = stageData.action;

      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeStageDefinitionModal = function(e) {
      if (e && e.target && e.target.id !== 'stage-info-modal' && !e.target.closest('button')) {
        return;
      }
      const modal = document.getElementById('stage-info-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const stageModal = document.getElementById('stage-info-modal');
        if (stageModal && !stageModal.classList.contains('hidden')) {
          closeStageDefinitionModal();
        }
        const slotLocModal = document.getElementById('slot-location-modal');
        if (slotLocModal && !slotLocModal.classList.contains('hidden')) {
          closeSlotLocationModal();
        }
      }
    });

  // Initialize default stage checklists for inward (Stage 4) and outward (Stage 2)
    setTimeout(() => {
      if (typeof updateInwardStageChecklists === 'function') updateInwardStageChecklists(4);
      if (typeof updateOutwardStageChecklists === 'function') updateOutwardStageChecklists(2);
    }, 50);
  
    // ==============================================
    // METRIC DEFINITIONS & INFO MODAL CONTROLLER
    // ==============================================
    const metricDefinitions = {
      in_out_ratio: {
        title: "1. In : Out Ratio",
        badge: "Balance Metric",
        definition: "The volumetric ratio of incoming inventory (inbound arrivals) compared to shipped goods (outbound dispatches) across all facilities over a rolling cycle.",
        measures: "Measures whether the warehouse network is in volume equilibrium, accumulating excess inventory, or draining faster than replenishment.",
        good: {
          range: "0.9 : 1 to 1.1 : 1 (Balanced)",
          items: [
            "Inflow matches outbound dispatch capacity",
            "Dock bays and receiving lanes remain fluid",
            "No staging overflow or putaway backlogs"
          ]
        },
        bad: {
          range: "> 1.3 : 1 (Heavy) OR < 0.7 : 1 (Depleting)",
          items: [
            "Heavy inflow causes receiving lane congestion",
            "Delayed putaway incurs truck detention fees",
            "Depleting flow risks stockouts and idle lines"
          ]
        }
      },
      days_of_inventory: {
        title: "2. Days of Inventory (DOI)",
        badge: "Runway Metric",
        definition: "The projected number of days current stock on hand will sustain operational demand based on recent sales and consumption velocity.",
        measures: "Measures inventory runway, capital efficiency, stockout vulnerability, and storage carrying cost.",
        good: {
          range: "14 to 25 Days (Optimal Buffer)",
          items: [
            "Healthy buffer protecting against supplier delays",
            "Absorbs unexpected outbound demand surges",
            "Working capital remains liquid and productive"
          ]
        },
        bad: {
          range: "< 10 Days (Stockout) OR > 35 Days (Deadstock)",
          items: [
            "< 10 days triggers order fulfillment failures",
            "> 35 days consumes costly floor storage space",
            "Higher risk of SKU obsolescence and expiry"
          ]
        }
      },
      pick_first_list: {
        title: "3. Pick-First List (FEFO Expiry)",
        badge: "Freshness & Loss Prevention",
        definition: "A live, real-time priority list identifying inventory batches closest to their expiration date to enforce First-Expired, First-Out (FEFO) warehouse protocols.",
        measures: "Measures inventory shelf-life risk, waste minimization, and compliance with perishable goods handling standards.",
        good: {
          range: "0 Batches Expiring in ≤ 4 Days Unassigned",
          items: [
            "All near-expiry inventory assigned to dispatches",
            "Strict First-Expired, First-Out (FEFO) compliance",
            "Zero financial write-offs or stock disposal"
          ]
        },
        bad: {
          range: "Batches Expiring in ≤ 4 Days Sitting Idle",
          items: [
            "Immediate financial write-offs from expired stock",
            "Retail customer returns and rejection penalties",
            "Hazardous disposal costs and regulatory breaches"
          ]
        }
      },
      dock_to_stock: {
        title: "4. Dock-to-Stock Time",
        badge: "Velocity Metric",
        definition: "The elapsed time from when an inbound transport carrier vehicle docks at a bay until all goods are unloaded, verified, QC approved, and binned in storage slots.",
        measures: "Measures inbound throughput agility, dock labor productivity, and how fast received goods become available for customer order picking.",
        good: {
          range: "≤ 4.0 Hours (SLA Compliant)",
          items: [
            "Received cargo becomes pickable within same shift",
            "Fast dock bay turnover clears gates for new trucks",
            "Minimal pallet dwell time in receiving staging"
          ]
        },
        bad: {
          range: "> 5.5 Hours (Severe Inbound Delay)",
          items: [
            "Trucks queue outside yard causing detention fees",
            "Delayed stock availability blocks customer orders",
            "Dock staging lanes become congested and unsafe"
          ]
        }
      },
      on_time_dispatch: {
        title: "5. On-Time Dispatch Rate",
        badge: "Customer Fulfillment SLA",
        definition: "The percentage of scheduled customer outbound orders that are picked, packed, inspected, and loaded onto linehaul carrier trucks before carrier departure cutoffs.",
        measures: "Measures outbound operational punctuality, packing line velocity, and adherence to delivery commitments.",
        good: {
          range: "≥ 95.0% (Benchmark Reliability)",
          items: [
            "Linehaul trailers depart strictly on schedule",
            "Next-day and express delivery SLAs fully met",
            "High customer satisfaction with zero SLA penalties"
          ]
        },
        bad: {
          range: "< 90.0% (Critical Miss Rate)",
          items: [
            "Rolled-over orders create morning dispatch delays",
            "Missed carrier cutoff windows postpone delivery",
            "Financial penalties accrue under client contracts"
          ]
        }
      },
      space_utilization: {
        title: "6. Space Utilization",
        badge: "Capacity Metric",
        definition: "The percentage of total physical pallet rack slots, bin storage locations, and cubic floor capacity currently occupied by stored inventory across the warehouse.",
        measures: "Measures physical storage efficiency and remaining buffer capacity for incoming shipments.",
        good: {
          range: "70% to 85% (Optimal Storage Band)",
          items: [
            "High warehouse storage density and asset utilization",
            "15–30% buffer prevents aisle congestion",
            "Forklifts move freely with fast bin access"
          ]
        },
        bad: {
          range: "> 90% (Gridlock) OR < 60% (Under-utilized)",
          items: [
            "> 90% causes staging gridlock and double handling",
            "Blocked high-bay racks slow down forklift travel",
            "< 60% wastes facility rent without revenue offset"
          ]
        }
      },
      labour_equipment: {
        title: "7. Labour & Equipment Utilization",
        badge: "Productivity Metric",
        definition: "The proportion of scheduled shift labor hours and active Material Handling Equipment (reach trucks, forklifts, BOPTs) actively engaged in productive operational tasks.",
        measures: "Measures workforce productivity, equipment availability, and cost per unit moved.",
        good: {
          range: "75% to 85% (Optimal Productivity)",
          items: [
            "Balanced workload across pickers and drivers",
            "Buffers preserved for battery swaps and checks",
            "Steady operating pace minimizes safety incidents"
          ]
        },
        bad: {
          range: "> 92% (Overstressed) OR < 65% (Idle Cost)",
          items: [
            "> 92% triggers operator fatigue and breakdowns",
            "Mid-shift battery drain causes equipment stoppages",
            "< 65% inflates labor handling cost per carton"
          ]
        }
      },
      dock_turnaround: {
        title: "8. Dock Turnaround Time (TAT)",
        badge: "Yard Management Metric",
        definition: "The total elapsed duration a transport vehicle spends on facility grounds from security gate check-in, bay docking, loading/unloading, to security gate pass release.",
        measures: "Measures yard management efficiency, dock bay turnover rate, and carrier driver dwell time.",
        good: {
          range: "≤ 45 Minutes (Fast Dwell)",
          items: [
            "Rapid vehicle turnover from gate-in to gate-out",
            "Zero transporter waiting or demurrage penalties",
            "Maximum yard gate throughput during peak volume"
          ]
        },
        bad: {
          range: "> 60 Minutes (Yard Congestion)",
          items: [
            "Vehicles spill onto external roadways causing queues",
            "Transporter disputes and demurrage claims accrue",
            "Downstream unloading and loading shifts stall"
          ]
        }
      },
      inbound_stage_duration: {
        title: "Inward Stage Duration",
        badge: "Journey Milestone Analysis",
        definition: "Detailed cycle time breakdown across the 6 sequential inward milestones matching the warehouse floor: Expected, At Dock, Unloading, QC & POD, Putaway, and Stored.",
        measures: "Measures exact stage-by-stage friction points in the inward flow compared against network standard SLA benchmarks.",
        good: {
          range: "All Stages within SLA (Total ≤ 4.7h)",
          items: [
            "Continuous flow from Expected arrival to Stored",
            "No idle staging pallets in unloading or QC bays",
            "Immediate inventory availability in WMS"
          ]
        },
        bad: {
          range: "Total > 5.5h (or Any Stage > 1.5x SLA)",
          items: [
            "Putaway delays freeze dock receiving capacity",
            "QC inspection backlogs delay order readiness",
            "Trucks face extended gate dwell times"
          ]
        }
      },
      outbound_stage_duration: {
        title: "Outward Stage Duration",
        badge: "Journey Milestone Analysis",
        definition: "Detailed cycle time breakdown across the 6 sequential outward milestones matching the warehouse floor: Order Received, Wave Picking, Sorting & Packing, QC & Weighing, Staged at Dock, and Dispatched & POD.",
        measures: "Measures order processing velocity through the fulfillment pipeline to ensure carrier departure cutoffs are met.",
        good: {
          range: "All Stages within SLA (Total ≤ 2.6h)",
          items: [
            "Order waves picked and packed ahead of cutoffs",
            "Packing tables run continuously without jams",
            "Staged orders ready as linehaul trailers dock"
          ]
        },
        bad: {
          range: "Total > 3.2h (or Wave Picking Lag > 1.0h)",
          items: [
            "Wave picking bottlenecks starve packing desks",
            "Orders miss linehaul carrier departure cutoffs",
            "Delayed shipments roll over to next delivery cycle"
          ]
        }
      }
    };

    function showMetricInfoModal(metricKey) {
      const data = metricDefinitions[metricKey];
      if (!data) return;
      
      const titleEl = document.getElementById('metric-info-title');
      const badgeEl = document.getElementById('metric-info-badge');
      const defEl = document.getElementById('metric-info-definition');
      const goodRangeEl = document.getElementById('metric-info-good-range');
      const goodListEl = document.getElementById('metric-info-good-list');
      const badRangeEl = document.getElementById('metric-info-bad-range');
      const badListEl = document.getElementById('metric-info-bad-list');

      if (titleEl) titleEl.textContent = data.title;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (defEl) defEl.textContent = data.definition + ' ' + data.measures;
      if (goodRangeEl) goodRangeEl.textContent = data.good.range;
      if (badRangeEl) badRangeEl.textContent = data.bad.range;

      if (goodListEl) {
        goodListEl.innerHTML = (data.good.items || []).map(item => `<li>${item}</li>`).join('');
      }
      if (badListEl) {
        badListEl.innerHTML = (data.bad.items || []).map(item => `<li>${item}</li>`).join('');
      }

      const modal = document.getElementById('metric-info-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeMetricInfoModal() {
      const modal = document.getElementById('metric-info-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      }
    }

    // Escape key listener for metric modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMetricInfoModal();
      }
    });

