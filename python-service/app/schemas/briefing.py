from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

class Metric(BaseModel):
  name: str = Field(..., min_length=1)
  value: str = Field(..., min_length=1)

class BriefingPointRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  text: str

class BriefingMetricRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  name: str
  value: str

class BriefingCreate(BaseModel):
  companyName: str = Field(..., min_length=1)
  ticker: str
  sector: str | None = None
  analystName: str = Field(..., min_length=1)
  summary: str = Field(..., min_length=1)
  recommendation: str = Field(..., min_length=1)
  keyPoints: list[str] = Field(..., min_items=2)
  risks: list[str] = Field(..., min_items=1)
  metrics: list[Metric] = Field(default_factory=list)

  @field_validator("ticker", mode="before")
  @classmethod
  def normalize_ticker(cls, v):
    if isinstance(v, str):
      return v.upper().strip() #NORMALIZE TICKER TO UPPER CASE
    return v

  @model_validator(mode="after")
  def validate_unique_metrics(self):
    names = [m.name for m in self.metrics]
    if len(names) != len(set(names)):
      raise ValueError("Metric names must be unique within the briefing")
    return self

class BriefingRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: int
  company_name: str
  ticker: str
  sector: str | None
  analyst_name: str
  summary: str
  recommendation: str
  key_points: list[BriefingPointRead]
  risks: list[BriefingPointRead]
  metrics: list[BriefingMetricRead]