import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// Question Manager types

export type newQuestionFormat = {
  question: string;
  alternativeQuestions: string[];
  answers: string[];
  tags: TagType[];
};

export type EditQuestionFormat = {
  question: string;
  newAlternativeQuestions: string[];
  newTags: string[];
  removedAlterntaiveQuestions: string[];
  removedTags: string[];
};

export type questionAlternative = {
  id: string;
  question: string;
};

export type answerType = {
  id: string;
  answer: string;
  favorite: boolean;
};

export type TagType = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type questionType = {
  id: string;
  question: string;
  alternativeQuestions: questionAlternative[];
  answers: answerType[];
  tags: TagType[];
};

export type tagType = {
  id: string;
  name: string;
  slug: string;
};

export type originType = {
  id: string;
  name: string;
  slug: string;
  url?: string;
};

export type matcherType = {
  id: string;
  full_name: string;
  email?: string;
  linkedin?: string;
  phone?: string;
};
