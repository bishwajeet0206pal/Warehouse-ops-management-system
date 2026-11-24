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

