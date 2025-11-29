import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Team Member',
    plural: 'Team',
  },
  admin: {
    useAsTitle: 'email',
  },

  auth: {
    useAPIKey: true,
  },

  access: {
    read: ({ req }) =>
      Boolean(req?.user && (req.user as any).role === 'admin'),
    create: ({ req }) =>
      Boolean(req?.user && (req.user as any).role === 'admin'),
    update: ({ req }) =>
      Boolean(req?.user && (req.user as any).role === 'admin'),
    delete: ({ req }) =>
      Boolean(req?.user && (req.user as any).role === 'admin'),
  },

  fields: [
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        description:
          'Admin has full access. Editor has limited access and cannot view Users (after you revert).',
      },
    },
  ],
}

export default Users
