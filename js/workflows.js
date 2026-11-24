    window.onWarehouseSelectChange = function(whName) {
      if (!whName) return;
      currentFacilityName = whName;

      // 1. Sync dropdown selects
      const inSel = document.getElementById('inward-warehouse-select');
      if (inSel) inSel.value = whName;
      const outSel = document.getElementById('outward-warehouse-select');
      if (outSel) outSel.value = whName;

      // 2. Update all facility labels across page
      const subFacility = document.getElementById('subtab-facility-label');
      if (subFacility) subFacility.textContent = whName;
      const inTableWh = document.getElementById('inward-table-wh');
      if (inTableWh) inTableWh.textContent = whName;
      const inBadge = document.getElementById('inward-facility-badge');
      if (inBadge) inBadge.textContent = `${whName} · Intake Operations`;
      
      const outTableWh = document.getElementById('outward-table-title');
      if (outTableWh) outTableWh.textContent = whName;
      const outBadge = document.getElementById('outward-facility-badge');
      if (outBadge) outBadge.textContent = `${whName} · Dispatch Operations`;

      const inDetailWh = document.getElementById('inward-detail-wh');
      if (inDetailWh) inDetailWh.textContent = whName;
      const outDetailWh = document.getElementById('outward-detail-wh');
      if (outDetailWh) outDetailWh.textContent = whName;
      const storedWh = document.getElementById('stored-page-title');
      if (storedWh) storedWh.textContent = whName;
      const dispWh = document.getElementById('dispatched-page-title');
      if (dispWh) dispWh.textContent = whName;

      // 3. Re-render inward and outward journey views
      if (typeof renderInwardTable === 'function') renderInwardTable();
      if (typeof renderOutwardJourney === 'function') renderOutwardJourney(whName);
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
          { num: 5, name: 'AI Vision Audit', detail: 'Visual verification of cargo packaging integrity & label OCR' },
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
            cardEl.className = 'bg-white border-2 border-[#93C5FD] rounded-2xl p-5 shadow-md relative transition-all';
          } else {
            cardEl.className = 'opacity-75 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-5 shadow-2xs relative transition-all';
          }
        }

        // 3b. Update Header Subtitle and Stage Pill
        const inwardEstTimes = { 1: '08:45 AM', 2: '09:15 AM', 3: '09:40 AM', 4: '10:00 AM', 5: '10:15 AM', 6: '10:45 AM' };
        const inSubSpan = document.getElementById(`inward-stage-sub-${s}`);
        const inNumPill = document.getElementById(`inward-stage-num-${s}`);
        const inTitleEl = document.getElementById(`inward-stage-title-${s}`);

        if (inNumPill) {
          if (isDone) {
            inNumPill.className = 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] uppercase tracking-wider font-arial';
          } else if (isInProgress) {
            inNumPill.className = 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] uppercase tracking-wider font-arial';
          } else {
            inNumPill.className = 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 uppercase tracking-wider font-arial';
          }
        }

        if (inTitleEl) {
          inTitleEl.className = isUpcoming ? 'text-[15px] font-bold text-gray-600' : 'text-[15px] font-bold text-[#1F2937]';
        }

        if (inSubSpan) {
          if (isDone) {
            inSubSpan.className = 'text-[11px] text-[#059669] font-medium font-arial';
            inSubSpan.textContent = '· Completed';
          } else if (isInProgress) {
            inSubSpan.className = 'text-[11px] text-[#2563EB] font-bold';
            inSubSpan.textContent = '· CURRENT STAGE';
          } else {
            inSubSpan.className = 'text-[11px] text-gray-400 font-arial';
            inSubSpan.textContent = `· Est. ${inwardEstTimes[s] || 'Upcoming'}`;
          }
        }

        // 3c. Toggle Active vs Pending Blocks (When pending, real info is blank)
        const inActiveBlock = document.getElementById(`inward-stage-${s}-active`);
        const inPendingBlock = document.getElementById(`inward-stage-${s}-pending`);
        if (inActiveBlock) inActiveBlock.style.display = isUpcoming ? 'none' : 'block';
        if (inPendingBlock) inPendingBlock.style.display = isUpcoming ? 'block' : 'none';

        // 4. Render Checklist Box
        const checklistBox = document.getElementById(`inward-stage-${s}-checklist`);
        if (checklistBox) {
          checklistBox.style.display = 'block';
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
              <div class="flex items-center justify-between py-2 px-3 rounded-lg border ${taskCardClass} shadow-2xs gap-2">
                <span class="font-bold text-[#1F2937] text-[12px] truncate">${task.num}. ${task.name}</span>
                ${taskBadge}
              </div>
            `;
          }).join('');

          checklistBox.innerHTML = `
            <div class="rounded-xl border border-gray-200 bg-[#F9FAFB] p-3 space-y-2">
              <div class="flex items-center justify-between pb-1.5 border-b border-gray-200 flex-wrap gap-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-arial block">Stage ${s} SOP Task Checklist</span>
                </div>
                <div>${headerBadge}</div>
              </div>
              <div class="space-y-1.5">
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
            cardEl.className = 'bg-white border-2 border-[#93C5FD] rounded-2xl p-5 shadow-md relative transition-all';
          } else {
            cardEl.className = 'opacity-75 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-5 shadow-2xs relative transition-all';
          }
        }

        // 3b. Update Header Subtitle and Stage Pill
        const outwardEstTimes = { 1: '10:15 AM', 2: '10:45 AM', 3: '11:15 AM', 4: '11:45 AM', 5: '12:30 PM', 6: '18:30 IST' };
        const outSubSpan = document.getElementById(`outward-stage-sub-${s}`);
        const outNumPill = document.getElementById(`outward-stage-num-${s}`);
        const outTitleEl = document.getElementById(`outward-stage-title-${s}`);

        if (outNumPill) {
          if (isDone) {
            outNumPill.className = 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] uppercase tracking-wider font-arial';
          } else if (isInProgress) {
            outNumPill.className = 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] uppercase tracking-wider font-arial';
          } else {
            outNumPill.className = 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 uppercase tracking-wider font-arial';
          }
        }

        if (outTitleEl) {
          outTitleEl.className = isUpcoming ? 'text-[15px] font-bold text-gray-600' : 'text-[15px] font-bold text-[#1F2937]';
        }

        if (outSubSpan) {
          if (isDone) {
            outSubSpan.className = 'text-[11px] text-[#059669] font-medium font-arial';
            outSubSpan.textContent = '· Completed';
          } else if (isInProgress) {
            outSubSpan.className = 'text-[11px] text-[#2563EB] font-bold';
            outSubSpan.textContent = '· CURRENT STAGE';
          } else {
            outSubSpan.className = 'text-[11px] text-gray-400 font-arial';
            outSubSpan.textContent = `· Est. ${outwardEstTimes[s] || 'Upcoming'}`;
          }
        }

        // 3c. Toggle Active vs Pending Blocks
        const outActiveBlock = document.getElementById(`outward-stage-${s}-active`);
        const outPendingBlock = document.getElementById(`outward-stage-${s}-pending`);
        if (outActiveBlock) outActiveBlock.style.display = isUpcoming ? 'none' : 'block';
        if (outPendingBlock) outPendingBlock.style.display = isUpcoming ? 'block' : 'none';

        // 4. Render Checklist Box
        const checklistBox = document.getElementById(`outward-stage-${s}-checklist`);
        if (checklistBox) {
          checklistBox.style.display = 'block';
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
              <div class="flex items-center justify-between py-2 px-3 rounded-lg border ${taskCardClass} shadow-2xs gap-2">
                <span class="font-bold text-[#1F2937] text-[12px] truncate">${task.num}. ${task.name}</span>
                ${taskBadge}
              </div>
            `;
          }).join('');

          checklistBox.innerHTML = `
            <div class="rounded-xl border border-gray-200 bg-[#F9FAFB] p-3 space-y-2">
              <div class="flex items-center justify-between pb-1.5 border-b border-gray-200 flex-wrap gap-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-arial block">Stage ${s} SOP Task Checklist</span>
                </div>
                <div>${headerBadge}</div>
              </div>
              <div class="space-y-1.5">
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

      const outSel = document.getElementById('outward-warehouse-select');
      if (outSel && outSel.value !== facility.name) outSel.value = facility.name;

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
        onWarehouseSelectChange(whName);
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


