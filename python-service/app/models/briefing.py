
from datetime import datetime
from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Briefing(Base):
  __tablename__= "briefings"

  id: Mapped[int] = mapped_column(primary_key= True, autoincrement=True)
  company_name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
  ticker: Mapped[str] = mapped_column(String(10), nullable=False)
  sector: Mapped[str | None] = mapped_column(String(100))
  analyst_name: Mapped[str] = mapped_column(String(100), nullable=False)
  summary: Mapped[str] = mapped_column(Text, nullable=False)
  recommendation: Mapped[str] = mapped_column(Text, nullable=False)
  generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
  html_content: Mapped[str | None] = mapped_column(Text, nullable=True)

  key_points: Mapped[list["BriefingKeyPoint"]] = relationship(
    "BriefingKeyPoint", back_populates="briefing", cascade="all, delete-orphan", order_by="BriefingKeyPoint.display_order"
  )
  risks: Mapped[list["BriefingRisk"]] = relationship(
    "BriefingRisk", back_populates="briefing", cascade="all, delete-orphan", order_by="BriefingRisk.display_order"
  )
  metrics: Mapped[list["BriefingMetric"]] = relationship(
    "BriefingMetric", back_populates="briefing", cascade="all, delete-orphan"
  )