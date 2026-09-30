<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problem_test_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->longText('input');
            $table->longText('expected_output');
            $table->unsignedSmallInteger('points')->default(1);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->unique(['problem_id', 'position']);
            $table->index(['problem_id', 'is_enabled']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problem_test_cases');
    }
};
