import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { locale } = useTranslation();
    const copy = {
        ru: { title: 'Регистрация', badge: 'Регистрация открыта', heading: 'Стать участником', description: 'Создайте аккаунт — после входа вы сможете участвовать в турнирах АТУ.', name: 'Имя и фамилия', email: 'Электронная почта', password: 'Пароль', repeat: 'Повторите пароль', min: 'Минимум 8 символов', again: 'Ещё раз', rules: 'Создавая аккаунт, вы соглашаетесь с правилами честного участия в соревнованиях.', processing: 'Создаём аккаунт…', submit: 'Зарегистрироваться', existing: 'Уже зарегистрированы?', login: 'Войти' },
        kk: { title: 'Тіркелу', badge: 'Тіркелу ашық', heading: 'Қатысушы болу', description: 'Аккаунт жасаңыз — кіргеннен кейін АТУ турнирлеріне қатыса аласыз.', name: 'Аты-жөні', email: 'Электрондық пошта', password: 'Құпиясөз', repeat: 'Құпиясөзді қайталаңыз', min: 'Кемінде 8 таңба', again: 'Қайта енгізіңіз', rules: 'Аккаунт жасай отырып, жарыстарға адал қатысу ережелерімен келісесіз.', processing: 'Аккаунт жасалуда…', submit: 'Тіркелу', existing: 'Тіркелгенсіз бе?', login: 'Кіру' },
        en: { title: 'Registration', badge: 'Registration is open', heading: 'Become a participant', description: 'Create an account to participate in ATU tournaments.', name: 'Full name', email: 'Email address', password: 'Password', repeat: 'Repeat password', min: 'At least 8 characters', again: 'Enter again', rules: 'By creating an account, you agree to the fair participation rules.', processing: 'Creating account…', submit: 'Register', existing: 'Already registered?', login: 'Sign in' },
    }[locale];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={copy.title} />

            <div className="mb-7">
                <span className="inline-flex rounded-lg bg-[#fff7d7] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6810]">
                    {copy.badge}
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[#142d55]">{copy.heading}</h2>
                <p className="mt-2 text-sm leading-6 text-[#7184a0]">
                    {copy.description}
                </p>
            </div>

            <form onSubmit={submit} className="grid gap-4">
                <div>
                    <InputLabel htmlFor="name" value={copy.name} />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full"
                        autoComplete="name"
                        placeholder="Алан Тьюринг"
                        isFocused
                        onChange={(event) => setData('name', event.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={copy.email} />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        placeholder="student@atu.edu.kz"
                        onChange={(event) => setData('email', event.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="password" value={copy.password} />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full"
                            autoComplete="new-password"
                            placeholder={copy.min}
                            onChange={(event) => setData('password', event.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value={copy.repeat} />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-2 block w-full"
                            autoComplete="new-password"
                            placeholder={copy.again}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <p className="text-xs leading-5 text-[#8795a9]">
                    {copy.rules}
                </p>

                <PrimaryButton className="mt-1 w-full" disabled={processing}>
                    {processing ? copy.processing : copy.submit}
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-[#7184a0]">
                {copy.existing}{' '}
                <Link href={route('login')} className="font-bold text-[#355da8] hover:text-[#23457e]">
                    {copy.login}
                </Link>
            </p>
        </GuestLayout>
    );
}
