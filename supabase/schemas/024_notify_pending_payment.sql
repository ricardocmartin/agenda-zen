create extension if not exists http;

create or replace function public.notify_pending_payment()
returns trigger as $$
declare
  client_phone text;
begin
  if new.from_site then
    select phone into client_phone from clients where id = new.client_id;
    perform http_post(
      'https://agendazen.app.n8n.cloud/webhook-test/883ea095-bd30-4596-b20d-fde1c92ce2f8',
      json_build_object('phone', client_phone, 'isPendingPagto', true)::text,
      'application/json'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger notify_pending_payment_trigger
after insert on appointments
for each row execute procedure public.notify_pending_payment();
