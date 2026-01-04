import { Router } from "express";
import { db } from "../db/client";
import { projects } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// GET /api/projects - Fetch all projects
router.get("/projects", async (req, res) => {
    try {
        const allProjects = await db
            .select({
                id: projects.id,
                title: projects.title,
                category: projects.category,
                summary: projects.summary,
                thumbnail_url: projects.thumbnail_url,
                external_link: projects.external_link,
                created_at: projects.created_at,
            })
            .from(projects)
            .orderBy(desc(projects.created_at));

        res.json(allProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

// GET /api/projects/:id - Fetch single project with markdown
router.get("/projects/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.id, id))
            .limit(1);

        if (project.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project[0]);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: "Failed to fetch project" });
    }
});

// POST /api/projects - Create new project
const CreateProjectSchema = z.object({
    title: z.string().min(3).max(255),
    category: z.string().min(3),
    summary: z.string().min(10).max(200),
    content_markdown: z.string().min(20),
    thumbnail_url: z.string().url(),
    external_link: z.string().url().optional(),
});

router.post("/projects", async (req, res) => {
    try {
        const validatedData = CreateProjectSchema.parse(req.body);

        const newProject = await db
            .insert(projects)
            .values(validatedData)
            .returning();

        res.status(201).json(newProject);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        console.error("Error creating project:", error);
        res.status(500).json({ message: "Failed to create project" });
    }
});

export default router;
