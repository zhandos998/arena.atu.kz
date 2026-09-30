<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competition_id')->constrained()->cascadeOnDelete();
            $table->string('code', 10);
            $table->string('title', 150);
            $table->longText('statement');
            $table->text('input_format')->nullable();
            $table->text('output_format')->nullable();
            $table->text('constraints')->nullable();
            $table->unsignedInteger('time_limit_ms')->default(1000);
            $table->unsignedSmallInteger('memory_limit_mb')->default(256);
            $table->unsignedSmallInteger('score')->default(100);
            $table->timestamps();

            $table->unique(['competition_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
