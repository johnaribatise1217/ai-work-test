from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class BriefingMetric(Base):
  __tablename__ = "briefing_metrics"
  __table_args__ = (UniqueConstraint("briefing_id", "name", name="uq_briefing_metric"),)

  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  briefing_id: Mapped[int] = mapped_column(ForeignKey("briefings.id", ondelete="CASCADE"))
  name: Mapped[str] = mapped_column(String(100), nullable=False)
  value: Mapped[str] = mapped_column(Text, nullable=False)

  briefing: Mapped["Briefing"] = relationship(back_populates="metrics")