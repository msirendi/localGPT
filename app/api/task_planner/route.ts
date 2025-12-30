import { MODEL } from "@/config/constants";
import OpenAI from "openai";

const CHAIN_OF_THOUGHT_PROMPT = `You are an expert task planner. Your job is to create detailed, actionable plans for complex tasks.

When given a task, think through it step by step:
1. First, understand the core objective and any constraints
2. Break down the task into logical phases or stages
3. For each phase, identify specific actionable steps
4. Consider dependencies between steps
5. Estimate time requirements where possible
6. Identify potential challenges or considerations

Think out loud as you analyze the task, then provide a structured plan.`;

const SELF_REFLECTION_PROMPT = `You are a critical reviewer of task plans. Your job is to identify weaknesses, gaps, or improvements in a proposed plan.

Review the plan carefully and consider:
1. Are there any missing steps that are crucial?
2. Are the dependencies correct and complete?
3. Are the time estimates realistic?
4. Are there any risks or challenges not addressed?
5. Could any steps be combined or made more efficient?
6. Is the order of steps optimal?

Provide specific, actionable feedback to improve the plan.`;

const PLAN_REFINEMENT_PROMPT = `You are an expert task planner. You've received feedback on your initial plan.

Incorporate the feedback to create an improved, final plan. The plan should be:
- Clear and actionable
- Well-organized with proper step ordering
- Realistic in time estimates
- Comprehensive but not overly complex

Output the final plan in a structured JSON format with:
- task_description: A clear summary of the task
- steps: An array of step objects with step_number, title, description, estimated_duration (optional), and dependencies (array of step numbers that must be completed first)
- notes: Any important considerations, warnings, or recommendations

Respond ONLY with valid JSON, no additional text.`;

interface PlanStep {
  step_number: number;
  title: string;
  description: string;
  estimated_duration?: string;
  dependencies: number[];
}

interface TaskPlan {
  task_description: string;
  steps: PlanStep[];
  notes: string;
  thinking?: string;
  reflection?: string;
}

export async function POST(request: Request) {
  try {
    const { task } = await request.json();

    if (!task) {
      return new Response(JSON.stringify({ error: "Task description is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI();

    // Step 1: Chain-of-Thought Planning
    const thinkingResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: CHAIN_OF_THOUGHT_PROMPT },
        {
          role: "user",
          content: `Please create a detailed plan for the following task:\n\n${task}\n\nThink through this step by step, explaining your reasoning as you break down the task.`,
        },
      ],
      temperature: 0.7,
    });

    const initialThinking = thinkingResponse.choices[0]?.message?.content || "";

    // Step 2: Self-Reflection
    const reflectionResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SELF_REFLECTION_PROMPT },
        {
          role: "user",
          content: `Here is a plan that was created for the task: "${task}"\n\n--- PROPOSED PLAN ---\n${initialThinking}\n--- END PLAN ---\n\nPlease critically review this plan and identify any weaknesses, gaps, or areas for improvement.`,
        },
      ],
      temperature: 0.5,
    });

    const reflection = reflectionResponse.choices[0]?.message?.content || "";

    // Step 3: Plan Refinement with Structured Output
    const refinementResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: PLAN_REFINEMENT_PROMPT },
        {
          role: "user",
          content: `Task: ${task}\n\n--- INITIAL PLAN ---\n${initialThinking}\n--- END INITIAL PLAN ---\n\n--- FEEDBACK ---\n${reflection}\n--- END FEEDBACK ---\n\nPlease create the final, improved plan incorporating this feedback. Output ONLY valid JSON.`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const refinedPlanText = refinementResponse.choices[0]?.message?.content || "{}";

    let plan: TaskPlan;
    try {
      plan = JSON.parse(refinedPlanText);
      // Add the thinking process and reflection for transparency
      plan.thinking = initialThinking;
      plan.reflection = reflection;
    } catch {
      // If JSON parsing fails, create a basic structure
      plan = {
        task_description: task,
        steps: [
          {
            step_number: 1,
            title: "Review the task",
            description: "Unable to parse structured plan. Please review the thinking process below.",
            dependencies: [],
          },
        ],
        notes: "Plan generation encountered an issue. See thinking process for details.",
        thinking: initialThinking,
        reflection: reflection,
      };
    }

    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in task planner:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error in task planner",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
