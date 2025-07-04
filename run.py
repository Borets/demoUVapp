#!/usr/bin/env python3
"""
Simple script to run the UV demo app
"""

if __name__ == "__main__":
    import os
    import uvicorn
    from app.main import app
    
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False  # Disable reload in production
    )