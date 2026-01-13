import { matcherType, originType, questionType, tagType } from "@/types";
import { create } from "zustand";

export type questionsAnswersType = {
  questions: questionType[];
  tags: tagType[];
  matchers: matcherType[];
  origins: originType[];
  setQuestions: (questions: questionType[]) => void;
  setTags: (tags: tagType[]) => void;
  setMatchers: (matchers: matcherType[]) => void;
  setOrigins: (origins: originType[]) => void;
};

export const useQuestionsAnswers = create<questionsAnswersType>((set) => ({
  questions: [],
  tags: [],
  matchers: [],
  origins: [],
  setQuestions: (questions: questionType[]) => set({ questions }),
  setTags: (tags: tagType[]) => set({ tags }),
  setMatchers: (matchers: matcherType[]) => set({ matchers }),
  setOrigins: (origins: originType[]) => set({ origins }),
}));
