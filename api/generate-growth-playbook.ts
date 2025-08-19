import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { startup_id, current_stage, sector, current_metrics, prediction_data } = req.body;

    const prompt = `
    You are a world-class startup advisor with experience helping companies scale from idea to IPO. 
    Create a personalized AI Growth Playbook for this startup:

    STARTUP PROFILE:
    - Stage: ${current_stage}
    - Sector: ${sector}
    ${current_metrics ? `
    - Current Revenue: $${current_metrics.revenue}
    - Current Burn Rate: $${current_metrics.burn_rate}/month
    - Runway: ${current_metrics.runway} months` : ''}
    ${prediction_data ? `
    - Predicted Failure Risk: ${(prediction_data.failure_probability * 100).toFixed(1)}%
    - Predicted Growth Rate: ${(prediction_data.growth_rate * 100).toFixed(1)}%/month` : ''}

    Create a comprehensive growth playbook with the following structure:

    1. CURRENT SITUATION ANALYSIS
    2. TOP 3 IMMEDIATE PRIORITIES (next 30 days)
    3. GROWTH STRATEGIES BY STAGE
    4. DEATH ZONE PREVENTION
    5. FUNDING READINESS
    6. KEY METRICS TO TRACK
    7. ACTION PLAN WITH TIMELINES

    Focus on:
    - Specific, actionable advice for their stage and sector
    - Death zone risks and how to avoid them
    - Realistic growth targets and milestones
    - Resource optimization strategies
    - Investor readiness and positioning

    Provide the response in well-formatted markdown with clear sections and bullet points.
    Be specific to their industry and stage - avoid generic advice.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert startup advisor. Create detailed, actionable growth playbooks specific to each startup\'s situation.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const aiResponse = await response.json();
    if (!aiResponse.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    const playbook = aiResponse.choices[0].message.content;

    // Store playbook (optional: save to Supabase)
    const playbookData = {
      startup_id,
      content: playbook,
      generated_at: new Date().toISOString(),
      stage: current_stage,
      sector,
      version: 1
    };

    return res.json({
      playbook,
      metadata: playbookData
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      details: 'Check function logs for more information'
    });
  }
}
