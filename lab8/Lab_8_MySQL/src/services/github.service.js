const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJsonWithTimeout = async (url, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'lab-6-fastify-book-catalog',
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

const fetchGithubWithRetry = async (url, logger) => {
  const retryDelays = [1000, 2000, 4000];

  for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
    try {
      return await fetchJsonWithTimeout(url, 5000);
    } catch (error) {
      if (attempt === retryDelays.length) {
        throw error;
      }

      logger.warn({ err: error, attempt: attempt + 1 }, 'GitHub request failed. Retrying.');
      await sleep(retryDelays[attempt]);
    }
  }

  return null;
};

const getContributorsRest = async ({ apiUrl, repo, logger, maxContributors = 100 }) => {
  const contributors = [];
  const pages = Math.ceil(maxContributors / 100);

  for (let page = 1; page <= pages; page += 1) {
    const url = `${apiUrl}/repos/${repo}/contributors?per_page=100&page=${page}`;
    const data = await fetchGithubWithRetry(url, logger);
    contributors.push(...data.map((item) => item.login).filter(Boolean));

    if (data.length < 100 || contributors.length >= maxContributors) {
      break;
    }
  }

  return contributors.slice(0, maxContributors);
};

const countSharedRepositories = async ({ apiUrl, repo, contributors, logger, parallel = false }) => {
  const repoMap = new Map();

  const processContributor = async (login) => {
    const url = `${apiUrl}/users/${login}/repos?per_page=100&sort=updated`;
    const repos = await fetchGithubWithRetry(url, logger);

    for (const userRepo of repos) {
      if (!userRepo.full_name || userRepo.full_name.toLowerCase() === repo.toLowerCase()) {
        continue;
      }

      const current = repoMap.get(userRepo.full_name) ?? {
        repo: userRepo.full_name,
        url: userRepo.html_url,
        sharedContributors: 0,
        sampleContributors: [],
      };

      current.sharedContributors += 1;

      if (current.sampleContributors.length < 5) {
        current.sampleContributors.push(login);
      }

      repoMap.set(userRepo.full_name, current);
    }
  };

  if (parallel) {
    const chunkSize = 10;
    for (let index = 0; index < contributors.length; index += chunkSize) {
      const chunk = contributors.slice(index, index + chunkSize);
      await Promise.all(chunk.map(processContributor));
    }
  } else {
    for (const login of contributors) {
      await processContributor(login);
    }
  }

  return [...repoMap.values()]
    .sort((a, b) => b.sharedContributors - a.sharedContributors)
    .slice(0, 5);
};

export const githubService = {
  async getSharedReposV1({ apiUrl, repo, logger }) {
    const contributors = await getContributorsRest({ apiUrl, repo, logger, maxContributors: 60 });
    const results = await countSharedRepositories({ apiUrl, repo, contributors, logger, parallel: false });

    return {
      repo,
      implementation: 'v1 REST API sequential analysis',
      analyzedContributors: contributors.length,
      results,
    };
  },

  async getSharedReposV2({ apiUrl, repo, logger }) {
    const contributors = await getContributorsRest({ apiUrl, repo, logger, maxContributors: 120 });
    const results = await countSharedRepositories({ apiUrl, repo, contributors, logger, parallel: true });

    return {
      repo,
      implementation: 'v2 REST API paginated contributors and batched parallel analysis',
      analyzedContributors: contributors.length,
      results,
    };
  },
};
