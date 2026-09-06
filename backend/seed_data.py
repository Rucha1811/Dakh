"""
Script to seed initial datasets into MongoDB for SIH Dakghar Niryat Kendra backend.
Reads from data_backup JSON files (complete dataset) using backup_manager.
"""

import os
import sys

# Ensure backend root is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

# Configure minimal Django settings if not already loaded
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sih_backend.settings')

import django
django.setup()

from backup_manager import restore_from_backup, get_system_backup_stats


def seed():
    print("Connecting to MongoDB...")
    stats = get_system_backup_stats()
    if not stats['db_online']:
        print("[!] ERROR: Cannot connect to MongoDB at configured URI.")
        sys.exit(1)
        
    print(f"Connected to MongoDB database '{stats['db_name']}'. Seeding datasets from data_backup/ ...\n")
    
    result = restore_from_backup()
    
    for col_name, count in sorted(result['collections'].items()):
        print(f"  [OK] [{col_name}] -> {count} records seeded")
        
    print(f"\n[SUCCESS] MongoDB database '{stats['db_name']}' contains {result['total_records']} total records across {result['total_collections']} collections!")


if __name__ == '__main__':
    seed()
