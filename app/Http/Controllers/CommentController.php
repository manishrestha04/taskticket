<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function getComments($ticketId)
    {
        $comments = Comment::where('ticket_id', $ticketId)->get();
        return response()->json($comments);
    }

    // Add a new comment to a ticket
    public function addComment(Request $request, $ticketId)
    {
        $request->validate([
            'comment' => 'required|string',
            'commentedBy' => 'required|string',
        ]);

        $comment = new Comment();
        $comment->ticket_id = $ticketId;
        $comment->comment = $request->comment;  
        $comment->commented_by = $request->commentedBy;
        $comment->save();

        return response()->json(['message' => 'Comment added successfully'], 201);
    }
}
