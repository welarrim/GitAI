"use strict";

const openaiModel = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

const openai = require("openai");
const logger = require("../logger");

class OpenAI {
  constructor() {
    logger.info("Init Openai...");
    this.openaiInstance = new openai();
  }

  async process(persona, request) {
    try {
      logger.info("Sending request to openai...");
      const completion = await this.openaiInstance.chat.completions.create({
        messages: [
          {
            role: "system",
            content: persona,
          },
          {
            role: "user",
            content: request,
          },
        ],
        model: openaiModel,
      });

      return completion.choices[0];
    } catch (error) {
      logger.error("Error while openai processing.", error);
    }
  }
}

module.exports = OpenAI;
