<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('problem_test_case_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('verdict');
            $table->unsignedInteger('execution_time_ms')->nullable();
            $table->unsignedInteger('memory_kb')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();

            $table->unique(['submission_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_results');
    }
};
