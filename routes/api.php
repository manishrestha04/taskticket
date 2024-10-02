<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CommentController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [UserController::class,'register']);
Route::post('/login', [UserController::class,'login']);

Route::middleware('auth:sanctum')->post('/addticket', [TicketController::class, 'addTicket']);
//Route::post('/addticket', [TicketController::class,'addTicket'])->middleware('auth:sanctum');
Route::get('/listtickets', [TicketController::class,'listtickets']);
Route::get('/users', [UserController::class, 'getUsers']);
Route::get('/ticket/{id}', [TicketController::class, 'getTicket']);
Route::put('/ticket/{id}/status', [TicketController::class, 'updateStatus']);
Route::put('/ticket/{id}/reassign', [TicketController::class, 'reassignTicket']);
Route::get('/ticket/{id}/comments', [CommentController::class, 'getComments']);
Route::post('/ticket/{id}/comments', [CommentController::class, 'addComment']);
Route::put('/ticket/{id}/close', [TicketController::class, 'closeTicket']);
Route::get('/closed-tickets', [TicketController::class, 'getClosedTickets']);