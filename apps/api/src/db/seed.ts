import { config } from "dotenv";
config({ path: ".env.local" });

const sampleProjects = [
    {
        title: "Retail Expansion Strategy (Kota Bandung)",
        category: "Site Selection",
        summary:
            "Location analysis using Isochrone and Huff's Gravity Model for retail site optimization",
        content_markdown: `# Retail Expansion Strategy

## Objective
Identify optimal locations for retail expansion in Kota Bandung using spatial analysis techniques.

## Methodology
- **Isochrone Analysis**: Calculate service areas at 5, 10, 15 min drive time
- **Huff's Gravity Model**: Estimate market share based on distance and store attractiveness

## Tools Used
- ArcGIS Pro 3.0
- Network Analyst Extension

## Results
Identified 3 optimal locations with 85%+ market coverage.`,
        thumbnail_url:
            "https://via.placeholder.com/400x300?text=Retail+Expansion+Strategy",
        external_link: "https://github.com/fadhil15/retail-expansion",
    },
    {
        title: "Land Use Change Prediction (Pangalengan)",
        category: "Spatial Data Science",
        summary:
            "S1 Thesis: Predicting land use changes using ANN-CA modeling and Sentinel-2 imagery",
        content_markdown: `# Land Use Change Prediction Using ANN-CA

## Research Background
This study predicts future land use patterns in Pangalengan using deep learning and cellular automata.

## Methodology
- **ANN (Artificial Neural Network)** for transition probability
- **CA (Cellular Automata)** for spatial simulation
- Sentinel-2 satellite imagery (2015-2024)

## Validation
- Kappa Coefficient: 0.87
- Overall Accuracy: 92.5%

## Results
Successfully predicted 2024-2030 land use with 92.5% accuracy.`,
        thumbnail_url:
            "https://via.placeholder.com/400x300?text=Land+Use+Change+Prediction",
        external_link: "https://repository.upi.edu",
    },
    {
        title: "WebGIS Creavill Bandung",
        category: "WebGIS",
        summary:
            "Interactive web mapping platform for Creavill community initiatives",
        content_markdown: `# WebGIS Creavill Bandung

## Project Overview
Interactive web mapping platform for Creavill Bandung community initiatives.

## Features
- Interactive map with OSM/Satellite basemaps
- Community data points with popups
- Real-time data updates
- Responsive mobile design

## Technology Stack
- Frontend: Next.js + Leaflet.js
- Backend: Node.js with PostGIS
- Hosting: Vercel
- Maps: OpenStreetMap

## Live Demo
https://creavill-webgis.vercel.app`,
        thumbnail_url:
            "https://via.placeholder.com/400x300?text=WebGIS+Creavill+Bandung",
        external_link: "https://creavill-webgis.vercel.app",
    },
];

async function seed() {
    try {
        console.log("🌱 Seeding database...");

        // Dynamic import to ensure dotenv loads first
        const { db } = await import("./client");
        const { projects } = await import("./schema");

        for (const project of sampleProjects) {
            const result = await db.insert(projects).values(project).returning();
            console.log(`✅ Created: ${result[0].title}`);
        }

        console.log("✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

seed();
