-- storage.objects on the receipts bucket was missing an UPDATE policy (0001_init.sql only
-- granted select/insert/delete), so overwriting a receipt at the same path silently failed.

create policy "update own receipts" on storage.objects for update
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
