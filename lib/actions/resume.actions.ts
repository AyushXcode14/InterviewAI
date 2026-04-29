"use server";

import { db } from "@/config/database";
import { projects, resumes, users } from "@/config/database/schema"; // include `users`

interface ResumeProject {
  title: string;
  description: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string[]; // array of skills
  summary: string;
  certifications?: string;
  projects: ResumeProject[];
}

export async function saveResume(
  resumeData: ResumeData,
  userId: string
): Promise<any> {
  try {
    await db
      .insert(users)
      .values({
        id: userId,
        email: `${userId}@dummy.com`, // Guarantee uniqueness to prevent crashes
      })
      .onConflictDoNothing({ target: users.id });

    // Convert skills array to PostgreSQL array format
    const skillsArray = resumeData.skills.join(",");

    // Insert resume row
    const savedResume = await db
      .insert(resumes)
      .values({
        name: resumeData.name,
        userId: userId,
        email: resumeData.email,
        phone: resumeData.phone,
        address: resumeData.address,
        education: resumeData.education,
        experience: resumeData.experience,
        skills: `{${skillsArray}}`, // matches "skills[]" column
        summary: resumeData.summary,
        certifications: resumeData.certifications,
      })
      .returning();

    // Insert related projects
    const projectPromises = resumeData.projects.map((project) =>
      db
        .insert(projects)
        .values({
          resumeId: savedResume[0].id,
          title: project.title,
          description: project.description,
        })
        .returning()
    );

    await Promise.all(projectPromises);
    return savedResume[0];
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error(`Failed to save resume: ${error instanceof Error ? error.message : String(error)}`);
  }
}
