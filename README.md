# Niryat Saathi (निर्यात् साथी)
### Digital Export Enablement Platform for Rural Indian Sellers & MSMEs via Dak Ghar Niryat Kendra (DNK)

> 📄 **System Documentation PDF:** [Niryat_Saathi_Project_Flow_Documentation.pdf](./Niryat_Saathi_Project_Flow_Documentation.pdf)  
> 📘 **Technical Architecture Guide:** [Niryat_Saathi_Technical_Documentation.pdf](./Niryat_Saathi_Technical_Documentation.pdf)

---

## 🏗️ Clean Project Architecture

```
SIH/
├── backend/                       # Django REST Framework Backend + MongoDB
│   ├── api/                      # REST API Endpoints (Products, DNKs, Orders, etc.)
│   ├── ai_assistant/             # Groq Multilingual AI Export Assistant (Daksh)
│   ├── backup_manager.py         # Unified Backup, ZIP & MongoDB Restore Engine
│   ├── backup_data.py            # CLI Backup Exporter & Snapshot Generator
│   ├── seed_data.py              # MongoDB Seeding & Database Restore
│   ├── templates/                # Single-Page Enterprise Backend Console (HTML5/Tailwind/Alpine)
│   ├── sih_backend/              # Django Settings, URLs, CORS, WSGI
│   ├── data_backup/              # Authoritative Clean Datasets (13 collections, 173 records)
│   │   └── snapshots/            # Automated Timestamped Backup Archives
│   └── manage.py
│
├── Dakh-main/                     # Web Frontend (Vite + React 19 + TypeScript + Tailwind)
│   ├── src/
│   │   ├── pages/                # Seller, Operator, Admin, Buyer Portals + Marketplace
│   │   ├── store/                # Unified Zustand stores (Live MongoDB Sync & Cache)
│   │   ├── components/           # UI components, Charts, Maps
│   │   └── i18n/                 # Multi-language translation layer (EN, HI, GU)
│   └── package.json
│
├── mobile/                        # Cross-Platform Mobile App (Expo + React Native)
│   ├── src/
│   │   ├── screens/              # Visual Map, Export Hub, Daksh AI, PBE Filing
│   │   ├── components/           # Gujarat Visual Map, Counter Cards
│   │   └── api/                  # Dynamic API client connecting to Django backend
│   └── package.json
│
└── run_project.bat                # 1-Click launcher for Backend, DB, Web, and Mobile
```

---

## ⚡ How to Run Everything

### Option 1: 1-Click Launch (Recommended)
Simply double click or run:
```cmd
.\run_project.bat
```

### Option 2: Individual Commands

1. **Backend Single-Page Console & REST API**:
   ```cmd
   cd backend
   .\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
   ```

2. **Trigger Full Database Backup (CLI)**:
   ```cmd
   cd backend
   .\venv\Scripts\python.exe backup_data.py
   ```

3. **Restore / Re-Seed Database (CLI)**:
   ```cmd
   cd backend
   .\venv\Scripts\python.exe seed_data.py
   ```

4. **Web Frontend**:
   ```cmd
   cd Dakh-main
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

5. **Mobile App**:
   ```cmd
   cd mobile
   npx expo start --web --port 8081
   ```

---

## 👥 Demo User Accounts (1-Click Login on UI)

| Role | Name | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Seller** | Meera Patel | `seller@demo.com` | `demo123` | `/seller` (Export Hub, Catalog, Cost Calc) |
| **DNK Operator** | Rajesh Kumar | `operator@demo.com` | `demo123` | `/operator` (Post Office Counter, Queue, PBE) |
| **Postal Admin** | Priya Sharma | `admin@demo.com` | `demo123` | `/admin` (National Postal Analytics) |
| **Buyer** | Hans Mueller | `buyer@demo.com` | `demo123` | `/buyer` (Marketplace & Order Tracking) |

---

## 🌐 Live URLs & Dashboards

- **Backend Single-Page Console**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/) *(Live Telemetry, Data Explorer, Backup Suite, API Tester, AI Daksh)*
- **Backend REST API Root**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- **System Health Diagnostics**: [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/)
- **1-Click Backup Download**: [http://127.0.0.1:8000/api/backup/download/](http://127.0.0.1:8000/api/backup/download/)
- **Web Frontend**: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Mobile Web App**: [http://localhost:8081](http://localhost:8081)
- **Database**: MongoDB (`mongodb://localhost:27017/sih_dakghar_db`)

