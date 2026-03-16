from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.models.briefing import Briefing
from app.models.briefing_key_point import BriefingKeyPoint
from app.models.briefing_risk import BriefingRisk
from app.models.briefing_metric import BriefingMetric
from app.schemas.briefing import BriefingCreate
from app.services.report_formatter import ReportFormatter

_formatter = ReportFormatter()

def _build_report_context(briefing: Briefing) -> dict:
  return {
    "title": f"{briefing.company_name} ({briefing.ticker}) - Briefing Report",
    "company_name": briefing.company_name,
    "ticker": briefing.ticker,
    "sector": briefing.sector or "N/A",
    "analyst_name": briefing.analyst_name,
    "summary": briefing.summary,
    "key_points": [p.text for p in briefing.key_points],
    "risks": [r.text for r in briefing.risks],
    "recommendation": briefing.recommendation,
    "metrics": [{"name": m.name, "value": m.value} for m in briefing.metrics],
    "generated_at": ReportFormatter.generated_timestamp(),
  }

def get_briefing(db: Session, briefing_id: int) -> Briefing | None:
  stmt = (
    select(Briefing)
    .options(
      selectinload(Briefing.key_points),
      selectinload(Briefing.risks),
      selectinload(Briefing.metrics),
    )
    .where(Briefing.id == briefing_id)
  )
  return db.scalar(stmt)

def create_briefing(db: Session, payload: BriefingCreate) -> Briefing:
  briefing = Briefing(
    company_name=payload.companyName,
    ticker=payload.ticker,
    sector=payload.sector,
    analyst_name=payload.analystName,
    summary=payload.summary,
    recommendation=payload.recommendation,
  )
  db.add(briefing)
  db.flush() # get id for children

  for i, text in enumerate(payload.keyPoints):
    db.add(BriefingKeyPoint(briefing_id=briefing.id, text=text.strip(), display_order=i + 1))
  for i, text in enumerate(payload.risks):
    db.add(BriefingRisk(briefing_id=briefing.id, text=text.strip(), display_order=i + 1))
  for m in payload.metrics:
    db.add(BriefingMetric(briefing_id=briefing.id, name=m.name.strip(), value=m.value.strip()))

  db.commit()
  return get_briefing(db, briefing.id)  # return fully loaded

def generate_briefing_report(db: Session, briefing_id: int) -> Briefing:
  briefing = get_briefing(db, briefing_id)
  if briefing is None:
    raise ValueError("Briefing not found")

  context = _build_report_context(briefing)
  html = _formatter.render_briefing_report(context)

  briefing.generated_at = datetime.now(timezone.utc)
  briefing.html_content = html
  db.commit()
  db.refresh(briefing)
  return briefing

def get_briefing_html(db: Session, briefing_id: int) -> str | None:
  briefing = get_briefing(db, briefing_id)
  return briefing.html_content if briefing else None