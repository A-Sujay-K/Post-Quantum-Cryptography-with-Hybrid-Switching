import json
import math
from PIL import Image
import numpy as np

def run():
    img_path = r'C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm\frontend-user\public\hero\qc-base-1x.png'
    im = Image.open(img_path)
    w, h = im.size
    alpha = np.array(im)[:, :, 3]
    
    print(f'Building verified wire path network on {w}x{h} canvas...')
    
    N_WIRES = 32
    centerX = 320.0
    
    # Snap (x, y) coordinate directly to the nearest physical wire / structural feature with alpha >= 12
    def snap_to_wire(x, y):
        iy = int(round(y))
        ix = int(round(x))
        iy = max(0, min(h - 1, iy))
        ix = max(0, min(w - 1, ix))
        
        if alpha[iy, ix] >= 12:
            return float(ix)
            
        best_x = ix
        best_val = alpha[iy, ix]
        # Search outward in both directions for strongest wire peak
        for r in range(1, 50):
            for candidate in [ix - r, ix + r]:
                if 0 <= candidate < w:
                    val = alpha[iy, candidate]
                    if val > best_val:
                        best_val = val
                        best_x = candidate
                        if best_val >= 18:
                            return float(best_x)
                            
        # If still not on a wire, walk towards centerX until hitting the wire bundle
        step = -1 if ix > centerX else 1
        cur_x = ix
        while 0 <= cur_x < w and abs(cur_x - centerX) > 5:
            if alpha[iy, cur_x] >= 12:
                return float(cur_x)
            cur_x += step
            
        return float(best_x)

    # ── Level Definitions for 640x640 Canvas ─────────────────────────────────
    y_ring = 182.0
    y_p1_in = 302.0
    y_p2_in = 428.0
    y_p3_in = 558.0
    y_conv = 590.0
    y_exit = 612.0
    
    # Spread factors across stages (left wires and right wires)
    u_vals = np.linspace(-1.0, 1.0, N_WIRES)
    
    x_ring = []
    x_p1 = []
    x_p2 = []
    x_p3 = []
    
    for u in u_vals:
        sign = 1.0 if u >= 0 else -1.0
        mag = abs(u) ** 0.82
        
        # Geometry spans covering left (X ~ 116..310) and right (X ~ 330..524)
        xr_est = centerX + sign * (30.0 + mag * 175.0)
        xp1_est = centerX + sign * (28.0 + mag * 182.0)
        xp2_est = centerX + sign * (30.0 + mag * 182.0)
        xp3_est = centerX + sign * (30.0 + mag * 182.0)
        
        x_ring.append(snap_to_wire(xr_est, y_ring))
        x_p1.append(snap_to_wire(xp1_est, y_p1_in))
        x_p2.append(snap_to_wire(xp2_est, y_p2_in))
        x_p3.append(snap_to_wire(xp3_est, y_p3_in))
        
    nodes = {}
    paths = []
    
    def add_node(nid, x, y, stage, ntype):
        snapped_x = snap_to_wire(x, y)
        nodes[nid] = {
            'id': nid,
            'x': round(float(snapped_x), 2),
            'y': round(float(y), 2),
            'stage': stage,
            'type': ntype,
            'in': [],
            'out': []
        }
        
    def bezier_pt(p0, p1, p2, p3, t):
        omt = 1.0 - t
        x = omt**3 * p0[0] + 3*omt**2*t * p1[0] + 3*omt*t**2 * p2[0] + t**3 * p3[0]
        y = omt**3 * p0[1] + 3*omt**2*t * p1[1] + 3*omt*t**2 * p2[1] + t**3 * p3[1]
        return [x, y]
        
    def compute_snapped_lut(pts):
        p0, p1, p2, p3 = pts
        N_SAMPLES = 40
        raw_pts = []
        for i in range(N_SAMPLES + 1):
            t = i / float(N_SAMPLES)
            pt = bezier_pt(p0, p1, p2, p3, t)
            snapped_x = snap_to_wire(pt[0], pt[1])
            raw_pts.append([snapped_x, pt[1]])
            
        dists = [0.0]
        total_len = 0.0
        for i in range(1, len(raw_pts)):
            dx = raw_pts[i][0] - raw_pts[i-1][0]
            dy = raw_pts[i][1] - raw_pts[i-1][1]
            total_len += math.hypot(dx, dy)
            dists.append(total_len)
            
        lut_pts = []
        for s in np.linspace(0.0, 1.0, 21):
            target_d = s * total_len
            idx = 0
            while idx < len(dists) - 2 and dists[idx + 1] < target_d:
                idx += 1
            seg_len = dists[idx + 1] - dists[idx]
            frac = (target_d - dists[idx]) / seg_len if seg_len > 1e-5 else 0.0
            x = raw_pts[idx][0] + frac * (raw_pts[idx + 1][0] - raw_pts[idx][0])
            y = raw_pts[idx][1] + frac * (raw_pts[idx + 1][1] - raw_pts[idx][1])
            sx = snap_to_wire(x, y)
            lut_pts.append([round(sx, 2), round(y, 2)])
            
        # Ensure exact match at endpoints
        lut_pts[0] = [p0[0], p0[1]]
        lut_pts[-1] = [p3[0], p3[1]]
        return round(total_len, 2), lut_pts

    # 1. Entry Nodes (Top Ring)
    for i in range(N_WIRES):
        add_node(f'ring-{i:02d}', x_ring[i], y_ring, 0, 'entry')

    # 2. Stage 0 Paths: Top Ring -> Plate 1
    for i in range(N_WIRES):
        nid_in = f'ring-{i:02d}'
        nid_out = f'p1-{i:02d}'
        add_node(nid_out, x_p1[i], y_p1_in, 1, 'plate')
        
        p0 = [nodes[nid_in]['x'], nodes[nid_in]['y']]
        p3 = [nodes[nid_out]['x'], nodes[nid_out]['y']]
        cp1 = [p0[0] * 0.85 + p3[0] * 0.15, p0[1] + (p3[1] - p0[1]) * 0.35]
        cp2 = [p0[0] * 0.15 + p3[0] * 0.85, p0[1] + (p3[1] - p0[1]) * 0.75]
        
        pts = [p0, cp1, cp2, p3]
        length, lut = compute_snapped_lut(pts)
        pid = f'path-s0-{i:02d}'
        paths.append({
            'id': pid,
            'stage': 0,
            'kind': 'wire',
            'start': nid_in,
            'end': nid_out,
            'points': pts,
            'length': length,
            'lut': lut
        })
        nodes[nid_in]['out'].append(pid)
        nodes[nid_out]['in'].append(pid)

    # 3. Stage 1 Paths: Plate 1 -> Plate 2 (S-Curves)
    for i in range(N_WIRES):
        nid_in = f'p1-{i:02d}'
        nid_out = f'p2-{i:02d}'
        add_node(nid_out, x_p2[i], y_p2_in, 2, 'plate')
        
        p0 = [nodes[nid_in]['x'], nodes[nid_in]['y']]
        p3 = [nodes[nid_out]['x'], nodes[nid_out]['y']]
        
        sign = 1.0 if p0[0] >= centerX else -1.0
        sway = sign * 8.0 * (1.0 + abs(i - N_WIRES/2) / float(N_WIRES))
        cp1 = [p0[0] + sway, p0[1] + (p3[1] - p0[1]) * 0.33]
        cp2 = [p3[0] - sway, p0[1] + (p3[1] - p0[1]) * 0.67]
        
        pts = [p0, cp1, cp2, p3]
        length, lut = compute_snapped_lut(pts)
        pid = f'path-s1-{i:02d}'
        paths.append({
            'id': pid,
            'stage': 1,
            'kind': 'wire',
            'start': nid_in,
            'end': nid_out,
            'points': pts,
            'length': length,
            'lut': lut
        })
        nodes[nid_in]['out'].append(pid)
        nodes[nid_out]['in'].append(pid)
        
        # Neighbor hop
        if i > 0 and i != 16:
            pid_hop = f'path-s1-hop-{i:02d}'
            nid_neighbor = f'p2-{i-1:02d}'
            p3_hop = [nodes[nid_neighbor]['x'], nodes[nid_neighbor]['y']]
            cp1_h = [p0[0] + sway, p0[1] + (p3[1] - p0[1]) * 0.33]
            cp2_h = [p3_hop[0] - sway, p0[1] + (p3[1] - p0[1]) * 0.67]
            pts_h = [p0, cp1_h, cp2_h, p3_hop]
            len_h, lut_h = compute_snapped_lut(pts_h)
            paths.append({
                'id': pid_hop,
                'stage': 1,
                'kind': 'wire',
                'start': nid_in,
                'end': nid_neighbor,
                'points': pts_h,
                'length': len_h,
                'lut': lut_h
            })
            nodes[nid_in]['out'].append(pid_hop)
            nodes[nid_neighbor]['in'].append(pid_hop)

    # 4. Stage 2 Paths: Plate 2 -> Plate 3 (Second S-Curve stage)
    for i in range(N_WIRES):
        nid_in = f'p2-{i:02d}'
        nid_out = f'p3-{i:02d}'
        add_node(nid_out, x_p3[i], y_p3_in, 3, 'plate')
        
        p0 = [nodes[nid_in]['x'], nodes[nid_in]['y']]
        p3 = [nodes[nid_out]['x'], nodes[nid_out]['y']]
        
        sign = 1.0 if p0[0] >= centerX else -1.0
        sway = sign * 8.0 * (1.0 + abs(i - N_WIRES/2) / float(N_WIRES))
        cp1 = [p0[0] + sway, p0[1] + (p3[1] - p0[1]) * 0.33]
        cp2 = [p3[0] - sway, p0[1] + (p3[1] - p0[1]) * 0.67]
        
        pts = [p0, cp1, cp2, p3]
        length, lut = compute_snapped_lut(pts)
        pid = f'path-s2-{i:02d}'
        paths.append({
            'id': pid,
            'stage': 2,
            'kind': 'wire',
            'start': nid_in,
            'end': nid_out,
            'points': pts,
            'length': length,
            'lut': lut
        })
        nodes[nid_in]['out'].append(pid)
        nodes[nid_out]['in'].append(pid)

    # 5. Stage 3 Paths: Plate 3 -> Column Convergence
    add_node('col-junction', centerX, y_conv, 4, 'column')
    for i in range(N_WIRES):
        nid_in = f'p3-{i:02d}'
        nid_out = 'col-junction'
        
        p0 = [nodes[nid_in]['x'], nodes[nid_in]['y']]
        p3 = [nodes['col-junction']['x'], nodes['col-junction']['y']]
        cp1 = [p0[0], p0[1] + 12.0]
        cp2 = [centerX + (p0[0] - centerX) * 0.25, y_conv - 8.0]
        
        pts = [p0, cp1, cp2, p3]
        length, lut = compute_snapped_lut(pts)
        pid = f'path-s3-{i:02d}'
        paths.append({
            'id': pid,
            'stage': 3,
            'kind': 'wire',
            'start': nid_in,
            'end': nid_out,
            'points': pts,
            'length': length,
            'lut': lut
        })
        nodes[nid_in]['out'].append(pid)
        nodes[nid_out]['in'].append(pid)

    # 6. Stage 4: Central Column Paths
    add_node('col-exit', centerX, y_exit, 4, 'exit')
    add_node('col-top', centerX, y_ring, 4, 'entry')
    
    # Path down the lower column to exit
    p_col_down = [
        [nodes['col-junction']['x'], nodes['col-junction']['y']],
        [centerX, y_conv + 5.0],
        [centerX, y_exit - 5.0],
        [nodes['col-exit']['x'], nodes['col-exit']['y']]
    ]
    length_cd, lut_cd = compute_snapped_lut(p_col_down)
    paths.append({
        'id': 'path-col-down',
        'stage': 4,
        'kind': 'column',
        'start': 'col-junction',
        'end': 'col-exit',
        'points': p_col_down,
        'length': length_cd,
        'lut': lut_cd
    })
    nodes['col-junction']['out'].append('path-col-down')
    nodes['col-exit']['in'].append('path-col-down')

    # Path from top of column to junction
    p_col_full = [
        [nodes['col-top']['x'], nodes['col-top']['y']],
        [centerX, y_p1_in],
        [centerX, y_p2_in],
        [nodes['col-junction']['x'], nodes['col-junction']['y']]
    ]
    length_cf, lut_cf = compute_snapped_lut(p_col_full)
    paths.append({
        'id': 'path-col-spine',
        'stage': 4,
        'kind': 'column',
        'start': 'col-top',
        'end': 'col-junction',
        'points': p_col_full,
        'length': length_cf,
        'lut': lut_cf
    })
    nodes['col-top']['out'].append('path-col-spine')
    nodes['col-junction']['in'].append('path-col-spine')

    rings = [
        {'id': 'ring-stage1', 'stage': 1, 'y': 240.0, 'height': 20.0, 'x': centerX},
        {'id': 'ring-stage2', 'stage': 2, 'y': 365.0, 'height': 20.0, 'x': centerX},
        {'id': 'ring-stage3', 'stage': 3, 'y': 492.0, 'height': 20.0, 'x': centerX}
    ]

    output_data = {
        'viewBox': {'width': w, 'height': h},
        'centerX': centerX,
        'rings': rings,
        'nodes': nodes,
        'paths': paths
    }

    out_file = r'C:\Users\asuja\.gemini\antigravity\scratch\pqc-secure-comm\frontend-user\src\home\qc\paths.json'
    with open(out_file, 'w') as f:
        json.dump(output_data, f, indent=2)
        
    print(f'Successfully built {len(paths)} paths and {len(nodes)} nodes.')
    print(f'Saved to {out_file}')

if __name__ == '__main__':
    run()
