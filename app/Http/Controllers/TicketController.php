<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    function addTicket(Request $request)
    {   
        $user = Auth::user();
try{
        $ticket= new Ticket;
        $ticket->request=$request->input('request');
        $ticket->title=$request->input('title');
        $ticket->description=$request->input('description');

        if ($request->hasFile('file')) {
            $ticket->file_path = $request->file('file')->store('public/tickets');
        } else {
            $ticket->file_path = null;
        }

        $ticket->assignto=$request->input('assignto');
        $ticket->assignby=$user->email;
        $ticket->save();
        return response()->json($ticket, 201); // Successfully created
} catch (\Exception $e) {
    return response()->json(['error' => 'Ticket could not be created'], 500);
}
    }

    function listtickets()
    {
        $tickets = Ticket::orderBy('created_at', 'desc')->get();
        return response()->json($tickets);
    }


    function getTicket($id)
{
    try {
        $ticket = Ticket::findOrFail($id); // Find the ticket by ID or throw a 404
        return response()->json($ticket, 200); // Return the ticket data
    } catch (\Exception $e) {
        return response()->json(['error' => 'Ticket not found'], 404); // Handle not found error
    }
}

public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|string',
    ]);

    try {
        $ticket = Ticket::findOrFail($id);
        $ticket->status = $request->input('status');
        $ticket->save();

        return response()->json(['message' => 'Ticket status updated successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Ticket not found'], 404);
    }
}


public function reassignTicket(Request $request, $id)
{
    $ticket = Ticket::find($id);
    if ($ticket) {
        $ticket->assignto = $request->assignto;
        $ticket->reassignedby = $request->reassignedby; // Update the user performing the reassignment
        $ticket->status = $request->status; // Update status to "Reassigned"
        $ticket->save();
        return response()->json(['message' => 'Ticket reassigned successfully'], 200);
    }
    return response()->json(['error' => 'Ticket not found'], 404);
}

public function closeTicket(Request $request, $ticketId)
{
    $request->validate([
        'remarks' => 'required|string',
    ]);

    $ticket = Ticket::findOrFail($ticketId);
    $ticket->status = 'Closed';
    $ticket->remarks = $request->remarks;
    $ticket->save();

    return response()->json(['message' => 'Ticket closed successfully'], 200);
}

public function getClosedTickets()
{
    // Retrieve all tickets with status 'Closed'
    $closedTickets = Ticket::where('status', 'Closed')
        ->orderBy('updated_at', 'desc')
        ->get();
    return response()->json($closedTickets);
    
}


}
