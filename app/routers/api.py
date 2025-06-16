from fastapi import APIRouter
from typing import Dict, List, Any
import time
import subprocess
import sys
import psutil
import os
from pathlib import Path

router = APIRouter()

@router.get("/benchmark/install-speed")
async def benchmark_install_speed() -> Dict[str, Any]:
    """Simulate package installation speed comparison"""
    # Simulated data based on UV's real-world performance
    return {
        "pip": {
            "numpy": 12.3,
            "pandas": 28.7,
            "matplotlib": 15.2,
            "requests": 3.1,
            "total": 59.3
        },
        "uv": {
            "numpy": 0.8,
            "pandas": 1.2,
            "matplotlib": 0.9,
            "requests": 0.3,
            "total": 3.2
        },
        "improvement": "18.5x faster",
        "timestamp": time.time()
    }

@router.get("/benchmark/venv-creation")
async def benchmark_venv_creation() -> Dict[str, Any]:
    """Simulate virtual environment creation speed comparison"""
    return {
        "python_venv": 8.2,
        "virtualenv": 2.1,
        "uv_venv": 0.1,
        "improvement_vs_python": "82x faster",
        "improvement_vs_virtualenv": "21x faster",
        "timestamp": time.time()
    }

@router.get("/system/info")
async def system_info() -> Dict[str, Any]:
    """Get system information for the demo"""
    return {
        "python_version": sys.version,
        "platform": sys.platform,
        "cpu_count": psutil.cpu_count(),
        "memory_gb": round(psutil.virtual_memory().total / (1024**3), 2),
        "disk_usage": {
            "total": round(psutil.disk_usage('/').total / (1024**3), 2),
            "free": round(psutil.disk_usage('/').free / (1024**3), 2)
        }
    }

@router.get("/project/structure")
async def project_structure() -> Dict[str, Any]:
    """Show current project structure managed by UV"""
    def get_directory_structure(path: Path, max_depth: int = 2, current_depth: int = 0) -> List[Dict[str, Any]]:
        if current_depth >= max_depth:
            return []
        
        items = []
        try:
            for item in sorted(path.iterdir()):
                if item.name.startswith('.'):
                    continue
                    
                item_data = {
                    "name": item.name,
                    "type": "directory" if item.is_dir() else "file",
                    "size": item.stat().st_size if item.is_file() else None
                }
                
                if item.is_dir() and current_depth < max_depth - 1:
                    item_data["children"] = get_directory_structure(item, max_depth, current_depth + 1)
                
                items.append(item_data)
        except PermissionError:
            pass
            
        return items
    
    project_root = Path(".")
    return {
        "project_root": str(project_root.resolve()),
        "structure": get_directory_structure(project_root),
        "key_files": {
            "pyproject_toml": (project_root / "pyproject.toml").exists(),
            "uv_lock": (project_root / "uv.lock").exists(),
            "requirements_txt": (project_root / "requirements.txt").exists()
        }
    }

@router.get("/dependencies/analysis")
async def dependencies_analysis() -> Dict[str, Any]:
    """Analyze project dependencies"""
    # Mock dependency analysis data
    return {
        "total_dependencies": 12,
        "direct_dependencies": 6,
        "transitive_dependencies": 6,
        "dependency_tree": {
            "fastapi": {
                "version": "0.104.0",
                "dependencies": ["starlette", "pydantic", "typing-extensions"]
            },
            "uvicorn": {
                "version": "0.24.0",
                "dependencies": ["asgiref", "click", "h11"]
            },
            "matplotlib": {
                "version": "3.7.0",
                "dependencies": ["numpy", "python-dateutil", "kiwisolver"]
            }
        },
        "security_advisories": 0,
        "outdated_packages": 0,
        "lock_file_status": "up_to_date"
    }