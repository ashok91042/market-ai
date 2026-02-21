import os
from typing import List, Dict, Any, Optional
try:
    import openai
except Exception:
    openai = None


def _call_openai(prompt: str, system: str = "You are a helpful assistant that outputs valid JSON.") -> Dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not openai or not api_key:
        return {"error": "OpenAI not configured"}
    openai.api_key = api_key
    try:
        resp = openai.ChatCompletion.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=800,
        )
        text = resp.choices[0].message.content
        return {"raw": text}
    except Exception as e:
        return {"error": str(e)}


def score_leads(leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = []
    for l in leads:
        rev = l.get("annual_revenue") or 0
        score = "Low"
        score_value = 1
        if rev > 1_000_000:
            score = "High"
            score_value = 9
        elif rev > 100_000:
            score = "Medium"
            score_value = 6
        # Simple rule bonus for title keywords
        title = (l.get("title") or "").lower()
        if any(k in title for k in ("ceo", "cmo", "founder", "vp")):
            score_value += 1
        results.append({"lead": l, "score": score, "score_value": score_value})
    return results


def create_pitch(lead: Dict[str, Any]) -> Dict[str, Any]:
    name = lead.get("name") or lead.get("company") or "Customer"
    pitch = f"Hi {name}, we help companies like yours increase revenue while reducing acquisition costs. Would you be open to a 10-minute call?"
    variations = [
        pitch,
        f"{name}, quick note — we've helped peers in your industry increase pipeline by 30% in 6 months. Interested in a short chat?",
        f"Hello {name}, can I share a short case study showing measurable ROI we delivered for similar companies?",
    ]
    return {"lead": lead, "pitch": pitch, "variations": variations}


def generate_campaign(leads: List[Dict[str, Any]], goal: Optional[str] = None) -> Dict[str, Any]:
    goal = goal or "pipeline generation"
    # Heuristic campaign plan
    subjects = [
        f"How {leads[0].get('company') if leads else 'companies'} cut costs by 20%",
        "Quick case study: pipeline lift in 90 days",
    ]
    plan = {
        "goal": goal,
        "channels": ["email", "linkedin", "phone"],
        "cadence_days": [0, 3, 10],
        "email_subjects": subjects,
        "steps": [
            "Send short case-study email (day 0)",
            "LinkedIn connection + message (day 3)",
            "Follow-up email with calendar link (day 10)",
        ],
    }
    return {"leads_count": len(leads), "campaign": plan}


def analyze_market(data: Dict[str, Any]) -> Dict[str, Any]:
    # Accepts optional fields: competitors, trends, industry
    industry = data.get("industry") or "general"
    competitors = data.get("competitors") or []
    trends = ["pricing pressure", "digital transformation", "shorter buying cycles"]
    summary = f"Market summary for {industry}: {len(competitors)} competitors identified."
    return {"industry": industry, "summary": summary, "top_trends": trends, "competitors": competitors}


def business_insights(leads: List[Dict[str, Any]], market: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    high_count = sum(1 for l in leads if (l.get("annual_revenue") or 0) > 1_000_000)
    insight = {
        "total_leads": len(leads),
        "high_value_leads": high_count,
        "recommendation": "Prioritize high-value accounts for ABM and craft industry-specific case studies.",
    }
    if market:
        insight["market_notes"] = market.get("summary")
    return insight


def generate_insights(leads: List[Dict[str, Any]], task: str = "insights", params: Optional[Dict[str, Any]] = None) -> Any:
    params = params or {}
    if task == "score":
        return score_leads(leads)
    if task == "pitch":
        # Return pitches per lead
        # If OpenAI configured, request tailored pitches
        api_key = os.getenv("OPENAI_API_KEY")
        if openai and api_key:
            prompt = (
                "Given the following lead, produce a concise sales pitch (1-2 sentences) and three subject lines. "
                "Return a JSON object with keys: pitch, subject_lines.\n\nLead:\n" + str(leads)
            )
            resp = _call_openai(prompt)
            # try to parse JSON if returned
            try:
                import json
                return json.loads(resp.get("raw", "null"))
            except Exception:
                return resp
        return [create_pitch(l) for l in leads]
    if task == "campaign":
        api_key = os.getenv("OPENAI_API_KEY")
        if openai and api_key:
            prompt = (
                "Create a concise 3-step outreach campaign for the following leads and goal. "
                "Return JSON with keys: goal, channels, cadence_days, email_subjects, steps.\n\nLeads:\n"
                + str(leads) + "\n\nGoal:\n" + str(params.get("goal"))
            )
            resp = _call_openai(prompt)
            try:
                import json
                return json.loads(resp.get("raw", "null"))
            except Exception:
                return resp
        return generate_campaign(leads, goal=params.get("goal"))
    if task == "market":
        api_key = os.getenv("OPENAI_API_KEY")
        if openai and api_key:
            prompt = (
                "You are a market analyst. Given the following inputs (industry, competitors, brief), produce a short market summary, top 3 trends, and top 3 competitors with one-line notes. "
                "Return a JSON object.\n\nInput:\n" + str(params)
            )
            resp = _call_openai(prompt)
            try:
                import json
                return json.loads(resp.get("raw", "null"))
            except Exception:
                return resp
        return analyze_market(params)
    if task == "business":
        api_key = os.getenv("OPENAI_API_KEY")
        if openai and api_key:
            prompt = (
                "Act as a senior business analyst. Given leads and optional market context, produce top 3 strategic recommendations and a short executive summary. Return JSON with keys: summary, recommendations.\n\nLeads:\n"
                + str(leads) + "\n\nMarket:\n" + str(params.get("market"))
            )
            resp = _call_openai(prompt)
            try:
                import json
                return json.loads(resp.get("raw", "null"))
            except Exception:
                return resp
        return business_insights(leads, market=params.get("market"))

    # default: insights (per-lead combined info)
    # Use OpenAI when configured to generate richer insights
    api_key = os.getenv("OPENAI_API_KEY")
    if openai and api_key:
        prompt = (
            "You are an AI marketing analyst. Given leads data (JSON), produce for each lead: "
            "a score (High/Medium/Low), a 1-line pitch, two tactical outreach suggestions, and a short messaging example. "
            "Return a JSON array where each element contains these fields.\n\nLeads:\n" + str(leads)
        )
        resp = _call_openai(prompt)
        try:
            import json
            return json.loads(resp.get("raw", "null"))
        except Exception:
            return resp

    # Heuristic fallback for offline use / testing
    results = []
    for l in leads:
        rev = l.get("annual_revenue") or 0
        if rev > 1_000_000:
            score = "High"
        elif rev > 100_000:
            score = "Medium"
        else:
            score = "Low"
        pitch = f"For {l.get('company') or l.get('name')}, emphasize ROI and cost savings over 12 months."
        tactics = [
            "Email with a short case study and specific ROI numbers",
            "LinkedIn outreach referencing a mutual connection or recent news",
        ]
        message = (
            f"Hi {l.get('name') or 'there'}, we helped companies like {l.get('company') or 'yours'} reduce costs by 20% while increasing pipeline. Can we share a 10-minute case study?"
        )
        results.append({"lead": l, "score": score, "pitch": pitch, "tactics": tactics, "message": message})
    return results
