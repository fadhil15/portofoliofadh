const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getProjects() {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
}

export async function getProjectById(id: number) {
    const res = await fetch(`${API_BASE}/api/projects/${id}`);
    if (!res.ok) throw new Error("Project not found");
    return res.json();
}

export async function createProject(data: any) {
    const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
}

export type Project = {
    id: number;
    title: string;
    category: string;
    summary: string;
    content_markdown?: string;
    thumbnail_url: string;
    external_link?: string;
    created_at: string;
};
