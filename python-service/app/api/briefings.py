from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.briefing import BriefingCreate, BriefingRead
from app.services.briefing_service import (
  create_briefing,
  get_briefing,
  generate_briefing_report,
  get_briefing_html,
)

router = APIRouter(prefix="/briefings", tags=["briefings"])

@router.post("", response_model=BriefingRead, status_code=status.HTTP_201_CREATED)
def create_briefing_endpoint(payload: BriefingCreate, db: Annotated[Session, Depends(get_db)]) -> BriefingRead:
  briefing = create_briefing(db, payload)
  return BriefingRead.model_validate(briefing)

@router.get("/{id}", response_model=BriefingRead, status_code=status.HTTP_200_OK)
def get_briefing_endpoint(id: int, db: Annotated[Session, Depends(get_db)]) -> BriefingRead:
  briefing = get_briefing(db, id)
  if not briefing:
    raise HTTPException(status_code=404, detail="Briefing not found")
  return BriefingRead.model_validate(briefing)

@router.post("/{id}/generate", response_model=BriefingRead)
def generate_endpoint(id: int, db: Annotated[Session, Depends(get_db)]) -> BriefingRead:
  briefing = generate_briefing_report(db, id)
  return BriefingRead.model_validate(briefing)

@router.get("/{id}/html", response_class=HTMLResponse)
def get_html_endpoint(id: int, db: Annotated[Session, Depends(get_db)]) -> str:
  html = get_briefing_html(db, id)
  if not html:
    raise HTTPException(status_code=404, detail="Report has not been generated yet")
  return html