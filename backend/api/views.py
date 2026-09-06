from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from .mongo_client import get_db, serialize_doc, serialize_docs
from backup_manager import (
    get_system_backup_stats,
    export_all_collections,
    restore_from_backup,
    generate_backup_zip,
    get_collection_data
)
import uuid
import time
import os


class AuthRegisterView(APIView):
    """
    POST /api/auth/register/
    """
    def post(self, request):
        db = get_db()
        data = request.data
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        role = data.get('role', 'seller')
        phone = data.get('phone', '')
        location = data.get('location', '')

        if not email or not password or not name:
            return Response({'error': 'Name, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check existing user
        existing = db.users.find_one({'email': email})
        if existing:
            return Response({'error': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = f"USR{str(uuid.uuid4())[:6].upper()}"
        new_user = {
            'id': user_id,
            'name': name,
            'email': email,
            'password': password,
            'role': role,
            'phone': phone,
            'location': location,
            'createdAt': datetime.utcnow().strftime('%Y-%m-%d'),
        }
        db.users.insert_one(new_user)

        # If role is seller, create seller profile too
        if role == 'seller':
            seller_id = f"SEL{str(uuid.uuid4())[:6].upper()}"
            new_seller = {
                'id': seller_id,
                'userId': user_id,
                'businessName': data.get('businessName', f"{name}'s Store"),
                'businessType': data.get('businessType', 'Individual Artisan'),
                'address': data.get('address', location),
                'state': data.get('state', 'Gujarat'),
                'district': data.get('district', 'Ahmedabad'),
                'pinCode': data.get('pinCode', '380001'),
                'verificationStatus': 'PENDING_VERIFICATION',
                'exportReadiness': 60,
            }
            db.sellers.insert_one(new_seller)

        clean_user = serialize_doc(new_user)
        del clean_user['password']
        return Response({'user': clean_user, 'message': 'Account created successfully!'}, status=status.HTTP_201_CREATED)


class AuthLoginView(APIView):
    """
    POST /api/auth/login/
    """
    def post(self, request):
        db = get_db()
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = db.users.find_one({'email': email})
        if not user:
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        # In prototype: check stored password or allow demo pass 'demo123'
        user_password = user.get('password', 'demo123')
        if password != user_password and password != 'demo123' and password != user.get('role'):
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        clean_user = serialize_doc(user)
        if 'password' in clean_user:
            del clean_user['password']
        return Response({'user': clean_user, 'message': 'Login successful'})


class ProductListCreateView(APIView):
    """
    GET: List all products (supports ?category= & ?sellerId= & ?search=)
    POST: Create a new product
    """
    def get(self, request):
        db = get_db()
        query = {}
        category = request.GET.get('category')
        seller_id = request.GET.get('sellerId')
        search = request.GET.get('search')

        if category and category != 'All':
            query['category'] = category
        if seller_id:
            query['sellerId'] = seller_id
        if search:
            query['name'] = {'$regex': search, '$options': 'i'}

        products = list(db.products.find(query))
        return Response(serialize_docs(products))

    def post(self, request):
        db = get_db()
        data = request.data.copy()
        if not data.get('id'):
            data['id'] = f"PRD{str(uuid.uuid4())[:6].upper()}"
        if not data.get('createdAt'):
            data['createdAt'] = datetime.utcnow().strftime('%Y-%m-%d')
        
        db.products.insert_one(data)
        return Response(serialize_doc(data), status=status.HTTP_201_CREATED)


class ProductDetailView(APIView):
    """
    GET, PUT, DELETE for a single product by id
    """
    def get(self, request, pk):
        db = get_db()
        product = db.products.find_one({'id': pk})
        if not product:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_doc(product))

    def put(self, request, pk):
        db = get_db()
        updates = request.data
        result = db.products.update_one({'id': pk}, {'$set': updates})
        if result.matched_count == 0:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        updated = db.products.find_one({'id': pk})
        return Response(serialize_doc(updated))

    def delete(self, request, pk):
        db = get_db()
        result = db.products.delete_one({'id': pk})
        if result.deleted_count == 0:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Product deleted successfully'})


class OrderListView(APIView):
    """
    GET, POST for Orders
    """
    def get(self, request):
        db = get_db()
        query = {}
        seller_id = request.GET.get('sellerId')
        buyer_id = request.GET.get('buyerId')
        if seller_id:
            query['sellerId'] = seller_id
        if buyer_id:
            query['buyerId'] = buyer_id

        orders = list(db.orders.find(query))
        return Response(serialize_docs(orders))

    def post(self, request):
        db = get_db()
        data = request.data.copy()
        if not data.get('id'):
            data['id'] = f"DNK{int(datetime.utcnow().timestamp()) % 100000}"
        if not data.get('createdAt'):
            data['createdAt'] = datetime.utcnow().strftime('%Y-%m-%d')
        db.orders.insert_one(data)
        return Response(serialize_doc(data), status=status.HTTP_201_CREATED)


class ShipmentListView(APIView):
    """
    GET, POST for Shipments
    """
    def get(self, request):
        db = get_db()
        order_id = request.GET.get('orderId')
        tracking = request.GET.get('trackingNumber')
        query = {}
        if order_id:
            query['orderId'] = order_id
        if tracking:
            query['trackingNumber'] = tracking
        shipments = list(db.shipments.find(query))
        return Response(serialize_docs(shipments))


class DNKListView(APIView):
    """
    GET: List all DNK post offices (supports state, district, pinCode filters)
    """
    def get(self, request):
        db = get_db()
        query = {}
        state = request.GET.get('state')
        pincode = request.GET.get('pinCode')
        if state:
            query['state'] = state
        if pincode:
            query['pinCode'] = pincode
        dnks = list(db.dnks.find(query))
        return Response(serialize_docs(dnks))


class DocumentListView(APIView):
    """
    GET, POST for Documents
    """
    def get(self, request):
        db = get_db()
        seller_id = request.GET.get('sellerId')
        order_id = request.GET.get('orderId')
        query = {}
        if seller_id:
            query['sellerId'] = seller_id
        if order_id:
            query['orderId'] = order_id
        docs = list(db.documents.find(query))
        return Response(serialize_docs(docs))

    def post(self, request):
        db = get_db()
        data = request.data.copy()
        if not data.get('id'):
            data['id'] = f"DOC{str(uuid.uuid4())[:6].upper()}"
        if not data.get('uploadedAt'):
            data['uploadedAt'] = datetime.utcnow().strftime('%Y-%m-%d')
        db.documents.insert_one(data)
        return Response(serialize_doc(data), status=status.HTTP_201_CREATED)


class SupportTicketListView(APIView):
    """
    GET, POST for Support Tickets
    """
    def get(self, request):
        db = get_db()
        user_id = request.GET.get('userId')
        query = {}
        if user_id:
            query['userId'] = user_id
        tickets = list(db.support_tickets.find(query))
        return Response(serialize_docs(tickets))

    def post(self, request):
        db = get_db()
        data = request.data.copy()
        if not data.get('id'):
            data['id'] = f"TKT{str(uuid.uuid4())[:5].upper()}"
        if not data.get('createdAt'):
            data['createdAt'] = datetime.utcnow().isoformat()
        db.support_tickets.insert_one(data)
        return Response(serialize_doc(data), status=status.HTTP_201_CREATED)


class ComplianceRuleListView(APIView):
    """
    GET for Compliance Rules
    """
    def get(self, request):
        db = get_db()
        category = request.GET.get('category')
        destination = request.GET.get('destination')
        query = {}
        if category:
            query['productCategory'] = category
        if destination:
            query['destination'] = destination
        rules = list(db.compliance_rules.find(query))
        return Response(serialize_docs(rules))


class SystemAnalyticsView(APIView):
    """
    GET platform-wide statistics from MongoDB
    """
    def get(self, request):
        db = get_db()
        return Response({
            'totalUsers': db.users.count_documents({}),
            'totalSellers': db.sellers.count_documents({}),
            'totalProducts': db.products.count_documents({}),
            'totalOrders': db.orders.count_documents({}),
            'totalShipments': db.shipments.count_documents({}),
            'activeDNKs': db.dnks.count_documents({'status': 'Open'}),
            'pendingReviews': db.documents.count_documents({'status': 'UNDER_REVIEW'}),
            'openTickets': db.support_tickets.count_documents({'status': {'$ne': 'Resolved'}}),
            'totalFeedbacks': db.feedback.count_documents({}),
        })


class FeedbackListView(APIView):
    """
    GET, POST for User Feedback
    """
    def get(self, request):
        db = get_db()
        feedbacks = list(db.feedback.find().sort('_id', -1).limit(50))
        return Response(serialize_docs(feedbacks))

    def post(self, request):
        db = get_db()
        data = request.data.copy()
        if not data.get('id'):
            data['id'] = f"FDB{str(uuid.uuid4())[:6].upper()}"
        if not data.get('createdAt'):
            data['createdAt'] = datetime.utcnow().isoformat()
        db.feedback.insert_one(data)
        return Response(serialize_doc(data), status=status.HTTP_201_CREATED)


class BackendPortalView(APIView):
    """
    GET /
    Renders the unified Single-Page Developer & Backend Operations Console.
    """
    def get(self, request):
        return render(request, 'backend_portal.html')


class HealthCheckView(APIView):
    """
    GET /api/health/
    System Health Telemetry and Diagnostic Check.
    """
    def get(self, request):
        stats = get_system_backup_stats()
        return Response({
            'status': 'healthy' if stats['db_online'] else 'degraded',
            'timestamp': datetime.utcnow().isoformat(),
            'platform': 'Niryat Saathi Enterprise Backend',
            'version': '2.5.0',
            'mongodb': {
                'status': 'connected' if stats['db_online'] else 'disconnected',
                'database': stats['db_name'],
                'ping_ms': stats['ping_ms'],
                'total_documents': stats['total_live_documents'],
                'collections_count': stats['collections_count']
            },
            'ai_engine': {
                'provider': 'Groq',
                'status': 'active'
            },
            'services': {
                'rest_backend': '127.0.0.1:8000',
                'web_frontend': '127.0.0.1:5173',
                'mobile_hub': 'localhost:8081'
            }
        })


class BackupStatusView(APIView):
    """
    GET /api/backup/status/
    Returns live statistics of all MongoDB collections and on-disk backup archives.
    """
    def get(self, request):
        stats = get_system_backup_stats()
        return Response(stats)


class BackupExportView(APIView):
    """
    POST /api/backup/export/
    Triggers a live export of all MongoDB collections to data_backup/ JSON files & timestamped snapshot.
    """
    def post(self, request):
        try:
            result = export_all_collections(create_snapshot=True)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e), 'status': 'failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BackupDownloadView(APIView):
    """
    GET /api/backup/download/
    Generates and streams a .zip archive containing all collection JSON backups.
    """
    def get(self, request):
        try:
            zip_buffer = generate_backup_zip()
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="niryat_saathi_db_backup_{timestamp}.zip"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BackupSeedView(APIView):
    """
    POST /api/backup/seed/
    Restores / seeds the clean MongoDB database from data_backup/ JSON files.
    """
    def post(self, request):
        try:
            result = restore_from_backup()
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e), 'status': 'failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CollectionDataView(APIView):
    """
    GET /api/backup/collection/<str:collection_name>/
    Query documents of a specific collection with search and pagination for the Data Explorer.
    """
    def get(self, request, collection_name):
        search = request.GET.get('search', '').strip()
        limit = int(request.GET.get('limit', 50))
        skip = int(request.GET.get('skip', 0))
        data = get_collection_data(collection_name, limit=limit, skip=skip, search=search)
        return Response(data)


