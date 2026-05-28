import * as migration_20260528_225645_payload_card_fields from './20260528_225645_payload_card_fields';

export const migrations = [
  {
    up: migration_20260528_225645_payload_card_fields.up,
    down: migration_20260528_225645_payload_card_fields.down,
    name: '20260528_225645_payload_card_fields'
  },
];
