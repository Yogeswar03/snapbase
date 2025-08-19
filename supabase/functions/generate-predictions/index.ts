import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();



interface PredictionRequest {
  startup_id: string;
  current_metrics: {
    revenue: number;
    expenses: number;
    burn_rate: number;
    runway: number;
  };
  startup_data: {
    sector: string;
    stage: string;
    team_experience: number;
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-predictions', async (req, res) => {
  try {
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { startup_id, current_metrics, startup_data }: PredictionRequest = req.body;

    // Get historical metrics for better prediction accuracy
    const { data: historicalMetrics } = await supabase
      .from('metrics')
      .select('*')
      .eq('startup_id', startup_id)
      .order('period_start', { ascending: false })
      .limit(12);

    // Generate AI-powered predictions using OpenAI
    const prompt = `
    You are an expert startup financial analyst. Analyze this startup data and provide predictions:

    CURRENT METRICS:
    - Revenue: $${current_metrics.revenue}
    - Expenses: $${current_metrics.expenses}
    - Burn Rate: $${current_metrics.burn_rate}/month
    - Runway: ${current_metrics.runway} months

    STARTUP PROFILE:
    - Sector: ${startup_data.sector}
    - Stage: ${startup_data.stage}
    - Team Experience: ${startup_data.team_experience} years

    HISTORICAL DATA:
    ${historicalMetrics?.map(m => `${m.period_start}: Revenue $${m.revenue}, Expenses $${m.expenses}, Burn $${m.burn_rate}`).join('\n') || 'No historical data available'}

    Please provide ONLY a JSON response with these exact fields:
    {
      "profit_loss": <predicted profit/loss next 12 months>,
      "growth_rate": <predicted monthly growth rate as decimal (0.05 = 5%)>,
      "failure_probability": <probability of failure 0-1>,
      "cashflow": <predicted net cashflow next 12 months>,
      "runway_months": <predicted runway in months>,
      "reasoning": <brief explanation of your analysis>
    }

    Base your predictions on startup industry benchmarks, growth patterns, and the death zone risks common in startup lifecycle.
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
          { role: 'system', content: 'You are a startup financial analyst. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const aiResponse = await response.json();
    console.log('OpenAI Response:', aiResponse);

    if (!aiResponse.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    let predictions;
    try {
      predictions = JSON.parse(aiResponse.choices[0].message.content);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI prediction response' });
    }

    // Store prediction in database
    const predictionData = {
      startup_id,
      input_data: {
        current_metrics,
        startup_data,
        historical_metrics: historicalMetrics?.slice(0, 3) || []
      },
      output_data: {
        reasoning: predictions.reasoning,
        model_used: 'gpt-4o-mini',
        generated_at: new Date().toISOString()
      },
      profit_loss: predictions.profit_loss || 0,
      growth_rate: predictions.growth_rate || 0,
      failure_probability: predictions.failure_probability || 0,
      cashflow: predictions.cashflow || 0,
      runway_months: predictions.runway_months || current_metrics.runway,
    };

    const { data: savedPrediction, error: saveError } = await supabase
      .from('predictions')
      .insert(predictionData)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving prediction:', saveError);
      return res.status(500).json({ error: 'Failed to save prediction' });
    }

    console.log('Prediction saved successfully:', savedPrediction.id);

    return res.json(savedPrediction);

  } catch (error: any) {
    console.error('Error in generate-predictions function:', error);
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