import {
    pgTable,
    text,
    integer,
    uuid,
    json,
    timestamp,
    boolean,
  } from 'drizzle-orm/pg-core';
  
  // 1. Assets (uploaded logos)
  export const assets = pgTable('assets', {
    id:           uuid('id').defaultRandom().primaryKey(),
    ownerId:      text('owner_id').notNull(),          // Clerk userId
    url:          text('url').notNull().unique(),
    mimeType:     text('mime_type').notNull(),
    size:         integer('size').notNull(),           // bytes
    createdAt:    timestamp('created_at').defaultNow().notNull(),
  });
  
  // 2. QR Codes
  export const qrcodes = pgTable('qrcodes', {
    id:             uuid('id').defaultRandom().primaryKey(),
    slug:           text('slug').notNull().unique(),
    targetUrl:      text('target_url').notNull(),
    designJson:     json('design_json').notNull(),       // all UI knobs
    enableTracking: boolean('enable_tracking').default(false).notNull(),
    assetId:        uuid('asset_id').references(() => assets.id),
    createdBy:      text('created_by').notNull(),        // Clerk userId or 'anon'
    createdAt:      timestamp('created_at').defaultNow().notNull(),
  });
  
  // 3. Scan Events
  export const scanEvents = pgTable('scan_events', {
    id:           uuid('id').defaultRandom().primaryKey(),
    qrCodeId:     uuid('qr_code_id').notNull().references(() => qrcodes.id),
    ip:           text('ip').notNull(),
    city:         text('city'),
    region:       text('region'),
    country:      text('country'),
    userAgent:    text('user_agent').notNull(),
    timestamp:    timestamp('timestamp').defaultNow().notNull(),
  });
  