CREATE TABLE briefings (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  sector TEXT,
  analyst_name TEXT NOT NULL,
  summary TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  generated_at TIMESTAMPTZ,
  html_content TEXT
);

CREATE TABLE briefing_key_points (
  id SERIAL PRIMARY KEY,
  briefing_id INTEGER NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE briefing_risks (
  id SERIAL PRIMARY KEY,
  briefing_id INTEGER NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE briefing_metrics (
  id SERIAL PRIMARY KEY,
  briefing_id INTEGER NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  CONSTRAINT uq_briefing_metric UNIQUE (briefing_id, name)
);

CREATE INDEX idx_briefing_key_points_order ON briefing_key_points (briefing_id, display_order);
CREATE INDEX idx_briefing_risks_order ON briefing_risks (briefing_id, display_order);