"use strict";

const gitlabHost = process.env.GITLAB_HOST || "";
const gitlabPrivateToken = process.env.GITLAB_PRIVATE_TOKEN || "";

const openaiMergeRequestPersona =
  process.env.OPENAI_MERGE_REQUEST_PERSONA ||
  "You are the developer who made this merge request";
const openaiMergeRequestRequest =
  process.env.OPENAI_MERGE_REQUEST_REQUEST ||
  "Describe as markdown format what you did in this changes without copying file content, and at the end, tell me if there any enhancement to do in the code starting this paragraph with a robot emoji:\n\n%s";

const logger = require("../logger");
const openai = require("./openai");
const axios = require("axios");

class Gitlab {
  constructor(payload) {
    this.payload = payload;
    this.projectId = this.payload.project.id;
    this.mergeRequestId = this.payload.object_attributes.iid;
  }

  async process() {
    if (!this.projectId || !this.mergeRequestId) {
      logger.error("projectId or mergeRequestId missing", {
        projectId: this.projectIs,
        mergeRequestId: this.mergeRequestId,
      });
      return;
    }
    switch (this.payload.object_kind) {
      case "merge_request":
        logger.info("Processing merge request...", {
          projectId: this.projectIs,
          mergeRequestId: this.mergeRequestId,
        });
        const mergeRequestChanges = await this.getMergeRequest();
        const OpenAI = new openai();
        const openaiResponse = await OpenAI.process(
          openaiMergeRequestPersona,
          this.sprintf(
            openaiMergeRequestRequest,
            JSON.stringify(mergeRequestChanges)
          )
        );
        await this.setMergeRequestDescription(openaiResponse.message.content);
        break;
      case "push":
        // Todo: Add push webhook and process
        break;
      default:
        logger.error("Payload received not considered", this.payload);
        break;
    }
  }

  async getMergeRequest() {
    try {
      logger.info("Fetching merge request changes...", {
        projectId: this.projectIs,
        mergeRequestId: this.mergeRequestId,
      });
      const response = await axios.get(
        `${gitlabHost}/api/v4/projects/${this.projectId}/merge_requests/${this.mergeRequestId}/diffs`,
        {
          headers: {
            "PRIVATE-TOKEN": gitlabPrivateToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error("Error fetching merge request", error);
    }
  }

  async setMergeRequestDescription(description) {
    try {
      logger.info("Update merge request description...", {
        projectId: this.projectIs,
        mergeRequestId: this.mergeRequestId,
      });
      const response = await axios.put(
        `${gitlabHost}/api/v4/projects/${this.projectId}/merge_requests/${this.mergeRequestId}`,
        {
          description,
        },
        {
          headers: {
            "PRIVATE-TOKEN": gitlabPrivateToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error("Error updating merge request description", error);
    }
  }

  sprintf(format, ...args) {
    return format.replace(/%s/g, () => args.shift());
  }
}

module.exports = Gitlab;
