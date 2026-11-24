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
  
