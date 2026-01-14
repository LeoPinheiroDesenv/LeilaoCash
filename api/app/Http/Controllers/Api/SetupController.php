<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Database\Seeders\TextSettingsSeeder;

class SetupController extends Controller
{
    public function runTextSeeder()
    {
        try {
            $seeder = new TextSettingsSeeder();
            $seeder->run();
            return response()->json(['success' => true, 'message' => 'Text settings seeded successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
