"""
Backup & Data Management Engine for Niryat Saathi Backend.
Handles exporting, seeding, restoring, ZIP bundling, and stats for MongoDB collections.
"""

import os
import io
import json
import glob
import time
import zipfile
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from django.conf import settings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKUP_DIR = os.path.join(BASE_DIR, 'data_backup')
SNAPSHOTS_DIR = os.path.join(BACKUP_DIR, 'snapshots')

# Recognized system collections
KNOWN_COLLECTIONS = [
    'users',
    'sellers',
    'products',
    'orders',
    'shipments',
    'dnks',
    'documents',
    'support_tickets',
    'compliance_rules',
    'analytics',
    'feedback',
    'notifications',
    'assistant_qa',
    'export_journey_steps',
]


def get_mongo_client():
    uri = getattr(settings, 'MONGODB_URI', 'mongodb://localhost:27017/')
    return MongoClient(uri, serverSelectionTimeoutMS=4000)


def get_db():
    client = get_mongo_client()
    db_name = getattr(settings, 'MONGODB_DB_NAME', 'sih_dakghar_db')
    return client[db_name]


def clean_record_for_mongo(rec):
    """Sanitize _id and objects before inserting into MongoDB."""
    if not isinstance(rec, dict):
        return rec
    rec = rec.copy()
    if '_id' in rec:
        if isinstance(rec['_id'], dict) and '$oid' in rec['_id']:
            rec['_id'] = ObjectId(rec['_id']['$oid'])
        elif isinstance(rec['_id'], dict):
            del rec['_id']
        elif isinstance(rec['_id'], str) and len(rec['_id']) == 24:
            try:
                rec['_id'] = ObjectId(rec['_id'])
            except Exception:
                pass
    return rec


def serialize_doc_for_export(doc):
    """Convert Mongo document into JSON-serializable dictionary."""
    if not isinstance(doc, dict):
        return doc
    clean = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            clean[k] = str(v)
        elif isinstance(v, datetime):
            clean[k] = v.isoformat()
        elif isinstance(v, list):
            clean[k] = [serialize_doc_for_export(item) if isinstance(item, dict) else (str(item) if isinstance(item, ObjectId) else item) for item in v]
        elif isinstance(v, dict):
            clean[k] = serialize_doc_for_export(v)
        else:
            clean[k] = v
    return clean


def export_all_collections(create_snapshot=True):
    """
    Exports all MongoDB collections to JSON files in data_backup/
    and optionally in a timestamped snapshot subfolder.
    """
    os.makedirs(BACKUP_DIR, exist_ok=True)
    if create_snapshot:
        os.makedirs(SNAPSHOTS_DIR, exist_ok=True)

    db = get_db()
    existing_cols = db.list_collection_names()
    # Filter out system collections like system.views
    cols_to_export = [c for c in existing_cols if not c.startswith('system.') and not c.startswith('_')]

    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    snapshot_subfolder = os.path.join(SNAPSHOTS_DIR, f"snapshot_{timestamp}") if create_snapshot else None
    if snapshot_subfolder:
        os.makedirs(snapshot_subfolder, exist_ok=True)

    results = {}
    total_records = 0

    for col_name in cols_to_export:
        docs = list(db[col_name].find())
        serialized_docs = [serialize_doc_for_export(doc) for doc in docs]

        # Primary backup file
        target_path = os.path.join(BACKUP_DIR, f"{col_name}.json")
        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(serialized_docs, f, indent=2, ensure_ascii=False)

        # Snapshot copy
        if snapshot_subfolder:
            snap_path = os.path.join(snapshot_subfolder, f"{col_name}.json")
            with open(snap_path, 'w', encoding='utf-8') as f:
                json.dump(serialized_docs, f, indent=2, ensure_ascii=False)

        results[col_name] = {
            'records': len(serialized_docs),
            'size_bytes': os.path.getsize(target_path),
            'file': f"{col_name}.json"
        }
        total_records += len(serialized_docs)

    return {
        'status': 'success',
        'timestamp': datetime.utcnow().isoformat(),
        'total_collections': len(cols_to_export),
        'total_records': total_records,
        'snapshot_folder': f"snapshot_{timestamp}" if create_snapshot else None,
        'collections': results
    }


def restore_from_backup(backup_folder=None):
    """
    Restores / seeds MongoDB from JSON files in data_backup/ or specified folder.
    """
    folder = backup_folder if backup_folder and os.path.isdir(backup_folder) else BACKUP_DIR
    if not os.path.isdir(folder):
        raise FileNotFoundError(f"Backup directory not found: {folder}")

    json_files = glob.glob(os.path.join(folder, '*.json'))
    if not json_files:
        raise ValueError(f"No JSON backup files found in {folder}")

    db = get_db()
    total_seeded = 0
    results = {}

    for json_path in sorted(json_files):
        col_name = os.path.splitext(os.path.basename(json_path))[0]
        if col_name.startswith('_'):
            continue

        with open(json_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)

        if isinstance(raw_data, list):
            cleaned_data = [clean_record_for_mongo(item) for item in raw_data]
            coll = db[col_name]
            coll.delete_many({})
            if cleaned_data:
                coll.insert_many(cleaned_data)
            results[col_name] = len(cleaned_data)
            total_seeded += len(cleaned_data)
        elif isinstance(raw_data, dict):
            # Single object collection
            cleaned_doc = clean_record_for_mongo(raw_data)
            coll = db[col_name]
            coll.delete_many({})
            coll.insert_one(cleaned_doc)
            results[col_name] = 1
            total_seeded += 1

    return {
        'status': 'success',
        'restored_at': datetime.utcnow().isoformat(),
        'total_collections': len(results),
        'total_records': total_seeded,
        'collections': results
    }


def generate_backup_zip():
    """
    Creates an in-memory ZIP archive containing all current backup JSON files.
    """
    json_files = glob.glob(os.path.join(BACKUP_DIR, '*.json'))
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Include metadata manifest
        manifest = {
            'platform': 'Niryat Saathi Enterprise Platform',
            'exported_at': datetime.utcnow().isoformat(),
            'database': getattr(settings, 'MONGODB_DB_NAME', 'sih_dakghar_db'),
            'file_count': len(json_files)
        }
        zip_file.writestr('manifest.json', json.dumps(manifest, indent=2))

        for json_path in json_files:
            file_name = os.path.basename(json_path)
            zip_file.write(json_path, arcname=f"data/{file_name}")

    zip_buffer.seek(0)
    return zip_buffer


def get_system_backup_stats():
    """
    Aggregates full system statistics including database health, collection counts,
    and backup files on disk.
    """
    db = get_db()
    live_cols = db.list_collection_names()
    live_stats = {}
    total_live_docs = 0

    # Test MongoDB Ping
    start_time = time.time()
    try:
        db.command('ping')
        ping_ms = round((time.time() - start_time) * 1000, 2)
        db_online = True
    except Exception:
        ping_ms = None
        db_online = False

    # Check live collections
    all_col_names = sorted(list(set(live_cols + KNOWN_COLLECTIONS)))
    for col_name in all_col_names:
        if col_name.startswith('system.') or col_name.startswith('_'):
            continue
        count = db[col_name].count_documents({}) if db_online and col_name in live_cols else 0
        backup_file = os.path.join(BACKUP_DIR, f"{col_name}.json")
        has_backup = os.path.isfile(backup_file)
        file_size = os.path.getsize(backup_file) if has_backup else 0
        last_modified = datetime.fromtimestamp(os.path.getmtime(backup_file)).strftime('%Y-%m-%d %H:%M:%S') if has_backup else None

        # Sample record to extract fields
        sample = db[col_name].find_one({}, {'_id': 0}) if count > 0 else None
        fields = list(sample.keys())[:6] if sample else []

        live_stats[col_name] = {
            'count': count,
            'has_backup': has_backup,
            'backup_size_bytes': file_size,
            'backup_size_kb': round(file_size / 1024, 1),
            'last_backup': last_modified,
            'sample_fields': fields
        }
        total_live_docs += count

    # Snapshots check
    snapshots = []
    if os.path.isdir(SNAPSHOTS_DIR):
        for entry in sorted(os.listdir(SNAPSHOTS_DIR), reverse=True)[:10]:
            full_path = os.path.join(SNAPSHOTS_DIR, entry)
            if os.path.isdir(full_path):
                file_count = len(glob.glob(os.path.join(full_path, '*.json')))
                created = datetime.fromtimestamp(os.path.getmtime(full_path)).strftime('%Y-%m-%d %H:%M:%S')
                snapshots.append({
                    'name': entry,
                    'created': created,
                    'file_count': file_count
                })

    return {
        'db_online': db_online,
        'ping_ms': ping_ms,
        'db_name': getattr(settings, 'MONGODB_DB_NAME', 'sih_dakghar_db'),
        'total_live_documents': total_live_docs,
        'collections_count': len(live_stats),
        'collections': live_stats,
        'snapshots': snapshots,
        'backup_dir': BACKUP_DIR,
    }


def get_collection_data(collection_name, limit=500, skip=0, search=None):
    """
    Fetches records for a specific collection with search and serialization.
    """
    db = get_db()
    if collection_name not in db.list_collection_names() and collection_name not in KNOWN_COLLECTIONS:
        return {'error': f"Collection '{collection_name}' not found", 'records': [], 'total': 0}

    coll = db[collection_name]
    query = {}
    if search:
        search_regex = {'$regex': search, '$options': 'i'}
        query = {
            '$or': [
                {'id': search_regex},
                {'name': search_regex},
                {'title': search_regex},
                {'email': search_regex},
                {'trackingNumber': search_regex},
                {'category': search_regex},
                {'status': search_regex},
                {'city': search_regex},
                {'state': search_regex},
                {'destinationCountry': search_regex},
                {'sellerId': search_regex},
                {'buyerName': search_regex},
                {'sellerName': search_regex},
                {'productName': search_regex},
                {'role': search_regex},
                {'type': search_regex},
                {'pincode': search_regex},
                {'description': search_regex},
            ]
        }

    total_matching = coll.count_documents(query)
    raw_docs = list(coll.find(query).skip(skip).limit(limit))
    clean_docs = [serialize_doc_for_export(d) for d in raw_docs]

    return {
        'collection': collection_name,
        'total': total_matching,
        'count': len(clean_docs),
        'limit': limit,
        'skip': skip,
        'records': clean_docs
    }
