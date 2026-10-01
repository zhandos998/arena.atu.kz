import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { locale } = useTranslation();
    const copy = {
        ru: { title: 'Вход', badge: 'Кабинет участника', heading: 'С возвращением', description: 'Войдите, чтобы увидеть соревнования, задачи и свои результаты.', email: 'Электронная почта', password: 'Пароль', forgot: 'Забыли пароль?', passwordPlaceholder: 'Введите пароль', remember: 'Запомнить меня', processing: 'Входим…', submit: 'Войти в Code Arena', noAccount: 'Ещё нет аккаунта?', register: 'Зарегистрироваться' },
        kk: { title: 'Кіру', badge: 'Қатысушы кабинеті', heading: 'Қайта қош келдіңіз', description: 'Жарыстарды, есептерді және нәтижелеріңізді көру үшін кіріңіз.', email: 'Электрондық пошта', password: 'Құпиясөз', forgot: 'Құпиясөзді ұмыттыңыз ба?', passwordPlaceholder: 'Құпиясөзді енгізіңіз', remember: 'Мені есте сақтау', processing: 'Кіру…', submit: 'Code Arena-ға кіру', noAccount: 'Аккаунтыңыз жоқ па?', register: 'Тіркелу' },
        en: { title: 'Sign in', badge: 'Participant dashboard', heading: 'Welcome back', description: 'Sign in to view competitions, problems, and your results.', email: 'Email address', password: 'Password', forgot: 'Forgot password?', passwordPlaceholder: 'Enter password', remember: 'Remember me', processing: 'Signing in…', submit: 'Sign in to Code Arena', noAccount: 'No account yet?', register: 'Register' },
    }[locale];
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={copy.title} />

            <div className="mb-7">
                <span className="inline-flex rounded-lg bg-[#edf3ff] dark:bg-[#203858] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#355da8] dark:text-[#a9c7ff]">
                    {copy.badge}
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">{copy.heading}</h2>
                <p className="mt-2 text-sm leading-6 text-[#7184a0] dark:text-[#aebfd6]">
                    {copy.description}
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="grid gap-5">
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
                        isFocused
                        onChange={(event) => setData('email', event.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between gap-3">
                        <InputLabel htmlFor="password" value={copy.password} />
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-xs font-semibold text-[#355da8] dark:text-[#a9c7ff] transition hover:text-[#23457e]">
                                {copy.forgot}
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="current-password"
                        placeholder={copy.passwordPlaceholder}
                        onChange={(event) => setData('password', event.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <label className="flex items-center gap-2 text-sm text-[#667892] dark:text-[#aebfd6]">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(event) => setData('remember', event.target.checked)}
                    />
                    {copy.remember}
                </label>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? copy.processing : copy.submit}
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-[#7184a0] dark:text-[#aebfd6]">
                {copy.noAccount}{' '}
                <Link href={route('register')} className="font-bold text-[#355da8] dark:text-[#a9c7ff] hover:text-[#23457e]">
                    {copy.register}
                </Link>
            </p>
        </GuestLayout>
    );
}
