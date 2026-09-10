import { EntitySchema } from "typeorm";

export const Task = new EntitySchema({
  name: "Task",
  tableName: "tasks",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    title: {
      type: "varchar",
      length: 150,
      nullable: false,
    },

    description: {
      type: "text",
      nullable: true,
    },

    status: {
      type: "varchar",
      length: 30,
      default: "pending",
    },
    
    // THE FOREIGN KEY: This column holds the UUID of the User who created this task.
    // nullable: false ensures an "orphan" task cannot exist without an owner.
    userId: {
      type: "uuid",
      nullable: false,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId",
      },
      onDelete: "CASCADE",
    },
  },
});