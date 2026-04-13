ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_payment_status_check
CHECK (
  payment_status IS NULL
  OR payment_status IN ('pending', 'completed', 'failed', 'expired')
);