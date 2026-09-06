"""
CLI Utility to backup MongoDB database into data_backup/ JSON files & timestamped snapshots.
Usage:
    python backup_data.py
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

from backup_manager import export_all_collections, get_system_backup_stats


def main():
    print("=" * 65)
    print("      NIRYAT SAATHI — DATABASE BACKUP GENERATOR")
    print("=" * 65)
    
    print("\n[1/2] Connecting to MongoDB and scanning collections...")
    stats_before = get_system_backup_stats()
    
    if not stats_before['db_online']:
        print("[!] ERROR: Cannot connect to MongoDB. Ensure MongoDB service is running.")
        sys.exit(1)
        
    print(f"  [+] Database: '{stats_before['db_name']}'")
    print(f"  [+] MongoDB Ping Latency: {stats_before['ping_ms']} ms")
    print(f"  [+] Total Documents to Backup: {stats_before['total_live_documents']}")
    
    print("\n[2/2] Exporting collections to JSON & Snapshot Archive...")
    result = export_all_collections(create_snapshot=True)
    
    for col_name, info in result['collections'].items():
        kb = round(info['size_bytes'] / 1024, 2)
        print(f"  [OK] {col_name.ljust(24)} -> {str(info['records']).rjust(4)} records ({kb} KB)")
        
    print("\n" + "=" * 65)
    print(f" [SUCCESS] Backup Completed Successfully!")
    print(f"   * Total Collections: {result['total_collections']}")
    print(f"   * Total Documents:   {result['total_records']}")
    print(f"   * Target Directory:  {os.path.join(BASE_DIR, 'data_backup')}")
    if result.get('snapshot_folder'):
        print(f"   * Snapshot Created:  {result['snapshot_folder']}")
    print("=" * 65 + "\n")


if __name__ == '__main__':
    main()
