<?php

namespace App\Models;

use Database\Factories\CompetitionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'rules', 'starts_at', 'ends_at', 'status', 'registration_type', 'allowed_languages'])]
class Competition extends Model
{
    /** @use HasFactory<CompetitionFactory> */
    use HasFactory;

    public const STATUSES = [
        'draft' => 'Черновик',
        'published' => 'Опубликовано',
        'archived' => 'В архиве',
    ];

    public const REGISTRATION_TYPES = [
        'open' => 'Открытая регистрация',
        'closed' => 'Закрытая регистрация',
    ];

    public const LANGUAGES = [
        'cpp' => 'C++ 20',
        'python' => 'Python 3',
        'java' => 'Java 21',
        'go' => 'Go 1.27',
        'javascript' => 'JavaScript',
        'csharp' => 'C#',
    ];

    /**
     * The user who created the competition.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Problems included in the competition.
     */
    public function problems(): HasMany
    {
        return $this->hasMany(Problem::class);
    }

    public function registeredUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'allowed_languages' => 'array',
        ];
    }
}
