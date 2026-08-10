import type {
  Developer,
  Task,
  TaskStatus,
} from "../types";

interface TaskRowProps {
  task: Task;
  developers: Developer[];
  onUpdate: (
    taskId: number,
    updates: {
      developerId?: number | null;
      status?: TaskStatus;
    }
  ) => Promise<void>;
}

export default function TaskRow({
  task,
  developers,
  onUpdate,
}: TaskRowProps) {
  const eligibleDevelopers = developers.filter((developer) => {
    const developerSkillIds = new Set(
      developer.skills?.map((skill) => skill.id) ?? []
    );

    return task.skills.every((skill) =>
      developerSkillIds.has(skill.id)
    );
  });

  return (
    <tr>
      <td>{task.title}</td>

      <td>
        {task.skills.length === 0
          ? "No skills"
          : task.skills.map((skill) => skill.name).join(", ")}
      </td>

      <td>
        <select
          value={task.status}
          onChange={(event) =>
            onUpdate(
              task.id,
              {
                status: event.target.value as TaskStatus,
              }
            )
          }
        >
          <option value="TODO">To-do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </td>

      <td>
        <select
          value={task.developerId ?? ""}
          onChange={(event) =>
            onUpdate(
              task.id,
              {
                developerId:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              }
            )
          }
        >
          <option value="">Unassigned</option>

          {eligibleDevelopers.map((developer) => (
            <option
              key={developer.id}
              value={developer.id}
            >
              {developer.name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}