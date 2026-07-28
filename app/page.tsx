// 스킬 갤러리 메인 페이지 - 스킬 카드 목록과 검색 기능 제공

import { getSkillRepos } from './lib/github';
import SkillGallery from './components/SkillGallery';

export default async function Home() {
  const skills = await getSkillRepos();
  return <SkillGallery skills={skills} />;
}