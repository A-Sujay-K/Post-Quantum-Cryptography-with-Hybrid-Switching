# PQC Secure Comm — Backend Data Issues

> These are data bugs originating in the backend API / WebSocket telemetry.
> The frontend MUST NOT fix them by hiding data. Instead: clamp, label, and explain defensively.
> File backend fixes separately; do not change API routes, payload shapes, or crypto logic.

---

## BUG-001: Impossible `availability_ratio` → A(T) = 17710%
**Severity:** High (makes dashboard look broken)
**Source:** `snapshot.key_pool.availability_ratio` — backend sends a ratio >> 1.0 (observed: ~177.1)
**Root cause (hypothesis):** Generation rate counter is never reset; ratio = generated / consumed overflows expected 0–1 range.
**Frontend defensive display (Phase 3):**
- Rename label from `A(T)` to `Avail. Ratio`
- Clamp display: `Math.min(ratio * 100, 100).toFixed(0) + '%'`
- If value > 1.5, show `⚠ >100%` with tooltip: "Backend metric out of range — clamped for display"
- Document: `KeyPoolPanel.jsx` line ~38

---

## BUG-002: `total_messages` = 0 when routing events exist
**Severity:** Medium
**Source:** `snapshot.routing.total_messages` returns 0 or stale value while `recent_events` contains routing decisions
**Root cause (hypothesis):** Counter increments only on WebSocket push; initial HTTP snapshot has stale zero.
**Frontend defensive display (Phase 3):**
- If `total_messages === 0` but `events.length > 0`, compute count from local events array
- Label derived value: `${derivedCount} (derived)`

---

## BUG-003: Duplicate rows in routing feed
**Severity:** High (makes feed look broken — same event_id appears 2–4× in rapid succession)
**Source:** `payload.recent_events` — backend re-broadcasts same event on every telemetry tick
**Root cause (hypothesis):** `recent_events` is a fixed-size ring buffer; each WS push re-sends the last N events.
**Frontend defensive display (Phase 4):**
- Deduplicate by `event.event_id` before rendering
- Keep insertion-order (most recent first)

---

## BUG-004: Timestamp timezone mismatch
**Severity:** Medium
**Source:** Chat header shows local time (11:26), events show UTC timestamps (05:55), critical lane event shows different UTC time (17:21)
**Root cause (hypothesis):** Different backend services use different timezone serialization; some send UTC ISO 8601, some send local time strings.
**Frontend defensive display (Phase 1):**
- Normalize all timestamps to local time using `new Date(ts).toLocaleTimeString()`
- Never display raw timestamp strings from API without parsing

---

## BUG-005: Threat threshold inconsistency (0.790 vs 0.8)
**Severity:** Low
**Source:** Tooltip shows `Score: 0.790`, threshold dashed line drawn at `0.8`, but docs say threshold = 0.7
**Root cause (hypothesis):** Threshold is hardcoded in two places with different values; config value is 0.7.
**Frontend defensive display (Phase 3):**
- Read threshold from `snapshot.routing.threat_threshold` if present, else default to `0.7`
- Ensure chart threshold line uses same value as tooltip comparison

---

## BUG-006: Y-axis range 0–1.5 on threat chart (non-semantic upper bound)
**Severity:** Low
**Source:** `ThreatScorePanel` Recharts Y-axis has `domain={[0, 1.5]}` — threat score is bounded 0–1
**Frontend defensive display (Phase 3):**
- Fix Y-axis domain to `[0, 1]`; add reference line at threshold
- Scores above 1.0 (if any) are backend bugs — clamp to 1.0 and log warning

---

## BUG-007: `key_pool.capacity` = 20 when displayed count = 3542
**Severity:** Medium
**Source:** `key_pool.capacity` = 20 (default), `key_pool.available` = 3542 — available > capacity
**Root cause (hypothesis):** Capacity field is a placeholder; actual pool size is unbounded in simulation.
**Frontend defensive display (Phase 3):**
- If `available > capacity`, use `available` as the gauge max (i.e., treat pool as "full")
- Label gauge max as `${available} keys` without showing a meaningless "capacity"
- Add depletion estimate: `(available / consumptionRate).toFixed(0) + ' min remaining'`
