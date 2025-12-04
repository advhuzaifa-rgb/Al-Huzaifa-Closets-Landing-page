import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Allow public read
    read: () => true,
    // Allow public create so uploads initiated via the server-side `/api/form`
    // endpoint (or direct client uploads) succeed without requiring an API key.
    // NOTE: this makes the media upload endpoint public and can be abused.
    // Consider adding size/type limits or switching to server-authenticated
    // uploads for production.
    create: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: true,
}
