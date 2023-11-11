# GitAI: GitLab Webhook Listener with OpenAI Integration

## Overview

This Node.js application is designed to listen for GitLab webhook events and automatically generate descriptions for changes made in merge requests using the OpenAI API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you can use this application, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [GitLab](https://gitlab.com/) account and repository
- [OpenAI API](https://beta.openai.com/signup/) access

## Getting Started

1. Configure your GitLab repository's webhook to point to your application's URL. (https://YOUR_DOMAIN/gitlab) **/gitlab at the end is mandatory**

2. Make sure you have your OpenAI Token

3. Clone this repository to your local machine:

  ```bash
  git clone https://github.com/welarrim/GitAI.git
  ```

4. Install the required dependencies:

  ```bash
  cd your-gitlab-webhook-app
  npm install
  ```

5. Copy .env.example to .env, then change variables in .env

  ```bash
  cp .env.example .env
  ```

6. Start the application:

  ```bash
  npm run dev # Start dev env
  or
  npm run start # Start prod env
  ```

## Usage

Once your application is up and running, it will automatically listen for GitLab webhook events related to merge requests. When a merge request is created or updated, it will send a request to the OpenAI API to generate a description of the changes. You can customize the logic for generating descriptions in your application code.

## Contributing

Contributions are welcome! If you have ideas, bug reports, or want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name: git checkout -b feature/my-feature or git checkout -b bugfix/issue-description.
3. Make your changes and commit them: git commit -m "Description of changes".
4. Push your changes to your fork: git push origin feature/my-feature.
5. Create a pull request to the main branch of the original repository.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.
