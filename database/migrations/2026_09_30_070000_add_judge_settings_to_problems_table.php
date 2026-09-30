<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('problems', function (Blueprint $table) {
            $table->string('checker_type')->default('tokens')->after('score');
            $table->string('reference_language')->nullable()->after('checker_type');
            $table->longText('reference_solution')->nullable()->after('reference_language');
        });
    }

    public function down(): void
    {
        Schema::table('problems', function (Blueprint $table) {
            $table->dropColumn(['checker_type', 'reference_language', 'reference_solution']);
        });
    }
};
