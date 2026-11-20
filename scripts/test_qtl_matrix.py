"""
test_qtl_matrix.py
Comprehensive QTL (Quantum Threat Level) validation and evaluation script across words, data payloads, file attachments, and sender priorities.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.utils.sensitivity import get_sensitivity_score
from app.core.threat_analyzer import compute_threat_level, compute_dynamic_threshold, determine_lane
import asyncio

TEST_CASES = [
    # Low Level (Routine / Benign)
    ("hello there", None, False, "Greeting"),
    ("how are you doing today?", None, False, "Casual chat"),
    ("lunch at 12:30", None, False, "Social / lunch"),
    ("team sync notes", None, False, "Team sync"),
    ("project status update", None, False, "Status report"),
    ("schedule meeting for tomorrow", None, False, "Calendar coordination"),
    ("reviewing the draft design", None, False, "Draft review"),
    ("thanks for the help", None, False, "Courtesy"),
    ("photo_team.jpg", "photo_team.jpg", False, "Media photo (.jpg)"),
    ("podcast_clip.mp4", "podcast_clip.mp4", False, "Media video (.mp4)"),

    # Medium Level (Corporate / Financial / Internal)
    ("financial quarterly performance", None, False, "Financial results"),
    ("invoice #9482 payment pending", None, False, "Billing / Invoice"),
    ("employee payroll and salary review", None, False, "HR / Payroll"),
    ("internal vulnerability assessment", None, False, "Security audit"),
    ("contract terms under NDA", None, False, "Legal agreement"),
    ("patent application submission", None, False, "Intellectual property"),
    ("restricted access banking portal", None, False, "Banking / Finance"),
    ("ssn verification record", None, False, "PII / Identity"),
    ("quarterly_report.pdf", "quarterly_report.pdf", False, "Document (.pdf)"),
    ("budget_2026.xlsx", "budget_2026.xlsx", False, "Spreadsheet (.xlsx)"),

    # High Level (Critical Security / Credentials / Secrets / High-Security Toggle)
    ("password reset token", None, False, "Account credential"),
    ("secret API access token", None, False, "API secret"),
    ("confidential strategic acquisition", None, False, "M&A strategy"),
    ("classified military operational order", None, False, "Defense / Classified"),
    ("urgent: security breach alert", None, False, "Emergency response"),
    ("private key seed phrase export", None, False, "Cryptographic key"),
    ("credentials.env", "credentials.env", False, "Env file (.env)"),
    ("server_private.key", "server_private.key", False, "Private key (.key)"),
    ("backup_vault.zip", "backup_vault.zip", False, "Archive container (.zip)"),
    ("routine update with high security toggle", None, True, "High Security Mode (Toggle)"),
]

async def run_matrix():
    print("=" * 110)
    print("QUANTUM THREAT LEVEL (QTL) COMPREHENSIVE WORD & DATA TEST REPORT")
    print("Formulation: QTL(f) = w1 * S + w2 * I  |  w1=0.60, w2=0.40  |  I = priority / 10.0")
    print("Threshold:   tau_eff(a) = tau_min + (tau_max - tau_min)*(1 - a),  K_max=25")
    print("=" * 110)

    # Let's test with pool at 15 keys (nominal: 15/25 -> a=0.60 -> tau_eff = 0.40 + 0.40*0.40 = 0.5600)
    k_avail = 15
    from app.config import get_settings
    settings = get_settings()
    tau_eff = compute_dynamic_threshold(k_avail, settings)
    print(f"Active Key Reservoir: {k_avail}/25 keys available -> a={k_avail/25:.2f} -> tau_eff = {tau_eff:.4f}")
    print(f"Critical Override S_crit = {settings.S_CRIT:.2f}")
    print("-" * 110)

    header = f"{'Payload / Data Text':<36} | {'Category':<20} | {'S':<5} | {'P=3':<6} | {'P=5':<6} | {'P=8':<6} | {'Lane (P=5)':<10}"
    print(header)
    print("-" * 110)

    low_list = []
    med_list = []
    high_list = []

    for text, filename, high_sec, cat in TEST_CASES:
        s = get_sensitivity_score(filename=filename, content=text, high_security=high_sec)
        qtl_p3 = await compute_threat_level(s, 3, k_avail, settings)
        qtl_p5 = await compute_threat_level(s, 5, k_avail, settings)
        qtl_p8 = await compute_threat_level(s, 8, k_avail, settings)
        lane = determine_lane(qtl_p5, tau_eff, s, settings.S_CRIT)

        display_name = filename if filename else text
        if len(display_name) > 34:
            display_name = display_name[:31] + "..."

        print(f"{display_name:<36} | {cat:<20} | {s:.2f}  | {qtl_p3:.3f}  | {qtl_p5:.3f}  | {qtl_p8:.3f}  | {lane.upper():<10}")

        item_info = {"text": text, "category": cat, "S": s, "qtl_p5": qtl_p5, "lane": lane}
        if s < 0.35:
            low_list.append(item_info)
        elif s < 0.80:
            med_list.append(item_info)
        else:
            high_list.append(item_info)

    print("=" * 110)
    return low_list, med_list, high_list

if __name__ == '__main__':
    asyncio.run(run_matrix())
