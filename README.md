# python-full-stack

# flask-react-mongodb

```
frm/
├── frontend/                   # React (with Vite) Application
│   ├── public/                 # Static assets for frontend dev
│   ├── src/
│   │   ├── index.css 
│   │   ├── main.jsx            
│   │   └── App.jsx
│   ├── index.html 
│   ├── package.json
│   ├── .env                    # .env secrets for dev
│   └── vite.config.js          # Proxy configuration for /api
├── backend/                    # Flask Application
│   ├── routes/
│   │   └── user_routes.py      # Blueprint logic
│   ├── public/                 # Build destination (frontend build)
│   ├── database.py             # MongoDB connection logic
│   ├── schemas.py              # Pydantic models
│   ├── index.py                # Main entry point (Flask app)
│   ├── .env                    # MONGO_URI, SECRET_KEY
│   └── requirements.txt        # Flask, pymongo, pydantic, flask-cors, python-dotenv
├── package.json                # Root scripts
├── package-lock.json
├── .gitignore                  # Ignore node_modules, __pycache__, .env, and dist
└── vercel.json                 # Vercel hosting configuration
```