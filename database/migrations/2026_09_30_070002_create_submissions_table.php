<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('problem_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('language', 30);
            $table->longText('source_code');
            $table->string('status')->default('queued');
            $table->string('verdict')->nullable();
            $table->unsignedSmallInteger('passed_tests')->default(0);
            $table->unsignedSmallInteger('total_tests')->default(0);
            $table->unsignedSmallInteger('score')->default(0);
            $table->unsignedInteger('execution_time_ms')->nullable();
            $table->unsignedInteger('memory_kb')->nullable();
            $table->text('compiler_output')->nullable();
            $table->timestamp('judged_at')->nullable();
            $table->timestamps();

            $table->index(['competition_id', 'user_id', 'created_at']);
            $table->index(['problem_id', 'user_id', 'verdict']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
