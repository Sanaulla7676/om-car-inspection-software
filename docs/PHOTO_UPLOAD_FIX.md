# Photo Upload Fix

## Confirmed problems

- The Vehicle stage's Scan VIN input had no `onChange` handler, so choosing or capturing a VIN image did not invoke the upload function.
- The upload routine added a photo to the evidence grid before Storage and metadata had succeeded. Failed uploads could remain visible as though they were attached.
- Concurrent uploads updated the last item in the array rather than the specific upload, which could replace another photo.
- The multiple-file picker launched every upload at once and each upload competed for the single uploading-status indicator.

## Changes

- Wire the VIN capture picker into the same evidence upload workflow and reset file inputs so the same file can be selected again.
- Upload to the private `inspection-media` bucket and write the metadata row before showing the photo as successfully attached.
- On metadata failure after a Storage success, attempt to remove the orphaned object without weakening RLS or making the bucket public.
- Append each successful photo rather than replacing the last array item.
- Process multi-file selections sequentially and reset the file input after each selection.
- Display the exact Storage/database error in an accessible live region. Files saved in offline/demo mode are explicitly identified as local-only.

## Storage verification

The OM Car Inspection Supabase project has the private `inspection-media` bucket, and its existing Storage policies restrict reads/writes to authenticated organization members. Those policies remain intact. The application still requires a valid login and organization membership to sync files.

## Validation

The browser-side upload flow was reviewed against the deployed schema and Storage policies. After the commit, GitHub Actions and Vercel production deployment must complete successfully. A real authenticated photo capture/upload still needs to be exercised in the workspace to confirm the logged-in user's session and membership are accepted by Supabase.