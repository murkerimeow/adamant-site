import * as migration_20260528_225645_payload_card_fields from './20260528_225645_payload_card_fields';
import * as migration_20260530_230450_reviews_team_blog_videos from './20260530_230450_reviews_team_blog_videos';
import * as migration_20260531_225139_catalog_project_fields from './20260531_225139_catalog_project_fields';

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
];
