// GitHub API에서 스킬 레포 목록과 상세 정보를 가져오는 유틸리티

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'nk-mjk';
const GITHUB_API = 'https://api.github.com';

export interface SkillRepo {
  name: string;
  description: string;
  html_url: string;
  skillFileUrl: string;
  fileType: 'skill' | 'plugin';
  imageUrls: string[];
  readme: string;
  updatedAt: string;
}

async function fetchGitHub(url: string) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

// 폴더를 재귀적으로 탐색해서 .skill 파일과 이미지 파일을 찾는 함수
async function findFilesInContents(
  contents: any[],
  repoName: string
): Promise<{ skillFile: any | null; fileType: 'skill' | 'plugin'; imageFiles: any[] }> {
  let skillFile: any = null;
  let fileType: 'skill' | 'plugin' = 'skill';
  let imageFiles: any[] = [];

  for (const item of contents) {
    if (item.type === 'file') {
      if (item.name.endsWith('.skill') || item.name.endsWith('.plugin')) {
        skillFile = item;
        fileType = item.name.endsWith('.plugin') ? 'plugin' : 'skill';
      } else if (item.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
        imageFiles.push(item);
      }
    } else if (item.type === 'dir') {
      // 하위 폴더 탐색
      const subContents = await fetchGitHub(
        `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/contents/${item.path}`
      );
      if (subContents) {
        const subResult = await findFilesInContents(subContents, repoName);
        if (!skillFile && subResult.skillFile) {
          skillFile = subResult.skillFile;
          fileType = subResult.fileType;
        }
        imageFiles = [...imageFiles, ...subResult.imageFiles];
      }
    }
  }

  return { skillFile, fileType, imageFiles };
}

export async function getSkillRepos(): Promise<SkillRepo[]> {
  const repos = await fetchGitHub(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
  );
  if (!repos) return [];

  const skillRepos = await Promise.all(
    repos.map(async (repo: any) => {
      const contents = await fetchGitHub(
        `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/contents`
      );
      if (!contents) return null;

      const { skillFile, fileType, imageFiles } = await findFilesInContents(contents, repo.name);
      if (!skillFile) return null;

      const readmeFile = contents.find((f: any) =>
        f.name.toLowerCase() === 'readme.md'
      );

      let readme = '';
      if (readmeFile) {
        const readmeRes = await fetch(readmeFile.download_url);
        readme = await readmeRes.text();
      }

      return {
        name: repo.name,
        description: repo.description || '',
        html_url: repo.html_url,
        skillFileUrl: skillFile.download_url,
        fileType,
        imageUrls: imageFiles.map((f: any) => f.download_url),
        readme,
        updatedAt: repo.updated_at,
      };
    })
  );

  return skillRepos.filter(Boolean) as SkillRepo[];
}

export async function getSkillRepo(name: string): Promise<SkillRepo | null> {
  const repos = await getSkillRepos();
  return repos.find((r) => r.name === name) || null;
}