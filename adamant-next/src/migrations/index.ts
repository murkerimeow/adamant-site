import * as migration_20260528_225645_payload_card_fields from './20260528_225645_payload_card_fields.ts';
import * as migration_20260530_230450_reviews_team_blog_videos from './20260530_230450_reviews_team_blog_videos.ts';
import * as migration_20260531_225139_catalog_project_fields from './20260531_225139_catalog_project_fields.ts';
import * as migration_20260602_223500_home_section_eyebrows from './20260602_223500_home_section_eyebrows.ts';
import * as migration_20260603_150000_catalog_portfolio_arrays from './20260603_150000_catalog_portfolio_arrays.ts';
import * as migration_20260603_233000_catalog_landing_categories from './20260603_233000_catalog_landing_categories.ts';
import * as migration_20260604_150000_home_section_headings from './20260604_150000_home_section_headings.ts';

export const migrations = [
  {
    up: migration_20260528_225645_payload_card_fields.up,
    down: migration_20260528_225645_payload_card_fields.down,
    name: '20260528_225645_payload_card_fields',
  },
  {
    up: migration_20260530_230450_reviews_team_blog_videos.up,
    down: migration_20260530_230450_reviews_team_blog_videos.down,
    name: '20260530_230450_reviews_team_blog_videos',
  },
  {
    up: migration_20260531_225139_catalog_project_fields.up,
    down: migration_20260531_225139_catalog_project_fields.down,
    name: '20260531_225139_catalog_project_fields'
  },
  {
    up: migration_20260602_223500_home_section_eyebrows.up,
    down: migration_20260602_223500_home_section_eyebrows.down,
    name: '20260602_223500_home_section_eyebrows'
  },
  {
    up: migration_20260603_150000_catalog_portfolio_arrays.up,
    down: migration_20260603_150000_catalog_portfolio_arrays.down,
    name: '20260603_150000_catalog_portfolio_arrays'
  },
  {
    up: migration_20260603_233000_catalog_landing_categories.up,
    down: migration_20260603_233000_catalog_landing_categories.down,
    name: '20260603_233000_catalog_landing_categories'
  },
  {
    up: migration_20260604_150000_home_section_headings.up,
    down: migration_20260604_150000_home_section_headings.down,
    name: '20260604_150000_home_section_headings'
  },
];
