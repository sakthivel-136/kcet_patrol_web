-- backend/setup_cron.sql

-- Enable the pg_cron extension if it isn't already
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create or replace the function to evaluate patrol rounds
CREATE OR REPLACE FUNCTION evaluate_patrol_rounds()
RETURNS void AS $$
DECLARE
    rec RECORD;
    v_report_date DATE;
    v_round_no INT;
    v_round_start TIMESTAMP WITH TIME ZONE;
    v_round_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- We evaluate the round that just ended.
    -- Since the cron runs at minute 30 of every odd hour (01:30, 03:30, etc.),
    -- the round that just ended is the one that started 1 hour and 30 minutes ago.
    -- For example, if it's 01:30, the round was 00:00 (which ended at 01:30).
    v_round_start := date_trunc('hour', now() - interval '1 hour 30 minutes');
    v_round_end := v_round_start + interval '1 hour 30 minutes';
    v_report_date := v_round_start::date;
    v_round_no := (EXTRACT(HOUR FROM v_round_start) / 2) + 1;

    -- Update missed scans logic
    -- (Assuming scanning_details only gets inserted if scanned, we might need to 
    -- cross-reference with qr table to insert MISSED records, or simply aggregate what was scanned).
    -- Here we do a simple aggregation of what was missed.
    
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS patrol_round_summaries (
        id SERIAL PRIMARY KEY,
        report_date DATE NOT NULL,
        round_no INT NOT NULL,
        campus_code TEXT NOT NULL,
        total_scans INT NOT NULL,
        missed_scans INT NOT NULL,
        evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(report_date, round_no, campus_code)
    );

    -- Insert a summary log into patrol_round_summaries
    INSERT INTO patrol_round_summaries (report_date, round_no, campus_code, total_scans, missed_scans, evaluated_at)
    SELECT 
        v_report_date,
        v_round_no,
        q.campus_code,
        COUNT(s.scan_id) as total_scans,
        SUM(CASE WHEN s.scan_id IS NULL THEN 1 ELSE 0 END) as missed_scans,
        now()
    FROM qr q
    LEFT JOIN scanning_details s ON s.qr_id = q.qr_id AND s.scan_time >= (v_round_start + interval '45 minutes') AND s.scan_time <= v_round_end
    GROUP BY q.campus_code
    ON CONFLICT (report_date, round_no, campus_code) 
    DO UPDATE SET 
        total_scans = EXCLUDED.total_scans,
        missed_scans = EXCLUDED.missed_scans,
        evaluated_at = EXCLUDED.evaluated_at;

END;
$$ LANGUAGE plpgsql;

-- Schedule execution at minute 30 of every odd hour
-- '30 1,3,5,7,9,11,13,15,17,19,21,23 * * *'
SELECT cron.schedule(
    'evaluate_patrol_rounds_job',
    '30 1,3,5,7,9,11,13,15,17,19,21,23 * * *',
    $$SELECT evaluate_patrol_rounds()$$
);
