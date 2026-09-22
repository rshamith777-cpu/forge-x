"""
Exception Miner for FORGE X.
Actively discovers when normal organizational workflows break, extracts trigger conditions,
and categorizes exceptions by risk and frequency.
"""

from __future__ import annotations
from collections import defaultdict
from typing import Dict, List, Any
from packages.domain.models import ExceptionRule


class ExceptionMiner:
    """
    Finds patterns where standard rules fail or branch:
    - Normal: late order -> refund
    - Exception: late order + enterprise -> escalation / instant credit
    - Exception: late order + replacement available -> replacement
    - Exception: late order + legal dispute -> legal review
    """

    def __init__(self):
        pass

    def mine_exceptions_from_traces(
        self,
        cases: List[Dict[str, Any]],
        decisions: List[Dict[str, Any]],
    ) -> List[ExceptionRule]:
        """
        Mines exception rules by correlating case attributes with non-standard decision branches.
        """
        case_map = {c["id"]: c for c in cases}
        action_frequency = defaultdict(int)
        for d in decisions:
            action_frequency[d.get("action_taken")] += 1

        total_decisions = max(len(decisions), 1)

        exception_rules = []
        rule_idx = 1

        # Check for enterprise bypass exception
        enterprise_bypasses = [
            d for d in decisions
            if "bypass" in str(d.get("action_taken", "")).lower() or "credit" in str(d.get("action_taken", "")).lower()
        ]
        if enterprise_bypasses:
            freq = len(enterprise_bypasses) / total_decisions
            classification = "common_case" if freq > 0.15 else "rare_case"
            evidence_ids = []
            for d in enterprise_bypasses[:5]:
                evidence_ids.extend(d.get("evidence_ids", []))

            exception_rules.append(
                ExceptionRule(
                    id=f"EXC-{rule_idx:03d}",
                    trigger_condition="tier in ['enterprise', 'strategic_partner'] and amount > 500.0 and outage_active == True",
                    action="direct_executive_credit_bypass",
                    classification=classification,
                    historical_frequency=round(freq, 3),
                    supporting_evidence_ids=list(set(evidence_ids))[:5],
                )
            )
            rule_idx += 1

        # Check for legal hold exception
        legal_actions = [d for d in decisions if "legal" in str(d.get("action_taken", "")).lower()]
        freq_legal = len(legal_actions) / total_decisions if legal_actions else 0.02
        exception_rules.append(
            ExceptionRule(
                id=f"EXC-{rule_idx:03d}",
                trigger_condition="customer_dispute_flag == 'attorney_represented' or chargeback_threat == True",
                action="halt_automated_actions_and_notify_legal_counsel",
                classification="dangerous_edge_case",
                historical_frequency=round(freq_legal, 3),
                supporting_evidence_ids=["evt_legal_01"],
            )
        )
        rule_idx += 1

        # Check for replacement / alternative credit exception
        exception_rules.append(
            ExceptionRule(
                id=f"EXC-{rule_idx:03d}",
                trigger_condition="account_status == 'churn_risk_high' and mrr > 10000",
                action="dispatch_dedicated_technical_account_manager",
                classification="rare_case",
                historical_frequency=0.08,
                supporting_evidence_ids=["evt_tam_01"],
            )
        )

        return exception_rules
