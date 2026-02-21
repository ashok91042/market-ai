#!/usr/bin/env python3
"""
CLI Interface for MarketAI Suite
Simple question-based input for users
"""

import requests
import json
import sys
from typing import List, Dict, Any

# Configuration
API_BASE_URL = "http://localhost:8000"
API_KEY = "AIzaSyB8o65qDz-8kuWEMPhB5fjRGzJGo4c9NNY"

HEADERS = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
}


def print_banner():
    """Display welcome banner"""
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║          🚀 MarketAI Suite - CLI Interface                 ║
    ║                                                            ║
    ║  AI-Powered Marketing Tools                               ║
    ║  - Campaign Generator                                     ║
    ║  - Sales Pitch Creator                                    ║
    ║  - Lead Scoring                                           ║
    ╚════════════════════════════════════════════════════════════╝
    """)


def get_leads() -> List[Dict[str, Any]]:
    """Collect lead information from user"""
    leads = []
    print("\n📋 Enter Lead Information")
    print("=" * 50)
    
    while True:
        print(f"\n--- Lead #{len(leads) + 1} ---")
        
        # Collect lead data
        name = input("Lead name (or company name): ").strip()
        if not name:
            if leads:
                print("✅ Lead entry complete")
                break
            else:
                print("❌ Please enter at least one lead name")
                continue
        
        company = input("Company name: ").strip() or name
        title = input("Job title (e.g., CEO, CMO, Manager): ").strip() or "Business Owner"
        email = input("Email address: ").strip() or f"{name.lower().replace(' ', '.')}@example.com"
        
        try:
            revenue = input("Annual revenue in $ (e.g., 1000000, or blank for unknown): ").strip()
            annual_revenue = int(revenue) if revenue else 0
        except ValueError:
            print("⚠️  Invalid revenue format, setting to 0")
            annual_revenue = 0
        
        lead = {
            "name": name,
            "company": company,
            "title": title,
            "email": email,
            "annual_revenue": annual_revenue
        }
        leads.append(lead)
        
        add_more = input("\nAdd another lead? (yes/no): ").strip().lower()
        if add_more not in ['yes', 'y']:
            break
    
    return leads


def generate_campaign():
    """Generate marketing campaign"""
    print("\n🎯 Campaign Generator")
    print("=" * 50)
    
    leads = get_leads()
    if not leads:
        print("❌ No leads provided")
        return
    
    goal = input("\nCampaign goal (e.g., 'Increase brand awareness', 'Generate 50 qualified leads'): ").strip()
    goal = goal or "Increase engagement and conversion"
    
    print("\n⏳ Generating campaign...")
    
    try:
        payload = {
            "leads": leads,
            "task": "campaign",
            "params": {"goal": goal}
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/analyze",
            json=payload,
            headers=HEADERS,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            insights = result.get("insights", result)
            print("\n✅ Campaign Generated Successfully!")
            print("=" * 50)
            if isinstance(insights, dict):
                print(json.dumps(insights, indent=2))
            else:
                print(insights)
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {str(e)}")


def generate_pitch():
    """Generate sales pitch"""
    print("\n💬 Sales Pitch Generator")
    print("=" * 50)
    
    leads = get_leads()
    if not leads:
        print("❌ No leads provided")
        return
    
    print("\n⏳ Generating pitches...")
    
    try:
        payload = {
            "leads": leads,
            "task": "pitch"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/analyze",
            json=payload,
            headers=HEADERS,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            insights = result.get("insights", result)
            print("\n✅ Pitches Generated Successfully!")
            print("=" * 50)
            if isinstance(insights, dict):
                print(json.dumps(insights, indent=2))
            else:
                print(insights)
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {str(e)}")


def score_leads():
    """Score leads based on potential"""
    print("\n⭐ Lead Scoring")
    print("=" * 50)
    
    leads = get_leads()
    if not leads:
        print("❌ No leads provided")
        return
    
    print("\n⏳ Scoring leads...")
    
    try:
        payload = {
            "leads": leads,
            "task": "scoring"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/analyze",
            json=payload,
            headers=HEADERS,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            insights = result.get("insights", result)
            print("\n✅ Leads Scored Successfully!")
            print("=" * 50)
            if isinstance(insights, dict):
                print(json.dumps(insights, indent=2))
            else:
                print(insights)
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {str(e)}")


def main_menu():
    """Display main menu"""
    print("\n📌 Main Menu")
    print("=" * 50)
    print("1. Generate Marketing Campaign")
    print("2. Generate Sales Pitch")
    print("3. Score Leads")
    print("4. Exit")
    print("=" * 50)


def check_server():
    """Check if backend server is running"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/health", timeout=2)
        return response.status_code == 200
    except:
        return False


def main():
    """Main CLI loop"""
    print_banner()
    
    # Check server
    print("🔍 Checking server connection...")
    if not check_server():
        print("❌ Cannot connect to backend server at", API_BASE_URL)
        print("Please make sure the backend is running: python backend/main.py")
        sys.exit(1)
    
    print("✅ Connected to MarketAI Suite")
    
    while True:
        main_menu()
        choice = input("Select an option (1-4): ").strip()
        
        if choice == "1":
            generate_campaign()
        elif choice == "2":
            generate_pitch()
        elif choice == "3":
            score_leads()
        elif choice == "4":
            print("\n✨ Thank you for using MarketAI Suite!")
            break
        else:
            print("❌ Invalid choice. Please select 1-4")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✨ Goodbye!")
        sys.exit(0)
