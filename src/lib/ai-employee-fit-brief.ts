export type AiEmployeeChannel = 'voice' | 'chat' | 'email' | 'mixed'
export type AiEmployeeSkill = 'answer' | 'qualify' | 'book' | 'follow-up'
export type AiEmployeeKnowledge = 'ready' | 'partial' | 'thin'
export type AiEmployeeHandoff = 'clear' | 'unclear' | 'not-defined'
export type AiEmployeeUrgency = 'exploring' | 'this-quarter' | 'urgent'

export type AiEmployeeFitBriefInput = {
  channel: AiEmployeeChannel
  skill: AiEmployeeSkill
  knowledge: AiEmployeeKnowledge
  handoff: AiEmployeeHandoff
  urgency: AiEmployeeUrgency
  industry?: string
  audience?: string
}

export type AiEmployeeFitPath = 'intake-first' | 'knowledge-first' | 'handoff-first' | 'pilot-ready'

export function recommendAiEmployeeFitPath(input: AiEmployeeFitBriefInput): AiEmployeeFitPath {
  if (input.handoff === 'not-defined' || input.handoff === 'unclear') return 'handoff-first'
  if (input.knowledge === 'thin') return 'knowledge-first'
  if (input.knowledge === 'ready' && input.handoff === 'clear') return 'pilot-ready'
  return 'intake-first'
}

export function buildAiEmployeeFitBrief(input: AiEmployeeFitBriefInput) {
  const path = recommendAiEmployeeFitPath(input)
  const industryNote = input.industry ? ` for ${input.industry}` : ''
  const audienceNote = input.audience ? ` Starting audience: ${input.audience}.` : ''

  const headlines: Record<AiEmployeeFitPath, string> = {
    'intake-first': 'Start with always-on intake—then expand skills',
    'knowledge-first': 'Strengthen trusted answers before you automate replies',
    'handoff-first': 'Define human handoff before an AI Employee goes live',
    'pilot-ready': 'You are close to a bounded AI Employee pilot',
  }

  const summaries: Record<AiEmployeeFitPath, string> = {
    'intake-first': `Your answers point to coverage and first-response pressure${industryNote}.${audienceNote} Begin with answering and capturing context where customers already reach you (phone, chat, or email), then add booking or follow-up once intake is reliable.`,
    'knowledge-first': `Your answers show how customers reach you and what the AI should do first are clearer than your approved answers${industryNote}.${audienceNote} An AI Employee should only answer from approved sources. Tighten knowledge and ownership before expanding automated replies.`,
    'handoff-first': `Your answers show people still need a clear takeover path${industryNote}.${audienceNote} Write when a person must take over, what context they receive, and who owns exceptions—before choosing a platform demo.`,
    'pilot-ready': `Your answers suggest a contained first release is realistic${industryNote}.${audienceNote} Keep the pilot on one way customers reach you and one first job, with measures and human escalation owned from day one.`,
  }

  const priorities: Record<AiEmployeeFitPath, string[]> = {
    'intake-first': [
      'Name the main way customers reach you and the hours that currently break coverage.',
      'Decide what an AI Employee may answer vs. only capture and route.',
      'Measure missed contacts recovered and time-to-first-response.',
    ],
    'knowledge-first': [
      'List the top questions that must come from approved knowledge only.',
      'Assign who updates scripts, FAQs, and known-issue notes.',
      'Block free-form answers until knowledge ownership is clear.',
    ],
    'handoff-first': [
      'Write escalation triggers: pricing, safety, access, complaints, exceptions.',
      'Specify the summary a person must receive with every handoff.',
      'Name the owner for after-hours and peak overflow exceptions.',
    ],
    'pilot-ready': [
      'Pick one way customers reach you and one high-volume first job for the release.',
      'Confirm integrations needed for booking or ticket creation—if any.',
      'Set success measures and a stop/expand decision after a short pilot.',
    ],
  }

  const plan: Record<AiEmployeeFitPath, [string, string, string]> = {
    'intake-first': [
      'Map current missed contacts by how customers reach you and time of day.',
      'Pilot intake + context capture with clear human routing.',
      'Add one approved skill only after intake quality is stable.',
    ],
    'knowledge-first': [
      'Curate the first knowledge pack for the top request types.',
      'Test answers with staff before customers rely on them.',
      'Open a limited reply scope once accuracy holds.',
    ],
    'handoff-first': [
      'Draft handoff rules and exception owners.',
      'Walk through three real edge cases with the frontline team.',
      'Only then compare AI Employee options on the same criteria.',
    ],
    'pilot-ready': [
      'Confirm how customers reach you, the first job, knowledge, and handoff in one brief.',
      'Compare platforms against those requirements—not demos alone.',
      'Run a time-boxed pilot with measures and a named owner.',
    ],
  }

  return {
    path,
    headline: headlines[path],
    summary: summaries[path],
    priorities: priorities[path],
    plan: plan[path],
  }
}
