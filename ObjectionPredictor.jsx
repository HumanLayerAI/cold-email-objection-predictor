import React, { useState } from 'react';

const ObjectionPredictor = () => {
  const [emailText, setEmailText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Psychological objection patterns based on cognitive biases
  const objectionPatterns = [
    {
      id: 'status_quo_bias',
      name: 'Status Quo Resistance',
      bias: 'Status Quo Bias',
      description: "Why should I change what's already working?",
      triggers: ['new', 'change', 'switch', 'transform', 'revolutionize', 'different', 'innovative'],
      negativeTriggers: ['current', 'existing', 'already'],
      reframe: "Acknowledge their current approach works, then position your offer as an enhancement, not replacement. Use: 'Building on what you already do well...'"
    },
    {
      id: 'time_scarcity',
      name: 'Time Investment Fear',
      bias: 'Scarcity Heuristic',
      description: "I don't have time to evaluate this or implement something new.",
      triggers: ['quick call', 'chat', 'meeting', 'demo', '15 minutes', '30 minutes', 'schedule'],
      negativeTriggers: ['busy', 'time'],
      reframe: "Lead with the time they'll SAVE, not the time you're asking for. Quantify: '5 mins now could save 3 hours/week.'"
    },
    {
      id: 'trust_deficit',
      name: 'Stranger Danger',
      bias: 'In-group Bias',
      description: "Who is this person? Why should I trust them?",
      triggers: ['i am', "i'm", 'my name is', 'i help', 'i work with'],
      negativeTriggers: ['referred', 'mutual', 'colleague', 'recommended'],
      reframe: "Add social proof early: mutual connections, recognizable clients, or specific knowledge about THEIR world that proves you're an insider."
    },
    {
      id: 'loss_aversion',
      name: 'Hidden Cost Fear',
      bias: 'Loss Aversion',
      description: "What's the catch? What will this cost me?",
      triggers: ['free', 'no obligation', 'complimentary', 'no cost', 'just', 'only'],
      negativeTriggers: [],
      reframe: "Paradoxically, 'free' triggers suspicion. Be upfront about what you want: 'I'm reaching out because I want to work with companies like yours. Here's what I'd need from you...'"
    },
    {
      id: 'relevance_doubt',
      name: 'Not-For-Me Dismissal',
      bias: 'Base Rate Neglect',
      description: "This is generic spam. They don't actually know my situation.",
      triggers: ['companies like yours', 'businesses in your industry', 'professionals like you', 'people in your position'],
      negativeTriggers: ['specifically', 'noticed that you', 'saw your post', 'your recent'],
      reframe: "Include ONE hyper-specific detail that proves research: a recent post they made, a specific challenge in their niche, their company's recent news."
    },
    {
      id: 'commitment_fear',
      name: 'Slippery Slope Anxiety',
      bias: 'Commitment Escalation',
      description: "If I respond, I'll be trapped in a sales funnel.",
      triggers: ['partnership', 'long-term', 'ongoing', 'relationship', 'work together'],
      negativeTriggers: ['one-time', 'single', 'no commitment', 'try'],
      reframe: "Offer a clear, small, reversible first step. 'Reply with one word: interested or not. Either way, no follow-ups unless you want them.'"
    },
    {
      id: 'authority_skepticism',
      name: 'Credibility Gap',
      bias: 'Authority Bias (Inverted)',
      description: "Why should I listen to YOU specifically?",
      triggers: ['expert', 'specialist', 'years of experience', 'proven', 'guaranteed'],
      negativeTriggers: ['results for', 'helped', 'case study', 'example'],
      reframe: "Show, don't tell. Replace claims with evidence: 'Last month, I helped [similar company] achieve [specific metric]' beats 'I'm an expert.'"
    },
    {
      id: 'cognitive_load',
      name: 'TLDR Reflex',
      bias: 'Cognitive Load Aversion',
      description: "This is too long/complex. I'll read it later (never).",
      triggers: [],
      negativeTriggers: [],
      lengthBased: true,
      reframe: "Front-load the value. First sentence should answer: 'Why should I care?' Cut everything that doesn't serve that goal. Aim for <100 words."
    }
  ];

  const analyzeEmail = () => {
    if (!emailText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const lowerEmail = emailText.toLowerCase();
      const wordCount = emailText.split(/\s+/).length;
      const detectedObjections = [];
      objectionPatterns.forEach(pattern => {
        let score = 0;
        let triggerMatches = [];
        let mitigationMatches = [];
        pattern.triggers.forEach(trigger => {
          if (lowerEmail.includes(trigger.toLowerCase())) {
            score += 2;
            triggerMatches.push(trigger);
          }
        });
        pattern.negativeTriggers.forEach(neg => {
          if (lowerEmail.includes(neg.toLowerCase())) {
            score -= 1;
            mitigationMatches.push(neg);
          }
        });
        if (pattern.lengthBased) {
          if (wordCount > 150) score += 3;
          else if (wordCount > 100) score += 2;
          else if (wordCount > 75) score += 1;
        }
        if (score > 0) {
          detectedObjections.push({
            ...pattern,
            score,
            triggerMatches,
            mitigationMatches,
            severity: score >= 3 ? 'high' : score >= 2 ? 'medium' : 'low'
          });
        }
      });
      detectedObjections.sort((a, b) => b.score - a.score);
      const totalRisk = detectedObjections.reduce((sum, obj) => sum + obj.score, 0);
      const maxPossibleRisk = objectionPatterns.length * 4;
      const replyLikelihood = Math.max(0, Math.min(100, Math.round(100 - (totalRisk / maxPossibleRisk * 100) - (wordCount > 100 ? 10 : 0) + (lowerEmail.includes('?') ? 5 : 0))));
      let assessment = '';
      let assessmentColor = '';
      if (replyLikelihood >= 70) {
        assessment = 'Strong - Low psychological resistance expected';
        assessmentColor = 'text-green-600';
      } else if (replyLikelihood >= 50) {
        assessment = 'Moderate - Address top 1-2 objections';
        assessmentColor = 'text-yellow-600';
      } else if (replyLikelihood >= 30) {
        assessment = 'Weak - Multiple resistance triggers detected';
        assessmentColor = 'text-orange-600';
      } else {
        assessment = 'High Risk - Consider rewriting with reframes';
        assessmentColor = 'text-red-600';
      }
      setAnalysis({
        objections: detectedObjections.slice(0, 4),
        replyLikelihood,
        assessment,
        assessmentColor,
        wordCount,
        hasQuestion: lowerEmail.includes('?'),
        hasPersonalization: lowerEmail.includes('noticed') || lowerEmail.includes('saw your') || lowerEmail.includes('your post') || lowerEmail.includes('your recent')
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cold Email Objection Predictor</h1>
          <p className="text-slate-400 text-sm">Predict psychological resistance before you hit send</p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-slate-500">
            <span>Built by <span className="text-emerald-400">Aariz</span> (AI × B2B Systems)</span>
            <span>×</span>
            <span><span className="text-cyan-400">Aakarsh</span> (Psychology × Law)</span>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
          <label className="block text-slate-300 text-sm font-medium mb-2">Paste your cold email draft:</label>
          <textarea
            className="w-full h-48 bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            placeholder="Paste your email here..."
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-slate-500 text-xs">{emailText.split(/\s+/).filter(w => w).length} words</span>
            <button onClick={analyzeEmail} disabled={!emailText.trim() || isAnalyzing} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isAnalyzing ? 'Analyzing...' : 'Predict Objections'}
            </button>
          </div>
        </div>
        {analysis && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Reply Likelihood Score</h2>
                  <p className={`text-sm ${analysis.assessmentColor}`}>{analysis.assessment}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${analysis.replyLikelihood >= 70 ? 'text-green-400' : analysis.replyLikelihood >= 50 ? 'text-yellow-400' : analysis.replyLikelihood >= 30 ? 'text-orange-400' : 'text-red-400'}`}>
                    {analysis.replyLikelihood}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                <div className={`h-2 rounded-full transition-all duration-500 ${analysis.replyLikelihood >= 70 ? 'bg-green-500' : analysis.replyLikelihood >= 50 ? 'bg-yellow-500' : analysis.replyLikelihood >= 30 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${analysis.replyLikelihood}%` }} />
              </div>
            </div>
            {analysis.objections.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4">Predicted Objections ({analysis.objections.length})</h2>
                <div className="space-y-4">
                  {analysis.objections.map((objection) => (
                    <div key={objection.id} className={`rounded-lg border p-4 ${getSeverityColor(objection.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getSeverityBadge(objection.severity)}`} />
                          <h3 className="font-semibold">{objection.name}</h3>
                        </div>
                        <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded">{objection.bias}</span>
                      </div>
                      <p className="text-sm italic mb-3 opacity-90">"{objection.description}"</p>
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <span className="text-xs font-semibold uppercase tracking-wide">Reframe →</span>
                        <p className="text-sm mt-1">{objection.reframe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-center text-slate-500 text-xs pt-4">
              <p>Framework: Cognitive Bias Integration for B2B Outreach</p>
              <p className="mt-1"><span className="text-emerald-400">Aariz Sajan</span> × <span className="text-cyan-400">The Human Layer AI</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectionPredictor;
