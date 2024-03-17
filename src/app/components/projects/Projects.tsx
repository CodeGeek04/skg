// Projects.tsx
"use client";

import { useEffect, useState } from "react";
import { Project } from "@prisma/client";
import AddProject from "./AddProject";

// Add necessary imports for AddProject, DeleteProject, and EditProject components

const Projects: React.FC = () => {
  const localStorageProjects = localStorage.getItem("localProjects");
  const initialProjects = localStorageProjects
    ? (JSON.parse(localStorageProjects) as Project[])
    : [];
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] =
    useState<boolean>(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Partial<Project>>({
    projectId: "",
    projectName: "",
    mobile: "",
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/project/getProjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          pageSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: Project[] = await response.json();
      setProjects(data);
      localStorage.setItem("localProjects", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handleAddProject = (newProject: Partial<Project>) => {
    // Send a POST request to your API endpoint to add the new project
    fetch("/api/project/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName: newProject.projectName,
        clientMobile: newProject.mobile,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add project");
        }
        return response.json();
      })
      .then((data) => {
        // Update the project list with the new project
        setProjects((prevProjects) => [...prevProjects, data]);
      })
      .catch((error) => {
        console.error("Error adding project:", error.message);
      });
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch("/api/project/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      fetchData(); // Refresh the product list after deleting a product
      handleCloseDeleteProject();
    } catch (error: any) {
      console.error("Error deleting project:", error.message);
    }
  };

  const handleEditProject = async (updatedProject: Partial<Project>) => {
    // Send a POST request to your API endpoint to update the project
    try {
      const response = await fetch("/api/project/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      fetchData(); // Refresh the project list after updating a project
      handleCloseEditProject();
    } catch (error: any) {
      console.error("Error updating project:", error.message);
    }
  };

  const handleOpenDeleteProject = (project: Project) => {
    setSelectedProjectId(project.mobile);
    setIsDeleteProjectOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditProjectOpen(true);
  };

  const handleCloseDeleteProject = () => {
    setIsDeleteProjectOpen(false);
  };

  const handleCloseEditProject = () => {
    setIsEditProjectOpen(false);
  };

  // Similar to the Products component, implement functions for adding, deleting, and editing projects

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-4xl font-bold">Project List</h1>

      {/* "Add Project" Button */}
      <button
        onClick={() => setIsAddProjectOpen(true)}
        className="mb-4 rounded-md bg-green-500 px-4 py-2 text-white"
      >
        Add Project
      </button>

      {/* Project List */}
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li
            key={project.projectId}
            className="rounded-md border p-4 shadow-md"
          >
            <h2 className="text-xl font-bold">{project.projectName}</h2>
            <p className="text-gray-500">{project.clientName}</p>
            <p className="text-gray-500">{project.mobile}</p>
            <div className="mt-2 flex space-x-2">
              {/* Delete Client Button */}
              <button
                onClick={() => handleOpenDeleteProject(project)}
                className="rounded-md bg-red-500 px-4 py-2 text-white"
              >
                Delete
              </button>
              {/* Edit Client Button */}
              <button
                onClick={() => handleOpenEditProject(project)}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <label className="mr-2">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-md border p-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <span className="mr-2">Page:</span>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2 rounded-md border px-4 py-2"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="rounded-md border px-4 py-2"
          >
            Next
          </button>
        </div>
      </div>

      {/* AddProject Overlay */}
      {isAddProjectOpen && (
        <AddProject
          onClose={() => setIsAddProjectOpen(false)}
          onAddProject={handleAddProject}
        />
      )}

      {/* DeleteProject Overlay */}
      {/* {isDeleteProjectOpen && (
        <DeleteProject
          onDeleteProject={handleDeleteProject}
          onClose={handleCloseDeleteProject}
          projectId={selectedProjectId}
        />
      )} */}

      {/* EditProject Overlay */}
      {/* {isEditProjectOpen && (
        <EditProject
          onEditProject={handleEditProject}
          onClose={handleCloseEditProject}
          project={selectedProject as Project}
        />
      )} */}
    </div>
  );
};

export default Projects;
