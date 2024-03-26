import { Project } from "@prisma/client";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="mb-4 rounded-lg bg-blue-200 p-4 shadow-md">
      <h2 className="mb-2 text-xl font-bold">{project.projectName}</h2>
      <p className="text-gray-500">{project.clientName}</p>
    </div>
  );
};

export default ProjectCard;
