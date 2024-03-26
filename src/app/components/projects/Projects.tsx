// Projects.tsx
"use client";

import { useEffect, useState } from "react";
import { Project } from "@prisma/client";
import ProjectCard from "./ProjectCard";
import AddProject from "./AddProject";
import { getProjects } from "~/app/serverActions";

// Add necessary imports for AddProject, DeleteProject, and EditProject components

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mobiles, setMobiles] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProjects(page, pageSize);
      setProjects(response);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleCloseAddProjectModal = () => {
    fetchData();
    setIsAddProjectModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {loading && <p className="flex text-2xl text-white">Loading...</p>}
      {!loading && projects.length === 0 && (
        <p className="text-2xl text-white">No projects found</p>
      )}
      {!loading &&
        projects.length > 0 &&
        projects.map((project) => (
          <ProjectCard key={project.clientName} project={project} />
        ))}
      {isAddProjectModalOpen && (
        <AddProject onClose={handleCloseAddProjectModal} mobiles={mobiles} />
      )}
      {!isAddProjectModalOpen && (
        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 text-2xl font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Project
        </button>
      )}
    </div>
  );
};

export default Projects;
