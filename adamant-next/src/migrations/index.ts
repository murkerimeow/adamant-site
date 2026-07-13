import * as migration_20260528_225645_payload_card_fields from './20260528_225645_payload_card_fields.ts';
import * as migration_20260530_230450_reviews_team_blog_videos from './20260530_230450_reviews_team_blog_videos.ts';
import * as migration_20260531_225139_catalog_project_fields from './20260531_225139_catalog_project_fields.ts';
import * as migration_20260602_223500_home_section_eyebrows from './20260602_223500_home_section_eyebrows.ts';
import * as migration_20260603_150000_catalog_portfolio_arrays from './20260603_150000_catalog_portfolio_arrays.ts';
import * as migration_20260603_233000_catalog_landing_categories from './20260603_233000_catalog_landing_categories.ts';
import * as migration_20260604_150000_home_section_headings from './20260604_150000_home_section_headings.ts';
import * as migration_20260605_010000_seo_categories_models from './20260605_010000_seo_categories_models.ts';
import * as migration_20260605_140000_site_settings_company_stats from './20260605_140000_site_settings_company_stats.ts';
import * as migration_20260605_160000_site_settings_company_stats_uuid from './20260605_160000_site_settings_company_stats_uuid.ts';
import * as migration_20260606_221500_catalog_item_seo_fields from './20260606_221500_catalog_item_seo_fields.ts';
import * as migration_20260606_233000_payload_schema_repairs from './20260606_233000_payload_schema_repairs.ts';
import * as migration_20260607_000000_posts_seo_schema_repair from './20260607_000000_posts_seo_schema_repair.ts';
import * as migration_20260612_120000_review_videos from './20260612_120000_review_videos.ts';
import * as migration_20260623_220000_global_hero_images from './20260623_220000_global_hero_images.ts';
import * as migration_20260626_120000_seed_site_settings_company_stats from './20260626_120000_seed_site_settings_company_stats.ts';
import * as migration_20260626_130000_portfolio_landing_categories from './20260626_130000_portfolio_landing_categories.ts';
import * as migration_20260626_140000_catalog_night_card_image from './20260626_140000_catalog_night_card_image.ts';
import * as migration_20260702_010000_site_settings_company_stat_images from './20260702_010000_site_settings_company_stat_images.ts';
import * as migration_20260706_020000_fix_public_text_typos from './20260706_020000_fix_public_text_typos.ts';
import * as migration_20260706_030000_sync_catalog_versions from './20260706_030000_sync_catalog_versions.ts';
import * as migration_20260706_050000_seed_portfolio_design_projects from './20260706_050000_seed_portfolio_design_projects.ts';
import * as migration_20260708_170000_client_access from './20260708_170000_client_access.ts';
import * as migration_20260711_230000_seed_landscape_portfolio from './20260711_230000_seed_landscape_portfolio.ts';
import * as migration_20260713_190000_seed_pdf_catalog_projects from './20260713_190000_seed_pdf_catalog_projects.ts';
import * as migration_20260713_210000_seed_vk_portfolio_projects from './20260713_210000_seed_vk_portfolio_projects.ts';

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
  {
    up: migration_20260605_010000_seo_categories_models.up,
    down: migration_20260605_010000_seo_categories_models.down,
    name: '20260605_010000_seo_categories_models'
  },
  {
    up: migration_20260605_140000_site_settings_company_stats.up,
    down: migration_20260605_140000_site_settings_company_stats.down,
    name: '20260605_140000_site_settings_company_stats'
  },
  {
    up: migration_20260605_160000_site_settings_company_stats_uuid.up,
    down: migration_20260605_160000_site_settings_company_stats_uuid.down,
    name: '20260605_160000_site_settings_company_stats_uuid'
  },
  {
    up: migration_20260606_221500_catalog_item_seo_fields.up,
    down: migration_20260606_221500_catalog_item_seo_fields.down,
    name: '20260606_221500_catalog_item_seo_fields'
  },
  {
    up: migration_20260606_233000_payload_schema_repairs.up,
    down: migration_20260606_233000_payload_schema_repairs.down,
    name: '20260606_233000_payload_schema_repairs'
  },
  {
    up: migration_20260607_000000_posts_seo_schema_repair.up,
    down: migration_20260607_000000_posts_seo_schema_repair.down,
    name: '20260607_000000_posts_seo_schema_repair'
  },
  {
    up: migration_20260612_120000_review_videos.up,
    down: migration_20260612_120000_review_videos.down,
    name: '20260612_120000_review_videos'
  },
  {
    up: migration_20260623_220000_global_hero_images.up,
    down: migration_20260623_220000_global_hero_images.down,
    name: '20260623_220000_global_hero_images'
  },
  {
    up: migration_20260626_120000_seed_site_settings_company_stats.up,
    down: migration_20260626_120000_seed_site_settings_company_stats.down,
    name: '20260626_120000_seed_site_settings_company_stats'
  },
  {
    up: migration_20260626_130000_portfolio_landing_categories.up,
    down: migration_20260626_130000_portfolio_landing_categories.down,
    name: '20260626_130000_portfolio_landing_categories'
  },
  {
    up: migration_20260626_140000_catalog_night_card_image.up,
    down: migration_20260626_140000_catalog_night_card_image.down,
    name: '20260626_140000_catalog_night_card_image'
  },
  {
    up: migration_20260702_010000_site_settings_company_stat_images.up,
    down: migration_20260702_010000_site_settings_company_stat_images.down,
    name: '20260702_010000_site_settings_company_stat_images'
  },
  {
    up: migration_20260706_020000_fix_public_text_typos.up,
    down: migration_20260706_020000_fix_public_text_typos.down,
    name: '20260706_020000_fix_public_text_typos'
  },
  {
    up: migration_20260706_030000_sync_catalog_versions.up,
    down: migration_20260706_030000_sync_catalog_versions.down,
    name: '20260706_030000_sync_catalog_versions'
  },
  {
    up: migration_20260706_050000_seed_portfolio_design_projects.up,
    down: migration_20260706_050000_seed_portfolio_design_projects.down,
    name: '20260706_050000_seed_portfolio_design_projects'
  },
  {
    up: migration_20260708_170000_client_access.up,
    down: migration_20260708_170000_client_access.down,
    name: '20260708_170000_client_access'
  },
  {
    up: migration_20260711_230000_seed_landscape_portfolio.up,
    down: migration_20260711_230000_seed_landscape_portfolio.down,
    name: '20260711_230000_seed_landscape_portfolio'
  },
  {
    up: migration_20260713_190000_seed_pdf_catalog_projects.up,
    down: migration_20260713_190000_seed_pdf_catalog_projects.down,
    name: '20260713_190000_seed_pdf_catalog_projects'
  },
  {
    up: migration_20260713_210000_seed_vk_portfolio_projects.up,
    down: migration_20260713_210000_seed_vk_portfolio_projects.down,
    name: '20260713_210000_seed_vk_portfolio_projects'
  },
];
