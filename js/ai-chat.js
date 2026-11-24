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
          <p class="text-[12px] text-emerald-600 font-semibold">Stages 1–3 completed. Stage 4 (QC & POD) verified with 0 carton damage via AI Vision.</p>
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

    
