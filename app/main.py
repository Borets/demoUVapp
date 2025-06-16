from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import uvicorn
from pathlib import Path

from app.routers import demo, api

app = FastAPI(
    title="UV Package Manager Demo",
    description="Interactive demonstration of UV package manager capabilities",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="app/templates")

# Include routers
app.include_router(demo.router, prefix="/demo", tags=["demo"])
app.include_router(api.router, prefix="/api", tags=["api"])

@app.get("/", response_class=HTMLResponse)
async def homepage(request: Request):
    """Homepage with UV demo overview"""
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "title": "UV Package Manager Demo"}
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "uv-demo-app"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )