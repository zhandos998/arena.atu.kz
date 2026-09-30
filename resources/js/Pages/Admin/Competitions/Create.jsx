import ArenaIcon from '@/Components/ArenaIcon';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const selectClassName = 'mt-2 block w-full rounded-xl border-[#ccd7e8] bg-white px-4 py-3 text-sm text-[#142d55] shadow-sm focus:border-[#355da8] focus:ring-[#355da8]';

export default function Create({ options, competition = null }) {
    const isEditing = competition !== null;
    const { data, setData, post, put, processing, errors } = useForm({
        title: competition?.title ?? '',
        description: competition?.description ?? '',
        rules: competition?.rules ?? '',
        starts_at: competition?.starts_at ?? '',
        ends_at: competition?.ends_at ?? '',
        status: competition?.status ?? 'draft',
        registration_type: competition?.registration_type ?? 'open',
        allowed_languages: competition?.allowed_languages ?? ['cpp', 'python'],
    });

    const submit = (event) => {
        event.preventDefault();

        if (isEditing) {
            put(route('admin.competitions.update', competition.id));
            return;
        }

        post(route('admin.competitions.store'));
    };

    const toggleLanguage = (language) => {
        setData(
            'allowed_languages',
            data.allowed_languages.includes(language)
                ? data.allowed_languages.filter((item) => item !== language)
                : [...data.allowed_languages, language],
        );
    };

    return (
        <AdminLayout title={isEditing ? 'Редактирование соревнования' : 'Новое соревнование'} subtitle="Основные настройки турнира">
            <Head title={isEditing ? `Изменить: ${competition.title}` : 'Создать соревнование'} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center gap-2 text-sm">
                    <Link href={route('admin.competitions.index')} className="font-bold text-[#355da8] hover:text-[#23457e]">
                        Соревнования
                    </Link>
                    <span className="text-[#a2adbc]">/</span>
                    <span className="text-[#7184a0]">Создание</span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <form onSubmit={submit} className="rounded-2xl border border-[#dfe7f3] bg-white p-5 shadow-sm sm:p-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8]">Основные данные</p>
                            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#142d55]">{isEditing ? 'Изменить соревнование' : 'Создать соревнование'}</h1>
                            <p className="mt-2 text-sm leading-6 text-[#7184a0]">{isEditing ? 'Обновите расписание, описание, правила и доступные языки.' : 'После сохранения турнир появится в списке администратора.'}</p>
                        </div>

                        <div className="mt-7 grid gap-5">
                            <div>
                                <InputLabel htmlFor="title" value="Название соревнования" />
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    className="mt-2 block w-full"
                                    placeholder="ATU Programming Cup 2026"
                                    isFocused
                                    onChange={(event) => setData('title', event.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Описание" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    rows="5"
                                    className="mt-2 block w-full rounded-xl border-[#ccd7e8] bg-white px-4 py-3 text-sm text-[#142d55] shadow-sm placeholder:text-[#9aa8ba] focus:border-[#355da8] focus:ring-[#355da8]"
                                    placeholder="Кратко опишите формат, правила и цель соревнования"
                                    onChange={(event) => setData('description', event.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="rules" value="Правила соревнования" />
                                <textarea
                                    id="rules"
                                    value={data.rules}
                                    rows="7"
                                    className="mt-2 block w-full rounded-xl border-[#ccd7e8] bg-white px-4 py-3 text-sm text-[#142d55] shadow-sm placeholder:text-[#9aa8ba] focus:border-[#355da8] focus:ring-[#355da8]"
                                    placeholder="Опишите начисление баллов, штрафы и правила участия"
                                    onChange={(event) => setData('rules', event.target.value)}
                                />
                                <InputError message={errors.rules} className="mt-2" />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="starts_at" value="Дата и время начала" />
                                    <TextInput
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        className="mt-2 block w-full"
                                        onChange={(event) => setData('starts_at', event.target.value)}
                                        required
                                    />
                                    <InputError message={errors.starts_at} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ends_at" value="Дата и время окончания" />
                                    <TextInput
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        min={data.starts_at || undefined}
                                        className="mt-2 block w-full"
                                        onChange={(event) => setData('ends_at', event.target.value)}
                                        required
                                    />
                                    <InputError message={errors.ends_at} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="registration_type" value="Регистрация" />
                                    <select
                                        id="registration_type"
                                        value={data.registration_type}
                                        className={selectClassName}
                                        onChange={(event) => setData('registration_type', event.target.value)}
                                    >
                                        {options.registrationTypes.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.registration_type} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value="Статус" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        className={selectClassName}
                                        onChange={(event) => setData('status', event.target.value)}
                                        disabled
                                    >
                                        {options.statuses.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <p className="mt-2 text-xs leading-5 text-[#8795a9]">Статус меняется на странице соревнования после добавления задач.</p>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-semibold text-[#314765]">Языки программирования</legend>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {options.languages.map((language) => (
                                        <label
                                            key={language.value}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-bold transition ${data.allowed_languages.includes(language.value) ? 'border-[#8eabda] bg-[#edf3ff] text-[#234d8f]' : 'border-[#dfe7f3] bg-white text-[#667892] hover:border-[#b8c9e4]'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.allowed_languages.includes(language.value)}
                                                className="rounded border-[#b8c9e4] text-[#355da8] focus:ring-[#355da8]"
                                                onChange={() => toggleLanguage(language.value)}
                                            />
                                            {language.label}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.allowed_languages} className="mt-2" />
                            </fieldset>
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#edf1f7] pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={isEditing ? route('admin.competitions.show', competition.id) : route('admin.competitions.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-[#ccd7e8] px-5 py-3 text-sm font-bold text-[#667892] transition hover:bg-[#f3f6fb]"
                            >
                                Отмена
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 transition hover:bg-[#294f91] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <ArenaIcon name="check" className="h-4 w-4" />
                                {processing ? 'Сохраняем…' : isEditing ? 'Сохранить изменения' : 'Создать соревнование'}
                            </button>
                        </div>
                    </form>

                    <aside className="h-fit rounded-2xl bg-[#193f7d] p-6 text-white xl:sticky xl:top-24">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#ffd83d]">
                            <ArenaIcon name="trophy" className="h-6 w-6" />
                        </span>
                        <h2 className="mt-5 text-lg font-black">Что будет дальше</h2>
                        <ol className="mt-5 grid gap-4">
                            {[
                                'Добавить задачи и ограничения',
                                'Загрузить 30–50 тестов для каждой задачи',
                                'Проверить настройки и опубликовать турнир',
                            ].map((step, index) => (
                                <li key={step} className="flex gap-3 text-sm leading-5 text-[#d8e3f5]">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#ffd83d] text-[10px] font-black text-[#10264f]">{index + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                        <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-[#9eb3d3]">
                            Черновик виден только администраторам. Опубликованное соревнование позже появится у участников.
                        </p>
                    </aside>
                </div>
            </div>
        </AdminLayout>
    );
}
