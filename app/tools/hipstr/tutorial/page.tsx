import { TutorialPage } from "@/components/tutorials/TutorialPage";
import { HIPSTR_TUTORIAL_POSTER, hipstrTutorial } from "@/lib/tutorials";

export default function HipstrTutorialPage() {
  return <TutorialPage tutorial={hipstrTutorial} poster={HIPSTR_TUTORIAL_POSTER} />;
}
