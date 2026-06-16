import { githubService } from '#services/github.service';

export const githubController = {
  async getSharedReposV1(request) {
    return githubService.getSharedReposV1({
      apiUrl: request.server.config.GITHUB_API_URL,
      repo: request.query.repo,
      logger: request.log,
    });
  },

  async getSharedReposV2(request) {
    return githubService.getSharedReposV2({
      apiUrl: request.server.config.GITHUB_API_URL,
      repo: request.query.repo,
      logger: request.log,
    });
  },
};
