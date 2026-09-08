"""
SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation.
Calculates memory retention decay and next review intervals based on learner recall quality.
"""

from dataclasses import dataclass
from datetime import date, timedelta
import math

@dataclass
class SRSState:
    repetition_number: int  # n: consecutive correct reviews
    ease_factor: float      # EF: difficulty multiplier (min 1.3, default 2.5)
    interval_days: int      # I: days until next review
    next_review_date: str   # ISO date string YYYY-MM-DD

def calculate_sm2(
    repetition_number: int,
    ease_factor: float,
    interval_days: int,
    quality: int,
    current_date: date = None
) -> SRSState:
    """
    Computes the updated SM-2 parameters based on recall quality.
    
    Parameters:
        repetition_number: Current number of consecutive successful reviews (n >= 0).
        ease_factor: Current ease factor (EF >= 1.3, initially 2.5).
        interval_days: Previous review interval in days.
        quality: Recall quality score from 0 (complete blackout) to 5 (perfect recall).
        current_date: Base date to compute next review (defaults to today).
    
    Returns:
        SRSState with updated repetition_number, ease_factor, interval_days, and next_review_date.
    """
    if current_date is None:
        current_date = date.today()

    # Validate and clamp quality to [0, 5]
    q = max(0, min(5, quality))

    # Calculate new ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = max(1.3, round(new_ef, 3))

    if q >= 3:
        # Correct response
        if repetition_number == 0:
            new_interval = 1
        elif repetition_number == 1:
            new_interval = 6
        else:
            new_interval = max(1, math.ceil(interval_days * new_ef))
        new_repetition = repetition_number + 1
    else:
        # Incorrect response: reset repetitions to 0 and interval to 1 day
        new_repetition = 0
        new_interval = 1

    next_date = current_date + timedelta(days=new_interval)

    return SRSState(
        repetition_number=new_repetition,
        ease_factor=new_ef,
        interval_days=new_interval,
        next_review_date=next_date.isoformat()
    )
