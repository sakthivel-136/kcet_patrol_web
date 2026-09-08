-- ============================================================================
-- SUPABASE POSTGRES CRON JOB FOR MISSED SCANS (NO SYSTEM_MISSED)
-- ============================================================================
-- Execute this SQL script directly in your Supabase SQL Editor.
-- It resolves allotted security guard names from `shift_allocations` + `security_users`
-- for each shift and saves comma-separated guard names (e.g. 'Adam, Kumar, Naavneeth, Ravi, Sathis')
-- into `scanning_details.guard_name`.
-- ============================================================================

-- 1. Create or replace the PL/pgSQL function
CREATE OR REPLACE FUNCTION mark_missed_scans()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    now_ist TIMESTAMP;
    effective_time TIMESTAMP;
    last_even_hour INT;
    nominal_time TIMESTAMP;
    window_start TIMESTAMP;
    window_end TIMESTAMP;
    round_no INT;
    rec_qr RECORD;
    matching_shift_id TEXT;
    assigned_guards TEXT;
BEGIN
    -- 1. Get current time in Asia/Kolkata (IST)
    now_ist := NOW() AT TIME ZONE 'Asia/Kolkata';
    
    -- 2. Calculate the window that just closed (45m to 1h30m past even hours)
    effective_time := now_ist - INTERVAL '1 hour 30 minutes';
    last_even_hour := EXTRACT(HOUR FROM effective_time)::INT - (EXTRACT(HOUR FROM effective_time)::INT % 2);
    
    nominal_time := DATE_TRUNC('day', effective_time) + (last_even_hour || ' hours')::INTERVAL;
    
    window_start := nominal_time + INTERVAL '45 minutes';
    window_end := nominal_time + INTERVAL '1 hour 30 minutes';
    round_no := (last_even_hour / 2) + 1;

    -- 3. Find the active shift for this round's window_start
    SELECT shift_id::TEXT INTO matching_shift_id
    FROM shifts
    WHERE 
        CASE 
            WHEN start_time::TIME <= end_time::TIME THEN
                window_start::TIME >= start_time::TIME AND window_start::TIME < end_time::TIME
            ELSE -- Overnight shift (e.g. 22:00 to 06:00)
                window_start::TIME >= start_time::TIME OR window_start::TIME < end_time::TIME
        END
    LIMIT 1;

    -- 4. Get comma-separated list of allotted guard names for this shift
    IF matching_shift_id IS NOT NULL THEN
        SELECT STRING_AGG(DISTINCT su.security_name, ', ' ORDER BY su.security_name)
        INTO assigned_guards
        FROM shift_allocations sa
        JOIN security_users su 
          ON (sa.guard_id::TEXT = su.security_id::TEXT OR sa.guard_id::TEXT = su.security_name::TEXT)
        WHERE sa.shift_id::TEXT = matching_shift_id
          AND UPPER(su.security_name) != 'SYSTEM_MISSED'
          AND sa.guard_id::TEXT != 'CLEAR';
    END IF;

    -- If no guards are allocated to shift, default to '-' instead of SYSTEM_MISSED
    IF assigned_guards IS NULL OR TRIM(assigned_guards) = '' THEN
        assigned_guards := '-';
    END IF;

    -- 5. Iterate through active QR scan points
    FOR rec_qr IN 
        SELECT q.qr_id, q.qr_name, q.campus_code
        FROM qr q
        WHERE LOWER(q.status) = 'active'
    LOOP
        -- Check if a scan record exists for this QR point during the round window
        IF NOT EXISTS (
            SELECT 1 
            FROM scanning_details sd
            WHERE sd.qr_id::TEXT = rec_qr.qr_id::TEXT
              AND (
                (sd.scan_time >= window_start AND sd.scan_time <= window_end)
                OR (sd.round_slot >= window_start AND sd.round_slot <= window_end)
              )
        ) THEN
            -- Insert missed scan record with assigned guards list
            INSERT INTO scanning_details (
                qr_id,
                qr_name,
                campus_code,
                guard_name,
                lat,
                log,
                status,
                round_slot,
                scan_time
            ) VALUES (
                rec_qr.qr_id,
                rec_qr.qr_name,
                rec_qr.campus_code,
                assigned_guards,
                0,
                0,
                'MISSED',
                window_start,
                window_end
            );
        END IF;
    END LOOP;
END;
$$;


-- 2. Schedule the function in pg_cron (runs at 35 minutes past every odd hour in IST)
-- Enable pg_cron extension if not enabled:
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Unschedule any previous version of the job to prevent duplicate cron schedules
SELECT cron.unschedule('mark-missed-scans-job') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'mark-missed-scans-job'
);

-- Schedule new cron job
SELECT cron.schedule(
    'mark-missed-scans-job',
    '35 1-23/2 * * *',
    $$ SELECT mark_missed_scans(); $$
);
