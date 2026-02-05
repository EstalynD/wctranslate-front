// Dashboard Components Barrel Export
export { Sidebar } from "./sidebar"
export { Header } from "./header"

// Cards
export {
  ProgressCard,
  NextTaskCard,
  AchievementsCard,
  ModuleCard,
  SupportCard,
} from "./cards"

// Library Components
export {
  SearchBar,
  CategoryFilters,
  LibraryModuleCard,
} from "./library"
export type { CategoryFilter, LibraryModule, ModuleCategory, ModuleLevel } from "./library"

// Module Detail Components
export {
  ModuleDetailHeader,
  BackToModulesButton,
  LessonTimeline,
  ModuleDetailFooter,
} from "./module-detail"
export type { Lesson, LessonTask, LessonStatus, TaskType } from "./module-detail"

// Lesson Detail Components
export {
  Breadcrumb,
  LessonDetailHeader,
  TaskCard,
  TaskList,
  LessonNavigation,
} from "./lesson-detail"
export type { Task, TaskStatus, LessonTaskType } from "./lesson-detail"

// Task Detail Components
export {
  TaskDetailHeader,
  TaskResources,
  TaskSubmission,
  DeadlineCard,
  TaskProgressHeader,
} from "./task-detail"
export type { Resource, ResourceType } from "./task-detail"

// Profile Components
export {
  ProfileHeader,
  PersonalInfoForm,
  AccountSettings,
  LearningStats,
  AchievementsGrid,
} from "./profile"