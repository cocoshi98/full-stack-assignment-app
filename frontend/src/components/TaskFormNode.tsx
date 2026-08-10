import type {
  Skill,
  TaskFormNodeData,
} from "../types";

import "./TaskFormNode.css";

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
    <div
      className={`task-node ${
        depth === 0 ? "task-node-root" : ""
      }`}
    >
      {depth > 0 && (
        <div className="task-node-branch">
          <span className="task-node-depth">
            Subtask level {depth}
          </span>
        </div>
      )}

      <div className="task-node-content">
        <div className="task-node-field">
          <label htmlFor={`title-${node.id}`}>
            Task title
          </label>

          <input
            id={`title-${node.id}`}
            type="text"
            value={node.title}
            placeholder={
              depth === 0
                ? "Enter task title"
                : "Enter subtask title"
            }
            onChange={(event) =>
              updateTitle(event.target.value)
            }
          />
        </div>

        <div className="task-node-field">
          <span className="task-node-label">
            Required skills
          </span>

          <div className="task-node-skills">
            {skills.map((skill) => (
              <label
                key={skill.id}
                className="task-node-skill"
              >
                <input
                  type="checkbox"
                  checked={node.skillIds.includes(
                    skill.id
                  )}
                  onChange={() =>
                    toggleSkill(skill.id)
                  }
                />

                <span>{skill.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="task-node-actions">
          <button
            type="button"
            onClick={addSubtask}
            className="task-button task-button-add"
          >
            + Add subtask
          </button>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="task-button task-button-remove"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {node.subtasks.length > 0 && (
        <div className="task-node-children">
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
        </div>
      )}
    </div>
  );
}