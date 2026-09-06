import sys
import json
import time
import urllib.request
import urllib.error
from pymongo import MongoClient

MONGODB_URI = "mongodb://localhost:27017/"
DB_NAME = "sih_dakghar_db"
API_BASE = "http://127.0.0.1:8000/api"

def run_tests():
    print("=" * 60)
    print(" 1. TESTING MONGODB CONNECTION & COLLECTIONS")
    print("=" * 60)
    
    start_time = time.time()
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
        ping_res = client.admin.command('ping')
        latency = round((time.time() - start_time) * 1000, 2)
        print(f" [+] MongoDB Ping: OK (Latency: {latency} ms)")
    except Exception as e:
        print(f" [!] MongoDB Connection Failed: {e}")
        return

    db = client[DB_NAME]
    collections = sorted(db.list_collection_names())
    print(f" [+] Database: '{DB_NAME}'")
    print(f" [+] Found {len(collections)} Collections:")
    
    total_docs = 0
    collection_stats = {}
    for col_name in collections:
        count = db[col_name].count_documents({})
        total_docs += count
        collection_stats[col_name] = count
        sample = db[col_name].find_one({}, {'_id': 0})
        sample_keys = list(sample.keys())[:4] if sample else []
        print(f"     * {col_name.ljust(22)} : {str(count).rjust(4)} docs | fields: {', '.join(sample_keys)}")

    print(f" [+] Total Documents across collections: {total_docs}")

    # Test MongoDB write & read
    test_col = db['_test_connectivity']
    test_col.insert_one({'test': True, 'timestamp': time.time()})
    retrieved = test_col.find_one({'test': True})
    assert retrieved is not None, "MongoDB read failed"
    test_col.delete_many({'test': True})
    print(" [+] MongoDB CRUD Operation: Verified (Write, Read, Delete OK)")

    print("\n" + "=" * 60)
    print(" 2. TESTING DJANGO BACKEND API ENDPOINTS")
    print("=" * 60)

    endpoints = [
        ("GET", "http://127.0.0.1:8000/", None),
        ("GET", "/health/", None),
        ("GET", "/backup/status/", None),
        ("GET", "/backup/collection/products/", None),
        ("GET", "/products/", None),
        ("GET", "/dnks/", None),
        ("GET", "/orders/", None),
        ("GET", "/shipments/", None),
        ("GET", "/documents/", None),
        ("GET", "/support-tickets/", None),
        ("GET", "/compliance-rules/", None),
        ("GET", "/analytics/", None),
        ("GET", "/feedback/", None),
        ("GET", "/assistant/health/", None),
        ("POST", "/auth/login/", {"email": "seller@demo.com", "password": "demo123"}),
        ("POST", "/assistant/chat/", {"message": "How do I export to Germany via DNK?", "language": "en"}),
    ]

    all_passed = True
    for method, path, payload in endpoints:
        url = path if path.startswith("http") else f"{API_BASE}{path}"
        req_start = time.time()
        try:
            req_data = json.dumps(payload).encode('utf-8') if payload else None
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={"Content-Type": "application/json"} if payload else {},
                method=method
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                duration = round((time.time() - req_start) * 1000, 1)
                status_code = response.getcode()
                body = response.read().decode('utf-8')
                try:
                    parsed = json.loads(body) if body else {}
                except Exception:
                    parsed = {"html_length": len(body)}
                
                # Summary details
                count_info = ""
                if isinstance(parsed, list):
                    count_info = f"({len(parsed)} items returned)"
                elif isinstance(parsed, dict):
                    if 'html_length' in parsed:
                        count_info = f"(Single-Page Console: {parsed['html_length']} bytes)"
                    elif 'total_live_documents' in parsed:
                        count_info = f"(DB Online: {parsed['total_live_documents']} total docs)"
                    elif 'total' in parsed:
                        count_info = f"(records: {parsed.get('count', 0)} of {parsed.get('total', 0)})"
                    elif 'results' in parsed and isinstance(parsed['results'], list):
                        count_info = f"({len(parsed['results'])} results)"
                    elif 'status' in parsed:
                        count_info = f"(status: {parsed['status']})"
                    elif 'user' in parsed:
                        count_info = f"(user: {parsed['user'].get('name', 'ok')})"
                    elif 'response' in parsed or 'reply' in parsed:
                        reply_len = len(parsed.get('response', parsed.get('reply', '')))
                        count_info = f"(AI reply length: {reply_len} chars)"

                print(f" [+] [{status_code}] {method.ljust(4)} {path.ljust(35)} in {str(duration).rjust(5)} ms {count_info}")
        except urllib.error.HTTPError as e:
            all_passed = False
            err_body = e.read().decode('utf-8', errors='ignore')
            print(f" [!] [{e.code}] {method.ljust(4)} {path.ljust(22)} ERROR: {err_body[:100]}")
        except Exception as e:
            all_passed = False
            print(f" [!] {method.ljust(4)} {path.ljust(22)} FAILED: {e}")

    print("\n" + "=" * 60)
    print(" SUMMARY STATUS")
    print("=" * 60)
    print(f" [+] MongoDB: ONLINE & HEALTHY ({len(collections)} collections, {total_docs} docs)")
    if all_passed:
        print(" [+] Django Backend API: 100% HEALTHY (All tested endpoints returned 200 OK)")
    else:
        print(" [!] Django Backend API: SOME ENDPOINTS RETURNED ERRORS")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
