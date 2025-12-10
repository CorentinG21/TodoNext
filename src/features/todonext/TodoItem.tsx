import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Todo } from "@/generated/prisma/client";
import { ComponentProps } from "react";

export type TodoItemProps = {
    todo: Todo
} & ComponentProps<typeof Item>

export const TodoItem = ({ todo, ...rest }: TodoItemProps) => {

    return (
        <Item
            {...rest}
            className="group bg-white hover:bg-gray-50 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 p-5"
        >
            <ItemActions>
                <Checkbox
                    checked={todo.status === "CHECKED"}
                    className="h-5 w-5 rounded-lg border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-colors duration-200"
                />
            </ItemActions>

            <ItemContent className="items-center flex-row">
                <ItemTitle
                    className={`mr-auto text-lg font-medium ${todo.status === "CHECKED"
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                >
                    {todo.label}
                </ItemTitle>

                <Badge
                    variant={
                        todo.priority === "HIGH"
                            ? "destructive"
                            : todo.priority === "MEDIUM"
                                ? "outline"
                                : "secondary"
                    }
                    className={`h-6 min-w-20 justify-center text-xs font-medium 
                    ${todo.priority === "HIGH"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : todo.priority === "MEDIUM"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-green-100 text-green-800 border-green-200"
                        }`}
                >
                    {todo.priority === "HIGH"
                        ? "Haute"
                        : todo.priority === "MEDIUM"
                            ? "Moyenne"
                            : "Basse"}
                </Badge>
            </ItemContent>
        </Item>
    );
};
