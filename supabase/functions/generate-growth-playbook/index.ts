import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();



interface PlaybookRequest {
  startup_id: string;
  current_stage: string;
  sector: string;
  current_metrics?: {
    revenue: number;
    expenses: number;
    burn_rate: number;
    runway: number;
  };
  prediction_data?: {
    failure_probability: number;
    growth_rate: number;
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-growth-playbook', async (req, res) => {
  try {
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const {
      startup_id,
      current_stage,
      sector,
      current_metrics,
      prediction_data
    }: PlaybookRequest = req.body;

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
  7. ACTION PLAN WITH TIMELINES (Month-by-month, step-by-step, e.g. "Month 1-2: Double down on LinkedIn outbound...", "Month 3: Hire 1 growth marketer...")
  8. RECOMMENDATION ENGINE: Suggest actions based on what similar startups did at this stage (use case studies, Crunchbase-style datasets, and synthetic bootstrapped data)
  9. SCENARIO SIMULATION: For each key metric (burn, CAC, revenue), provide a "What if?" analysis (e.g., "What happens if you cut burn by 20%?", "What if you increase CAC by 10%?")
  10. CONTINUOUS UPDATES: Explain how the playbook will refresh every week/month based on new input data and market signals (funding rounds, competitor benchmarks, etc.)

  Focus on:
  - Specific, actionable advice for their stage and sector
  - Death zone risks and how to avoid them
  - Realistic growth targets and milestones
  - Resource optimization strategies
  - Investor readiness and positioning
  - Learning from similar startups
  - Scenario-based recommendations

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
    console.log('OpenAI Playbook Response received');

    if (!aiResponse.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    const playbook = aiResponse.choices[0].message.content;

    // Store playbook (you could create a playbooks table if needed)
    const playbookData = {
      startup_id,
      content: playbook,
      generated_at: new Date().toISOString(),
      stage: current_stage,
      sector,
      version: 1
    };

    console.log('Generated playbook for startup:', startup_id);

    return res.json({
      playbook,
      metadata: playbookData
    });

  } catch (error: any) {
    console.error('Error in generate-growth-playbook function:', error);
    return res.status(500).json({
      error: error.message,
      details: 'Check function logs for more information'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});