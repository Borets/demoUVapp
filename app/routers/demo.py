from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/speed", response_class=HTMLResponse)
async def speed_demo(request: Request):
    """Speed comparison demonstration"""
    return templates.TemplateResponse(
        "speed_demo.html",
        {"request": request, "title": "UV Speed Comparison"}
    )

@router.get("/dependencies", response_class=HTMLResponse)
async def dependencies_demo(request: Request):
    """Dependency management demonstration"""
    return templates.TemplateResponse(
        "dependencies_demo.html",
        {"request": request, "title": "UV Dependency Management"}
    )

@router.get("/project", response_class=HTMLResponse)
async def project_demo(request: Request):
    """Project management demonstration"""
    return templates.TemplateResponse(
        "project_demo.html",
        {"request": request, "title": "UV Project Management"}
    )

@router.get("/python-versions", response_class=HTMLResponse)
async def python_versions_demo(request: Request):
    """Python version management demonstration"""
    return templates.TemplateResponse(
        "python_versions_demo.html",
        {"request": request, "title": "UV Python Version Management"}
    )