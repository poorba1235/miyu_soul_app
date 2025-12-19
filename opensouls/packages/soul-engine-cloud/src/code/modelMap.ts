import { PRICING_TIERS } from "./pricingTiers.ts";
import { SupportedModel } from "@opensouls/core";

type Processors = "openai" | "anthropic" | "fireworks" | "google"
export type ModelParams = { name: string; processor: Processors ; pricingTier: keyof typeof PRICING_TIERS }

export const MODEL_MAP: Record<SupportedModel, ModelParams> = {
    "vision": { name: "gpt-4o", processor: "openai", pricingTier: "gpt_4o" },
    "gpt-4o-mini": { name: "gpt-4o-mini", processor: "openai", pricingTier: "gpt_4o_mini" }, 
    "exp/claude-3-opus": { name: "claude-3-opus-20240229", processor: "anthropic", pricingTier: "claude_3_opus" },
    "exp/claude-3-sonnet": { name: "claude-3-sonnet-20240229", processor: "anthropic", pricingTier: "claude_3_sonnet" },
    "exp/claude-3-5-sonnet": { name: "claude-3-5-sonnet-20240620", processor: "anthropic", pricingTier: "claude_3_sonnet" },
    "exp/claude-3-haiku": { name: "claude-3-haiku-20240307", processor: "anthropic", pricingTier: "claude_3_haiku" },
    "exp/firefunction-v1": { name: "fireworks/firefunction-v1", processor: "fireworks", pricingTier: "fireworks_16b" },
    "exp/phi-3-vision": { name: "fireworks/phi-3-vision-128k-instruct", processor: "fireworks", pricingTier: "fireworks_16b" },
    "exp/mixtral-8x22b-instruct": { name: "fireworks/mixtral-8x22b-instruct", processor: "fireworks", pricingTier: "fireworks_moe_lg" },
    "exp/llama-v3-70b-instruct": { name: "fireworks/llama-v3-70b-instruct", processor: "fireworks", pricingTier: "fireworks_80b" },

    "exp/llama-v3p1-8b-instruct": { name: "fireworks/llama-v3p1-8b-instruct", processor: "fireworks", pricingTier: "fireworks_16b" },
    "exp/llama-v3p1-70b-instruct": { name: "fireworks/llama-v3p1-70b-instruct", processor: "fireworks", pricingTier: "fireworks_80b" },
    "exp/llama-v3p1-405b-instruct": { name: "fireworks/llama-v3p1-405b-instruct", processor: "fireworks", pricingTier: "fireworks_400b" },

    "exp/gemini-1.5-pro": { name: "gemini-1.5-pro", processor: "google", pricingTier: "gemini_1_5_pro" },
    "exp/gemini-1.5-flash": { name: "gemini-1.5-flash", processor: "google", pricingTier: "gemini_1_5_flash" },
    "exp/gemini-1.5-pro-exp-0801": { name: "gemini-1.5-pro-exp-0801", processor: "google", pricingTier: "gemini_1_5_pro" },
  }
