import EmojiPicker, {
  Emoji,
  EmojiStyle,
  Theme as EmojiTheme,
} from "emoji-picker-react";

import { ModelType } from "../store";

import BotIcon from "../icons/bot.svg";
import BlackBotIcon from "../icons/black-bot.svg";
import ClaudeIcon from "../icons/bot.Claude.png";
import GeminiIcon from "../icons/bot.Gemini.png";
import LlamaIcon from "../icons/bot.Llama.png";
import CohereIcon from "../icons/bot.Cohere.png";
import DeepseekIcon from "../icons/deepseek-color.svg";
import KimiIcon from "../icons/kimi.png";
import GlmIcon from "../icons/glm.png";
import GrokIcon from "../icons/grok.png";
import Gpt35Icon from "../icons/bot.png";
import QwenIcon from "../icons/qwen.png";

// import "../styles/model-avatar.scss";

export function getEmojiUrl(unified: string, style: EmojiStyle) {
  // Whoever owns this Content Delivery Network (CDN), I am using your CDN to serve emojis
  // Old CDN broken, so I had to switch to this one
  // Author: https://github.com/H0llyW00dzZ
  return `https://fastly.jsdelivr.net/npm/emoji-datasource-apple/img/${style}/64/${unified}.png`;
}

export function AvatarPicker(props: {
  onEmojiClick: (emojiId: string) => void;
}) {
  return (
    <EmojiPicker
      width={"100%"}
      lazyLoadEmojis
      theme={EmojiTheme.AUTO}
      getEmojiUrl={getEmojiUrl}
      onEmojiClick={(e) => {
        props.onEmojiClick(e.unified);
      }}
    />
  );
}

export function Avatar(props: { model?: ModelType; avatar?: string }) {
  if (props.model) {
    return (
      <div className="no-dark">
        {(() => {
          const model = props.model?.toLowerCase() || "";

          if (model.includes("claude")) {
            return (
              <img
                src={ClaudeIcon.src}
                className="user-avatar model-avatar"
                alt="Claude"
              />
            );
          }

          if (model.includes("gemini")) {
            return (
              <img
                src={GeminiIcon.src}
                className="user-avatar model-avatar"
                alt="Gemini"
              />
            );
          }

          if (model.includes("llama")) {
            return (
              <img
                src={LlamaIcon.src}
                className="user-avatar model-avatar"
                alt="Llama"
              />
            );
          }

          if (model.includes("gpt-3.5") || model.includes("gpt3")) {
            return (
              <img
                src={Gpt35Icon.src}
                className="user-avatar model-avatar"
                alt="GPT-3.5"
              />
            );
          }

          if (
            model.startsWith("gpt-4") ||
            model.startsWith("chatgpt-4o") ||
            model.startsWith("o1")
          ) {
            return <BlackBotIcon className="user-avatar model-avatar" />;
          }

          if (model.includes("command")) {
            return (
              <img
                src={CohereIcon.src}
                className="user-avatar model-avatar"
                alt="Cohere"
              />
            );
          }

          if (model.includes("deepseek")) {
            return <DeepseekIcon className="user-avatar model-avatar" />;
          }

          if (model.includes("kimi")) {
            return (
              <img
                src={KimiIcon.src}
                className="user-avatar model-avatar"
                alt="Kimi"
              />
            );
          }

          if (model.includes("glm")) {
            return (
              <img
                src={GlmIcon.src}
                className="user-avatar model-avatar"
                alt="GLM"
              />
            );
          }

          if (model.includes("grok")) {
            return (
              <img
                src={GrokIcon.src}
                className="user-avatar model-avatar"
                alt="Grok"
              />
            );
          }

          if (model.includes("qwen")) {
            return (
              <img
                src={QwenIcon.src}
                className="user-avatar model-avatar"
                alt="Qwen"
              />
            );
          }

          return <BotIcon className="user-avatar model-avatar" />;
        })()}
      </div>
    );
  }

  return (
    <div className="user-avatar">
      {props.avatar && <EmojiAvatar avatar={props.avatar} />}
    </div>
  );
}

export function EmojiAvatar(props: { avatar: string; size?: number }) {
  return (
    <Emoji
      unified={props.avatar}
      size={props.size ?? 18}
      getEmojiUrl={getEmojiUrl}
    />
  );
}
