export interface TaskDetailsItem {
    title: string;
    technical_why?: string;
    pseudo_code?: string | string[];
    academic_reference?: string;
    common_pitfalls?: string | string[];
    smart_media?: {
        youtube_video_id?: string;
        references?: Array<{ title: string; url: string }>;
    };
}

export type TaskChecklistItem = string | TaskDetailsItem;

export interface RoadmapPhase {
    phase: string;
    tasks: string[];
}

export interface AcademicLink {
    subject: string;
    chapters: string[];
}

export interface ResourceItem {
    title: string;
    url: string;
}

export interface WorkspaceData {
    project_title: string;
    description: string;
    roadmap: RoadmapPhase[];
    task_checklist: TaskChecklistItem[];
    academic_links?: AcademicLink[];
    resources: ResourceItem[];
    currentPhaseIndex?: number;
    drive_note?: string;
    notion_url?: string;
    archive_match?: {
        project_name: string;
        solution_hint: string;
        task_name: string;
    };
}
