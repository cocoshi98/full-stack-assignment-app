import type {
  Skill,
  TaskFormNodeData,
} from "../types";

interface TaskFormNodeProps {
  node: TaskFormNodeData;
  skills: Skill[];
  depth?: number;
  onChange: (updatedNode: TaskFormNodeData) => void;
  onRemove?: () => void;
}

export default function TaskFormNode({
  node,
  skills,
  depth = 0,
  onChange,
  onRemove,
}: TaskFormNodeProps) {
  function updateTitle(title: string) {
    onChange({
      ...node,
      title,
    });
  }

  function toggleSkill(skillId: number) {
    const nextSkillIds = node.skillIds.includes(skillId)
      ? node.skillIds.filter((id) => id !== skillId)
      : [...node.skillIds, skillId];

    onChange({
      ...node,
      skillIds: nextSkillIds,
    });
  }

  function addSubtask() {
    const newSubtask: TaskFormNodeData = {
      id: crypto.randomUUID(),
      title: "",
      skillIds: [],
      subtasks: [],
    };

    onChange({
      ...node,
      subtasks: [
        ...node.subtasks,
        newSubtask,
      ],
    });
  }

  function updateSubtask(
    subtaskId: string,
    updatedSubtask: TaskFormNodeData
  ) {
    onChange({
      ...node,
      subtasks: node.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? updatedSubtask
          : subtask
      ),
    });
  }

  function removeSubtask(subtaskId: string) {
    onChange({
      ...node,
      subtasks: node.subtasks.filter(
        (subtask) => subtask.id !== subtaskId
      ),
    });
  }

  return (
    <section
      style={{
        marginLeft: depth * 24,
        marginTop: 16,
        padding: 16,
        border: "1px solid #ccc",
      }}
    >
      <div>
        <label>
          Title
          <input
            type="text"
            value={node.title}
            onChange={(event) =>
              updateTitle(event.target.value)
            }
          />
        </label>
      </div>

      <fieldset>
        <legend>Required Skills</legend>

        {skills.map((skill) => (
          <label key={skill.id}>
            <input
              type="checkbox"
              checked={node.skillIds.includes(skill.id)}
              onChange={() =>
                toggleSkill(skill.id)
              }
            />

            {skill.name}
          </label>
        ))}
      </fieldset>

      <div>
        <button
          type="button"
          onClick={addSubtask}
        >
          Add Subtask
        </button>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>

      {node.subtasks.map((subtask) => (
        <TaskFormNode
          key={subtask.id}
          node={subtask}
          skills={skills}
          depth={depth + 1}
          onChange={(updatedSubtask) =>
            updateSubtask(
              subtask.id,
              updatedSubtask
            )
          }
          onRemove={() =>
            removeSubtask(subtask.id)
          }
        />
      ))}
    </section>
  );
}