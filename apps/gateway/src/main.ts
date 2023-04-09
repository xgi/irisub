import { migrateToLatest } from './migrate';
import { startServer } from './server';

if (process.argv.includes('--migrate-db-only')) {
  migrateToLatest();
} else {
  startServer();
}
