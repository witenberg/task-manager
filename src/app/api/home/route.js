import Task from "../../../models/task";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID not provided' }), { status: 400 });
        }

        const tasks = await Task.find({ userId });
        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error fetching tasks', error }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        console.log("Received data:", data);

        const { userId, title, description, completionDate } = data;

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
        }

        if (!title) {
            return new Response(JSON.stringify({ message: 'Title is required' }), { status: 400 });
        }

        const task = new Task({
            title,
            description,
            completed: false,
            completionDate,
            userId,
        });

        await task.save();
        return new Response(JSON.stringify(task), { status: 201 });

    } catch (error) {
        console.error("Error creating task:", error.message || error);
        return new Response(JSON.stringify({ message: 'Error creating task', error: error.message || error }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const data = await req.json();
        console.log("Received data for update:", data);

        const { title, description, completionDate, completed } = data;

        if (!id) {
            return new Response(JSON.stringify({ message: 'Task ID is required' }), { status: 400 });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, {
            title,
            description,
            completionDate: completionDate || null,
            completed,
        }, { new: true });

        if (!updatedTask) {
            return new Response(JSON.stringify({ message: 'Task not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedTask), { status: 200 });

    } catch (error) {
        console.error("Error updating task:", error.message || error);
        return new Response(JSON.stringify({ message: 'Error updating task', error: error.message || error }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get('id');

        if (!taskId) {
            return new Response(JSON.stringify({ message: 'Task ID is required' }), { status: 400 });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return new Response(JSON.stringify({ message: 'Task not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Task deleted' }), { status: 200 });

    } catch (error) {
        console.error("Error deleting task:", error.message || error);
        return new Response(JSON.stringify({ message: 'Error deleting task', error: error.message || error }), { status: 500 });
    }
}
