import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './db/schema';
import { eq, desc } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Fadhil Portfolio API' });
});

// GET /api/projects - Fetch all projects
app.get('/api/projects', async (req, res) => {
    try {
        const allProjects = await db.query.projects.findMany({
            orderBy: [desc(schema.projects.created_at)],
        });
        return res.json(allProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET /api/projects/:id - Fetch single project
app.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await db.query.projects.findFirst({
            where: eq(schema.projects.id, Number(id)),
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// POST /api/projects - Add new project (Simple protection)
app.post('/api/projects', async (req, res) => {
    // Simple header check for security (in production use proper auth)
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.API_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { title, category, summary, content_markdown, thumbnail_url, external_link } = req.body;

        // Basic validation
        if (!title || !category || !summary || !content_markdown) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProject = await db.insert(schema.projects).values({
            title,
            category,
            summary,
            content_markdown,
            thumbnail_url,
            external_link,
            // created_at defaults to now
        }).returning();

        return res.status(201).json(newProject[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ error: 'Failed to create project' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
