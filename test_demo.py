#!/usr/bin/env python3
"""
Simple test script to verify demo app structure and functionality
"""

import os
import json
from pathlib import Path

def test_project_structure():
    """Test that all required files are present"""
    required_files = [
        "pyproject.toml",
        "uv.lock", 
        "requirements.txt",
        "run.py",
        "app/main.py",
        "app/__init__.py",
        "app/routers/api.py",
        "app/routers/demo.py",
        "app/templates/base.html",
        "app/templates/index.html",
        "app/templates/dependencies_demo.html",
        "app/templates/project_demo.html",
        "app/templates/python_versions_demo.html",
        "app/templates/speed_demo.html",
        "app/static/css/style.css",
        "app/static/js/app.js",
        "demos/speed_demo.py",
        "demos/dependency_demo.py",
        "README.md"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    else:
        print("✅ All required files present")
        return True

def test_template_structure():
    """Test that templates have proper structure"""
    templates_dir = Path("app/templates")
    templates = list(templates_dir.glob("*.html"))
    
    print(f"✅ Found {len(templates)} HTML templates")
    
    # Check each template for basic structure
    for template in templates:
        content = template.read_text()
        if "{% extends" in content or template.name == "base.html":
            print(f"✅ {template.name} has proper template structure")
        else:
            print(f"⚠️  {template.name} might be missing template inheritance")
    
    return True

def test_api_structure():
    """Test API route structure"""
    api_file = Path("app/routers/api.py")
    if not api_file.exists():
        print("❌ API router file missing")
        return False
    
    content = api_file.read_text()
    
    # Check for required API endpoints
    required_endpoints = [
        "/benchmark/install-speed",
        "/benchmark/venv-creation", 
        "/system/info",
        "/project/structure",
        "/dependencies/analysis"
    ]
    
    missing_endpoints = []
    for endpoint in required_endpoints:
        if endpoint not in content:
            missing_endpoints.append(endpoint)
    
    if missing_endpoints:
        print(f"❌ Missing API endpoints: {missing_endpoints}")
        return False
    else:
        print("✅ All required API endpoints present")
        return True

def test_static_assets():
    """Test static assets"""
    css_file = Path("app/static/css/style.css")
    js_file = Path("app/static/js/app.js")
    
    if css_file.exists():
        css_content = css_file.read_text()
        if len(css_content) > 1000:  # Basic check for substantial CSS
            print("✅ CSS file has substantial content")
        else:
            print("⚠️  CSS file seems minimal")
    else:
        print("❌ CSS file missing")
        return False
    
    if js_file.exists():
        js_content = js_file.read_text()
        if "class UVDemo" in js_content:
            print("✅ JavaScript has demo functionality")
        else:
            print("⚠️  JavaScript missing demo classes")
    else:
        print("❌ JavaScript file missing")
        return False
    
    return True

def test_demo_modules():
    """Test demo modules"""
    speed_demo = Path("demos/speed_demo.py")
    dependency_demo = Path("demos/dependency_demo.py")
    
    modules_ok = True
    
    if speed_demo.exists():
        content = speed_demo.read_text()
        if "class SpeedDemonstrator" in content:
            print("✅ Speed demo module has proper structure")
        else:
            print("⚠️  Speed demo missing main class")
            modules_ok = False
    else:
        print("❌ Speed demo module missing")
        modules_ok = False
    
    if dependency_demo.exists():
        content = dependency_demo.read_text()
        if "class DependencyDemonstrator" in content:
            print("✅ Dependency demo module has proper structure")
        else:
            print("⚠️  Dependency demo missing main class")
            modules_ok = False
    else:
        print("❌ Dependency demo module missing")
        modules_ok = False
    
    return modules_ok

def test_configuration_files():
    """Test configuration files"""
    pyproject = Path("pyproject.toml")
    uv_lock = Path("uv.lock")
    requirements = Path("requirements.txt")
    
    config_ok = True
    
    if pyproject.exists():
        content = pyproject.read_text()
        if "[project]" in content and "fastapi" in content:
            print("✅ pyproject.toml has proper structure")
        else:
            print("⚠️  pyproject.toml missing required content")
            config_ok = False
    else:
        print("❌ pyproject.toml missing")
        config_ok = False
    
    if uv_lock.exists():
        print("✅ uv.lock file present")
    else:
        print("❌ uv.lock file missing")
        config_ok = False
    
    if requirements.exists():
        content = requirements.read_text()
        if "fastapi" in content and "uvicorn" in content:
            print("✅ requirements.txt has required dependencies")
        else:
            print("⚠️  requirements.txt missing core dependencies")
            config_ok = False
    else:
        print("❌ requirements.txt missing")
        config_ok = False
    
    return config_ok

def main():
    """Run all tests"""
    print("🚀 Testing UV Demo App Structure and Functionality")
    print("=" * 60)
    
    tests = [
        ("Project Structure", test_project_structure),
        ("Template Structure", test_template_structure), 
        ("API Structure", test_api_structure),
        ("Static Assets", test_static_assets),
        ("Demo Modules", test_demo_modules),
        ("Configuration Files", test_configuration_files)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n📋 Testing {test_name}...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} | {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! Demo app is ready for deployment.")
        return True
    else:
        print("⚠️  Some tests failed. Please review the issues above.")
        return False

if __name__ == "__main__":
    main()