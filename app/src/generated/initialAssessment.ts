/* eslint-disable */
// GENERATED FILE — DO NOT EDIT. Run `npm run generate:quiz` from app/.
// Source: ../data/quiz/{questions,answer-options,question-sets,question-set-items,controlled-values}.csv

export const initialAssessment = {
  "id": "initial_assessment",
  "version": 1,
  "label": "Initial assessment",
  "description": "First-run baseline and current-balance assessment.",
  "estimatedMinutes": 10,
  "status": "draft",
  "questions": [
    {
      "id": "q_baseline_natural_pace_001",
      "version": 1,
      "slug": "natural-pace",
      "text": "How would you describe your natural pace when moving through everyday activities?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "movement_pace",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 1,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_natural_pace_001_quick_changeable_move_rapidly",
          "version": 1,
          "text": "Quick and changeable; I often move rapidly between things.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_natural_pace_001_purposeful_efficient_move_clear",
          "version": 1,
          "text": "Purposeful and efficient; I tend to move with a clear objective.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_natural_pace_001_steady_unhurried_prefer_move",
          "version": 1,
          "text": "Steady and unhurried; I prefer to move at a consistent pace.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_natural_pace_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_energy_pattern_001",
      "version": 1,
      "slug": "usual-energy-pattern",
      "text": "Which description best matches your usual energy pattern?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "energy",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 2,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_energy_pattern_001_energy_comes_bursts_change",
          "version": 1,
          "text": "My energy comes in bursts and can change quickly.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_energy_pattern_001_energy_strong_focused_but",
          "version": 1,
          "text": "My energy is strong and focused, but I may push too hard.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_energy_pattern_001_energy_builds_gradually_last",
          "version": 1,
          "text": "My energy builds gradually and tends to last once I get going.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_energy_pattern_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_routine_preference_001",
      "version": 1,
      "slug": "routine-preference",
      "text": "What is your natural relationship with routine?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "routine",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 3,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_routine_preference_001_enjoy_variety_but_routines",
          "version": 1,
          "text": "I enjoy variety, but my routines can be inconsistent.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_routine_preference_001_like_organized_routines_help",
          "version": 1,
          "text": "I like organized routines that help me accomplish goals.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_routine_preference_001_prefer_familiar_dependable_routines",
          "version": 1,
          "text": "I prefer familiar, dependable routines and dislike sudden changes.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_routine_preference_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_decision_style_001",
      "version": 1,
      "slug": "decision-making-style",
      "text": "How do you generally make everyday decisions?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "decision_style",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 4,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_decision_style_001_decide_quickly_but_change",
          "version": 1,
          "text": "I decide quickly but may change my mind afterward.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_decision_style_001_evaluate_options_make_firm",
          "version": 1,
          "text": "I evaluate the options and make a firm decision.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_decision_style_001_take_time_prefer_feel",
          "version": 1,
          "text": "I take my time and prefer to feel certain before deciding.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_decision_style_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_learning_style_001",
      "version": 1,
      "slug": "learning-new-information",
      "text": "When learning something new, which pattern fits you best?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "learning",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 5,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_learning_style_001_understand_new_ideas_quickly",
          "version": 1,
          "text": "I understand new ideas quickly, especially when they are interesting.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_learning_style_001_learn_best_through_logic",
          "version": 1,
          "text": "I learn best through logic, structure, and clear explanations.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_learning_style_001_take_longer_learn_but",
          "version": 1,
          "text": "I may take longer to learn, but the knowledge becomes deeply established.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_learning_style_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_long_term_memory_001",
      "version": 1,
      "slug": "long-term-memory",
      "text": "How would you describe your memory over time?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "memory",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 6,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_long_term_memory_001_learn_quickly_but_forget",
          "version": 1,
          "text": "I learn quickly but may forget details just as quickly.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_long_term_memory_001_remember_information_useful_important",
          "version": 1,
          "text": "I remember information that is useful, important, or connected to a goal.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_long_term_memory_001_once_learn_something_thoroughly",
          "version": 1,
          "text": "Once I learn something thoroughly, I tend to remember it for a long time.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_long_term_memory_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_physical_endurance_001",
      "version": 1,
      "slug": "physical-endurance",
      "text": "During physical activity, what is your usual endurance pattern?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "endurance",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 7,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_physical_endurance_001_start_energetically_but_stamina",
          "version": 1,
          "text": "I can start energetically, but my stamina varies.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_physical_endurance_001_sustain_intense_effort_especially",
          "version": 1,
          "text": "I can sustain intense effort, especially when motivated by a challenge.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_physical_endurance_001_warm_up_slowly_but",
          "version": 1,
          "text": "I warm up slowly, but I can continue steadily for a long time.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_physical_endurance_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_body_frame_001",
      "version": 1,
      "slug": "natural-body-frame",
      "text": "Before major changes in weight, fitness, illness, or lifestyle, how would you describe your natural body frame?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "body_frame",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 8,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_body_frame_001_naturally_light_narrow_fine",
          "version": 1,
          "text": "Naturally light, narrow, or fine-boned.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_body_frame_001_naturally_medium_proportionate_moderately",
          "version": 1,
          "text": "Naturally medium, proportionate, or moderately muscular.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_body_frame_001_naturally_broad_solid_substantial",
          "version": 1,
          "text": "Naturally broad, solid, or substantial.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_body_frame_001_unsure_or_changed",
          "version": 1,
          "text": "Not sure or my body has changed too much to tell.",
          "defaultOrder": 4,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_weight_tendency_001",
      "version": 1,
      "slug": "weight-tendency",
      "text": "Throughout most of your adult life, what has been your natural tendency with weight?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "weight_tendency",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 9,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_weight_tendency_001_lose_weight_easily_difficulty",
          "version": 1,
          "text": "I tend to lose weight easily or have difficulty maintaining it.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_weight_tendency_001_weight_responds_fairly_quickly",
          "version": 1,
          "text": "My weight responds fairly quickly to changes in eating and activity.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_weight_tendency_001_gain_weight_easily_lose",
          "version": 1,
          "text": "I tend to gain weight easily and lose it gradually.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_weight_tendency_001_unsure_or_changed",
          "version": 1,
          "text": "Not sure or major changes make this difficult to answer.",
          "defaultOrder": 4,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_skin_tendency_001",
      "version": 1,
      "slug": "skin-tendency",
      "text": "When your skin is in its usual state, which description fits best?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "skin",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 10,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_skin_tendency_001_dry_thin_cool_rough",
          "version": 1,
          "text": "It tends to be dry, thin, cool, or rough.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_skin_tendency_001_warm_sensitive_flushed_easily",
          "version": 1,
          "text": "It tends to be warm, sensitive, flushed, or easily irritated.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_skin_tendency_001_soft_smooth_thicker_naturally",
          "version": 1,
          "text": "It tends to be soft, smooth, thicker, or naturally moist.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_skin_tendency_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_temperature_tolerance_001",
      "version": 1,
      "slug": "temperature-tolerance",
      "text": "Which type of weather or temperature is naturally hardest for you?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "temperature_tolerance",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 11,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_temperature_tolerance_001_cold_windy_dry_conditions",
          "version": 1,
          "text": "Cold, windy, or dry conditions.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_temperature_tolerance_001_hot_weather_strong_direct",
          "version": 1,
          "text": "Hot weather or strong direct sun.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_temperature_tolerance_001_cold_damp_heavy_weather",
          "version": 1,
          "text": "Cold, damp, or heavy weather.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_temperature_tolerance_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none affects me consistently.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_sweating_tendency_001",
      "version": 1,
      "slug": "sweating-tendency",
      "text": "Under similar levels of heat or activity, how much do you naturally tend to sweat?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "sweating",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 12,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_sweating_tendency_001_little_irregularly",
          "version": 1,
          "text": "Usually little or irregularly.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_sweating_tendency_001_easily_noticeably",
          "version": 1,
          "text": "Easily and often noticeably.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_sweating_tendency_001_moderately_some_moisture_clamminess",
          "version": 1,
          "text": "Moderately, often with some moisture or clamminess.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_sweating_tendency_001_unsure",
          "version": 1,
          "text": "Not sure.",
          "defaultOrder": 4,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_appetite_001",
      "version": 1,
      "slug": "usual-appetite",
      "text": "When you are generally well, how would you describe your appetite?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "appetite",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 13,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_appetite_001_variable_very_hungry_at",
          "version": 1,
          "text": "It is variable; I may be very hungry at one meal and uninterested at another.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_appetite_001_strong_arrives_predictably",
          "version": 1,
          "text": "It is strong and arrives predictably.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_appetite_001_steady_but_not_urgent",
          "version": 1,
          "text": "It is steady but not urgent, and I can comfortably wait to eat.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_appetite_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_delayed_meals_001",
      "version": 1,
      "slug": "delayed-meals",
      "text": "What usually happens when a meal is delayed?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "delayed_meals",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 14,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_delayed_meals_001_forget_about_eating_then",
          "version": 1,
          "text": "I may forget about eating, then suddenly feel depleted, shaky, or unsettled.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_delayed_meals_001_become_intensely_hungry_impatient",
          "version": 1,
          "text": "I become intensely hungry, impatient, or irritable.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_delayed_meals_001_notice_hunger_but_wait",
          "version": 1,
          "text": "I notice the hunger but can usually wait without much difficulty.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_delayed_meals_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_digestion_001",
      "version": 1,
      "slug": "usual-digestion",
      "text": "When eating foods that normally agree with you, which digestive pattern is most typical?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "digestion",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 15,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_digestion_001_unpredictable_digestion_gas_bloating",
          "version": 1,
          "text": "Unpredictable digestion, often with gas, bloating, or irregular comfort.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_digestion_001_fast_intense_digestion_sometimes",
          "version": 1,
          "text": "Fast or intense digestion, sometimes with heat or burning discomfort.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_digestion_001_slow_heavy_digestion_especially",
          "version": 1,
          "text": "Slow or heavy digestion, especially after a large meal.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_digestion_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_bowel_pattern_001",
      "version": 1,
      "slug": "usual-bowel-pattern",
      "text": "When your digestion is in its usual state, which pattern fits best?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "bowel_pattern",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 16,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_bowel_pattern_001_irregular_timing_tendency_toward",
          "version": 1,
          "text": "Irregular timing, with a tendency toward dryness or difficulty.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_bowel_pattern_001_frequent_urgent_movements_tendency",
          "version": 1,
          "text": "Frequent or urgent movements, with a tendency toward looseness.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_bowel_pattern_001_regular_but_slower_movements",
          "version": 1,
          "text": "Regular but slower movements, sometimes with a sense of heaviness.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_bowel_pattern_001_unsure_or_prefer_not",
          "version": 1,
          "text": "Not sure or prefer not to answer.",
          "defaultOrder": 4,
          "kind": "prefer_not",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_sleep_pattern_001",
      "version": 1,
      "slug": "natural-sleep-pattern",
      "text": "When life is relatively stable, what is your natural sleep pattern?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "sleep",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 17,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_sleep_pattern_001_light_easily_interrupted_amount",
          "version": 1,
          "text": "Light or easily interrupted, and the amount I sleep may vary.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_sleep_pattern_001_moderate_fairly_regular_though",
          "version": 1,
          "text": "Moderate and fairly regular, though heat or mental activity may disturb it.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_sleep_pattern_001_deep_long_find_difficult",
          "version": 1,
          "text": "Deep and long, and I may find it difficult to wake.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_sleep_pattern_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_speaking_style_001",
      "version": 1,
      "slug": "natural-speaking-style",
      "text": "How would you describe your natural speaking style?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "speaking_style",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 18,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_speaking_style_001_fast_animated_sometimes_changing",
          "version": 1,
          "text": "Fast, animated, and sometimes changing direction quickly.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_speaking_style_001_clear_direct_precise_sometimes",
          "version": 1,
          "text": "Clear, direct, precise, and sometimes forceful.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_speaking_style_001_calm_measured_sometimes_slow",
          "version": 1,
          "text": "Calm, measured, and sometimes slow to respond.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_speaking_style_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_baseline_stress_response_001",
      "version": 1,
      "slug": "response-to-pressure",
      "text": "When under ordinary stress, which response is most typical for you?",
      "helpText": null,
      "assessmentType": "baseline",
      "category": "stress_response",
      "responseType": "single_select",
      "timeWindow": "usual_adult_state",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 19,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_baseline_stress_response_001_become_worried_scattered_uncertain",
          "version": 1,
          "text": "I become worried, scattered, uncertain, or restless.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_stress_response_001_become_impatient_critical_frustrated",
          "version": 1,
          "text": "I become impatient, critical, frustrated, or intensely focused.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_stress_response_001_withdraw_resist_change_hold",
          "version": 1,
          "text": "I withdraw, resist change, hold onto the issue, or lose motivation.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_baseline_stress_response_001_unsure_or_none_fit",
          "version": 1,
          "text": "Not sure or none of these fit.",
          "defaultOrder": 4,
          "kind": "none_fit",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_sleep_001",
      "version": 1,
      "slug": "recent-sleep",
      "text": "During the past seven days, how has your sleep been?",
      "helpText": null,
      "assessmentType": "current",
      "category": "sleep",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 20,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_sleep_001_light_interrupted_irregular_difficult",
          "version": 1,
          "text": "Light, interrupted, irregular, or difficult to settle into.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_sleep_001_shortened_disturbed_by_feeling",
          "version": 1,
          "text": "Shortened or disturbed by feeling warm, mentally active, or driven.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_sleep_001_heavy_prolonged_difficulty_waking",
          "version": 1,
          "text": "Heavy or prolonged, with difficulty waking or getting started.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_sleep_001_comfortable_close_normal_sleep",
          "version": 1,
          "text": "Comfortable and close to my normal sleep.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_sleep_001_unsure",
          "version": 1,
          "text": "Not sure.",
          "defaultOrder": 5,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_appetite_001",
      "version": 1,
      "slug": "recent-appetite",
      "text": "During the past seven days, how has your appetite compared with your usual pattern?",
      "helpText": null,
      "assessmentType": "current",
      "category": "appetite",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 21,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_appetite_001_more_irregular_unpredictable_than",
          "version": 1,
          "text": "More irregular or unpredictable than usual.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_appetite_001_more_intense_urgent_than",
          "version": 1,
          "text": "More intense or urgent than usual.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_appetite_001_weaker_slower_less_interested",
          "version": 1,
          "text": "Weaker, slower, or less interested than usual.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_appetite_001_close_usual_pattern",
          "version": 1,
          "text": "Close to my usual pattern.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_appetite_001_unsure",
          "version": 1,
          "text": "Not sure.",
          "defaultOrder": 5,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_digestion_001",
      "version": 1,
      "slug": "recent-digestion",
      "text": "During the past seven days, which digestive pattern has been most noticeable?",
      "helpText": null,
      "assessmentType": "current",
      "category": "digestion",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 22,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_digestion_001_gas_bloating_irregularity_dryness",
          "version": 1,
          "text": "Gas, bloating, irregularity, or dryness.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_digestion_001_heat_burning_discomfort_urgency",
          "version": 1,
          "text": "Heat, burning discomfort, urgency, or looseness.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_digestion_001_heaviness_sluggishness_feeling_full",
          "version": 1,
          "text": "Heaviness, sluggishness, or feeling full for a long time.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_digestion_001_digestion_felt_comfortable_close",
          "version": 1,
          "text": "Digestion has felt comfortable and close to normal.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_digestion_001_unsure_or_prefer_not",
          "version": 1,
          "text": "Not sure or prefer not to answer.",
          "defaultOrder": 5,
          "kind": "prefer_not",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_energy_001",
      "version": 1,
      "slug": "recent-energy",
      "text": "During the past seven days, how has your energy felt?",
      "helpText": null,
      "assessmentType": "current",
      "category": "energy",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 23,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_energy_001_scattered_inconsistent_depleted_difficult",
          "version": 1,
          "text": "Scattered, inconsistent, depleted, or difficult to sustain.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_energy_001_intense_driven_restless_difficult",
          "version": 1,
          "text": "Intense, driven, restless, or difficult to switch off.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_energy_001_heavy_slow_sleepy_difficult",
          "version": 1,
          "text": "Heavy, slow, sleepy, or difficult to activate.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_energy_001_stable_close_normal_energy",
          "version": 1,
          "text": "Stable and close to my normal energy.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_energy_001_unsure",
          "version": 1,
          "text": "Not sure.",
          "defaultOrder": 5,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_stress_response_001",
      "version": 1,
      "slug": "recent-response-to-stress",
      "text": "During the past seven days, what has been your most common response to pressure?",
      "helpText": null,
      "assessmentType": "current",
      "category": "stress_response",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 24,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_stress_response_001_worry_uncertainty_restlessness_feeling",
          "version": 1,
          "text": "Worry, uncertainty, restlessness, or feeling scattered.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_stress_response_001_irritation_impatience_frustration_feeling",
          "version": 1,
          "text": "Irritation, impatience, frustration, or feeling overly driven.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_stress_response_001_withdrawal_heaviness_resistance_low",
          "version": 1,
          "text": "Withdrawal, heaviness, resistance, or low motivation.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_stress_response_001_response_felt_manageable_close",
          "version": 1,
          "text": "My response has felt manageable and close to normal.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_stress_response_001_unsure_or_prefer_not",
          "version": 1,
          "text": "Not sure or prefer not to answer.",
          "defaultOrder": 5,
          "kind": "prefer_not",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_routine_001",
      "version": 1,
      "slug": "recent-routine",
      "text": "During the past seven days, how has your daily routine felt?",
      "helpText": null,
      "assessmentType": "current",
      "category": "routine",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 25,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_routine_001_unpredictable_disrupted_constantly_changing",
          "version": 1,
          "text": "Unpredictable, disrupted, or constantly changing.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_routine_001_overly_scheduled_demanding_focused",
          "version": 1,
          "text": "Overly scheduled, demanding, or focused on productivity.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_routine_001_inactive_repetitive_difficult_get",
          "version": 1,
          "text": "Inactive, repetitive, or difficult to get moving within.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_routine_001_consistent_supportive",
          "version": 1,
          "text": "Consistent and supportive.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_routine_001_unsure",
          "version": 1,
          "text": "Not sure.",
          "defaultOrder": 5,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_current_body_qualities_001",
      "version": 1,
      "slug": "recent-body-qualities",
      "text": "During the past seven days, which group of physical qualities has been most noticeable?",
      "helpText": null,
      "assessmentType": "current",
      "category": "body_qualities",
      "responseType": "single_select",
      "timeWindow": "past_7_days",
      "skippable": true,
      "sensitive": false,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 26,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_current_body_qualities_001_dryness_coldness_tension_lightness",
          "version": 1,
          "text": "Dryness, coldness, tension, or lightness.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_body_qualities_001_heat_redness_sensitivity_sharpness",
          "version": 1,
          "text": "Heat, redness, sensitivity, or sharpness.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_body_qualities_001_heaviness_dampness_congestion_sluggishness",
          "version": 1,
          "text": "Heaviness, dampness, congestion, or sluggishness.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_body_qualities_001_none_particularly_noticeable",
          "version": 1,
          "text": "None of these has been particularly noticeable.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_current_body_qualities_001_unsure",
          "version": 1,
          "text": "Not sure.",
          "defaultOrder": 5,
          "kind": "not_sure",
          "exclusive": true,
          "status": "draft"
        }
      ]
    },
    {
      "id": "q_context_major_change_001",
      "version": 1,
      "slug": "changes-from-usual-state",
      "text": "Is there anything currently making your body, habits, or energy substantially different from your usual state?",
      "helpText": null,
      "assessmentType": "context",
      "category": "major_change",
      "responseType": "single_select",
      "timeWindow": "current_context",
      "skippable": true,
      "sensitive": true,
      "randomizeAnswers": false,
      "status": "draft",
      "defaultOrder": 27,
      "priority": 100,
      "requiredForCompletion": false,
      "requiredForResult": false,
      "minimumCategoryCoverage": false,
      "answers": [
        {
          "id": "a_context_major_change_001_no_major_change",
          "version": 1,
          "text": "No major change.",
          "defaultOrder": 1,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_context_major_change_001_recent_travel_major_schedule",
          "version": 1,
          "text": "Recent travel or a major schedule change.",
          "defaultOrder": 2,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_context_major_change_001_significant_stress_major_life",
          "version": 1,
          "text": "Significant stress or a major life event.",
          "defaultOrder": 3,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_context_major_change_001_recent_illness_injury_medication",
          "version": 1,
          "text": "Recent illness, injury, medication change, pregnancy, or another physical change.",
          "defaultOrder": 4,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_context_major_change_001_another_reason",
          "version": 1,
          "text": "Another reason.",
          "defaultOrder": 5,
          "kind": "ordinary",
          "exclusive": true,
          "status": "draft"
        },
        {
          "id": "a_context_major_change_001_prefer_not",
          "version": 1,
          "text": "Prefer not to answer.",
          "defaultOrder": 6,
          "kind": "prefer_not",
          "exclusive": true,
          "status": "draft"
        }
      ]
    }
  ]
} as const

export type InitialAssessment = typeof initialAssessment
export type QuizQuestion = InitialAssessment['questions'][number]
export type QuizAnswer = QuizQuestion['answers'][number]
