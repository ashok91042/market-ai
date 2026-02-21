// API Configuration with Manual API Key
// Support both HTTP and HTTPS
const protocol = window.location.protocol; // http: or https:
const host = window.location.host; // localhost:8000

const API_CONFIG = {
  baseURL: `${protocol}//${host}`,  // Use same protocol as current page
  apiKey: 'AIzaSyB8o65qDz-8kuWEMPhB5fjRGzJGo4c9NNY'  // Change this to your API key
};

// Store leads for each section
let campaignLeads = [];
let pitchLeads = [];
let scoreLeads = [];

// Chart instances (to destroy old ones)
let campaignChart = null;
let scoreChart = null;

// Helper function to make API calls with API key
async function callAPI(endpoint, data) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.apiKey
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Status message display
function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = `status-message show ${type}`;
  
  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 4000);
}

// Function to add lead from form inputs
function addLead(section) {
  const form = document.getElementById(section + 'Form');
  const nameInput = form.querySelector('.lead-name');
  const companyInput = form.querySelector('.lead-company');
  const titleInput = form.querySelector('.lead-title');
  const emailInput = form.querySelector('.lead-email');
  const revenueInput = form.querySelector('.lead-revenue');

  // Validate inputs
  if (!nameInput.value.trim()) {
    showStatus('❌ Please enter lead name', 'error');
    return;
  }

  const lead = {
    name: nameInput.value.trim(),
    company: companyInput.value.trim() || nameInput.value.trim(),
    title: titleInput.value.trim() || 'Business Owner',
    email: emailInput.value.trim() || `${nameInput.value.toLowerCase().replace(' ', '.')}@example.com`,
    annual_revenue: revenueInput.value ? parseInt(revenueInput.value) : 0
  };

  // Add to appropriate array
  let leadsArray;
  if (section === 'campaignLeads') {
    campaignLeads.push(lead);
    leadsArray = campaignLeads;
  } else if (section === 'pitchLeads') {
    pitchLeads.push(lead);
    leadsArray = pitchLeads;
  } else if (section === 'leadScore') {
    scoreLeads.push(lead);
    leadsArray = scoreLeads;
  }

  // Clear inputs
  nameInput.value = '';
  companyInput.value = '';
  titleInput.value = '';
  emailInput.value = '';
  revenueInput.value = '';

  // Update display
  updateLeadsDisplay(section, leadsArray);
  showStatus(`✅ Lead added: ${lead.name}`, 'success');
}

// Function to update leads display
function updateLeadsDisplay(section, leadsArray) {
  const displayEl = document.getElementById(section + 'Display');
  
  if (leadsArray.length === 0) {
    displayEl.innerHTML = '';
    return;
  }

  let html = '<div class="leads-list"><h4>Added Leads:</h4>';
  leadsArray.forEach((lead, index) => {
    html += `
      <div class="lead-card">
        <div class="lead-info">
          <strong>${lead.name}</strong> @ ${lead.company}<br>
          <small>${lead.title} | ${lead.email} | $${lead.annual_revenue.toLocaleString()}</small>
        </div>
        <button onclick="removeLead('${section}', ${index})" class="btn-remove">✕</button>
      </div>
    `;
  });
  html += '</div>';
  displayEl.innerHTML = html;
}

// Function to remove a lead
function removeLead(section, index) {
  let leadsArray;
  if (section === 'campaignLeads') {
    leadsArray = campaignLeads;
  } else if (section === 'pitchLeads') {
    leadsArray = pitchLeads;
  } else if (section === 'leadScore') {
    leadsArray = scoreLeads;
  }

  leadsArray.splice(index, 1);
  updateLeadsDisplay(section, leadsArray);
  showStatus('✅ Lead removed', 'success');
}

// Add lead functions for each section
function addLeadToCampaign() {
  addLead('campaignLeads');
}

function addLeadToPitch() {
  addLead('pitchLeads');
}

function addLeadToScore() {
  addLead('leadScore');
}

// Campaign Generator (product-based)
async function runCampaign() {
  const product = (document.getElementById('campaignProduct') || {}).value || '';
  const audience = (document.getElementById('campaignAudience') || {}).value || '';
  const platform = (document.getElementById('campaignPlatform') || {}).value || '';

  if (!product.trim()) {
    showStatus('❌ Please enter a product name', 'error');
    return;
  }
  if (!audience.trim()) {
    showStatus('❌ Please enter the target audience', 'error');
    return;
  }

  showStatus('⏳ Generating campaign...', 'loading');

  try {
    const payload = {
      product: product.trim(),
      audience: audience.trim(),
      platform: platform,
      task: 'campaign'
    };

    const data = await callAPI('/api/analyze', payload);

    displayCampaignResults(data, payload);
    showStatus('✅ Campaign generated successfully!', 'success');
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
    document.getElementById('campaignText').textContent = 'Error: ' + error.message;
  }
}

// Display campaign as chart and text
// Display campaign results (attractive, emoji-enhanced)
function displayCampaignResults(data, requestPayload = {}) {
  const insights = data.insights || data || {};
  const textDiv = document.getElementById('campaignText');

  // Build header summary
  let html = '<h4>🚀 Campaign Plan</h4>';
  html += '<div class="insight-box">';

  // Show submitted inputs first (straight key:value, one per line)
  if (requestPayload.product) {
    html += `<p>🛍️ <strong>Product:</strong> ${escapeHtml(requestPayload.product)}</p>`;
  }
  if (requestPayload.audience) {
    html += `<p>👥 <strong>Target Audience:</strong> ${escapeHtml(requestPayload.audience)}</p>`;
  }
  if (requestPayload.platform) {
    html += `<p>🌐 <strong>Platform:</strong> ${escapeHtml(requestPayload.platform)}</p>`;
  }

  // Divider
  html += '<hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:12px 0;"/>';

  // Generate a detailed step-by-step plan (use insights if present)
  const plan = generateCampaignPlan(requestPayload, insights);

  // Add short summary and steps
  if (plan.summary) {
    html += `<p>💡 <strong>Summary:</strong> ${escapeHtml(plan.summary)}</p>`;
  }

  if (plan.keyMessage) {
    html += `<p>💬 <strong>Key Message:</strong> ${escapeHtml(plan.keyMessage)}</p>`;
  }

  if (plan.channels) {
    html += `<p>📣 <strong>Channels:</strong> ${escapeHtml(plan.channels)}</p>`;
  }

  if (plan.cta) {
    html += `<p>👉 <strong>CTA:</strong> ${escapeHtml(plan.cta)}</p>`;
  }

  // Step-by-step actions
  if (plan.steps && plan.steps.length) {
    html += '<h5 style="margin-top:10px;color:rgba(255,255,255,0.95)">🛠️ Action Plan</h5>';
    html += '<ol style="padding-left:18px;margin-top:8px;">';
    plan.steps.forEach(step => {
      html += `<li style="margin-bottom:8px;color:white">${escapeHtml(step)}</li>`;
    });
    html += '</ol>';
  }

  // Metrics
  if (plan.metrics) {
    html += `<p>📊 <strong>KPIs:</strong> ${escapeHtml(plan.metrics)}</p>`;
  }

  html += '</div>';
  textDiv.innerHTML = html;
}

// Create a practical campaign plan from inputs and backend insights
function generateCampaignPlan(payload, insights) {
  const product = (payload.product || '').trim();
  const audience = (payload.audience || '').trim();
  const platform = (payload.platform || '').trim();

  const plan = {
    summary: '',
    keyMessage: '',
    channels: '',
    cta: '',
    steps: [],
    metrics: ''
  };

  plan.summary = `Launch a focused ${product} campaign targeting ${audience} on ${platform}.`;
  plan.keyMessage = `Position ${product} as the must-have solution for ${audience} — emphasize benefits and ease-of-use.`;
  plan.channels = platform ? `${platform}` : 'Social ads, Email, Organic posts';
  plan.cta = `Try ${product} now — limited-time offer or demo sign-up.`;

  // Suggested steps
  plan.steps.push(`Define target segments within ${audience} and build a concise customer persona.`);
  plan.steps.push(`Create 3 variations of ad copy: benefit-focused, social-proof, and urgency-driven.`);
  plan.steps.push(`Design visual assets sized for ${platform} (carousel, short video, and static image).`);
  plan.steps.push(`Set up a landing page with a single clear CTA and tracking parameters.`);
  plan.steps.push(`Run an A/B test for headlines and CTAs for 2 weeks, then iterate.`);
  plan.steps.push(`Allocate budget across awareness and conversion with daily monitoring.`);

  // Incorporate backend insights if available
  if (insights && typeof insights === 'object') {
    if (insights.recommendation) plan.steps.unshift(String(insights.recommendation));
    if (insights.content) plan.steps.push(`Content ideas: ${Array.isArray(insights.content) ? insights.content.join(', ') : String(insights.content)}`);
    if (insights.metrics) plan.metrics = Array.isArray(insights.metrics) ? insights.metrics.join(', ') : String(insights.metrics);
  }

  if (!plan.metrics) plan.metrics = 'Impressions, CTR, Conversion Rate, CPA';

  return plan;
}

// small utility to avoid HTML injection and preserve spacing
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').trim();
}

// Pitch Generator
async function runPitch() {
  if (pitchLeads.length === 0) {
    showStatus('❌ Please add at least one lead', 'error');
    return;
  }

  showStatus('⏳ Generating pitches...', 'loading');

  try {
    const data = await callAPI('/api/analyze', { 
      leads: pitchLeads, 
      task: 'pitch' 
    });

    displayPitchResults(data);
    showStatus('✅ Pitches generated successfully!', 'success');
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
    document.getElementById('pitchOutput').textContent = 'Error: ' + error.message;
  }
}

// Display pitch results as cards
function displayPitchResults(data) {
  const insights = data.insights || data;
  const outputDiv = document.getElementById('pitchOutput');
  
  let html = '<div class="pitches-grid">';
  
  pitchLeads.forEach((lead, index) => {
    let pitch = '';
    
    if (Array.isArray(insights) && insights[index]) {
      pitch = insights[index];
    } else if (typeof insights === 'object' && insights.pitches && insights.pitches[index]) {
      pitch = insights.pitches[index];
    } else if (typeof insights === 'string') {
      pitch = insights;
    } else {
      pitch = 'Generated pitch for lead';
    }

    html += `
      <div class="pitch-card">
        <div class="pitch-header">
          <h4>${lead.name}</h4>
          <p class="pitch-company">${lead.company}</p>
        </div>
        <div class="pitch-body">
          <p class="pitch-text">${pitch}</p>
        </div>
        <div class="pitch-footer">
          <span class="pitch-title">${lead.title}</span>
          <span class="pitch-revenue">$${(lead.annual_revenue / 1000000).toFixed(1)}M</span>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  outputDiv.innerHTML = html;
}

// Lead Scoring
async function runLeadScore() {
  if (scoreLeads.length === 0) {
    showStatus('❌ Please add at least one lead', 'error');
    return;
  }

  showStatus('⏳ Scoring leads...', 'loading');

  try {
    const data = await callAPI('/api/analyze', { 
      leads: scoreLeads, 
      task: 'score' 
    });

    displayScoreResults(data);
    showStatus('✅ Leads scored successfully!', 'success');
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
    document.getElementById('scoreText').textContent = 'Error: ' + error.message;
  }
}

// Display score results as chart
function displayScoreResults(data) {
  const insights = data.insights || data;
  
  // Destroy existing chart if it exists
  if (scoreChart) {
    scoreChart.destroy();
  }

  const ctx = document.getElementById('scoreChart');
  const textDiv = document.getElementById('scoreText');
  
  // Extract scores from insights or use mock data
  let scores = scoreLeads.map(lead => {
    let score = 5; // default
    const title = lead.title.toLowerCase();
    if (title.includes('ceo') || title.includes('founder')) score = 9;
    else if (title.includes('cto') || title.includes('cmo')) score = 8;
    else if (title.includes('vp') || title.includes('director')) score = 7;
    else if (title.includes('manager')) score = 6;
    
    if (lead.annual_revenue > 1000000) score = Math.min(10, score + 1);
    return score;
  });

  // Create doughnut chart
  scoreChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: scoreLeads.map((l, i) => `${l.name} (${scores[i]}/10)`),
      datasets: [{
        label: 'Lead Quality Score',
        data: scores,
        backgroundColor: [
          'rgba(102, 126, 234, 0.7)',
          'rgba(118, 75, 162, 0.7)',
          'rgba(240, 147, 251, 0.7)',
          'rgba(102, 126, 234, 0.5)',
          'rgba(118, 75, 162, 0.5)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(240, 147, 251, 1)',
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: '⭐ Lead Quality Distribution'
        },
        legend: {
          display: true,
          position: 'right'
        }
      }
    }
  });

  // Display scores as list
  let scoreText = '<h4>Lead Scores</h4><div class="scores-table">';
  scores.forEach((score, index) => {
    const lead = scoreLeads[index];
    const scoreColor = score >= 8 ? '#28a745' : score >= 6 ? '#ffc107' : '#dc3545';
    scoreText += `
      <div class="score-row">
        <span class="score-name">${lead.name}</span>
        <span class="score-company">${lead.company}</span>
        <span class="score-value" style="color: ${scoreColor};">⭐ ${score}/10</span>
      </div>
    `;
  });
  scoreText += '</div>';
  textDiv.innerHTML = scoreText;
}

// Initialize - Pre-load sample data
window.addEventListener('DOMContentLoaded', () => {
  const sampleLeads = [
    {
      name: 'Alex Johnson',
      company: 'TechCorp',
      email: 'alex@techcorp.com',
      title: 'CEO',
      annual_revenue: 5000000
    },
    {
      name: 'Sarah Chen',
      company: 'InnovateLabs',
      email: 'sarah@innovatelabs.com',
      title: 'CTO',
      annual_revenue: 2500000
    }
  ];

  // Only initialize for pages that have the forms
  if (document.getElementById('campaignLeadsForm')) {
    campaignLeads = [...sampleLeads];
    updateLeadsDisplay('campaignLeads', campaignLeads);
  }
  
  if (document.getElementById('pitchLeadsForm')) {
    pitchLeads = [...sampleLeads];
    updateLeadsDisplay('pitchLeads', pitchLeads);
  }
  
  if (document.getElementById('leadScoreForm')) {
    scoreLeads = [...sampleLeads];
    updateLeadsDisplay('leadScore', scoreLeads);
  }
});
