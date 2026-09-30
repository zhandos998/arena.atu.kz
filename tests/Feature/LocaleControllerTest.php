<?php

namespace Tests\Feature;

use Tests\TestCase;

class LocaleControllerTest extends TestCase
{
    public function test_user_can_change_interface_locale(): void
    {
        $this->from(route('home'))
            ->post(route('locale.update'), ['locale' => 'kk'])
            ->assertStatus(303)
            ->assertRedirect(route('home'))
            ->assertSessionHas('locale', 'kk')
            ->assertCookie('atu_locale', 'kk');
    }

    public function test_unsupported_locale_is_rejected(): void
    {
        $this->post(route('locale.update'), ['locale' => 'de'])
            ->assertSessionHasErrors('locale');
    }
}
