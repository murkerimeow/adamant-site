import * as migration_20260528_225645_payload_card_fields from './20260528_225645_payload_card_fields';
import * as migration_20260530_230450_reviews_team_blog_videos from './20260530_230450_reviews_team_blog_videos';

export const migrations = [
  {
    up: migration_20260528_225645_payload_card_fields.up,
    down: migration_20260528_225645_payload_card_fields.down,
    name: '20260528_225645_payload_card_fields',
  },
  {
    up: migration_20260530_230450_reviews_team_blog_videos.up,
    down: migration_20260530_230450_reviews_team_blog_videos.down,
    name: '20260530_230450_reviews_team_blog_videos'
  },
];
