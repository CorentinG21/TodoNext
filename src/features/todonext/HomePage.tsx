import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { prisma } from "@/lib/prisma"
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const HomePage = async () => {
    const todos = await prisma.todo.findMany();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 md:mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                        TodoLIST
                    </h1>
                    <p className="text-gray-500 text-lg">
                        {todos.length} tâche{todos.length > 1 ? 's' : ''} en cours
                    </p>
                </div>

                {/* Liste des todos */}
                <div className="space-y-4">
                    {todos.map(todo => (
                        <Item
                            key={todo.id}
                            variant="outline"
                            className="group bg-white hover:bg-gray-50 transition-all duration-200 
                                     rounded-xl shadow-sm hover:shadow-md border border-gray-200 
                                     hover:border-gray-300 p-5"
                        >
                            <div className="flex items-center gap-4">
                                <ItemActions>
                                    <Checkbox
                                        checked={todo.status === "CHECKED"}
                                        className="h-5 w-5 rounded-lg border-gray-300 
                                                 data-[state=checked]:bg-blue-500 
                                                 data-[state=checked]:border-blue-500
                                                 transition-colors duration-200"
                                    />
                                </ItemActions>

                                <ItemContent className="flex-1">
                                    <div className="flex items-center">
                                        <ItemTitle className={`text-lg font-medium ${todo.status === "CHECKED" ? 'line-through text-gray-400' : 'text-gray-700'}`}
                                        >
                                            {todo.label}
                                        </ItemTitle>
                                        <Badge
                                            variant={todo.priority === "HIGH" ? "destructive" : todo.priority === "MEDIUM" ? "outline" : "secondary"}
                                            className={`h-6 min-w-20 justify-center text-xs font-medium 
                                                ${todo.priority === "HIGH"
                                                    ? 'bg-red-100 text-red-800 border-red-200'
                                                    : todo.priority === "MEDIUM"
                                                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                                                        : 'bg-green-100 text-green-800 border-green-200'
                                                }`}
                                        >
                                            {todo.priority === "HIGH" ? "Haute" : todo.priority === "MEDIUM" ? "Moyenne" : "Basse"}
                                        </Badge>
                                    </div>
                                </ItemContent>
                            </div>
                        </Item>
                    ))}
                </div>
            </div >
        </div >
    )
}